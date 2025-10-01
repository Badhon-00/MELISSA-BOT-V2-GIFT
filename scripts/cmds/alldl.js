const axios = require("axios");
const fs = require("fs-extra");
const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "alldl",
    version: "1.0.5",
    author: "Badhon",
    countDown: 2,
    role: 0,
    description: {
      en: "𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱 𝘃𝗶𝗱𝗲𝗼 𝗳𝗿𝗼𝗺 𝘁𝗶𝗸𝘁𝗼𝗸, 𝗳𝗮𝗰𝗲𝗯𝗼𝗼𝗸, 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺, 𝗬𝗼𝘂𝗧𝘂𝗯𝗲, 𝗮𝗻𝗱 𝗺𝗼𝗿𝗲",
    },
    category: "utility",
    guide: {
      en: "[video_link]",
    },
  },
  onStart: async function ({ api, args, event }) {
    const dipto = event.messageReply?.body || args[0];
    if (!dipto) {
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
      return api.sendMessage("❌ | Please provide a video link to download.", event.threadID, event.messageID);
    }
    try {
      api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
      const { data } = await axios.get(`${await baseApiUrl()}/alldl?url=${encodeURIComponent(dipto)}`);
      const filePath = __dirname + `/cache/vid.mp4`;
      if(!fs.existsSync(__dirname + '/cache')){
        fs.mkdirSync(__dirname + '/cache');
      }
      const vid = (
        await axios.get(data.result, { responseType: "arraybuffer" })
      ).data;
      fs.writeFileSync(filePath, Buffer.from(vid, "utf-8"));
      const url = await global.utils.shortenURL(data.result);
      

      let platform = "Unknown Platform";
      const originalUrl = dipto.toLowerCase();
      
      if (originalUrl.includes("tiktok")) platform = "TikTok";
      else if (originalUrl.includes("facebook") || originalUrl.includes("fb")) platform = "Facebook";
      else if (originalUrl.includes("instagram")) platform = "Instagram";
      else if (originalUrl.includes("youtube") || originalUrl.includes("youtu.be")) platform = "YouTube";
      else if (originalUrl.includes("twitter") || originalUrl.includes("x.com")) platform = "Twitter/X";
      else if (originalUrl.includes("pinterest")) platform = "Pinterest";
      else if (originalUrl.includes("likee") || originalUrl.includes("like.video")) platform = "Likee";
      else if (originalUrl.includes("snapchat")) platform = "Snapchat";
      else if (originalUrl.includes("dailymotion")) platform = "Dailymotion";
      else if (originalUrl.includes("vimeo")) platform = "Vimeo";
      
      // Enhanced design layout
      const designLayout = `
┏━━━━━━━━━━━━━━━━━━━━┓
┃    🎬 𝗩𝗜𝗗𝗘𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 📱 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: ${platform}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 🔗 𝗦𝗵𝗼𝗿𝘁𝗲𝗻𝗲𝗱 𝗨𝗥𝗟: ${url || "Not available"}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 📥 𝗦𝘁𝗮𝘁𝘂𝘀: Successfully Downloaded
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱 𝗯𝘆: ${event.senderID}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⚡ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆: 𝗕𝗔𝗗𝗛𝗢𝗡
┗━━━━━━━━━━━━━━━━━━━━┛

${data.cp ? `📝 𝗖𝗮𝗽𝘁𝗶𝗼𝗻: ${data.cp}` : ''}
      `.trim();

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      api.sendMessage({
          body: designLayout,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );
      
    } catch (error) {
      api.setMessageReaction("❎", event.messageID, (err) => {}, true);
      
      const errorLayout = `
┏━━━━━━━━━━━━━━━━━━━━┓
┃      ❌ 𝗘𝗥𝗥𝗢𝗥       
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⚠️  Failed to download video
┣━━━━━━━━━━━━━━━━━━━━┫
┃ 📝  Error: ${error.message}
┣━━━━━━━━━━━━━━━━━━━━┫
┃ ⚡  Powered by: 𝗕𝗔𝗗𝗛𝗢𝗡
┗━━━━━━━━━━━━━━━━━━━━┛
      `.trim();
      
      api.sendMessage(errorLayout, event.threadID, event.messageID);
    }
  },
};
