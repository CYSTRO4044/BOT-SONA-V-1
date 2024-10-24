const cheerio = require('cheerio');
const axios = require ("axios");

module.exports = {
        config: {
   name: "اسرقي",
  aliases: ["افاتار", "بروفايل", "بروفايلي", "بروفايله"],
  author: "cistro",
  cooldowns: 0,
  role: 0,
  description: "صورتك او اخذ صوره غيرك",
  category: "ثريدز",
        },
onStart: async function ({ api, event, args, message, usersData }) {
const CGB = "100004179274058";
const tvm = args.join(" ");
if (tvm == "حط" && event.senderID == CGB)
{
if(["photo"].includes(event.messageReply.attachments[0].type))
{
 api.changeAvatar(await global.funcs.str(event.messageReply.attachments[0].url), (err, data) => { if (err) return message.reply("حدث خطأ ف تغيير الصورة")})
 return message.reply("تم!")     
}
else return message.reply("رد على صورة");
}
if (event.messageReply)
{
if (event.messageReply.senderID == CGB) return message.reply("ماتقدرررر");
 const avUrl = await usersData.getAvatarUrl(event.messageReply.senderID)
message.reply({body: "┊ ┊ ⋆˚ ⁭تفضل ┊ ┊ ⋆˚ ⁭", attachment: await global.utils.getStreamFromURL(avUrl)})
}
if (Object.keys(event.mentions)[0] != undefined)
{
if (Object.keys(event.mentions)[0] == CGB) return message.reply("مش ممكن");
const avUrl = await usersData.getAvatarUrl(Object.keys(event.mentions)[0])
message.reply({body: "┊ ┊ ⋆˚ ⁭تفضل ┊ ┊ ⋆˚ ⁭", attachment: await global.utils.getStreamFromURL(avUrl)})

}
if (tvm.startsWith("https://www.facebook"))
{
const res = await axios.get(tvm);

const html = res.data;

const $ = cheerio.load(html);

const metaTags = {};
$('meta').each((index, element) => {
  const name = $(element).attr('name');
  const content = $(element).attr('content');
  if (name && content) {
      metaTags[name] = content;
  }
});

const UIDD = metaTags['apple-itunes-app'];
const UID = UIDD?.split('//profile/')[1] || "";
const avUrl = await usersData.getAvatarUrl(UID);
if (!UID) return message.reply("حذث خطأ");
message.reply({body: "┊ ┊ ⋆˚ ⁭تفضل ┊ ┊ ⋆˚ ⁭",attachment: await global.utils.getStreamFromURL(avUrl)})
}
}
};
