const fs = require("fs-extra");

module.exports = {
        config: {
                name: "رست",
                version: "1.1",
                author: "cistro",
                countDown: 5,
                role: 2,
                description: {
                        vi: "Khởi động lại bot",
                        en: "إعادة تشغيل البوت"
                },
                category: "Owner",
                guide: {
                        vi: "   {pn}: Khởi động lại bot",
                        en: "   {pn}: إعادة تشغيل البوت"
                }
        },

        langs: {
                vi: {
                        restartting: "🌝 | Đang khởi động lại Sona"
                },
                en: {
                        restartting: "🌝 | جاري إعادة تشغيل سونا "
                }
        },

        onLoad: function ({ api }) {
                const pathFile = `${__dirname}/tmp/restart.txt`;
                if (fs.existsSync(pathFile)) {
                        const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
                        api.sendMessage(`✅ | تمت إعادة تشغيل سونا\n⏰ | المدة: ${(Date.now() - time) / 1000}ثانية`, tid);
                        fs.unlinkSync(pathFile);
                }
        },

        onStart: async function ({ message, event, getLang }) {
                const pathFile = `${__dirname}/tmp/restart.txt`;
                fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
                await message.reply(getLang("restartting"));
                process.exit(2);
        }
};