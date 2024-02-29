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
    let noOfImage = ctx.message.text;
    if (!(noOfImage >= 1 && noOfImage <= 10)) {
      ctx.reply('Enter value between 1-10 !');
      return;
    },
    ctx.session.noOfImage = noOfImage;
    await ctx.reply(`Number of Images: 1`);
    await ctx.reply('Enter Steps of generating Image ( 1-75 ) ...');
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

    let imgs = await imgApi.generateImage(params);

    for(let i in imgs){
        ctx.replyWithPhoto(imgs[i]);
    }
    // End the wizard and reset the session data
    return ctx.scene.leave();
  }
);


export default wizard;
