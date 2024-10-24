const axios = require("axios");
const FormData  = require('form-data');
function convertSize(byte) {
  let bytes = parseInt(byte);
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}
const nm = ["⓪", "⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"];
const form = new FormData();
module.exports = {
  config: {
    name: "تشابه",
    author: "Cystro",
    aliases: ["شبه","تشابة"],
    version: "1.0",
    countDown: 5,
    description: "البحث عن صور مشابهة",
    category: "الصور"
  },

  onStart: async function ({ api, event, args, message }) {
    if (event.type !== "message_reply" || !["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
      return message.reply("رد عا صوره 🙂🚮");
    }
      message.reaction('🍭', event.messageID);
    const imageUrl = event.messageReply.attachments[0].url;
    
    form.append('knowledgeRequest', `{"imageInfo":{"url":"${imageUrl}","source":"Url"},"knowledgeRequest":{"invokedSkills":["ImageById","BestRepresentativeQuery","Offline","ObjectDetection","OCR","EntityLinkingFace","EntityLinkingDog","EntityLinkingAnimal","EntityLinkingPlant","EntityLinkingLandmark","EntityLinkingFood","EntityLinkingBook","SimilarImages","RelatedSearches","ProductAds","SponsoredAds","Annotation","Recipes","Travel"],"invokedSkillsRequestData":{"adsRequest":{"textRequest":{"mainlineAdsMaxCount":2}}},"index":1}}`);

const response = await axios.post(
  'https://www.bing.com/images/api/custom/knowledge',
  form,
  {
    params: {
      'q': '',
      'rshighlight': 'true',
      'textDecorations': 'true',
      'internalFeatures': 'share',
      'FORM': 'SBIVSP',
      'skey': 'n6uppFVcr4r2y-MuNV55_0knMGGiqBHYCF6YCFJ6h-I',
      'safeSearch': 'Strict',
      'mkt': 'ar-xa',
      'setLang': 'ar-xa',
      'IG': 'AE1918AEEDAB4E37B681802A95468C32',
      'IID': 'idpins',
      'SFX': '1'
    },
    headers: {
      ...form.getHeaders(),
      'authority': 'www.bing.com',
      'accept': '*/*',
      'accept-language': 'ar-MA,ar;q=0.9,en-US;q=0.8,en;q=0.7',
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryIfiuv5n1RJBJkM6w',
      'cookie': '_IDET=VSNoti2=20240817&MIExp=0&SwipeNoti=2; ipv6=hit=1723918935835; MUID=2172378EB7E967A43765235DB6AF66FB; MUIDB=2172378EB7E967A43765235DB6AF66FB; SRCHD=AF=NOFORM; SRCHUID=V=2&GUID=C6CF6342272347D4BD8ED5BA6E2F89EA&dmnchg=1; MMCASM=ID=1DBBBDC1D43A4AD8ABA90E786A9A8062; fdfre=o=1; sbi=cfdlg=1&dvcidx=0&fredone=1; SRCHUSR=DOB=20240817&T=1723904693000&TPC=1723904708000; USRLOC=HS=1&ELOC=LAT=35.57619857788086|LON=-5.366199970245361|N=%D8%AA%D8%B7%D9%88%D8%A7%D9%86%D8%8C%20%D8%B7%D9%86%D8%AC%D8%A9%20%D8%AA%D8%B7%D9%88%D8%A7%D9%86%20%D8%A7%D9%84%D8%AD%D8%B3%D9%8A%D9%85%D8%A9|ELT=1|; _RwBf=r=0&ilt=6&ihpd=0&ispd=1&rc=3&rb=0&gb=0&rg=200&pc=3&mtu=0&rbb=0&g=0&cid=&clo=0&v=6&l=2024-08-17T07:00:00.0000000Z&lft=0001-01-01T00:00:00.0000000&aof=0&ard=0001-01-01T00:00:00.0000000&rwdbt=0001-01-01T00:00:00.0000000&rwflt=0001-01-01T00:00:00.0000000&o=2&p=&c=&t=0&s=0001-01-01T00:00:00.0000000+00:00&ts=2024-08-17T14:30:05.3068062+00:00&rwred=0&wls=&wlb=&wle=&ccp=&cpt=&lka=0&lkt=0&aad=0&TH=; _EDGE_S=SID=3993A904C3906E7F0DF8BDDAC20F6F94; _SS=SID=3993A904C3906E7F0DF8BDDAC20F6F94; SRCHHPGUSR=SRCHLANG=ar&DM=1&CW=891&CH=1685&SCW=891&SCH=1686&BRW=HTP&BRH=T&DPR=2.1&UTC=60&HV=1723915336&PV=12.0.0&WTS=63859500202&IG=AE1918AEEDAB4E37B681802A95468C32&PRVCW=1164&PRVCH=2202',
      'origin': 'https://www.bing.com',
      'pragma': 'no-cache',
      'referer': 'https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIVSP&sbisrc=UrlPaste&q=imgurl:https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp3695693.jpg',
      'sec-ch-ua': '"Not-A.Brand";v="99", "Chromium";v="124"',
      'sec-ch-ua-arch': '""',
      'sec-ch-ua-bitness': '""',
      'sec-ch-ua-full-version': '"124.0.6327.4"',
      'sec-ch-ua-full-version-list': '"Not-A.Brand";v="99.0.0.0", "Chromium";v="124.0.6327.4"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-model': '"SM-A125F"',
      'sec-ch-ua-platform': '"Android"',
      'sec-ch-ua-platform-version': '"12.0.0"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    }
  }
);

let re = response.data.tags[0].actions[0].data.value;

let narr = re.map(i => ({
    url: i.contentUrl,
    title: i.name,
    size: convertSize(i.contentSize),
    hostPage: i.hostPageUrl
  })); 
//console.log(narr[0])
   if (narr.length === 0) {
        message.reaction('❌', event.messageID);
        return message.reply("لا توجد صور مشابهة");
   }
    message.reaction('✅', event.messageID);

    const r6 = narr.slice(0, 6);
    let msg = "◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕\n";
    r6.forEach((r, i) => {
        const { title, hostPage } = r;
        const index = (i + 1).toString().split('').map(num => nm[parseInt(num)]).join('');
        msg += `\n◕◕◕◕◕◕◕◕✧${index}✧◕◕◕◕◕◕◕◕\n\n✧◝${title}◜✧\n`;
      });
    const img = await Promise.all(r6.map(async j => await global.utils.getStreamFromURL(j.url)));
  let ne = "»»» ✧◝التالي";
      if (narr.length <= 6) {
        ne = "◍•ᴗ•◍✧*تتم*";
      }
  await message.reply({
        body: msg + `\n◕◕◕◕◕◕◕◕◕◕◕◕${ne}`,
        attachment: img
      }, (error, message) => {
        global.GoatBot.onReply.set(message.messageID, {
          commandName: "تشابه",
          messageID: message.messageID,
          author: event.senderID,
          type: "nx",
          pg: 1,
          total: narr.length,
          res: narr
        });
      });
  },
  onReply: async function({ Reply, api, message, event }) {
    const { type, author, pg, total, res } = Reply;
    if (author != event.senderID) return;

    const messageBody = event.body.trim().toLowerCase();

    if (type === "nx" && messageBody === "التالي") {
      const nextPage = pg + 1;
      const start = (nextPage - 1) * 6;
      const end = start + 6;

      if (start >= total) {
        return message.reply("There are no other results");
      }

      const nextResults = res.slice(start, end);
      let msg = "◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕◕\n";

      nextResults.forEach((d, i) => {
        const { title } = d;
        const index = (start + i + 1).toString().split('').map(num => nm[parseInt(num)]).join('');
        msg += `\n◕◕◕◕◕◕◕◕✧${index}✧◕◕◕◕◕◕◕◕\n\n✧◝${title}◜✧\n`;
      });

      const attachments = await Promise.all(nextResults.map(async j => await global.utils.getStreamFromURL(j.url)));
      let ne = "»»» ✧◝التالي";
      if (end >= total) {
        ne = "◍•ᴗ•◍✧*تم*";
      }
      await message.reply({
        body: msg + `◕◕◕◕◕◕◕◕◕◕◕◕${ne}`,
        attachment: attachments
      }, (error, message) => {
        global.GoatBot.onReply.set(message.messageID, {
          commandName: "تشابه",
          messageID: message.messageID,
          author: event.senderID,
          type: "nx",
          pg: nextPage,
          total: total,
          res: res
        });
      });
    } else if (!isNaN(messageBody)) {
      const index = parseInt(messageBody, 10) - 1;
      if (index < 0 || index >= res.length) {
        return message.reply(`عدد الصور هو ${res.length}`);
      }

      const sRe = res[index];
      const {url, title, size, hostPage} = sRe

      await message.reply({
        body: `العنوان : ${title} 🪐\nرابط الموقع : ${hostPage} 🌐\n رابط الصورة : ${url} 🖼️\nحجم الصورة : ${size} 📥`,
        attachment: await global.utils.getStreamFromURL(url)
      })
    }
  }
}