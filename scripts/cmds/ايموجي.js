

module.exports = {
  config: {
    name: "ايموجي",
    aliases: ["emjqis"],
    version: "1.0",
    author: "cistro",
    description: {
      vi: "",
      en: "من العاب السرعة"
    },
    longDescription: "لعبة اول من يرسل الايموجي المطلوب ",
     category: "ترفيه",
    guide: {
    vi: '',
    en: "{pn} @تاغ"
  }
},


  onLoad: async function ({}) {
    global.emoji = {}

    const TID = 28292;
    global.emoji[TID] = {
        emoji: null,
        link: null
      };
  },
  onStart: async function({ message, event, commandName, getLang }) {
  if (!global.emoji) global.emoji = {};


const emojis = [
{
  "emoji": "😗",
  "link": "https://i.imgur.com/LdyIyYD.png"
},
{
  "emoji": "😭",
  "link": "https://i.imgur.com/P8zpqby.png"
},
  {
  "emoji": "🤠",
  "link": "https://i.imgur.com/kG71glL.png"
  },
  {
  "emoji": "🙂",
  "link": "https://i.imgur.com/hzP1Zca.png"
  },
    {
  "emoji": "🐸",
  "link": "https://i.imgur.com/rnsgJju.png"
  },
    {
  "emoji": "⛽",
  "link": "https://i.imgur.com/LBROa0K.png"
  },
    {
  "emoji": "💰",
  "link": "https://i.imgur.com/uQmrlvt.png"
  },
    {
  "emoji": "🥅",
  "link": "https://i.imgur.com/sGItXyC.png"
  },
    {
  "emoji": "♋",
  "link": "https://i.imgur.com/FCOgj6D.jpg"
  },
    {
  "emoji": "🍌",
  "link": "https://i.imgur.com/71WozFU.jpg"
  },
    {
  "emoji": "🦊",
  "link": "https://i.imgur.com/uyElK2K.png"
  },
    {
  "emoji": "😺",
  "link": "https://i.imgur.com/PXjjXzl.png"
  },
    {
  "emoji": "🍀",
  "link": "https://i.imgur.com/8zJRvzg.png"
  },
    {
  "emoji": "🆘",
  "link": "https://i.imgur.com/Sl0JWTu.png"
  },
    {
  "emoji": "🥺",
  "link": "https://i.imgur.com/M69t6MP.jpg"
  },
    {
  "emoji": "😶",
  "link": "https://i.imgur.com/k0hHyyX.jpg"
  },
    {
  "emoji": "😑",
  "link": "https://i.imgur.com/AvZygtY.png"
  },
    {
  "emoji": "😔",
  "link": "https://i.imgur.com/pQ08T2Q.jpg"
  },
    {
  "emoji": "🤦‍♂️",
  "link": "https://i.imgur.com/WbVCMIp.jpg"
  },
    {
  "emoji": "👀",
  "link": "https://i.imgur.com/sH3gFGd.jpg"
  },
    {
  "emoji": "💱",
  "link": "https://i.imgur.com/Gt301sv.jpg"
  },
    {
  "emoji": "🕴️",
  "link": "https://i.imgur.com/652pmot.jpg"
  },
    {
  "emoji": "🏖️",
  "link": "https://i.imgur.com/CCb2cVz.png"
  },
    {
  "emoji": "🏕️",
  "link": "https://i.imgur.com/zoGHqWD.jpg"
  },
    {
  "emoji": "🪆",
  "link": "https://i.imgur.com/FUrUIYZ.jpg"
  }
];
  const TID = event.threadID;
  const randomIndex = Math.floor(Math.random() * emojis.length);
  const data = emojis[randomIndex];

  global.emoji[TID] = {
    emoji: data.emoji,
    link: data.link
  };

  await message.reply({
    body: 'اول من يرسل هذ الايموجي يفوز 🌝',
    attachment: await global.utils.getStreamFromURL(global.emoji[TID].link)
  });
},

  onChat: async function({ event, message, usersData }) {
  if (!global.emoji) global.emoji = {};

  var TID = event.threadID;
  var uid = event.senderID;
  var name = await usersData.getName(uid);

  try { 

  if (global.emoji[TID].emoji) {
    if (event.body === global.emoji[TID].emoji) {
      await usersData.set(uid, (await usersData.get(uid, "exp") || 0) + 1, "exp");
      global.emoji[TID] = {
        emoji: null,
        link: null
      };
      message.reply(`قام ${name} ب ارسال الايموجي المطلوب \nعدد نقاطك : ${await usersData.get(uid, "exp")} نقطة 😗\n`);
    }
  }
  } catch (e) {}
}

  }
