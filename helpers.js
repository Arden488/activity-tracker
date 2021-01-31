import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";

const replyWithQuestion = async (text, ctx) => {
    await ctx.reply(
        text
        // Markup.inlineKeyboard([Markup.button.callback("Далее", "next")])
    );
    return ctx.wizard.next();
};

export { replyWithQuestion };
