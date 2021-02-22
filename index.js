import express from "express";
import localtunnel from "localtunnel";
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

let tunnerUrl = `${process.env.HEROKU_URL}`;

if (process.env.NODE_ENV !== "production") {
    const tunnel = await localtunnel({ port: PORT });
    tunnerUrl = tunnel.url;
}

const webhook = `${tunnerUrl}/${secretPath}`;

bot.telegram.setWebhook(webhook);

// bot.launch(launchConfig);
const app = express();

app.use(express.bodyParser());

app.post("/location/add", (req, res) => {
    console.log(req.body);
    response.end();
    // return res.send("Test");
});

// Set the bot API endpoint
app.use(bot.webhookCallback(`/${secretPath}`));

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}!`);
});

// Enable graceful stop
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
