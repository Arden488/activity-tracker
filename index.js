import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import hourlyWizard from "./hourlyWizard.js";
import morningWizard from "./morningWizard.js";
import eveningWizard from "./eveningWizard.js";

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
const stage = new Scenes.Stage([hourlyWizard, morningWizard, eveningWizard]);

bot.use(session());
bot.use(stage.middleware());

bot.command("morning", (ctx) => {
    return ctx.scene.enter("morning-wizard");
});
bot.command("hourly", (ctx) => {
    return ctx.scene.enter("hourly-wizard");
});
bot.command("evening", (ctx) => {
    return ctx.scene.enter("evening-wizard");
});

bot.on("text", (ctx) => {
    ctx.reply(
        "Choose an option",
        Markup.keyboard([["/hourly", "/morning", "/evening"]])
    );
});

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
