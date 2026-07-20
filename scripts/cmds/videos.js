const axios = require("axios");
const fs = require('fs');
const path = require('path');

const baseApiUrl = async () => {
        const base = await axios.get(`https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json`);
        return base.data.mahmud; 
};

module.exports = {
        config: {
                name: "videos",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "ইউটিউব থেকে ভিডিও সার্চ করুন এবং পছন্দমতো ডাউনলোড করুন",
                        en: "Search videos from YouTube and download your choice",
                        vi: "Tìm kiếm video từ YouTube và tải xuống theo lựa chọn của bạn"
                },
                category: "media",
                guide: {
                        bn: '   {pn} <নাম>: ভিডিও সার্চ করতে নাম লিখুন',
                        en: '   {pn} <name>: Enter name to search videos',
                        vi: '   {pn} <tên>: Nhập tên để tìm kiếm video'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, ভিডিওর নাম তো দাও! 🔍",
                        noResult: "× কোনো রেজাল্ট পাওয়া যায়নি।",
                        select: "𝐒𝐞𝐥𝐞𝐜𝐭 𝐚 𝐯𝐢𝐝𝐞𝐨:\n\n%1\n• ভিডিও ডাউনলোড করতে নম্বর দিয়ে রিপ্লাই দাও",
                        success: "✅ 𝙃𝙚𝙧𝙚'𝙨 𝙮𝙤𝙪𝙧 𝙫𝙞𝙙𝙚𝙤 𝙗𝙖𝙗𝙮\n\n• 𝐓𝐢𝐭𝐥𝐞: %1",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "× Baby, please provide a video name! 🔍",
                        noResult: "× No results found.",
                        select: "𝐒𝐞𝐥𝐞𝐜𝐭 𝐚 𝐯𝐢𝐝𝐞𝐨:\n\n%1\n• Reply with the number to download",
                        success: "✅ 𝙃𝙚𝙧𝙚'𝙨 𝙮𝙤𝙪𝙧 𝙫𝙞𝙙𝙚𝙤 𝙗𝙖𝙗𝙮\n\n• 𝐓𝐢𝐭𝐥𝐞: %1",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "× Cưng ơi, vui lòng cung cấp tên video! 🔍",
                        noResult: "× Không tìm thấy kết quả.",
                        select: "𝐒𝐞𝐥𝐞𝐜𝐭 𝐚 𝐯𝐢𝐝𝐞𝐨:\n\n%1\n• Phản hồi bằng số để tải xuống",
                        success: "✅ Video của cưng đây <😘\n\n• 𝐓𝐢êu đề: %1",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang, commandName }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                if (!args[0]) return message.reply(getLang("noInput"));

                try {
                        api.setMessageReaction("🐤", event.messageID, () => {}, true);
                        const apiUrl = await baseApiUrl();
                        const keyWord = args.join(" ");

                        const res = await axios.get(`${apiUrl}/api/video/search?songName=${encodeURIComponent(keyWord)}`);
                        const result = res.data.slice(0, 6);

                        if (!result.length) {
                                api.setMessageReaction("🥹", event.messageID, () => {}, true);
                                return message.reply(getLang("noResult"));
                        }

                        let listMsg = "";
                        const thumbnails = [];
                        const cacheDir = path.join(__dirname, "cache");
                        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

                        for (let i = 0; i < result.length; i++) {
                                const info = result[i];
                                listMsg += `${i + 1}. ${info.title}\n[ ${info.time} ]\n\n`;
                                
                                const thumbPath = path.join(cacheDir, `thumb_${event.senderID}_${i}.jpg`);
                                const thumbRes = await axios.get(info.thumbnail, { responseType: "arraybuffer" });
                                fs.writeFileSync(thumbPath, Buffer.from(thumbRes.data));
                                thumbnails.push(fs.createReadStream(thumbPath));
                                setTimeout(() => { if(fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath); }, 20000);
                        }

                        return message.reply({
                                body: getLang("select", listMsg),
                                attachment: thumbnails
                        }, (err, info) => {
                                global.GoatBot.onReply.set(info.messageID, {
                                        commandName,
                                        author: event.senderID,
                                        result,
                                        apiUrl
                                });
                        });

                } catch (err) {
                        console.error("Search Error:", err);
                        return message.reply(getLang("error", err.message));
                }
        },

        onReply: async function ({ event, api, Reply, getLang, message }) {
                const { result, apiUrl, author } = Reply;
                if (event.senderID !== author) return;

                const choice = parseInt(event.body);
                if (isNaN(choice) || choice <= 0 || choice > result.length) return;

                api.unsendMessage(Reply.messageID);
                api.setMessageReaction("📥", event.messageID, () => {}, true);

                const videoID = result[choice - 1].id;
                const cacheDir = path.join(__dirname, "cache");
                const filePath = path.join(cacheDir, `video_${event.senderID}.mp4`);

                try {
                        const res = await axios.get(`${apiUrl}/api/video/download?link=${videoID}&format=mp4`);
                        const { title, downloadLink } = res.data;

                        const videoBuffer = (await axios.get(downloadLink, { responseType: "arraybuffer" })).data;
                        fs.writeFileSync(filePath, Buffer.from(videoBuffer));

                        return message.reply({
                                body: getLang("success", title),
                                attachment: fs.createReadStream(filePath)
                        }, () => {
                                api.setMessageReaction("🪽", event.messageID, () => {}, true);
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        });

                } catch (err) {
                        console.error("Download Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
