const axios = require("axios"), fs = require("fs"), path = require("path");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "album",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                category: "media",
                description: {
                        bn: "বিভিন্ন ক্যাটাগরির ভিডিও অ্যালবাম দেখুন",
                        en: "Watch video albums from various categories",
                        vi: "Xem album video từ các danh mục khác nhau"
                },
                guide: {
                        bn: '{pn} [পৃষ্ঠা] | {pn} add [ক্যাটাগরি] (ভিডিও রিপ্লাই) | {pn} list',
                        en: '{pn} [page] | {pn} add [category] (reply to video) | {pn} list',
                        vi: '{pn} [trang] | {pn} add [danh mục] (phản hồi video) | {pn} list'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, একটি ক্যাটাগরি দাও অথবা ভিডিওতে রিপ্লাই দাও",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139",
                        invalidPage: "× ভুল পৃষ্ঠা! সর্বোচ্চ পৃষ্ঠা: %1",
                        header: "𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐕𝐢𝐝𝐞𝐨",
                        footer: "\n♻ | পৃষ্ঠা [%1/%2]<😘\nℹ | টাইপ করুন !%3 %4 - পরবর্তী পৃষ্ঠা দেখতে।"
                },
                en: {
                        noInput: "× Baby, please specify a category or reply to a video",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139",
                        invalidPage: "× Invalid page! Max page: %1",
                        header: "𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐕𝐢𝐝𝐞𝐨",
                        footer: "\n♻ | 𝐏𝐚𝐠𝐞 [%1/%2]<😘\nℹ | 𝐓𝐲𝐩𝐞 !%3 %4 - 𝐭𝐨 𝐬𝐞𝐞 𝐧𝐞𝐱𝐭 𝐩𝐚𝐠𝐞."
                },
                vi: {
                        noInput: "× Cưng ơi, vui lòng chỉ định danh mục hoặc phản hồi video",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ.",
                        invalidPage: "× Trang không hợp lệ! Trang tối đa: %1",
                        header: "𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐀𝐥𝐛𝐮𝐦 𝐕𝐢𝐝𝐞𝐨",
                        footer: "\n♻ | Trang [%1/%2]<😘\nℹ | Nhập !%3 %4 - để xem trang tiếp theo."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);

                try {
                        const apiBase = await mahmud();

                        if (args[0] === "add") {
                                if (!args[1] || event.type !== "message_reply" || !event.messageReply.attachments.length) return message.reply(getLang("noInput"));
                                api.setMessageReaction("⏳", event.messageID, () => {}, true);
                                const imgurRes = await axios.get(`${apiBase.replace(/\/$/, "")}/imgur?url=${encodeURIComponent(event.messageReply.attachments[0].url)}`);
                                const res = await axios.post(`${apiBase}/api/album2/mahmud/add`, { category: args[1].toLowerCase(), videoUrl: imgurRes.data.link });
                                api.setMessageReaction("🪽", event.messageID, () => {}, true);
                                return message.reply(res.data.message);
                        }

                        if (args[0] === "list") {
                                api.setMessageReaction("⏳", event.messageID, () => {}, true);
                                const res = await axios.get(`${apiBase}/api/album2/mahmud/list`);
                                api.setMessageReaction("🪽", event.messageID, () => {}, true);
                                return message.reply(res.data.message);
                        }

                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        const configRes = await axios.get(`${apiBase}/api/album2/mahmud/display`);
                        const { displayNames, realCategories, captions } = configRes.data;
                        const page = parseInt(args[0]) || 1, itemsPerPage = 10, totalPages = Math.ceil(displayNames.length / itemsPerPage);

                        if (page < 1 || page > totalPages) {
                                api.setMessageReaction("❌", event.messageID, () => {}, true);
                                return message.reply(getLang("invalidPage", totalPages));
                        }

                        const startIndex = (page - 1) * itemsPerPage;
                        const menu = `${getLang("header")}\n𐙚━━━━━━━━━━━━━━━━━━━━━ᡣ𐭩\n${displayNames.slice(startIndex, startIndex + itemsPerPage).map((name, i) => `${startIndex + i + 1}. ${name}`).join("\n")}\n𐙚━━━━━━━━━━━━━━━━━━━━━ᡣ𐭩${getLang("footer", page, totalPages, this.config.name, page + 1)}`;

                        api.setMessageReaction("🪽", event.messageID, () => {}, true);
                        return message.reply(menu, (err, info) => {
                                global.GoatBot.onReply.set(info.messageID, { commandName: this.config.name, messageID: info.messageID, author: event.senderID, realCategories, captions });
                        });
                } catch (err) {
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.response?.data?.error || err.message));
                }
        },

        onReply: async function ({ api, event, Reply, getLang, message }) {
                if (event.senderID !== Reply.author) return;
                api.unsendMessage(Reply.messageID);
                const category = Reply.realCategories[parseInt(event.body) - 1];
                if (!category) return;

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        const apiBase = await mahmud();
                        const response = await axios.get(`${apiBase}/api/album2/mahmud/videos/${category}?userID=${event.senderID}`);
                        const randomVideoUrl = response.data.videos[Math.floor(Math.random() * response.data.videos.length)];
                        const filePath = path.join(__dirname, `cache/album_${Date.now()}.mp4`);

                        const res = await axios({ url: randomVideoUrl, method: "GET", responseType: "stream", headers: { 'User-Agent': 'Mozilla/5.0' } });
                        const writer = fs.createWriteStream(filePath);
                        res.data.pipe(writer);

                        writer.on("finish", () => {
                                api.setMessageReaction("🪽", event.messageID, () => {}, true);
                                message.reply({ body: Reply.captions[category] || Reply.captions["default"], attachment: fs.createReadStream(filePath) }, () => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); });
                        });
                        writer.on("error", (err) => message.reply(getLang("error", err.message)));
                } catch (err) {
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.response?.data?.error || err.message));
                }
        }
};
