const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "autodl",
    aliases: ["autodl"],
    version: "1.6",
    author: "Badhon",
    role: 0,
    description: "Auto-download media from any platform",
    category: "utility",
    guide: { en: "Send any media link" }
  },

  onStart: async function({}) {},

  onChat: async function({ api, event }) {
    const url = event.body?.match(/https?:\/\/[^\s]+/)?.[0];
    if (!url) return;

    try {
      api.setMessageReaction("🐸", event.messageID, () => {}, true);

      const apiUrl = (await axios.get("https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json")).data.api;
      const { data } = await axios.get(`${apiUrl}/nazrul/alldlxx?url=${encodeURIComponent(url)}`);
      
      if (!data.url) throw new Error(data.error || "No download link found");

      const filePath = path.join(__dirname, `n_${Date.now()}.mp4`);
      const writer = fs.createWriteStream(filePath);
      const response = await axios({
        url: data.url,
        method: 'GET',
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': '*/*',
          'Connection': 'keep-alive'
        }
      });

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      let userName = "User";
      try {
        const userInfo = await api.getUserInfo(event.senderID);
        userName = userInfo[event.senderID]?.name || "User";
      } catch (e) {
        console.log("Could not fetch user info");
      }
      const successLayout = `
┏━━━━━━━━━━━━━━━━━━━━┓
┃    🎬 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 📱 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: ${data.p || "Unknown"}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🔗 𝗦𝗵𝗼𝗿𝘁𝗲𝗻𝗲𝗱 𝗨𝗥𝗟: ${url || "Not available"}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 📥 𝗦𝘁𝗮𝘁𝘂𝘀: Successfully Downloaded
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱 𝗯𝘆: ${userName}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⚡ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆: 𝗕𝗔𝗗𝗛𝗢𝗡
┗━━━━━━━━━━━━━━━━━━━━┛
      `.trim();

      await api.sendMessage({
        body: successLayout,
        attachment: fs.createReadStream(filePath)
      }, event.threadID);

      fs.unlink(filePath, () => {});
      api.setMessageReaction("🐤", event.messageID, () => {}, true);

    } catch (error) {
      const errorLayout = `
┏━━━━━━━━━━━━━━━━━━━━┓
┃      ❌ 𝗘𝗥𝗥𝗢𝗥       
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⚠️  Failed to download video
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 📝  Error: ${error.message}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⚡ Powered by: 𝗕𝗔𝗗𝗛𝗢𝗡
┗━━━━━━━━━━━━━━━━━━━━┛
      `.trim();

      api.setMessageReaction("❌", event.messageID, () => {}, true);
      await api.sendMessage({
        body: errorLayout
      }, event.threadID);
      console.log(error.message);
    }
  }
};
