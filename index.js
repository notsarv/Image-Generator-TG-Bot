import { Telegraf, Scenes, session, Markup } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();
import wizard from './wizard.js';
const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([wizard]);
bot.use(session());
bot.use(stage.middleware());


bot.start((ctx) =>
  (async () => {
    ctx.reply("Welcome !");
  })()
);

bot.command('image', async (ctx) => {
  (async () => {
    await ctx.scene.enter('image-wizard');
  })();
});

bot.launch();

console.log("Bot Started !");
