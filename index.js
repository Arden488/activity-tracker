const express = require("express");
const { Composer, Markup, Scenes, session, Telegraf } = require("telegraf");

const token = process.env.BOT_TOKEN;
if (token === undefined) {
    throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(token);
const path = "a98";
const PORT = process.env.PORT || 3456;

const stepHandler = new Composer();
stepHandler.action("next", async (ctx) => {
    await ctx.reply("Step 2. Via inline button");
    return ctx.wizard.next();
});
stepHandler.command("next", async (ctx) => {
    await ctx.reply("Step 2. Via command");
    return ctx.wizard.next();
});
stepHandler.use((ctx) =>
    ctx.replyWithMarkdown("Press `Next` button or type /next")
);

const superWizard = new Scenes.WizardScene(
    "super-wizard",
    async (ctx) => {
        await ctx.reply(
            "Step 1",
            Markup.inlineKeyboard([
                Markup.button.url("❤️", "http://telegraf.js.org"),
                Markup.button.callback("➡️ Next", "next"),
            ])
        );
        return ctx.wizard.next();
    },
    stepHandler,
    async (ctx) => {
        await ctx.reply("Step 3");
        return ctx.wizard.next();
    },
    async (ctx) => {
        await ctx.reply("Step 4");
        return ctx.wizard.next();
    },
    async (ctx) => {
        await ctx.reply("Done");
        return await ctx.scene.leave();
    }
);

// bot.on("text", (ctx) => ctx.replyWithHTML("<b>Hello2</b>"));
// bot.on("sticker", (ctx) => ctx.reply("👍"));
bot.on("text", (ctx) => {
    console.log(ctx.message.chat, ctx.state);
    return ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Hello ${ctx.message.chat.username}`
    );
});
// ctx.replyWithHTML("Yea")
//     ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard)
// });
// bot.action("delete", (ctx) => ctx.deleteMessage());

if (process.env.NODE_ENV === "production") {
    bot.telegram.setWebhook(`${process.env.HEROKU_URL}/${path}`);
} else {
    // Set telegram webhook
    bot.telegram.setWebhook(`https://gentle-dodo-81.loca.lt/${path}`);
}

const stage = new Scenes.Stage([superWizard], {
    default: "super-wizard",
});
bot.use(session());
bot.use(stage.middleware());

const app = express();

app.get("/cron", (req, res) =>
    ctx.telegram.sendMessage(37053287, `Hello ${ctx.message.chat.username} 👍`)
);

// Set the bot API endpoint
app.use(bot.webhookCallback(`/${path}`));

app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}!`);
});
