const axios = require("axios");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const request = require('request');
const sizeOf = require('image-size');

const nm = ["⓪", "⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"];


module.exports = {
    config: {
      name: "ميلو",
      aliases: ["مانهو","مانجا"],
      version: "1.0",
      author: "Cystro",
      countDown: 5,
      role: 0,
      description: {
			vi: "",
			en: "مكتبة  ميلو"
		},
      longDescription: {
        vi: '',
        en: "مكتبة مانجا ميلو"
      },
      category: "خدمات",
      guide: {
        vi: '',
        en: "{pn}"
      }
    },
    
    onStart: async function({ api, message, event , usersData}) {
      const msg = `🔥 | مكتــبة المانجا 🏫📚
      
←› يرجى الرد على هذه الرسالة بكلمات البحث لاسم المانجا أو المانهوا المراد البحث عنه.

⌯︙يفضل استخدام الحروف الإنجليزية.
⌯︙ رد ب "مفضلاتي" لعرض مفضلاتك.`;

      message.reply(msg, (error, message) => {
        global.GoatBot.onReply.set(message.messageID, {
          commandName: "ميلو",
          messageID: message.messageID,
          author: event.senderID,
          type: "letsSearch"
        });
      });
    },
onReply: async function({ Reply, api, message, event, usersData }) {
        const { type, result, author } = Reply;
         if( author != event.senderID ) return;
const messageBody = event.body.trim().toLowerCase();
        const body = parseInt(messageBody);
        if (type === "letsSearch"& messageBody === "مفضلاتي") {
          const favorites = await usersData.get(author, "data.favorites", []);
          let tag = await usersData.getName(author)
          let messg = `❛ ${tag} ❛\n\n`
          if (favorites.length === 0) {
            messg += `⭐ | لا تمتلك اي مفضلات الان.`
          }
          favorites.forEach((manga, i) => {
            const index = (i + 1).toString().split('').map(num => nm[parseInt(num)]).join('');
          messg += `⑉◍⁠⑉◍⁠⑉◍⁠⑉◍⁠⑉◍⁠⑉◍⁠⑉◍⁠⑉◍⁠⑉◍⑉◍⁠⑉◍⁠⑉◍⁠⑉◍⁠⑉◍\n${ index }.←›الأسم: ${ manga.name }⭐\n المشاهدات: ${ manga.views }✨\n←› تمت إضافتها إلى مفضلاتك في ${ manga.favoriteTime }📥\n⁠⁠⑉◍⁠⑉◍⁠⑉◍⁠⁠⁠⑉◍⁠⑉◍ القصة⁠⑉◍⁠⑉◍⁠⑉◍⑉◍⁠⁠⑉◍⁠\n←› ${manga.summary ? manga.summary : "لا توجد قصة خذ قصة قصير كان في قددددديييم الزمانننننن كان هناك امير و سيم و أميرة ساحرة بشعة يعيشان في جبببببل  بعدد وبعدهااا انتهت القصصة اتمنى انننن تعجبببك القصصصصة و شكراً"
}📕`;
        });
        message.unsend(Reply.messageID)
         return message.reply({
         body:  messg,
         mentions: [{tag: tag,id: author}],
         }, (error, message) => {
                        global.GoatBot.onReply.set(message.messageID, {
                       commandName: "ميلو",
                       messageID: message.messageID,
                       resultMessageID: message.messageID,
                       author: event.senderID,
                       type: "favoriX",
                       favorites: favorites,
                       usersData:usersData
                        });
                    }
                );

        }
        if (type === "letsSearch") {
           const {favorites}=Reply
            const keywords = messageBody;
            message.reaction('🍭', event.messageID);
            try {
                const response = await axios.get(
                    `https://issam-mangax.onrender.com/mello/search/${encodeURIComponent(
                        keywords
                    )}`
                );
                const mangaData = response.data;
                const NumberOfSearch = mangaData.length;

                if (NumberOfSearch === 0) {
           message.reaction('❌', event.messageID);                    return message.reply(`❌︙لم يتم العثور على "${keywords}"🫠`);
                }

                let formattedMessage = `〄 تم العثور على ${NumberOfSearch} مانجا 🔎⤷\n\n`;

                mangaData.forEach((anime, index) => {
                    formattedMessage += `${index + 1}- الاسم ←› ${anime.title} 🤍\n`;
                    const genres = anime.genres.map((genre) => genre.name);
                  
                     
                let genresString = genres.join(' ، ');
                
                   formattedMessage += `←› التصانيف: ${genresString ? genresString : 'لا توجد تصانيف ' } 🖌️\n`;
                    formattedMessage += `←› التقييم: ${anime.rate}✨\n`;
                    formattedMessage +=`←› المشاهدات: ${anime.views} 🧸\n\n`
                });

                let please = `⌯︙قم بالرد برقم بين 1 و ${NumberOfSearch} 🧞‍♂`;
                if (NumberOfSearch === 1) {
                    please = "⌯︙ قم بالرد برقم واحد 1 .";
                }

                message.reply(
                    `
${formattedMessage}
${please}
`,
                    (error, message) => {
                        global.GoatBot.onReply.set(message.messageID, {
                        commandName: "ميلو",
                            messageID: message.messageID,
                            resultMessageID: message.messageID,
                          author: event.senderID,
                            type: "animeResults",
                           result: mangaData,
                           usersData:usersData,
                           favorites: favorites
                        });
                    }
                );
             } catch (error) {
                console.error("Error occurred while fetching anime data:", error);
                return message.reply(`❌︙لم يتم العثور على "${keywords}"🧞‍♂`);
            }
        }

        if (type === "animeResults"||type === "favoriX" ) {
            try {
              const {usersData, favorites } = Reply
              let x = result
                if (type === "favoriX") {
                  x = favorites
                }
                if (isNaN(body) || body < 1 || body > x.length) {
                    return message.reply(`⌯︙قم بالرد برقم بين 1 و ${x.length} 🧞‍♂`);
                }
                const index = body - 1;
                const playUrl = x[index].id;

                const response = await axios.get(
                    `https://issam-mangax.onrender.com/mello/manga/${encodeURIComponent(
                        playUrl
                    )}`
                );
                const mangaData = response.data;
                let rating = "لا يوجد";
                if (mangaData.rate) {
                    rating = mangaData.rate;
                }
                const tts = await usersData.get(author, "data.favorites", []);
               function dtSting(dateString) {
                      const date = new Date(dateString);
               const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
               return date.toLocaleDateString('ar-EG', options);
                    }
               
                let categories = "لا يوجد";
                let genres = mangaData.genres.map((genre) => genre.name);


                let  genresString = genres.join(' ، ');
                    
                const downloadLinks = "";
                let downloadMessage = "";
               
                const msg = `
• ┉ • ┉ • ┉ • ┉ • ┉ •
←› الاسم : ${mangaData.title.split(" ").slice(0, 3).join(" ") + '...'} 🧸
←› السنة : ${mangaData.year ?  mangaData.year : "غيرو معروفة"} ✴
←› عدد المشاهدات: ${mangaData.views} 🍃
←› تم رفعها : ${await dtSting(mangaData.created_at)} 📤
←› تم تحديثها : ${await dtSting(mangaData.updated_at)} 🕙
←› الفئات : ${genresString ? genresString : 'لا توجد فئات ' } 🔖
←› التقييم : 5/${mangaData.rate? mangaData.rate : "0"} او 10/${mangaData.ten_rate? mangaData.ten_rate : "0"} ✳
←› مكتملة : ${mangaData.is_completed == 0 ? "لا" :  "نعم"} 🛩️
←› الفئة العمرية: ${mangaData.age_rating_id == 1 ? "للأطفال" : mangaData.age_rating_id == 2 ? "المراهقين" : mangaData.age_rating_id == 3 ? "للبالغين " : "الكل"} 🍭
←› جديدة : ${mangaData.is_new? "نعم" : "لا"}  🍂
←› الحالة : ${mangaData.status == 1? "متوقفة 🔴" : mangaData.status == 2? "نشطة 🟢" : "منتهية 🔵"}
• ┉ • ┉ • ┉ • ┉ • ┉ •
←› القصة : ${mangaData.summary ? mangaData.summary : "لا توجد قصة 🤦🏻"} 📖
• ┉ • ┉ • ┉ • ┉ • ┉ •
←› لقرائة المانجا : الرجاء الرد على الرساله بكلمة "قراءة" \n او ${tts.find(obj => obj.id == mangaData.id)? "رد ب ازالة لإزالتها من المفضلات" : "رد ب اضافة لإضافتها الى المفضلات"}  `;
                message.unsend(Reply.messageID)
                message.reply(
                    {
                        body: msg,
                        attachment: await global.utils.getStreamFromURL(mangaData.img),
                    },
                    (error, message) => {
                        const downloadLinks = "";
                        let downloadMsg = "";
                        
                        global.GoatBot.onReply.set(message.messageID, {
                            commandName: "ميلو",
                            messageID: message.messageID,
                            resultMessageID: message.messageID,
                            author: event.senderID,
                            type: "mangaChapte",
                            result: mangaData,
                            usersData:usersData
                        });
                    }
                );
            } catch (error) {
              message.unsend(Reply.messageID)
                console.error("Error occurred while fetching anime details:", error);
                return message.reply("❌︙حدث خطأ أثناء جلب تفاصيل المانجا. الرجاء المحاولة مرة أخرى في وقت لاحق.");
            }
        } 
          if (type == "mangaChapte" && messageBody === "ازالة" ) {
            message.unsend(Reply.messageID)
          let favorites = await usersData.get(author, "data.favorites", []);
          let mid = result.id;

          let oIndex = favorites.findIndex(obj => obj.id === mid);

          if (oIndex !== -1) {
          const edit = favorites.splice(oIndex, 1);
            await usersData.set(author, favorites, "data.favorites");
            message.reply(`تمت ازالة ${result.title.split(" ").slice(0, 3).join(" ") + '...'} من مفضلاتك`)
           }else{
             message.reply("🤡")
           }
          }
          if (type == "mangaChapte" && messageBody === "اضافة" ) {
            message.unsend(Reply.messageID)
            const addFavorite = await usersData.get(author, "data.favorites", []);
            if (addFavorite.length >= 5) {
              return message.reply("لقد وصلت إلى للحد الأقصى للمفضلات.")
            }
            if (addFavorite.find(obj => obj.id == result.id)) {
              return message.reply("موجود اصلا في المفضلات انت غبي ؟")
            }
            const tm = new Date();
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const tim = tm.toLocaleDateString('ar-EG', options);
            addFavorite.push({
              id: result.id,
              name: result.title,
              views: result.views,
              rate: result.ten_rate,
              favoriteTime: tim,
              summary: result.summary
              })
            await usersData.set(author, addFavorite, "data.favorites");
            message.reply(`✧⁠*⁠。${await usersData.getName(author)}\n\n تم حفظ "${result.title.split(" ").slice(0, 3).join(" ") + '...'}" في مفضلاتك ⁦✿`)
          }
        

        if (type == "mangaChapte" && messageBody === "قراءة" ) {
         message.unsend(Reply.messageID)
            var res = await axios.get(`https://issam-mangax.onrender.com/mello/manga/${result.id}`);
            const id = res.data.chapters.map(genre => genre.title)
            
            const resData = id[0];
            let msg = `⋆˚ ⬷ تحتوي هذه المانغا/مانهوا على ${resData? resData : "0 🌝"} رد برقم الفصل لبدك تقرأه ⋆˚ ⬷. `;
            message.reply(msg, (error, message) => {
              global.GoatBot.onReply.set(message.messageID, {
                commandName: "ميلو",
                messageID: message.messageID,
                resultMessageID: message.messageID,
                author: event.senderID,
                type: "ReadChapt",
                result: result,
                name: result.title
              });
            });
            } 
            


    if (type == "ReadChapt") {
     
    const {name} = Reply
    if (isNaN(messageBody)) return message.reply("رد برقم يااا");

       let num = messageBody;
       
    var res = await axios.get(`https://issam-mangax.onrender.com/mello/manga/${result.id}`);
    
    let data = res.data.chapters;
    
    let chapter = data.find(obj => obj.order == num);
    if (!chapter) {
     return message.reply(`يبدو ان الفصل ${num} غيرو موجود او تم حذفه `)
    }
    var res = await axios.get(`https://issam-mangax.onrender.com/mello/chapter/${chapter.id}/${chapter.manga_id}`);
    let rr = res.data.chapterImages;
    let arr = []
    for (let i = 0; i < rr.length; ++i) {
        arr.push(await rr[i].src)
    }
         try{
       const pages = arr;
       let curBch = 1;
       const send = async (batch) => {
          const start = (batch - 1) * 12;
          const end = start + 12;

          if (start >= pages.length) {
            return message.reply("انتهى الفصل");
          }

          const pgs = await Promise.all(pages.slice(start, end).map(async url => await global.utils.getStreamFromURL(url)));
          
          let ne = `⁦ꈍ   رد ب "التالي" لعرض الباقي   ꈍ`;
          let mm = end
          if (end >= pages.length) {
            ne = "◍•ᴗ•◍✧*تم*";
             mm = pages.length
          }
        let lastRequestTimestamp = 0;
          await message.reply({
            body: `⁦⁦༼⁠                الفصل ${num}              ༽
 ⁦⑉ ⁦⑉ ⁦⁦⑉ ⁦⁦⑉ ⁦⑉  ⁦✷${mm}/${pages.length}✷  ⁦⑉ ⁦⑉ ⁦⑉⁦ ⁦⑉ ⁦⑉ 
 ${ne}
 ⁦⑉ ⁦⑉ ⁦ ⁦⑉ ⁦⑉ ⁦⑉ ⁦⑉ ⁦ ⁦⑉ ⁦⑉ ⁦⑉ ⁦⑉ ⁦ ⁦⑉ ⁦⑉ ⁦⑉ ⁦⑉ ⁦ ⁦⑉ ⁦`,
            attachment: pgs
          }, (error, message) => {
            global.GoatBot.onReply.set(message.messageID, {
              commandName: "ميلو",
              messageID: message.messageID,
              author: event.senderID,
              type: "imagePagination",
              curBch: batch,
              pages: pages,
              num: num,
              chapter: chapter,
              name:name,
              arr:arr,
              lastRequestTimestamp:lastRequestTimestamp
            });
          });
        };
   
   await send(curBch);
   
} catch (e) {

        console.error("Err fetching data:", e);

        return message.reply(`حدث خطأ `);
}  } else if (type === "imagePagination" && messageBody === "التالي") {
  let lastRequestTimestamp = 0;
    const currentTimestamp = Date.now();
  if (currentTimestamp - lastRequestTimestamp < 5000) { 
    return message.reply("🤡")
  }
  message.unsend(Reply.messageID)
  const { curBch, pages, num, chapter, name, arr } = Reply;
  const nextBatch = curBch + 1;
  const send = async (batch) => {
    const start = (batch - 1) * 12;
    const end = start + 12;

    if (start >= pages.length) {
      return message.reply("انتهى الفصل");
    }
       
    const pgs2 = await Promise.all(pages.slice(start, end).map(async url => await global.utils.getStreamFromURL(url)));
    let ne = `⁦ꈍ   رد ب "التالي" لعرض الباقي   ꈍ`;
    let mm = end
          if (end >= pages.length) {
            ne = "◍•ᴗ•◍✧*تم*";
             mm = pages.length
          }

    await message.reply({
      body: `⁦⁦༼⁠                الفصل ${num}              ༽
 ⁦⑉ ⁦⑉ ⁦⁦⑉ ⁦⑉ ⑉  ⁦✷${mm}/${pages.length}✷ ⁦ ⁦⑉ ⁦⑉ ⁦⑉⁦ ⁦⑉ ⁦⑉ 
 ${ne}
 ⁦⑉ ⁦⑉ ⁦ ⁦⑉ ⁦⑉ ⁦⑉ ⁦⑉ ⁦ ⁦⑉ ⁦⑉ ⁦⑉ ⁦⑉ ⁦ ⁦⑉ ⁦⑉ ⁦⑉ ⁦⑉ ⁦ ⁦⑉ ⁦`,
      attachment: pgs2
    }, (error, message) => {
      global.GoatBot.onReply.set(message.messageID, {
        commandName: "ميلو",
        messageID: message.messageID,
        author: event.senderID,
        type: "imagePagination",
        curBch: batch,
        pages: pages,
        num: num,
        name: name,
        arr: arr
      });
    });
  };

  await send(nextBatch);


} else if (type === "imagePagination" && messageBody === "تحميل") {
  message.unsend(Reply.messageID)
  const {name, arr, num }=Reply
  try{
    message.reaction('✨', event.messageID);
    const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(`${name.replaceAll(" ", "-")}-(${num}).pdf`);
  doc.pipe(writeStream);
  
  const images = arr;

for (let i = 0; i < images.length; i++) {
  const imageUrl = images[i];
  const body = await new Promise((resolve, reject) => {
    request({ url: imageUrl, encoding: null }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return reject(error || new Error('خطاء عند تحميل الصور'));
      }
      resolve(body);
    });
  });

  const dimensions = sizeOf(body);

  if (i === 0) {
    doc.image(body, 0, 0, { width: dimensions.width, height: dimensions.height });
  } else {
    doc.addPage({ size: [dimensions.width, dimensions.height] });
    doc.image(body, 0, 0, { width: dimensions.width, height: dimensions.height });
  }
}

doc.end();

  writeStream.on('finish', async () => {
    const stats = fs.statSync(`${name.replaceAll(" ", "-")}-(${num}).pdf`);
    const sizeInMB = stats.size / (1024 * 1024);
    message.reaction('✅', event.messageID);
    await message.reply({
        body:`انقر للتحميل \n حجم الفصل هو : ${sizeInMB.toFixed(2)} ميغابايت` ,
        attachment: fs.createReadStream(`${name.replaceAll(" ", "-")}-(${num}).pdf`)
      });
    fs.unlinkSync(`${name.replaceAll(" ", "-")}-(${num}).pdf`);
  });

  
} catch (e) {
  message.reply("حدث خطأ ")
  message.reaction('😾', event.messageID);
  console.error("err2", e)
}
}
}
};