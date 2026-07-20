const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "jail",
                aliases: ["জেল"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "কাউকে জেলে পাঠানোর এডিট ছবি তৈরি করুন",
                        en: "Create a jail edit image of someone",
                        vi: "Tạo ảnh chỉnh sửa bỏ tù ai đó"
                },
                category: "fun",
                guide: {
                        bn: '   {pn} <মেনশন/রিপ্লাই/UID>: কাউকে জেলে পাঠাতে ব্যবহার করুন',
                        en: '   {pn} <mention/reply/UID>: Use to put someone in jail',
                        vi: '   {pn} <đề cập/trả lời/UID>: Sử dụng để tống ai đó vào tù'
                }
        },

        langs: {
                bn: {
                        noTarget: "× বেবি, কাকে জেলে পাঠাবে? মেনশন, রিপ্লাই বা UID দাও! 🐸",
                        success: "𝐄𝐟𝐟𝐞𝐜𝐭 𝐣𝐚𝐢𝐥 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐛𝐚𝐛𝐲 <😘",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noTarget: "× Baby, mention, reply, or provide UID of the target! 🐸",
                        success: "𝐄𝐟𝐟𝐞𝐜𝐭 𝐣𝐚𝐢𝐥 𝐬𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐛𝐚𝐛𝐲 <😘",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noTarget: "× Cưng ơi, hãy đề cập, phản hồi hoặc cung cấp UID! 🐸",
                        success: "𝐄𝐟𝐟𝐞𝐜𝐭 𝐣𝐚𝐢𝐥 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 <😘",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const { threadID, messageID, messageReply, mentions } = event;
                let id2;
                if (messageReply) id2 = messageReply.senderID;
                else if (Object.keys(mentions).length > 0) id2 = Object.keys(mentions)[0];
                else if (args[0]) id2 = args[0];
                else return message.reply(getLang("noTarget"));

                const filePath = path.join(__dirname, "cache", `jail_${id2}_${Date.now()}.png`);
                if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });

                try {
                        
                        api.setMessageReaction("⏳", messageID, () => {}, true);

                        const baseUrl = await baseApiUrl();
                        const url = `${baseUrl}/api/dig?type=jail&user=${id2}`;
                        const response = await axios.get(url, { responseType: "arraybuffer" });
                        
                        fs.writeFileSync(filePath, response.data);

                        return message.reply({
                                body: getLang("success"),
                                attachment: fs.createReadStream(filePath)
                        }, () => {
                                api.setMessageReaction("✅", messageID, () => {}, true);
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        });

                } catch (err) {
                        console.error("Jail Error:", err);
                        api.setMessageReaction("❌", messageID, () => {}, true);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
