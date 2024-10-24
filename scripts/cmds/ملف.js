const fs = require('fs');

module.exports = {
  config: {
    name: "ملف",
    version: "1.0",
    author: "Cystro",
    countDown: null,
    role: 2,
    shortDescription: "ملفات سونا",
    longDescription: "ملفات سونا",
    category: "owner",
    guide: "{pn} file name. Ex: .{pn} filename"
  },

  onStart: async function ({ message, args, api, event }) {
    const fileName = args[0];
    const permission = ["100004179274058","100085065303625"];
    if (!fileName) {
      return api.sendMessage("اكتب اسم الملف 🌝💔", event.threadID, event.messageID);
    }

    const filePath = __dirname + `/${fileName}.js`;
    if (!fs.existsSync(filePath)) {
      return api.sendMessage(`File not found: ${fileName}.js`, event.threadID, event.messageID);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    api.sendMessage({ body: fileContent }, event.threadID);
  }
};