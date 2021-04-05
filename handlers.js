import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import hourlyWizard from "./hourlyWizard.js";
import eveningWizard from "./eveningWizard.js";

export const registerHandlers = (bot) => {
    const stage = new Scenes.Stage([hourlyWizard, eveningWizard]);

    bot.use(session());
    bot.use(stage.middleware());

    bot.command("hourly", (ctx) => {
        return ctx.scene.enter("hourly-wizard");
    });
    bot.command("evening", (ctx) => {
        return ctx.scene.enter("evening-wizard");
    });

    bot.on("text", (ctx) => {
        ctx.reply(
            "Choose an option",
            Markup.keyboard([["/hourly", "/evening"]])
        );
    });
};
