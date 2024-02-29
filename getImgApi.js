import fetch from 'node-fetch';

async function parseCookies(response) {
    const raw = response.headers.raw()['set-cookie'];
    return raw.map((entry) => {
        const parts = entry.split(';');
        const cookiePart = parts[0];
        return cookiePart;
    }).join(';');
}

class ImgApi{

    async login() {
	try {
            let loginResponse = await fetch("https://getimg.ai/api/auth", {
		"headers": {
                    "accept": "application/json, text/plain",
		    "accept-language": "en-IN,en;q=0.9,hi-IN;q=0.8,hi;q=0.7,en-GB;q=0.6,en-US;q=0.5",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": "\"Android\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "Referer": "https://getimg.ai/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": `{\"name\":\"\",\"email\":\"${process.env.username}\",\"password\":\"${process.env.password}\"}`,
                "method": "POST"
	    });
            if(loginResponse.ok){
                this.cookie = await parseCookies(loginResponse);
                return Promise.resolve(loginResponse.json());
            }else{
                return Promise.reject(`GetImgApi Login Error: ${loginResponse.json()}`);
            }
        } catch (err){
            return Promise.reject(`GetImgApi Login Fetch Error: ${err}`);
        }
    }

    async generateImage(model, params){
        try{
            let img = await fetch(`https://getimg.ai/api/models/${model}`, {
                "headers": {
		    "accept": "application/json, text/plain",
                    "accept-language": "en-IN,en;q=0.9,hi-IN;q=0.8,hi;q=0.7,en-GB;q=0.6,en-US;q=0.5",
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": "\"Android\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "cookie": this.cookie,
                    "Referer": "https://getimg.ai/text-to-image",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
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
