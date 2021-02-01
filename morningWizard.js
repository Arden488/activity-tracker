import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import { firestore } from "./firestore.js";
import { replyWithQuestion } from "./helpers.js";

// Temp hack - https://github.com/telegraf/telegraf/issues/1333
Scenes.WizardScene.prototype.enterMiddleware =
    Scenes.WizardScene.prototype.middleware;
const wizard = new Scenes.WizardScene(
    "morning-wizard",
    async (ctx) => {
        ctx.wizard.state.started = true;
        return replyWithQuestion(ctx, "Во сколько проснулся?");
    },
    async (ctx) => {
        ctx.wizard.state.hours_of_sleep = ctx.message.text;
        return replyWithQuestion(ctx, "Хорошо ли спалось?");
    },
    async (ctx) => {
        ctx.wizard.state.good_or_bad_sleep = ctx.message.text;
        return replyWithQuestion(ctx, "Снилось ли что-нибудь?");
    },
    async (ctx) => {
        ctx.wizard.state.dreams = ctx.message.text;
        return replyWithQuestion(ctx, "Во сколько пошел спать?");
    },
    async (ctx) => {
        ctx.wizard.state.time_went_to_bed = ctx.message.text;
        return replyWithQuestion(ctx, "Легко ли заснул?");
    },
    async (ctx) => {
        ctx.wizard.state.easy_fall_asleep = ctx.message.text;
        return replyWithQuestion(ctx, "Просыпался ли ночью?");
    },
    async (ctx) => {
        ctx.wizard.state.woke_up_at_night = ctx.message.text;
        // console.log(ctx.wizard.state);
        await firestore.collection("mornings").add({
            datetime: Date.now(),
            user_id: ctx.message.chat.id,
            ...ctx.wizard.state,
        });
        await ctx.reply("Готово");
        return await ctx.scene.leave();
    }
);

export default wizard;
