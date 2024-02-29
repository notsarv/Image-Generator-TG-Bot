import pkg from 'telegraf';
const { Scenes } = pkg;
import fetch from 'node-fetch';
import ImgApi from './getImgApi.js';
const Wizard = Scenes.WizardScene;

const wizard = new Wizard(
  'image-wizard',
  async (ctx) => {
    await ctx.reply('Enter the Prompt for Image ...');
    return ctx.wizard.next();
  },
  async (ctx) => {
    let nprompt = ctx.message.text;
    ctx.session.nprompt = nprompt;
    await ctx.reply(`Negative Prompt: ${nprompt}`);
    await ctx.reply('Enter Number of Image to be generated ( 1-10 ) ... [ This is always set to 1 ]');
    return ctx.wizard.next();
  },
  async (ctx) => {
    let noOfImage = ctx.message.text;
    if (!(noOfImage >= 1 && noOfImage <= 10)) {
      ctx.reply('Enter value between 1-10 !');
      return;
    }

    ctx.session.noOfImage = noOfImage;
    await ctx.reply(`Number of Images: 1`);
    await ctx.reply('Enter Steps of generating Image ( 1-75 ) ...');
    return ctx.wizard.next();
  },
  async (ctx) => {
    let steps = ctx.message.text;
    if (!(steps >= 1 && steps <= 75)) {
      ctx.reply('Enter value between 1-75 !');
      return;
    }
    ctx.session.steps = steps;
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.reply('Please Wait ...');
    let imgApi = new ImgApi();
    let params = {
	"model" : "default",
        "n": 1,
        "prompt": `${ctx.session.prompt}`
    };

    let imgs = await imgApi.generateImage(ctx.session.model, params);

    for(let i in imgs){
        ctx.replyWithPhoto(imgs[i]);
    }
    // End the wizard and reset the session data
    return ctx.scene.leave();
  }
);


export default wizard;
