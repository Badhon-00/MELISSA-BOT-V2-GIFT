const fs = require("fs");
const axios = require("axios");

const videoMap = {
  "🥵": "https://files.catbox.moe/nja09a.mp4",
  "👅": "https://files.catbox.moe/dty32d.mp4",
  "👄": "https://files.catbox.moe/8z7vay.mp4",
  "🫦": "https://files.catbox.moe/q0hrek.mp4",
  "💋": "https://files.catbox.moe/03vl6j.mp4",
  "😘": "https://files.catbox.moe/udwapn.mp4",
  "😽": "https://files.catbox.moe/1i3l9u.mp4",
  "😗": "https://files.catbox.moe/cactm7.mp4",
  "😙": "https://files.catbox.moe/epnqxz.mp4",
  "😚": "https://files.catbox.moe/py03ij.mp4"
};

const messages = [
  "I know you're enjoying these videos, baby 😏",
  "How does this make you feel? 🥵",
  "You like what you see, don't you? 💋",
  "This is just for you, my naughty friend 😘",
  "Don't get too excited now... or should you? 😈",
  "Your secret is safe with me... enjoy! 😽",
  "I know exactly what you need right now 😙",
  "Feeling hot yet? Let me turn up the heat 🔥",
  "You wanted this, didn't you? Bad girl/boy 😏",
  "This video was made just for you, enjoy 😚"
];

module.exports = {
  config: {
    name: "pnx2",
    version: "1.0.2",
    premium: true,
    prefix: true,
    role: 0,
    author: "𝐁𝐀𝐃𝐇𝐎𝐍",
    description: "NSFW Videos",
    category: "18+",
    guide: "React with emoji to get videos",
    cooldowns: 5,
  },

  onChat: async function({ api, event }) {
    const { threadID, messageID, body } = event;
    
    if (videoMap[body]) {
      try {
        const media = (await axios.get(videoMap[body], { responseType: 'stream' })).data;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const msg = {
          body: `♡━━━━♡━━━━━━♡━━━━♡\n 𝐁𝐀𝐃𝐇𝐎𝐍'𝐒 𝐏𝐑𝐄𝐌𝐈𝐔𝐌  𝐂𝐎𝐍𝐓𝐄𝐍𝐓\n♡━━━━♡━━━━━━♡━━━━♡`,
          attachment: media
        };
        
        await api.sendMessage(msg, threadID, messageID);
        await api.setMessageReaction("🤭", event.messageID, (err) => {}, true);
      } catch (error) {
        console.error("Error sending video:", error);
        api.sendMessage("Oops, something went wrong while sending your video... try again later!", threadID, messageID);
      }
    }
  },
  
  onStart: function() {}
};
