import { Composer, Markup, Scenes, session, Telegraf } from "telegraf";
import { firestore } from "./firestore.js";

const replyWithQuestion = async (ctx, text, keyboard) => {
    await ctx.reply(text, keyboard);
    return ctx.wizard.next();
};

const setSchedule = async (active) => {
    const reminderDocRef = await firestore.collection("config").doc("reminder");

    const reminderDocSnapshot = await reminderDocRef.get();

    if (reminderDocSnapshot.exists) {
        await reminderDocRef.update({ active });
    }
};

export { replyWithQuestion, setSchedule };
