const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
        const response = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return response.data.mahmud;
};

module.exports = {
        config: {
                name: "bankai",
                aliases: ["bankaivid"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "ব্লিচ এনিমের র‍্যান্ডম ব্যাংকাই ভিডিও পান",
                        en: "Get a random Bankai video from Bleach anime",
                        vi: "Lấy một video Bankai ngẫu nhiên từ anime Bleach"
                },
                category: "anime",
                guide: {
                        bn: '   {pn}: একটি র‍্যান্ডম ব্যাংকাই ভিডিও দেখতে ব্যবহার করুন',
                        en: '   {pn}: Use to get a random Bankai video',
                        vi: '   {pn}: Sử dụng để lấy một video Bankai ngẫu nhiên'
                }
        },

        langs: {
                bn: {
                        noVideo: "× কোনো ভিডিও খুঁজে পাওয়া যায়নি! 🗡️",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐁𝐀𝐍𝐊𝐀𝐈 𝐯𝐢𝐝𝐞𝐨 𝐛𝐚𝐛𝐲 <😘",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noVideo: "× No videos found! 🗡️",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐁𝐀𝐍𝐊𝐀𝐈 𝐯𝐢𝐝𝐞𝐨 𝐛𝐚𝐛𝐲 <😘",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noVideo: "× Không tìm thấy video nào! 🗡️",
                        success: "Video BANKAI của cưng đây <😘",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const filePath = path.join(__dirname, "cache", `bankai_${Date.now()}.mp4`);
                if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });

                try {
                        
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);

                        const apiUrl = await mahmud();
                        const res = await axios.get(`${apiUrl}/api/album/mahmud/videos/bleach?userID=${event.senderID}`);
                        
                        if (!res.data.success || !res.data.videos.length) {
                                return message.reply(getLang("noVideo"));
                        }

                        const url = res.data.videos[Math.floor(Math.random() * res.data.videos.length)];
                        const videoRes = await axios({
                                url,
                                method: "GET",
                                responseType: "stream",
                                headers: { 'User-Agent': 'Mozilla/5.0' }
                        });

                        const writer = fs.createWriteStream(filePath);
                        videoRes.data.pipe(writer);

                        writer.on("finish", () => {
                                return message.reply({
                                        body: getLang("success"),
                                        attachment: fs.createReadStream(filePath)
                                }, () => {
                                        api.setMessageReaction("✅", event.messageID, () => {}, true);
                                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                                });
                        });

                        writer.on("error", (err) => { throw err; });

                } catch (err) {
                        console.error("Bankai Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
