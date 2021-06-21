import express from "express";
import * as fs from "fs";
import { compareAsc, format } from "date-fns";
import localtunnel from "localtunnel";
import bodyParser from "body-parser";
import { firestore } from "./firestore.js";
import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import { registerHandlers } from "./handlers.js";

/**
 *
 * BOT CREATION AND SETUP
 *
 */
const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

/**
 *
 * BOT HANDLERS
 *
 */

const bot = new Telegraf(token);

registerHandlers(bot);

/**
 *
 * HOOK SETUP AND BOT LAUNCH
 *
 */
const secretPath = "a98";
const PORT = process.env.PORT || 3456;

let tunnerUrl = `${process.env.SERVER_URL}`;

if (process.env.NODE_ENV !== "production") {
  const tunnel = await localtunnel({ port: PORT });
  tunnerUrl = tunnel.url;
}

const webhook = `${tunnerUrl}/${secretPath}`;

bot.telegram.setWebhook(webhook);

// bot.launch(launchConfig);
const app = express();
app.use(express.json({ limit: "50mb" }));

app.use(bodyParser.json());

app.post("/location/add", async (req, res) => {
  const firestore_response = await firestore
    .collection("locations")
    .add(req.body);
  res.end(firestore_response.id);
});

app.post("/health/add", async (req, res) => {
  let data = req.body.data;

  logDataToFile(data);

  const tData = transformHealthExportData(data);
  const isAlreadySaved = await checkIfSaved(tData);
  if (!isAlreadySaved) {
    const response = await storeHealthExportData(tData);
    if (response) {
      notifyTelegram("Сохранил данные о здоровье");
    }
  } else {
    notifyTelegram(
      "Попытка сохранить данные о здоровье, которые уже есть в базе"
    );
  }

  res.end();
});

app.get("/health/", async (req, res) => {
  let entries = [];
  //const today = new Date().setHours(0, 0, 0, 0);
  const ref = await firestore
    .collection("health")
    .orderBy("datetime", "desc")
    //.startAt(new Date(today).toISOString())
    .limit(10);

  try {
    const snapshot = await ref.get();
    entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error(e);
    return;
  }

  res.json(entries);
});

app.get("/location/", async (req, res) => {
  let entries = [];
  const today = new Date().setHours(0, 0, 0, 0);
  const ref = await firestore
    .collection("locations")
    .orderBy("location.timestamp")
    .startAt(new Date(today).toISOString())
    .limit(1000);
  try {
    const snapshot = await ref.get();
    entries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error(e);
    return;
  }

  res.json(entries);
});

app.post(`/${secretPath}`, (req, res) => bot.handleUpdate(req.body, res));

// Set the bot API endpoint
app.use(bot.webhookCallback(`/${secretPath}`));

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}!`);
});

function logDataToFile(data) {
  const logFileName = `${new Date().toJSON()}.json`;
  fs.writeFile(`./log/${logFileName}`, JSON.stringify(data), (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("The log file was saved!");
  });
}

function transformHealthExportData(data) {
  const metricsData = data.metrics;

  // const transformedData = [];
  const dataAggr = {};

  metricsData.forEach((category) => {
    const { name, units, data } = category;
    if (data.length === 0) return;

    data.forEach((item) => {
      const datetime = new Date(item.date);
      const date = format(datetime, "dd.MM.yyyy");

      if (!(date in dataAggr)) {
        dataAggr[date] = {};
      }
      if (!(name in dataAggr[date])) {
        dataAggr[date][name] = {
          datetime: {},
          data: [],
        };
      }

      const dataByDate = dataAggr[date][name];

      if (
        !dataByDate.datetime.start ||
        compareAsc(datetime, dataByDate.datetime.start) === -1
      ) {
        dataByDate.datetime.start = datetime;
      }
      if (
        !dataByDate.datetime.end ||
        compareAsc(datetime, dataByDate.datetime.end) === 1
      ) {
        dataByDate.datetime.end = datetime;
      }

      dataByDate.data.push(item);
    });

    // for (let dataDate in dataAggr) {
    // const catRef = firestore.collection(name).doc();
    // batch.set(catRef, dataAggr[dataDate]);
    // transformedData.push(dataDate);
    // }
  });

  return dataAggr;
}

async function storeHealthExportData(data) {
  const batch = firestore.batch();

  for (let dataDate in data) {
    for (let metric in data[dataDate]) {
      const catRef = firestore.collection(metric).doc();
      const dataToSave = data[dataDate][metric];
      batch.set(catRef, dataToSave);
    }
  }

  return await batch.commit();
}

async function checkIfSaved(data) {
  let exists = false;
  for (let date in data) {
    const dateData = data[date];

    for (let metric in dateData) {
      // const metricData = dateData.data;
      const start = dateData[metric].datetime.start;
      const end = dateData[metric].datetime.end;

      const ref = await firestore.collection(metric);
      const snapshot = await ref
        .where("datetime.start", "==", start)
        .where("datetime.end", "==", end)
        .get();
      if (!snapshot.empty) {
        exists = true;
        // snapshot.forEach((doc) => {
        //   console.log(doc.id, "=>", doc.data());
        // });
      }
      // const catRef = firestore.collection(dataDate).doc();
      // batch.set(catRef, dataAggr[dataDate]);
    }
  }
  return exists;
}

function notifyTelegram(message) {
  bot.telegram.sendMessage(process.env.USER1_ID, message);
}
// Enable graceful stop
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
