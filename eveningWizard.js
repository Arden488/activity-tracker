import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";

const stepHandler = new Composer();
stepHandler.action("next", async (ctx) => {
    await ctx.reply(
        "Evening wizard: Step 2. Button",
        Markup.inlineKeyboard([Markup.button.callback("➡️ Next", "next")])
    );
    return ctx.wizard.next();
});
stepHandler.command("next", async (ctx) => {
    await ctx.reply(
        "Evening wizard: Step 2. Command",
        Markup.inlineKeyboard([Markup.button.callback("➡️ Next", "next")])
    );
    return ctx.wizard.next();
});
stepHandler.use((ctx) =>
    ctx.replyWithMarkdown("Press `Next` button or type /next")
);

// Temp hack - https://github.com/telegraf/telegraf/issues/1333
Scenes.WizardScene.prototype.enterMiddleware =
    Scenes.WizardScene.prototype.middleware;
const wizard = new Scenes.WizardScene(
    "evening-wizard",
    async (ctx) => {
        await ctx.reply(
            "Evening wizard: Step 1",
            Markup.inlineKeyboard([Markup.button.callback("➡️ Next", "next")])
        );
        return ctx.wizard.next();
    },
    stepHandler,
    async (ctx) => {
        await ctx.reply(
            "Evening wizard: Step 3",
            Markup.inlineKeyboard([Markup.button.callback("➡️ Next", "next")])
        );
        return ctx.wizard.next();
    },
    async (ctx) => {
        await ctx.reply("Done");
        return await ctx.scene.leave();
    }
);

export default wizard;
