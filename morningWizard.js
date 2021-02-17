import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import { firestore } from "./firestore.js";
import { replyWithQuestion, setSchedule } from "./helpers.js";

// Temp hack - https://github.com/telegraf/telegraf/issues/1333
Scenes.WizardScene.prototype.enterMiddleware =
    Scenes.WizardScene.prototype.middleware;
const wizard = new Scenes.WizardScene(
    "morning-wizard",
    async (ctx) => {
        ctx.wizard.state.started = true;
        const keyboardOptions = Markup.keyboard([
            ["До 7", "07:00", "07:30"],
            ["8:00", "8:30", "9:00"],
            ["9:30", "10:00", "10:30"],
            ["11:00", "11:30", "12:00", "После 12"],
        ]);
        return replyWithQuestion(ctx, "Во сколько проснулся?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.hours_of_sleep = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]);
        return replyWithQuestion(ctx, "Выспался?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.good_or_bad_sleep = ctx.message.text;
        const keyboardOptions = Markup.keyboard([
            "Нет",
            "Да, но не помню",
            "Да, но не хочу писать",
        ]);
        return replyWithQuestion(
            ctx,
            "Снилось ли что-нибудь?",
            keyboardOptions
        );
    },
    async (ctx) => {
        ctx.wizard.state.dreams = ctx.message.text;
        const keyboardOptions = Markup.keyboard([
            ["До 10", "10:00", "10:30", "11:00"],
            ["11:30", "12:00", "После 12"],
        ]);
        return replyWithQuestion(
            ctx,
            "Во сколько пошел спать?",
            keyboardOptions
        );
    },
    async (ctx) => {
        ctx.wizard.state.time_went_to_bed = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]);
        return replyWithQuestion(ctx, "Легко ли заснул?", keyboardOptions);
    },
    async (ctx) => {
        ctx.wizard.state.easy_fall_asleep = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]);
        return replyWithQuestion(ctx, "Просыпался ли ночью?", keyboardOptions);
    },

    async (ctx) => {
        ctx.wizard.state.woke_up_at_night = ctx.message.text;
        const keyboardOptions = Markup.keyboard([["Да", "Нет"]]);
        return replyWithQuestion(
            ctx,
            "Пил ли воду за 2 часа до сна?",
            keyboardOptions
        );
    },
    async (ctx) => {
        ctx.wizard.state.drank_water_late = ctx.message.text;
        await firestore.collection("mornings").add({
            datetime: Date.now(),
            user_id: ctx.message.chat.id,
            ...ctx.wizard.state,
        });

        setSchedule(true);

        await ctx.reply(
            "Готово",
            Markup.keyboard([["/hourly", "/morning", "/evening"]])
        );
        return await ctx.scene.leave();
    }
);

export default wizard;
