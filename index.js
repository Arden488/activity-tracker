// import express from "express";
import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
// import { runWizard } from "./wizard.js";
// import testScene from "./test.js";

const token = process.env.BOT_TOKEN;
if (token === undefined) {
    throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);
const secretPath = "a98";
const PORT = process.env.PORT || 3456;

/******** */
bot.on("text", (ctx) => ctx.reply("asd"));
// bot.command("test", (ctx) => ctx.scene.enter("test"));
// const stage = new Scenes.Stage([testScene]);
/******** */

// bot.use(session());
// bot.use(stage.middleware());

process.env.NODE_ENV === "production" ? startProdMode(bot) : startDevMode(bot);

function startDevMode(bot) {
    bot.launch();

    // Enable graceful stop
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

function startProdMode(bot) {
    bot.telegram.setWebhook(`${process.env.HEROKU_URL}/${secretPath}`);

    bot.startWebhook(secretPath, null, PORT);
}
