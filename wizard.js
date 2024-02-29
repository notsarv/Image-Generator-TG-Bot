import pkg from 'telegraf';
const { Scenes } = pkg;
import fetch from 'node-fetch';
import ImgApi from './getImgApi.js';
const Wizard = Scenes.WizardScene;

const wizard = new Wizard(
  'image-wizard',
  async (ctx) => {
    await ctx.reply('Please Select the Model Id ...');
    await ctx.replyWithMarkdown(await getModels());
    return ctx.wizard.next();
  },
  async (ctx) => {
    let model = ctx.message.text;
    let model_isOk = await modelExists(model);
    if(!model_isOk){
	ctx.reply('Invalid Model Id !');
	return;
    }
    ctx.session.model = model;
    await ctx.reply(`Model: ${model}`);
    await ctx.reply('Enter the Prompt for Image ...');
    return ctx.wizard.next();
  },
  async (ctx) => {
    let prompt = ctx.message.text;
    ctx.session.prompt = prompt;
    await ctx.reply(`Prompt: ${prompt}`);
    await ctx.reply('Enter Negative Prompt for Image ...');
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
    await ctx.reply(`Number of Steps: ${steps}`);
    await ctx.reply('Enter Guidance scale of Prompt ( 1-20 ) ...');
    return ctx.wizard.next();
  },
  async (ctx) => {
    let guidanceScale = ctx.message.text;
    if (!(guidanceScale >= 1 && guidanceScale <= 20)) {
      ctx.reply('Enter value between 1-20 !');
      return;
    }

    ctx.session.guidanceScale = guidanceScale;
    await ctx.reply(`Guidance Scale: ${guidanceScale}`);
    await ctx.reply('Reply anything to start generating ...');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.reply('Please Wait ...');
    let imgApi = new ImgApi();
    await imgApi.login();
    let params = {
        "tool": "generator",
        "num_inference_steps": `${ctx.session.steps}`,
        "guidance_scale": `${ctx.session.guidanceScale}`,
        "num_images": 1,
        "width": 768,
        "height": 1024,
        "enhance_face": "false",
        "scheduler": "dpmsolver++",
        "prompt": `${ctx.session.prompt}`,
        "negative_prompt": `${ctx.session.nprompt}`
    };

    let imgs = await imgApi.generateImage(ctx.session.model, params);

    for(let i in imgs){
        ctx.replyWithPhoto(imgs[i]);
    }
    // End the wizard and reset the session data
    return ctx.scene.leave();
  }
);

async function modelExists(model){
  try{
    let resp = await fetch("https://getimg.ai/api/models?status=active&public=true", {
      "headers": {
          "accept": "application/json, text/plain,",
          "accept-language": "en-IN,en;q=0.9,hi-IN;q=0.8,hi;q=0.7,en-GB;q=0.6,en-US;q=0.5",
          "sec-ch-ua": "\"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?1",                                                                       "sec-ch-ua-platform": "\"Android\"",
          "sec-fetch-dest": "empty",                                                                      "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "Referer": "https://getimg.ai/text-to-image",
          "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    });

    let json = await resp.json();
    var modelsId = [];
    for(let i in json){
        let id = json[i].id;
        modelsId.push(`${id}`);
    }
    return modelsId.includes(model);
  }catch(err){
    console.log(err);
    return null;
  }
}

async function getModels(){
  try{
    let resp = await fetch("https://getimg.ai/api/models?status=active&public=true", {
      "headers": {
  	  "accept": "application/json, text/plain,",
  	  "accept-language": "en-IN,en;q=0.9,hi-IN;q=0.8,hi;q=0.7,en-GB;q=0.6,en-US;q=0.5",
   	  "sec-ch-ua": "\"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?1",
          "sec-ch-ua-platform": "\"Android\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "Referer": "https://getimg.ai/text-to-image",
          "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": null,
      "method": "GET"
    });

    let json = await resp.json();
    var models = '';
    for(let i in json){
        let id = json[i].id;
        let name = json[i].name;
	models = `${models}\n\n${(i-0)+1}. ${name}  ( `+"```"+`${id}`+"``` )";
    }
    return models;
  }catch(err){
    console.log(err);
    return null;
  }
}


export default wizard;
