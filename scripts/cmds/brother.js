// brother.js
const fs = require("fs-extra");
const Canvas = require("canvas");

module.exports = {
  config: {
    name: "brother",
    aliases: ["bro", "buddy"],
    version: "1.0.0",
    author: "Rahad",
    countDown: 5,
    role: 0,
    shortDescription: "Brother edit with template",
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
        return api.sendMessage("❌ | কেউ ট্যাগ করো!", event.threadID, event.messageID);
      }

      // Load avatars
      const avatar1 = await Canvas.loadImage(
        `https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );
      const avatar2 = await Canvas.loadImage(
        `https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );

      // Load background
      const background = await Canvas.loadImage("https://i.imgur.com/n2FGJFe.jpg");

      // Create canvas
      const canvas = Canvas.createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");

      // Draw background
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Avatar coordinates (same as before)
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
      const path = __dirname + "/cache/brother.png";
      const out = fs.createWriteStream(path);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      out.on("finish", () => {
        api.sendMessage(
          {
            body: "✧•❁𝐵𝐫𝑜𝐭𝐡𝐞𝐫❁•✧\n\n╔═══❖••° °••❖═══╗\n\n   ✅ 𝐏𝐚𝐢𝐫𝐢𝐧𝐠 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥\n\n╚═══❖••° °••❖═══╝\n\n✶⊶⊷⊷❍⊶⊷⊷✶\n\n    👑 𝐤𝐨𝐫𝐥𝐚 𝐛𝐡𝐫𝐨𝐭𝐡𝐞𝐫 💞\n\n✶⊶⊷⊷❍⊶⊷⊷✶",
            attachment: fs.createReadStream(path)
          },
          event.threadID,
          () => fs.unlinkSync(path),
          event.messageID
        );
      });
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | কোনো সমস্যা হয়েছে!", event.threadID, event.messageID);
    }
  }
};
