const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "دخليني",
    version: "3.0", 
    author: "Cystro",
    countDown: 5,
    role: 2,
    shortDescription: "دخول المجموعات المتواجد فيها البوت",
    longDescription: "",
    category: "ادمن",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event }) {
    try {
      const groupList = await api.getThreadList(300, null, ['INBOX']); 

      const filteredList = groupList.filter(group => group.threadName !== null);

      if (filteredList.length === 0) {
        api.sendMessage('لا توجد مجموعات حالياً', event.threadID);
      } else {
        const formattedList = filteredList.map((group, index) =>
          `${index + 1}. ${group.threadName}\n ايدي: ${group.threadID}`
        );

  
        const start = 0;
        const currentList = formattedList.slice(start, start + 5);

        const message = `╭─╮\n│قائمة المجموعات:\n${currentList.join("\n")}\n╰───────────ꔪ`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName:'دخليني',
          messageID: sentMessage.messageID,
          author: event.senderID,
          start,
        });
      }
    } catch (error) {
      console.error("فاك", error);
    }
  },

  onReply: async function ({ api, event, Reply, args }) {
    const { author, commandName, start } = Reply;

    if (event.senderID !== author) {
      return;
    }

    const userInput = args.join(" ").trim().toLowerCase();

    if (userInput === 'التالي') {
    
      const nextPageStart = start + 5;
      const nextPageEnd = nextPageStart + 5;

      try {
        const groupList = await api.getThreadList(300, null, ['INBOX']);
        const filteredList = groupList.filter(group => group.threadName !== null);

        if (nextPageStart >= filteredList.length) {
          api.sendMessage('انتهت القائمة', event.threadID, event.messageID);
          return;
        }

        const currentList = filteredList.slice(nextPageStart, nextPageEnd).map((group, index) =>
          `${nextPageStart + index + 1}. ${group.threadName}\n ايدي: ${group.threadID}`
        );

        const message = `╭─╮\n│قائمة المتواجد فيها البوت:\n${currentList.join("\n")}\n╰───────────ꔪ`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: 'دخليني',
          messageID: sentMessage.messageID,
          author: event.senderID,
          start: nextPageStart,
        });

      } catch (error) {
        console.error("ارر", error);
        api.sendMessage('يرور 🌝💔', event.threadID, event.messageID);
      }

    } else if (userInput === 'السابق') {
     
      const prevPageStart = Math.max(start - 5, 0);
      const prevPageEnd = prevPageStart + 5;

      try {
        const groupList = await api.getThreadList(300, null, ['INBOX']);
        const filteredList = groupList.filter(group => group.threadName !== null);

        if (prevPageStart < 0) {
          api.sendMessage('في بداية القائمة بالفعل.', event.threadID, event.messageID);
          return;
        }

        const currentList = filteredList.slice(prevPageStart, prevPageEnd).map((group, index) =>
          `${prevPageStart + index + 1}. ${group.threadName}\nادي: ${group.threadID}`
        );

        const message = `╭─╮\n│قائمة المجموعات :\n${currentList.join("\n")}\n╰───────────ꔪ`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        global.GoatBot.onReply.set(sentMessage.messageID, {
          commandName: 'دخليني',
          messageID: sentMessage.messageID,
          author: event.senderID,
          start: prevPageStart,
        });

      } catch (error) {
        console.error("ايررر", error);
        api.sendMessage('ايررررر.', event.threadID, event.messageID);
      }

    } else if (!isNaN(userInput)) {
     
      const groupIndex = parseInt(userInput, 10);

      try {
        const groupList = await api.getThreadList(300, null, ['INBOX']);
        const filteredList = groupList.filter(group => group.threadName !== null);

        if (groupIndex <= 0 || groupIndex > filteredList.length) {
          api.sendMessage('رد برقم المجموعة', event.threadID, event.messageID);
          return;
        }

        const selectedGroup = filteredList[groupIndex - 1];
        const groupID = selectedGroup.threadID;

        await api.addUserToGroup(event.senderID, groupID);
        api.sendMessage(`تمت إضافتك الى: ${selectedGroup.threadName}`, event.threadID, event.messageID);

      } catch (error) {
        console.error("حدث خطأ", error);
        api.sendMessage('حدث خطأ ربما امسكرين المجموعة.', event.threadID, event.messageID);
      }

    } else {
      api.sendMessage('رد بالتالي او السابق', event.threadID, event.messageID);
    }

    
    global.GoatBot.onReply.delete(event.messageID);
  },
};