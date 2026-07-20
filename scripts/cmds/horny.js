const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmud = async () => {
        const response = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return response.data.mahmud;
};

module.exports = {
        config: {
                name: "horny",
                aliases: ["hornyvid", "hvideo"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "রেন্ডম হর্নি ভিডিও দেখুন (১৮+)",
                        en: "Watch random horny videos (18+)"
                },
                category: "18+",
                guide: {
                        bn: '   {pn}: রেন্ডম ভিডিও পেতে ব্যবহার করুন',
                        en: '   {pn}: Use to get a random video'
                }
        },

        langs: {
                bn: {
                        notFound: "× কোনো ভিডিও পাওয়া যায়নি বেবি!",
                        downloadErr: "× ভিডিও ডাউনলোড করতে সমস্যা হয়েছে।",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐇𝐨𝐫𝐧𝐲 𝐯𝐢𝐝𝐞𝐨 <😘",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        notFound: "× No videos found baby!",
                        downloadErr: "× Video download error.",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐇𝐨𝐫𝐧𝐲 𝐯𝐢𝐝𝐞𝐨 <😘",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const cacheDir = path.join(__dirname, "cache");
                const filePath = path.join(cacheDir, `horny_${Date.now()}.mp4`);

                try {
                        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

                        const apiUrl = await mahmud();
                        const res = await axios.get(`${apiUrl}/api/album/mahmud/videos/horny2?userID=${event.senderID}`);

                        if (!res.data.success || !res.data.videos.length) {
                                return message.reply(getLang("notFound"));
                        }

                        const url = res.data.videos[Math.floor(Math.random() * res.data.videos.length)];

                        const video = await axios({
                                url,
                                method: "GET",
                                responseType: "stream",
                                headers: { 'User-Agent': 'Mozilla/5.0' }
                        });

                        const writer = fs.createWriteStream(filePath);
                        video.data.pipe(writer);

                        writer.on("finish", () => {
                                message.reply({
                                        body: getLang("success"),
                                        attachment: fs.createReadStream(filePath)
                                }, () => {
                                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                                });
                        });

                        writer.on("error", (err) => {
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                                return message.reply(getLang("downloadErr"));
                        });

                } catch (err) {
                        console.error("Horny command error:", err);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
