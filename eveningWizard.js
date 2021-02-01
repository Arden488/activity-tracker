import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import { firestore } from "./firestore.js";
import { replyWithQuestion } from "./helpers.js";

// Temp hack - https://github.com/telegraf/telegraf/issues/1333
Scenes.WizardScene.prototype.enterMiddleware =
    Scenes.WizardScene.prototype.middleware;
const wizard = new Scenes.WizardScene(
    "evening-wizard",
    async (ctx) => {
        ctx.wizard.state.started = true;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]).oneTime();
        return replyWithQuestion(ctx, "Занимался спортом?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.workout = ctx.message.text;
        return replyWithQuestion(ctx, "Сколько часов работал?");
    },
    async (ctx) => {
        ctx.wizard.state.hours_working = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]);
        return replyWithQuestion(
            ctx,
            "Прочитал как минимум 10 страниц?",
            keyboardOptions
        );
    },
    async (ctx) => {
        ctx.wizard.state.pages_read = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]);
        return replyWithQuestion(ctx, "Кушал вовремя?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.eat_in_time = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]);
        return replyWithQuestion(ctx, "Кушал junk-food?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.junk_food = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]).oneTime();
        return replyWithQuestion(
            ctx,
            "Доволен ли тем как прошел день?",
            keyboardOptions
        );
    },
    async (ctx) => {
        ctx.wizard.state.satisfied = ctx.message.text;
        return replyWithQuestion(ctx, "Что самое важное произошло за день?");
    },
    async (ctx) => {
        ctx.wizard.state.important = ctx.message.text;
        return replyWithQuestion(ctx, "Есть чем поделиться?");
    },
    async (ctx) => {
        ctx.wizard.state.notes = ctx.message.text;
        await firestore.collection("evenings").add({
            datetime: Date.now(),
            user_id: ctx.message.chat.id,
            ...ctx.wizard.state,
        });
        await ctx.reply(
            "Готово",
            Markup.keyboard([["/hourly", "/morning", "/evening"]])
        );
        return await ctx.scene.leave();
    }
);

export default wizard;
