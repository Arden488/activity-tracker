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
            ["0 - 😵 - Чувствую сильную усталость"],
            ["1 - 🤭 - Чувствую усталость, но не сильную"],
            ["2 - 😐 - Не чувствую особой усталости, но и нет энергичности"],
            ["3 - 😎 - Чувствую прилив сил и хочется что-то делать"],
        ]);
        return replyWithQuestion(
            ctx,
            "Насколько ты чувствуешь себя уставшим?",
            keyboardOptions
        );
    },
    async (ctx) => {
        ctx.wizard.state.fatigue = ctx.message.text.slice(0, 1);
        const keyboardOptions = Markup.keyboard([
            ["0 - 💩 - Ужасное настроение, жизнь говно"],
            ["1 - 🙁 - Не в духе, но не критично"],
            ["2 - 🙄 - Затрудняюсь ответить или нейтрально"],
            ["3 - 🙂 - Всё хорошо, я оптимистичен"],
            ["4 - 🤩 - Жизнь прекрасна!"],
        ]);
        return replyWithQuestion(
            ctx,
            "Какое у тебя настроение?",
            keyboardOptions
        );
    },
    async (ctx) => {
        ctx.wizard.state.mood = ctx.message.text.slice(0, 1);
        await firestore.collection("hourly").add({
            datetime: Date.now(),
            user_id: ctx.message.chat.id,
            ...ctx.wizard.state,
        });
        ctx.reply("Готово", Markup.keyboard([["/hourly", "/evening"]]));
        return await ctx.scene.leave();
    }
);

export default wizard;
