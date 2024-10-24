const axios = require("axios");
const { yts, youtubedl, youtubedlv2, youtubedlv3 } = require("@bochilteam/scraper-sosmed");
const nm = ["⓪", "⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"];

const mm = async function (url) {
    try {
        const yt = await youtubedl(url)
            .catch(async () => await youtubedlv3(url))
            .catch(async () => await youtubedlv2(url));

        return yt;
    } catch (error) {
        console.error("Error fetching video information:", error);
        throw error;
    }
};

async function search(keyWord) {
    try {
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyWord)}`;
        const res = await axios.get(url);
        const getJson = JSON.parse(res.data.split("ytInitialData = ")[1].split(";</script>")[0]);

        const videos = getJson.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
        const results = [];

        for (const video of videos) {
            if (video.videoRenderer?.lengthText?.simpleText) {
                const videoId = video.videoRenderer.videoId;
                const title = video.videoRenderer.title.runs[0].text;
                const thumbnail = video.videoRenderer.thumbnail.thumbnails.pop().url;
                const time = video.videoRenderer.lengthText.simpleText;
                const channel = {
                    id: video.videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
                    name: video.videoRenderer.ownerText.runs[0].text,
                    thumbnail: video.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails.pop().url.replace(/s[0-9]+\-c/g, '-c')
                };
                const viewCountText = video.videoRenderer.viewCountText?.simpleText || 'No views available';
                const viewCount = viewCountText.match(/\d+/g) ? parseInt(viewCountText.replace(/\D/g, '')) : 0;
                const publishedTime = video.videoRenderer.publishedTimeText?.simpleText || 'No date available';

                results.push({
                    id: videoId,
                    title: title,
                    thumbnail: thumbnail,
                    time: time,
                    viewCount: viewCount,
                    publishedTime: publishedTime,
                    channel: channel
                });
                if (results.length === 12) break;
            }
        }
        return results;
    } catch (e) {
        console.error("Error searching video:", e);
        const error = new Error("Cannot search video");
        error.code = "SEARCH_VIDEO_ERROR";
        throw error;
    }
}

module.exports = {
    config: {
        name: "اغنية",
        aliases: ["شغلي", "music"],
        version: "1.17",
        author: "Cystro",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "مجرد البحث عن اغنية"
        },
        longDescription: {
            en: "بحث عن اغنيتك"
        },
        category: "خدمات",
        guide: {
            en: "{pn}"
        },
    },

    onStart: async function ({ api, event, args, message }) {
        const keySearch = args.join(" ");
        if (!keySearch) return message.send('احم احم اكتب شي للبحث');

        message.reaction('🎧', event.messageID);
        const a = await search(keySearch);
        let msg = "";

        a.forEach((r, i) => {
            const { title, channel, viewCount, time } = r;
            const index = (i + 1).toString().split('').map(num => nm[parseInt(num)]).reverse().join('');
            msg += `♫♫♫♫♫♫♫♫♫${index}♫♫♫♫♫♫♫♫♫\nالاسم: ${title} 🪄\n الفنان: ${channel.name} 🪐\n المشاهدات: ${viewCount} 🎩\n المدة: ${time} 🕸️\n\n`;
        });

        message.reaction('🎸', event.messageID);
        await message.reply(msg, (error, replyMessage) => {
            if (error) {
                message.reaction('❌', event.messageID);
                return console.error(":", error);
            }

            global.GoatBot.onReply.set(replyMessage.messageID, {
                commandName: "اغنية",
                messageID: replyMessage.messageID,
                author: event.senderID,
                type: "اغنية",
                res: a
            });
        });
    },

    onReply: async function({ Reply, api, message, event }) {
        const { type, author, res } = Reply;
        if (author !== event.senderID) return;

        const messageBody = event.body.trim().toLowerCase();

        if (type === "اغنية" && !isNaN(messageBody)) {
            message.reaction('📥', event.messageID);
            const index = parseInt(messageBody, 10) - 1;
            if (index < 0 || index >= res.length) {
                return message.reply(`عدد النتائج ${res.length}`);
            }

            const sRe = res[index];
            const { id } = sRe;
            const url = `https://www.youtube.com/watch?v=${id}`;

            try {
                const videoInfo = await mm(url);
                const availableQualities = Object.keys(videoInfo.audio);

                const filteredQualities = availableQualities
                    .filter(q => parseInt(q) <= 128)
                    .sort((a, b) => parseInt(b) - parseInt(a));

                if (filteredQualities.length > 0) {
                    const bestQuality = filteredQualities[0];
                    const link = await videoInfo.audio[bestQuality].download();
                    message.reaction('🎧', event.messageID);
                    await message.reply({
                        body: "⇣♡◄∘ تفضل صديقي ∘►♡⇡",
                        attachment: await global.utils.getStreamFromURL(link)
                    });
                } else {
                    message.reply("لم يتم العثور على جودة مناسبة أقل من أو تساوي 128 kbps.");
                }
            } catch (error) {
                console.error(":", error);
                message.reply("مجرد ايرر");
            }
        }
    }
};