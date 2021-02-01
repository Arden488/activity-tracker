import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";

const replyWithQuestion = async (ctx, text, keyboard) => {
    await ctx.reply(text, keyboard);
    return ctx.wizard.next();
};

export { replyWithQuestion };
