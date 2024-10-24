const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const nm = ["⓪", "⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"];
const sym = ['❥', '☏', '☑', '♚', '▲', '♪', 'Ⓐ', '☤', '✘', '☒', '♛', '▼', '♫', '⌘', '♡', 'ღ', 'ツ', '☼', '❅', '✎', '✪', '✯', '☭', '✞', '✿', '✄', '∞', '✫', '★'];
const k = sym[Math.floor(Math.random() * sym.length)];
const t = [
  "https://i.ibb.co/z7t6Gjp/462285990-557485423602508-8141838986561317116-n-png-stp-dst-png-p480x480-nc-cat-109-ccb-1-7-nc-sid-9.png",
  "https://i.ibb.co/jvZbPjq/462546580-537735622535547-8318814498170735069-n-png-stp-dst-png-p480x480-nc-cat-100-ccb-1-7-nc-sid-9.png",
  "https://i.ibb.co/YTVPLY6/462380513-1523386635210591-6685662209979453270-n-png-stp-dst-png-p480x480-nc-cat-101-ccb-1-7-nc-sid.png",
  "https://i.ibb.co/bgVsszs/462640544-882925797151125-3653763748981701756-n-png-stp-dst-png-p480x480-nc-cat-102-ccb-1-7-nc-sid-9.png",
  "https://i.ibb.co/J7szrgk/462566136-8880331561987003-3975210668538163532-n-png-stp-dst-png-p480x480-nc-cat-100-ccb-1-7-nc-sid.png",
  "https://i.ibb.co/VpD0TbW/462575951-1012073293936553-7839500034942452698-n-png-stp-dst-png-p480x480-nc-cat-103-ccb-1-7-nc-sid.png",
  "https://i.ibb.co/QCGT7Tn/462550822-1199754664647037-3302281741106486894-n-png-stp-dst-png-p480x480-nc-cat-106-ccb-1-7-nc-sid.png",
  "https://i.ibb.co/SwTsXkr/462559569-1267592194414067-1487281186331040879-n-png-stp-dst-png-p480x480-nc-cat-106-ccb-1-7-nc-sid.png",
  "https://i.ibb.co/F6YDsRQ/462546652-564800922559918-1696445173000922137-n-png-stp-dst-png-p480x480-nc-cat-103-ccb-1-7-nc-sid-9.png"
];
const yyy = t[Math.floor(Math.random() * t.length)];

module.exports = {
  config: {
    name: "الاوامر",
    aliases: ["شرح", "اوامر", "الاوامر", "help"],
    version: "1.17",
    author: "cistro",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "عرض الاوامر"
    },
    longDescription: {
      en: "عرض الاوامر"
    },
    category: "خدمات",
    guide: {
      en: "{pn}"
    },
    priority: 1
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID } = event;
    const pageSize = 20;
    const pageNumber = args[0] ? parseInt(args[0]) : 1;

    if (isNaN(pageNumber)) {
      const prefix = await getPrefix(threadID);
      const commandName = args[0]?.toLowerCase();

      if (commandName) {
        const command = commands.get(commandName) || commands.get(aliases.get(commandName));
        if (!command) {
          return await message.reply(`الأمر "${commandName}" غير موجود ☄.`);
        }

        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";
        const longDescription = configCommand.longDescription?.en || configCommand.longDescription || "نسيت أحطو";
        const guideBody = configCommand.guide?.en || configCommand.guide || "لا توجد طريقة للاستخدام لأنها سهلة 🤡.";
        const usage = guideBody.replace(/\{prefix\}|\{p\}/g, prefix)
          .replace(/\{name\}|\{n\}/g, configCommand.name)
          .replace(/\{pn\}/g, prefix + configCommand.name);

        const response = `⁂⁂⁂⁂⁂༆𝕊𝓸𝓃Ａ-βσ𝕥༆⁂⁂⁂⁂⁂
߷  الاسم: ${configCommand.name} 🪅
߷  العنوان: ${longDescription} 💬
߷  أسماء أخرى: ${configCommand.aliases ? configCommand.aliases.join(", ") : "ماعندو أسماء أخرى"} 🔭
߷  الإصدار: ${configCommand.version || "1.0"} 🤖
߷  الدور: ${roleText}
߷  وقت الانتظار: ${configCommand.countDown || 1} ثانية ⏳
߷  صانع الكود: ${author} 🧸🧷
߷  الاستخدام: 🛀
${usage}
✵✵✵✵✵✵✵✵✵✵✵✵✵`;

        const gifAttachment = await global.utils.getStreamFromURL(yyy);
        return message.reply({
          body: response,
          attachment: gifAttachment
        });
      }
    }

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    const totalCommands = Array.from(commands.values())
      .filter(command => command.config.hidn !== true).length;

    if (startIndex >= totalCommands || startIndex < 0) {
      return message.reply("الصفحة غير موجودة 🌝");
    }

    const ttr = await global.utils.getStreamFromURL(yyy);

    const sortedScripts = Array.from(commands.values())
      .filter(command => command.config.hidn !== true)
      .sort(compareScripts)
      .slice(startIndex, endIndex)
      .map((command, index) => {
        const commandNumber = startIndex + index + 1
        let description = command.config.description?.en || command.config.description || command.config.shortDescription?.en || command.config.shortDescription || "مافي وصف";
        return `❲🔮❳-> :${commandNumber} : ${command.config.name}: ${description}`;
      })
      .join("\n");

    return message.reply({
      body: `↬↬◌↬↬❀*̥˚↬↫◌↫↫❀*̥˚↫↫\n❲${sortedScripts}❳\n❍◠◠❍◠◠❍◠◠❍◠◠❍\n⊶ رقم الصفحة: ❲${nm[pageNumber]}❳\n⊶ عدد الأوامر: *̥ ${totalCommands} *̥\n❍‿‿❍‿‿❍‿‿❍‿‿❍\n `,
      attachment: ttr
    });
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "الكل 🐻";
    case 1:
      return "أدمن المجموعة 🦸";
    case 2:
      return "المطور 🧑‍🎤";
    default:
      return "لا يمتلك دور 🤡";
  }
}

function compareScripts(command1, command2) {
  const name1 = command1.config.name;
  const name2 = command2.config.name;
  return name1.localeCompare(name2);
  }