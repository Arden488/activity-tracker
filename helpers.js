import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";

const replyWithQuestion = async (ctx, text, keyboard) => {
    await ctx.reply(
        text,
        keyboard
        // Markup.inlineKeyboard([Markup.button.callback("Далее", "next")])
    );
    return ctx.wizard.next();
};

export { replyWithQuestion };
