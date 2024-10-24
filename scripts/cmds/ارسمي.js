const axios = require('axios');
const moment = require("moment-timezone");
async function translate(text, sourceLang, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await axios.get(url);
  const translation = res.data[0].map((item) => item[0]).join("");
  return translation;
}
module.exports = {
  config: {
    name: 'لرسمي',
    aliases: ['xl'],
    version: '1.5',
    author: 'Cystro',
    countDown: 0,
    role: 0,
    category: "الصور",
    guide: {
      vi: "",
      en: "اكسل وصف"
    },
  },

  onStart: async function ({ event, usersData, api, args, message }) {
        try {
       let prompt = "";
       let imageUrl = "";
       let aspectRatio = "1:1"; 
       let step = "20"


            const aspectIndex = args.indexOf("--ar");
             if (aspectIndex !== -1 && args.length > aspectIndex + 1) {
    aspectRatio = args[aspectIndex + 1];
    args.splice(aspectIndex, 2); 
}

const indexSt = args.indexOf("--s");
if (indexSt !== -1 && args.length > indexSt + 1) {
    step = args[indexSt + 1];
    args.splice(indexSt, 2); 
}

            if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0 && ["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
                imageUrl = encodeURIComponent(event.messageReply.attachments[0].url);
            }

            if (args.length > 0) {
                prompt = args.join(" ");
            } else {
                message.reply("⚠️ | ادخل نص.");
                return;
            }
  const startTime = new Date();         
const pompt = await translate(prompt, "ar", "en");

            let apiUrl =` https://imagine-issam.onrender.com/xl3?prompt=${encodeURIComponent(pompt)}&rto=${aspectRatio}&step=${step}&hid=&wid=`;
            if (imageUrl) {
                apiUrl += `&url=${imageUrl}`;
            }
          message.reaction("🧸", event.messageID);

            
  const endTime = new Date();
         const uid = event.senderID;
                const userNamefromData = await usersData.getName(uid);
                const drawingTime = (endTime - startTime) / 1000;

                const currentDate = moment.tz("Africa/Cairo").format("YYYY-MM-DD");
                const currentTime = moment.tz("Africa/Cairo").format("h:mm:ss A");
       
            message.reply({   body: `
❨ تم تنفيذ طلبك بنجاح 🏜 ❩

⌯︙بواسطة -› ${userNamefromData}
⌯︙استغرق -› ${drawingTime} 🧭
⌯︙الوقت -› ${currentTime} ⌚
⌯︙التاريخ -› ${currentDate} 📚
              `,
                attachment: await global.utils.getStreamFromURL(apiUrl)
            });  
            await message.reaction("🖌️", event.messageID);
        } catch (error) {
         message.reaction("❌", event.messageID);
          console.error("⁠▽xl err:", error.message)
        }
    }
};