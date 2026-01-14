const fs = require("fs-extra");
const axios = require("axios");
const Canvas = require("canvas");
const path = require("path");

module.exports = {
 config: {
 name: "kiss2",
 aliases: ["kiss2"],
 version: "2.1",
 author: "Badhon",
 countDown: 5,
 role: 0,
 shortDescription: "Kiss with custom image",
 longDescription: "Generate a kiss image with the mentioned user using a custom background.",
 category: "love",
 guide: "{pn} @mention"
 },

 onStart: async function ({ api, message, event, usersData }) {
 const mention = Object.keys(event.mentions);
 if (mention.length === 0) return message.reply("Please mention someone to kiss.");

 let senderID = event.senderID;
 let mentionedID = mention[0];

 try {
 const avatar1 = await usersData.getAvatarUrl(mentionedID); 
 const avatar2 = await usersData.getAvatarUrl(senderID); 

 const [avatarImg1, avatarImg2] = await Promise.all([
 Canvas.loadImage(avatar1),
 Canvas.loadImage(avatar2)
 ]);

 const bgUrl = "https://bit.ly/44bRRQG";
 const bgRes = await axios.get(bgUrl, { responseType: "arraybuffer" });
 const bg = await Canvas.loadImage(bgRes.data);

 const canvasWidth = 850;
 const canvasHeight = 700;

 const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
 const ctx = canvas.getContext("2d");

 ctx.drawImage(bg, 0, 0, canvasWidth, canvasHeight);

 const avatarSize = 250;
 const y = canvasHeight / 2 - avatarSize - 70; 


 ctx.save();
 ctx.beginPath();
 ctx.arc(150 + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
 ctx.closePath();
 ctx.clip();
 ctx.drawImage(avatarImg1, 150, y, avatarSize, avatarSize);
 ctx.restore();


 ctx.save();
 ctx.beginPath();
 ctx.arc(canvasWidth - 150 - avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
 ctx.closePath();
 ctx.clip();
 ctx.drawImage(avatarImg2, canvasWidth - 150 - avatarSize, y, avatarSize, avatarSize);
 ctx.restore();


 const imgPath = path.join(__dirname, "tmp", `${senderID}_${mentionedID}_kiss.png`);
 await fs.ensureDir(path.dirname(imgPath));
 fs.writeFileSync(imgPath, canvas.toBuffer("image/png"));

 message.reply({
 body: "Kisssssss!",
 attachment: fs.createReadStream(imgPath)
 }, () => fs.unlinkSync(imgPath));

 } catch (err) {
 console.error("Error in kiss command:", err);
 message.reply("There was an error creating the kiss image.");
 }
 }
};