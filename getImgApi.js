import fetch from 'node-fetch';

class ImgApi{

    async generateImage(model, params){
        try{
            let img = await fetch(`https://galaxyapi.onrender.com/v1/images/generations`, {
                "headers": {
		    "accept": "application/json, text/plain",
                    "Authorization": 'Bearer ${process.env.apikey}',
                    "content-type": "application/json"
                },
                "body": `${JSON.stringify(params)}`,
                "method": "POST"
            });
            let imgJson = await img.json();
	    let imgUrls = [];
	    for(let i in imgJson){
                let imgUrl = imgJson[i].images[0].jpegUrl;
		imgUrls.push(imgUrl);
	    }
            return Promise.resolve(imgUrls);
        }catch(err){
            return Promise.reject(err);
        }
    }
}

export default ImgApi;
