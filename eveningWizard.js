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
        return replyWithQuestion("Занимался спортом?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.workout = ctx.message.text;
        return replyWithQuestion("Сколько часов работал?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.hours_working = ctx.message.text;
        return replyWithQuestion("Прочитал как минимум 10 страниц?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.pages_read = ctx.message.text;
        return replyWithQuestion("Кушал вовремя?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.eat_in_time = ctx.message.text;
        return replyWithQuestion("Кушал junk-food?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.junk_food = ctx.message.text;
        return replyWithQuestion("Доволен ли тем как прошел день?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.satisfied = ctx.message.text;
        return replyWithQuestion("Что самое важное произошло за день?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.important = ctx.message.text;
        return replyWithQuestion("Есть чем поделиться?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.notes = ctx.message.text;
        // console.log(ctx.wizard.state);
        await firestore
            .collection("evenings")
            .add({ datetime: Date.now(), ...ctx.wizard.state });
        await ctx.reply("Готово");
        return await ctx.scene.leave();
    }
);

export default wizard;
