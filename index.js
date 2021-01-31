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

const webhookSettings = {
    webhook: {
        domain: `${process.env.HEROKU_URL}/${secretPath}`,
        port: PORT,
    },
};

const launchConfig =
    process.env.NODE_ENV === "production" ? webhookSettings : {};

bot.launch(launchConfig);

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
