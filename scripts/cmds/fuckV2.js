const fs = require("fs-extra");
const Canvas = require("canvas");

module.exports = {
  config: {
    name: "fuckV2",
    aliases: ["fuckv2", "chda"],
    version: "1.0.3",
    author: "Badhon",
    countDown: 5,
    role: 0,
    shortDescription: "Fuck edit with template",
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

      const avatar1 = await Canvas.loadImage(
        `https://graph.facebook.com/${id1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );
      const avatar2 = await Canvas.loadImage(
        `https://graph.facebook.com/${id2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`
      );

      const background = await Canvas.loadImage(
        "https://drive.google.com/uc?export=view&id=1-St_iO7eEDBPxIfpnmR4cT9BaBhnkDP9"
      );

      const canvas = Canvas.createCanvas(background.width, background.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      const left = { x: 190, y: 200, size: 180 };  
      const right = { x: 390, y: 200, size: 180 }; 


      function drawCircle(img, x, y, size) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      }
      drawCircle(avatar1, left.x, left.y, left.size);
      drawCircle(avatar2, right.x, right.y, right.size);
      const path = __dirname + "/cache/fuck.png";
      const out = fs.createWriteStream(path);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on("finish", () => {
        api.sendMessage(
          {
            body: "উফফফ!! জান আরো জোরে 🥵🥵",
            attachment: fs.createReadStream(path),
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
  },
};
