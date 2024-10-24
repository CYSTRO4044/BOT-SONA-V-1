module.exports = {
  config: {
    name: "تخمين", 
    author: "Cystro",
    longDescription: "تخمين الارقام",
    category: "العاب",
  },

  onLoad: async function ({}) {
    global.nm = {};
  },

  onStart: async function({ message, event }) {
    if (!global.nm) global.nm = {};

    const TID = event.threadID;
    const rm = Math.floor(Math.random() * 1000) + 1;

    global.nm[TID] = {
      number: rm,
      active: true
    };

    await message.reply('تم بدءا العبة، قوانين اللعبة بسيطة ارسل رقم اذا تفاعل البوت مع رسالتك ب ⬇️ يعني ان الرقم اصغر من الرقم الذي ارسلته و اذا تفاعل ب ⬆️ يعني بأن الرقم اكبر و هكذا.');
  },

  onChat: async function({ event, message, usersData }) {
    if (!global.nm) global.nm = {};

    const TID = event.threadID;
    const uid = event.senderID;
    const name = await usersData.getName(uid);

    if (global.nm[TID] && global.nm[TID].active) {
      const gn = parseInt(event.body);
      const an = global.nm[TID].number;

      if (!isNaN(gn)) {
        if (gn === an) {
          global.nm[TID].active = false;
          await usersData.set(uid, (await usersData.get(uid, "exp") || 0) + 5, "exp");
await message.reaction("☑️", event.messageID);
          await message.reply(`قام ${name} ب تخمين الرقم الصحيح اولا 🎉 \n نقاطك اصبحت: ${await usersData.get(uid, "exp")} نقطة 🏆`);
        } else if (gn > an) {
          await message.reaction("⬇️", event.messageID);
        } else {
          await message.reaction("⬆️", event.messageID);
        }
      }
    }
  }
};