import fetch from 'node-fetch';

class ImgApi{

    async generateImage(params){
        try{
            let img = await fetch(`https://galaxyapi.onrender.com/v1/images/generations`, {
                "headers": {
		    "accept": "application/json",
                    "Authorization": `Bearer ${process.env.API_KEY}`,
                    "content-type": "application/json"
                },
                "body": `${JSON.stringify(params)}`,
                "method": "POST"
            });
            let imgJson = await img.json();
            
        console.log(imgJson)
	    let imgUrls = [];
	    for(let i in imgJson.data){
	        let imgUrl = imgJson.data[i].url;
            imgUrls.push(imgUrl);
        }
        
        return Promise.resolve(imgUrls);
        
        }catch(err){
            return Promise.reject(err);
        }
    }
}

export default ImgApi;
