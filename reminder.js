import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import { firestore } from "./firestore.js";

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

const users = [
    { id: 37053287, username: "Arden488" },
    // { id: 14379256, username: "Saldeia" },
];

const reminderDocSnapshot = await firestore
    .collection("config")
    .doc("reminder")
    .get();

const { hourly, active } = reminderDocSnapshot.data();

if (active && hourly) {
    bot.telegram.sendMessage(users[0].id, `Затрекай данные 👊`);
}

setTimeout(() => {
    process.exit(0);
}, 5000);
