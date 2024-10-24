const axios = require('axios');
const FormData = require('form-data');

module.exports = {
 config: {
 name: "رابط",
 aliases: ["i","رط"],
 version: "1.0",
 author: "Cystro",
 countDown: 5,
 role: 0,
 shortDescription: {
 ar: "رابط الصور"
 },
 longDescription: {
 ar: "قم بتحميل الصورة على موبي عن طريق الرد على الصورة"
 },
 category: "tools",
 guide: {
 en: "Converting an image to a convertible imgbb"
 }
 },

 onStart: async function ({ api, event }) {
 const imgbbApiKey = "1b4d99fa0c3195efe42ceb62670f2a25"; // Replace "YOUR_API_KEY_HERE" with your actual API key
 const linkanh = event.messageReply?.attachments[0]?.url;
 if (!linkanh) {
 return api.sendMessage('رد علي الصوره ياغبي 🌝🤦‍♀️', event.threadID, event.messageID);
 }

 try {
 const response = await axios.get(linkanh, { responseType: 'arraybuffer' });
 const formData = new FormData();
 formData.append('image', Buffer.from(response.data, 'binary'), { filename: 'image.png' });
 const res = await axios.post('https://api.imgbb.com/1/upload', formData, {
 headers: formData.getHeaders(),
 params: {
 key: imgbbApiKey
 }
 });
 const imageLink = res.data.data.url;
 return api.sendMessage(imageLink, event.threadID, event.messageID);
 } catch (error) {
 console.log(error);
 return api.sendMessage('Failed to upload image to imgbb.', event.threadID, event.messageID);
 }
 }
};