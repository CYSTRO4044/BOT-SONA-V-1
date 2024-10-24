module.exports = {
  config: {
    name: "اطلعي",
    aliases: ["l"],
    version: "1.0",
    author: "Cystro",
    countDown: 5,
    role: 2,
    shortDescription: {
      en: "مادخلك"
    },
    longDescription: {
      en: "مادخلك"
    },
    category: "المطور",
    guide: {
      en: ""
    }
  },
  onStart: async function ({ api, event, args }) {
    if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
  }
};