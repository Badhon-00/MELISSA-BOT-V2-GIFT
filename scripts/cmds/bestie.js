// bestie.js
const fs = require("fs-extra");
const Canvas = require("canvas");

module.exports = {
  config: {
    name: "bestie",
    aliases: ["friend", "buddy"],
    version: "7.3.8",
    author: "Rahad",
    countDown: 5,
    role: 0,
    shortDescription: "Bestie edit with template",
    longDescription: "Put user profile pictures exactly on placeholders in background",
    category: "funny",
    guide: "{pn} @tag"
  },

  onStart: async function ({ event, api }) {
    try {
      const id1 = event.senderID;
      const mentions = Object.keys(event.mentions || {});
      const id2 = mentions[0];
      if (!id2) {
        return api.sendMessage("❌ | Please mention someone!", event.threadID, event.messageID);
      }

      // Load avatars
      const avatar1 = await Canvas.loadImage(
        `https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );
      const avatar2 = await Canvas.loadImage(
        `https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );

      // Load background
      const background = await Canvas.loadImage("https://i.imgur.com/RloX16v.jpg");

      // Create canvas
      const canvas = Canvas.createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");

      // Draw background
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // === Coordinates (same as jimp version) ===
      const left = { x: 93, y: 111, size: 191 };
      const right = { x: 434, y: 107, size: 190 };

      // Draw left avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(left.x + left.size / 2, left.y + left.size / 2, left.size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar1, left.x, left.y, left.size, left.size);
      ctx.restore();

      // Draw right avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(right.x + right.size / 2, right.y + right.size / 2, right.size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar2, right.x, right.y, right.size, right.size);
      ctx.restore();

      // Save & send
      const path = __dirname + "/cache/bestie.png";
      const out = fs.createWriteStream(path);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      out.on("finish", () => {
        api.sendMessage(
          {
            body: "✧•❁𝐅𝐫𝐢𝐞𝐧𝐝𝐬𝐡𝐢𝐩❁•✧\n\n╔═══❖••° °••❖═══╗\n\n   𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐁𝐞𝐬𝐭𝐢𝐞 𝐄𝐝𝐢𝐭\n\n╚═══❖••° °••❖═══╝\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶\n\n    🤏💨 𝐍𝐞 𝐃𝐡𝐨𝐫 𝐓𝐨𝐫 𝐁𝐞𝐬𝐭𝐢𝐞 💞\n\n   ✶⊶⊷⊷❍⊶⊷⊷✶",
            attachment: fs.createReadStream(path)
          },
          event.threadID,
          () => fs.unlinkSync(path),
          event.messageID
        );
      });
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Something went wrong!", event.threadID, event.messageID);
    }
  }
};
