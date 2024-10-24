const fs = require('fs');
const axios = require('axios');
const path = require('path');
const imageSize = require('image-size');

module.exports = {
  config: {
    name: 'تحويل',
    version: '1.5',
    author: 'Cystro',
    countDown: 0,
    role: 0,
    shortDescription: { en: "تحويل صورة الى انمي" },
    category: "الصور",
    guide: { en: "رد على صورة لتحويلها الى انمي" },
  },

  onStart: async function ({ event, api, message, args }) {
    if (event.type !== "message_reply" || !["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
      return message.reply("رد عا صوره 🙂🚮");
    }

    const imageUrl = event.messageReply.attachments[0].url;
    let option = "2";
    if (args[0] && !isNaN(args[0])){
      option = args[0];
    }
    if (option === "1") {
      await processImageWithProdia(imageUrl, args.slice(1).join(' '), api, event, message);
    } else if (option === "2") {
      await processImageWithDrawever(imageUrl, message, event);
    } else if (option === "3") {
       await mmm(imageUrl, message, event)
      }
  }
};

async function processImageWithProdia(imageUrl, prompt, api, event, message) {
  message.reaction("🪄", event.messageID);
  const apiKey = 'e8346eb2-6187-4748-a42f-7241580ee1f1';
  const imageBuffer = await downloadImage(imageUrl);
  const { width, height } = imageSize(imageBuffer);
  const aspectRatio = width / height > 1.4 ? "landscape" : width / height < 0.8 ? "portrait" : "square";

  try {
    const generatedImageUrl = await generateImageProdia(apiKey, imageUrl, prompt, aspectRatio);
    const processedBuffer = await downloadImage(generatedImageUrl);
    const imagePath = path.join(__dirname, '/assets/image/generated_image.png');
    fs.writeFileSync(imagePath, processedBuffer);
    message.reaction("🪐", event.messageID)
    await api.sendMessage({ body: `⇣♡◄∘ تفضل صديقي ∘►♡⇡`, attachment: fs.createReadStream(imagePath) }, event.threadID);
    fs.unlinkSync(imagePath);
  } catch (error) {
    message.reaction("❌", event.messageID)
    console.error('Error processing image with Prodia:', error);
    message.reply('مجرد ايرر');
  }
}

async function generateImageProdia(apiKey, imageUrl, prompt, aspectRatio) {
  const options = {
    method: 'POST',
    url: 'https://api.prodia.com/v1/sd/transform',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-Prodia-Key': apiKey,
    },
    data: {
      imageUrl,
      prompt,
      model: 'meinamix_meinaV9.safetensors [2ec66ab0]',
      denoising_strength: 0.40,
      negative_prompt: 'worst quality, normal quality, ...',
      style_preset: 'anime',
      sampler: 'Euler a',
      steps: 50,
      cfg_scale: 8,
      seed: -1,
      upscale: true,
      aspect_ratio: aspectRatio,
    },
  };

  const response = await axios(options);
  const job = response.data.job;

  while (true) {
    const jobResponse = await axios.get(`https://api.prodia.com/v1/job/${job}`, {
      headers: { accept: 'application/json', 'X-Prodia-Key': apiKey },
    });

    if (jobResponse.data.status === 'succeeded') {
      return jobResponse.data.imageUrl;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function processImageWithDrawever(imageUrl, message, event) {
  message.reaction("🪄", event.messageID)
  try {
    const base64Image = await imageUrlToBase64(imageUrl);
 const data = JSON.stringify({
      "image": `${base64Image}`
    });

    let config = {
      method: 'POST',
      url: 'https://www.drawever.com/api/tools/process',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; RMX3430 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.186 Mobile Safari/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Android WebView";v="126"',
        'sec-ch-ua-mobile': '?1',
        'path': '/ai/photo-to-anime',
        'sec-ch-ua-platform': '"Android"',
        'origin': 'https://www.drawever.com',
        'x-requested-with': 'mark.via.gp',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://www.drawever.com/ai/photo-to-anime?start=1723412154131',
        'accept-language': 'ar-MA,ar;q=0.9,en-MA;q=0.8,en-US;q=0.7,en;q=0.6',
        'priority': 'u=1, i',
        'Cookie': '...'
      },
      data: data
    };

    const response = await axios.request(config);
    const base64Data = response.data[1].replace(/^data:image\/jpeg;base64,/, "");

    const filename = "processed_image.jpg";
    saveImageToFile(base64Data, filename);
    message.reaction("🪐", event.messageID)
    await message.reply({ body: `⇣♡◄∘ تفضل صديقي ∘►♡⇡`, attachment: fs.createReadStream(filename) });
    fs.unlinkSync(filename);
  } catch (error) {
    message.reaction("❌", event.messageID)
    console.error('Error processing image with Drawever:', error);
    message.reply('مجرد ايرر');
  }
}
async function mmm(imageUrl, message, event){
   try{
     const axios = require("axios")
message.reaction("🪄", event.messageID);
      const a = await axios.get(`https://issam-dev-v1.onrender.com/api/tools/toanime?url=${imageUrl}`)
      const url = a.data.result.image_data;
        message.reaction("🪐", event.messageID);
      message.reply({ body: `⇣♡◄∘ تفضل صديقي ∘►♡⇡`, attachment: await global.utils.getStreamFromURL(url) });
      } catch (err){
        message.reaction("❌", event.messageID);
        await message.reply(`🙂🚮`)
   }
}
async function downloadImage(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}

async function imageUrlToBase64(imgUrl) {
  try {
    const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
    return `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;
  } catch (error) {
    console.error('Error converting image URL to Base64:', error);
    throw error;
  }
}

function saveImageToFile(base64Image, filename) {
  try {
    fs.writeFileSync(filename, Buffer.from(base64Image, 'base64'));
  } catch (error) {
    console.error('Error saving image to file:', error);
  }
}