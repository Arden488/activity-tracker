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
        return replyWithQuestion("Энергия (от 0 до 5)?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.energy = ctx.message.text;
        return replyWithQuestion("Настроение (от 0 до 5)?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.mood = ctx.message.text;
        return replyWithQuestion("Где находился этот час?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.location = ctx.message.text;
        return replyWithQuestion("Чем занимался этот час?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.activity = ctx.message.text;
        return replyWithQuestion("Что кушал?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.eat = ctx.message.text;
        return replyWithQuestion("Пил ли воду?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.water = ctx.message.text;
        return replyWithQuestion("Пил ли кофе?", ctx);
    },
    async (ctx) => {
        ctx.wizard.state.coffee = ctx.message.text;
        // console.log();
        await firestore
            .collection("hourly")
            .add({ datetime: Date.now(), ...ctx.wizard.state });
        await ctx.reply("Готово");
        return await ctx.scene.leave();
    }
);

export default wizard;
