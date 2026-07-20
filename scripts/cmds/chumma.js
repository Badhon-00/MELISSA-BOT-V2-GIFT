const fs = require("fs-extra");

module.exports = {
  config: {
    name: "chumma",
    version: "1.0",
    author: "Priyansh",
    countDown: 5,
    role: 0,
    shortDescription: "no-prefix",
    longDescription: "Bot Will Reply You In Engish/Bangla Language",
    category: "no prefix",
    guide: {
      en: "{p}{n}",
    }
  },

  onStart: async function ({ }) { },

  onChat: async function ({ api, event }) {
    var { threadID, messageID } = event;
    const lowerMessage = event.body.toLowerCase();

    if (lowerMessage.includes("Kiss Me") || lowerMessage.includes("Kiss") || lowerMessage.includes("kiss me")) {
      const imagePath = __dirname + "/cache/kiss.jpg";

      if (fs.existsSync(imagePath)) {
        return api.sendMessage({
          body: "Ummmmmahhh Hmmmaahhhh janu 🤤 😘",
          attachment: fs.createReadStream(imagePath)
        }, threadID, messageID);
      } else {
        return api.sendMessage("❌ Error: chocolate file missing !", threadID, messageID);
      }
    }
  }
};
