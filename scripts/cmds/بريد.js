const axios = require("axios");
const nm = ["⓪", "⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"];
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function decodeMIME(encodedStr) {
  if (encodedStr.includes('=?UTF-8?B?')) {
    return encodedStr
      .split(' ')
      .map(part => {
        const matches = part.match(/\?UTF-8\?B\?(.+)\?=/);
        if (matches) {
          return Buffer.from(matches[1], 'base64').toString('utf8');
        }
        return part;
      })
      .join(' ');
  }

  return encodedStr;
}

module.exports = {
  config: {
    name: "بريد",
    version: "1.0",
    author: "Cystro",
    role: 0,
    shortDescription: "بريد وهمي ميهم",
    longDescription: "مجرد بريد وهمي ميهم",
    category: "خدمات",
    guide: {
      en: " {pn}"
    }
  },

  onStart: async function ({ api, args, message, event, usersData }) {
    const m = args[0];
    if (!m) return message.reply("اكتب بريد جديد لإنشاء بريد جديد او اذا كنت تريد بريد جديد بأسمك  اكتب بريد جديد اسمك وبعض الارقام@هنا المضيف سأذكر البعض منهم في الأسفل ، وبعد عندما صندوق و اختصارو هو -ص نسيت مثل جديد اختصارو هو -ج تكتب بريد صندوق و البريد بعدها ،،،،،،، اعرف ان شرحي زفت \n \n 1.t-mail.tech\n2.fbimg.click\n3.fbrankupgif.click\n4.lianeai.click\n5.hazeyy.click\n6.tangina.click\n\n\n ® ملاحظة: وقت استلام الرسائل يستغرق وقت");

    switch (m) {
      case "جديد":
      case "-ج": {
        const ema = args.slice(1).join(" ");

        if (ema && emailRegex.test(ema) && (ema.endsWith("@t-mail.tech") || ema.endsWith("@fbimg.click") || ema.endsWith("@fbrankupgif.click") || ema.endsWith("@lianeai.click") || ema.endsWith("@tangina.click") || ema.endsWith("@hazeyy.click"))) {
          const tt = await axios.get(`https://issam-tempmail.onrender.com/api/create_email?email=${ema}`);

          if (tt.data.status === false) {
            return message.reply("مجرد ايررر او تحقق من ان كتابة البريد الالكتروني صحيح ");
          }

          const mx = tt.data.email;
          await message.reply(`تفضل بريدك الجديد 🚮🚮\n ${mx}`);
        } else {
          const res = await axios.get("https://issam-tempmail.onrender.com/api/generate_email");
          const email = res.data.email;
          await message.reply(`تفضل بريدك الجديد 🙂🚮\n ${email}`);
        }
        break;
      }

      case "صندوق":
      case "-ص": {
        const arg = args.slice(1).join(" ");
        if (!arg) return message.reply("غبي 🤦🏻 ادخل البريد");
        if (!arg.match(emailRegex)) return message.reply("تظن اني غبي");

        const res = await axios.get(`https://issam-tempmail.onrender.com/api/inbox?email=${arg}`);
        if (res.data.status === false) return message.reply("مجرد ايرر");

        const results = res.data.data;
        if (results.length === 0) return message.reply("لا توجد رسائل حالياً 🙂🚮");

        let msg = "";
        results.forEach((r, i) => {
          const { subject, from, date } = r;
          const index = (i + 1).toString().split('').map(num => nm[parseInt(num)]).reverse().join('');
          msg += `-------------------\n${index}\n الرسالة: ${decodeMIME(subject)} 🗳️\nمن: ${from} 📬\n التاريخ: ${date} 📆📌\n-------------------\n`;
        });

        await message.reply(msg);
        break;
        
      }
    }
  }
};