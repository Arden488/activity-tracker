require("dotenv").config();
const express = require("express");
const { Telegraf } = require("telegraf");

const token = process.env.BOT_TOKEN;
if (token === undefined) {
    throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);
const path = "a98";
const PORT = process.env.PORT || 3456;

bot.on("text", (ctx) => ctx.replyWithHTML("<b>Hello</b>"));

if (process.env.NODE_ENV === "production") {
    bot.telegram.setWebhook(`${process.env.HEROKU_URL}/${path}`);
} else {
    // Set telegram webhook
    bot.telegram.setWebhook(`https://gentle-dodo-81.loca.lt/${path}`);
}

const app = express();
app.get("/", (req, res) => res.send("Hello World!"));
// Set the bot API endpoint
app.use(bot.webhookCallback(`/${path}`));

app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}!`);
});
