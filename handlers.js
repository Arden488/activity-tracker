import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import hourlyWizard from "./hourlyWizard.js";
import morningWizard from "./morningWizard.js";
import eveningWizard from "./eveningWizard.js";

export const registerHandlers = (bot) => {
    const stage = new Scenes.Stage([
        hourlyWizard,
        morningWizard,
        eveningWizard,
    ]);

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
};
