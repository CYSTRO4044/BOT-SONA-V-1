const axios = require("axios");

module.exports = {
  config: {
    name: "تطقيم",
    author: "Cystro",
    version: "1.0",
    countDown: 5,
    description: "بس تطقيم",
    category: "الصور"
  },

  onStart: async function ({ api, event, args, message }) {
    try {
      let url;
      if (args.join(" ") === "اولاد") {
        url = 'https://raw.githubusercontent.com/Afghhjjkoo/GURU-BOT/main/lib/5%D8%AA%D8%B7%D9%82%D9%8A%D9%85.json';
      } else if (args.join(" ") === "بنات") {
        url = "https://raw.githubusercontent.com/Afghhjjkoo/GURU-BOT/main/lib/miku54.json";
      } else {
        url = 'https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json';
      }

      const response = await axios.get(url);
      const anu = response.data;
      const random = anu[Math.floor(Math.random() * anu.length)];

      const mt = (args.join(" ") === "اولاد" || args.join(" ") === "بنات") ? random.cowo : random.male;
      const fg = (args.join(" ") === "اولاد" || args.join(" ") === "بنات") ? random.cewe : random.female;

      const rh = await global.utils.getStreamFromURL(mt);
      const eh = await global.utils.getStreamFromURL(fg);
      const kj = [rh, eh];

      await message.reply({
        attachment: kj,
        body: `⇣♡◄∘ تفضل صديقي ∘►♡⇡`
      });

    } catch (error) {
      console.error("اا:", error.message);
      api.sendMessage({ body: `حدث خطأ` }, event.threadID);
    }
  }
};