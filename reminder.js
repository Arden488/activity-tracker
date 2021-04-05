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

const reminderDocSnapshot = await firestore
    .collection("config")
    .doc("reminder")
    .get();

const { hourly, active } = reminderDocSnapshot.data();

if (active && hourly) {
    bot.telegram.sendMessage(process.env.USER1_ID, `Затрекай данные 👊`);
}

setTimeout(() => {
    process.exit(0);
}, 5000);
