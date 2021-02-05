import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import { firestore } from "./firestore.js";
import { replyWithQuestion } from "./helpers.js";

// Temp hack - https://github.com/telegraf/telegraf/issues/1333
Scenes.WizardScene.prototype.enterMiddleware =
    Scenes.WizardScene.prototype.middleware;

const wizard = new Scenes.WizardScene(
    "hourly-wizard",
    async (ctx) => {
        ctx.wizard.state.started = true;
        const keyboardOptions = Markup.keyboard([
            ["0", "1", "2", "3", "4", "5"],
        ]);
        return replyWithQuestion(ctx, "Энергия (от 0 до 5)?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.energy = ctx.message.text;
        const keyboardOptions = Markup.keyboard([
            ["0", "1", "2", "3", "4", "5"],
        ]);
        return replyWithQuestion(
            ctx,
            "Настроение (от 0 до 5)?",
            keyboardOptions
        );
    },
    async (ctx) => {
        ctx.wizard.state.location = ctx.message.text;
        const keyboardOptions = Markup.keyboard(["Пропустить"]);
        return replyWithQuestion(
            ctx,
            "Чем занимался этот час?",
            keyboardOptions
        );
    },
    async (ctx) => {
        ctx.wizard.state.activity = ctx.message.text;
        const keyboardOptions = Markup.keyboard(["Ничего"]);
        return replyWithQuestion(ctx, "Что кушал?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.eat = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]);
        return replyWithQuestion(ctx, "Пил ли воду?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.water = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]);
        return replyWithQuestion(ctx, "Пил ли кофе?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.coffee = ctx.message.text;
        await firestore.collection("hourly").add({
            datetime: Date.now(),
            user_id: ctx.message.chat.id,
            ...ctx.wizard.state,
        });
        ctx.reply(
            "Готово",
            Markup.keyboard([["/hourly", "/morning", "/evening"]])
        );
        return await ctx.scene.leave();
    }
);

export default wizard;
