const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "ابتايم",
    aliases: ["upe"],
    version: "1.0",
    author: "CYSTRO",
    role: 0,
    shortDescription: {
      en: "وقت التشغيل"
    },
    category: "ادمن",
    guide: {
      en: "للإستخدام {p}ابتايم ."
    }
  },
  onStart: async function ({ api, event, args }) {
    try {
     const imageLinks = [
  "https://i.ibb.co/hYz7SYf/image.png",
  "https://i.ibb.co/LpjnBG7/image.png",
  "https://i.ibb.co/yfrpk6j/image.png",
  "https://i.ibb.co/WtTZY0h/image.png",
  "https://i.ibb.co/wcq23cY/image.jpg",
  "https://i.ibb.co/5jF9v1N/image.png",
  "https://i.ibb.co/17DN5rD/image.png",
  "",
  ""
];
       


      const randomImageIndex = Math.floor(Math.random() * imageLinks.length);
      const imageUrl = imageLinks[randomImageIndex];


      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, 'assets/image', `background.png`);
      await fs.outputFile(imagePath, imageResponse.data);


      const uptime = process.uptime();
      const seconds = Math.floor(uptime % 60);
      const minutes = Math.floor((uptime / 60) % 60);
      const hours = Math.floor((uptime / (60 * 60)) % 24);
      const days = Math.floor(uptime / (60 * 60 * 24));

      let uptimeString = `${days} يوم, ${hours} ساعة, ${minutes} دقيقة, و ${seconds} ثانية`;
      if (days === 0) {
        uptimeString = `${hours} ساعة, ${minutes} دقيقة, و ${seconds} ثانية`;
        if (hours === 0) {
          uptimeString = `${minutes} دقيقة, و ${seconds} ثانية`;
          if (minutes === 0) {
            uptimeString = `${seconds} ثانية`;
          }
        }
      }


      const message = `البوت يعمل منذ 🌝 \n${uptimeString}`;
      const imageStream = fs.createReadStream(imagePath);

      await api.sendMessage({
        body: message,
        attachment: imageStream
      }, event.threadID, event.messageID);


      await fs.unlink(imagePath);
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred.`, event.threadID, event.messageID);
    }
  }
};