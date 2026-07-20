const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "chor",
    aliases: ["mystery"],
    version: "1.2",
    author: "Samir (Enhanced by ChatGPT)",
    countDown: 5,
    role: 0,
    shortDescription: "Put a mysterious person in a kidnap frame",
    longDescription: "Fun command to place tagged or sender in a mysterious wanted-like frame",
    category: "fun",
    guide: {
      en: "{pn} @tag",
      vi: "{pn} @tag"
    }
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    const userID = mention.length > 0 ? mention[0] : event.senderID;

    try {
      const imgPath = await createKidnapImage(userID);
      await message.reply({
        body: "Who's behind the mask?",
        attachment: fs.createReadStream(imgPath)
      });
      fs.unlinkSync(imgPath); // Auto delete image after sending
    } catch (err) {
      console.error(err);
      message.reply("Failed to generate the kidnap image.");
    }
  }
};

async function createKidnapImage(id) {
  const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
  const avatar = await jimp.read(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=${token}`);
  avatar.circle();

  // Working stylish frame (replaceable)
  const background = await jimp.read("https://i.imgur.com/ES28alv.png");

  background.resize(500, 670).composite(avatar.resize(111, 111), 48, 410);

  const outputPath = `kidnap_${Date.now()}.png`;
  await background.writeAsync(outputPath);
  return outputPath;
  }