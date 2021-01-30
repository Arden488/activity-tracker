const express = require("express");
const { Composer, Markup, Scenes, session, Telegraf } = require("telegraf");

const token = process.env.BOT_TOKEN;
if (token === undefined) {
    throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);
const path = "a98";
const PORT = process.env.PORT || 3456;

const users = [
    { id: 37053287, username: "Arden488" },
    { id: 14379256, username: "Saldeia" },
];

for (user of users) {
    console.log(user);
    bot.telegram.sendMessage(user.id, `Hello ${user.username} 👍`);
}

// // Set the bot API endpoint
// app.use(bot.webhookCallback(`/${path}`));
