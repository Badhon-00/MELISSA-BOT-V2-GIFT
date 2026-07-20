const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "kicked",
                aliases: ["latthi"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "প্রিয়জনের সাথে kicked ইমেজ জেনারেট করুন",
                        en: "Generate a image with your kicked one",
                        vi: "Tạo hình ảnh ôm nhau trên giường với người yêu"
                },
                category: "fun",
                guide: {
                        bn: '   {pn} @মেনশন: কাউকে মেনশন দিয়ে ব্যবহার করুন',
                        en: '   {pn} @mention: Mention someone to use',
                        vi: '   {pn} @mention: Đề cập đến ai đó để sử dụng'
                }
        },

        langs: {
                bn: {
                        noMention: "× বেবি, কাউকে তো মেনশন দাও",
                        success: "𝐇𝐞𝐫𝐞’𝐬 𝐲𝐨𝐮𝐫 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        noMention: "× Baby, please mention someone!",
                        success: "𝐇𝐞𝐫𝐞’𝐬 𝐲𝐨𝐮𝐫 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        noMention: "× Cưng ơi, hãy đề cập đến ai đó",
                        success: "Ảnh của cưng đây",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author.trim() !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const mentions = Object.keys(event.mentions);
                if (mentions.length === 0) return message.reply(getLang("noMention"));

                const senderID = event.senderID;
                const targetID = mentions[0];
                const imgPath = path.join(__dirname, "cache", `kicked_${senderID}_${targetID}.png`);
                if (!fs.existsSync(path.dirname(imgPath))) fs.mkdirSync(path.dirname(imgPath), { recursive: true });

                try {
                     
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        
                        const base = await mahmud();
                        const response = await axios.post(`${base}/api/kicked`, 
                                { senderID, targetID }, 
                                { responseType: "arraybuffer" }
                        );

                        fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

                        return message.reply({
                                body: getLang("success"),
                                attachment: fs.createReadStream(imgPath)
                        }, () => {
                                api.setMessageReaction("✅", event.messageID, () => {}, true);
                                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                        });

                } catch (err) {
                        console.error("kick Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
