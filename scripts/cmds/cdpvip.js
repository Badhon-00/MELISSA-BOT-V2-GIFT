const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "cdpvip",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "ক্যাটাগরি অনুযায়ী ভিআইপি কাপল ডিপি পান",
                        en: "Get VIP couple DPs by category",
                        vi: "Lấy ảnh đại diện đôi VIP theo danh mục"
                },
                category: "media",
                guide: {
                        bn: '   {pn} <ক্যাটাগরি>: ডিপি পান'
                                + '\n   {pn} list: সব ক্যাটাগরি দেখুন',
                        en: '   {pn} <category>: Get DP'
                                + '\n   {pn} list: See all categories',
                        vi: '   {pn} <danh mục>: Lấy ảnh'
                                + '\n   {pn} list: Xem tất cả danh mục'
                }
        },

        langs: {
                bn: {
                        usage: "⚠️ ব্যবহার নিয়ম:\n{pn} <ক্যাটাগরি>\n{pn} list",
                        noCat: "× কোনো ক্যাটাগরি খুঁজে পাওয়া যায়নি।",
                        listTitle: "🎀 সহজলভ্য ক্যাটাগরি সমূহ:\n",
                        notFound: "× ক্যাটাগরি পাওয়া যায়নি। সহজলভ্য ক্যাটাগরি:\n",
                        empty: "× এই ক্যাটাগরিতে কোনো ছবি নেই।",
                        loadErr: "× ছবিগুলো লোড করা সম্ভব হয়নি।",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐑𝐚𝐧𝐝𝐨𝐦 %1 𝐜𝐝𝐩 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲 <😘",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        usage: "⚠️ Usage:\n{pn} <category>\n{pn} list",
                        noCat: "× No categories found.",
                        listTitle: "🎀 Available categories:\n",
                        notFound: "× Category not found. Available:\n",
                        empty: "× No DP found in this category.",
                        loadErr: "× All image URLs failed to load.",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐑𝐚𝐧𝐝𝐨𝐦 %1 𝐜𝐝𝐩 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲 <😘",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        usage: "⚠️ Cách dùng:\n{pn} <danh mục>\n{pn} list",
                        noCat: "× Không tìm thấy danh mục nào.",
                        listTitle: "🎀 Danh mục có sẵn:\n",
                        notFound: "× Không tìm thấy danh mục. Danh mục có sẵn:\n",
                        empty: "× Không tìm thấy ảnh trong danh mục này.",
                        loadErr: "× Không thể tải được hình ảnh nào.",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐑𝐚𝐧𝐝𝐨𝐦 %1 𝐜𝐝𝐩 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲 <😘",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                if (!args.length) return message.reply(getLang("usage"));

                const command = args[0].toLowerCase();

                try {
                        const apiBase = await mahmud();
                        const baseUrl = `${apiBase}/api/cdpvip2`;

                        const getStream = async (url) => {
                                const res = await axios({
                                        url,
                                        method: "GET",
                                        responseType: "stream",
                                        headers: { "User-Agent": "Mozilla/5.0" }
                                });
                                return res.data;
                        };

                        if (command === "list") {
                                const res = await axios.get(`${baseUrl}/list`);
                                const summary = res.data?.summary || {};
                                const keys = Object.keys(summary);

                                if (!keys.length) return message.reply(getLang("noCat"));

                                let msg = getLang("listTitle");
                                keys.forEach(cat => msg += `• ${cat}\n`);
                                return message.reply(msg);
                        }

                        const listRes = await axios.get(`${baseUrl}/list`);
                        const availableCategories = Object.keys(listRes.data?.summary || {});

                        if (!availableCategories.includes(command)) {
                                let msg = getLang("notFound");
                                availableCategories.forEach(cat => msg += `• ${cat}\n`);
                                return message.reply(msg);
                        }

                        const res = await axios.get(`${baseUrl}?category=${command}`);
                        const groupImages = res.data?.group || [];

                        if (!groupImages.length) return message.reply(getLang("empty"));

                        const streamAttachments = [];
                        for (const url of groupImages) {
                                try {
                                        const stream = await getStream(url);
                                        streamAttachments.push(stream);
                                } catch (e) {
                                        console.warn(`Failed to load: ${url}`);
                                }
                        }

                        if (!streamAttachments.length) return message.reply(getLang("loadErr"));

                        return message.reply({
                                body: getLang("success", command),
                                attachment: streamAttachments
                        });

                } catch (err) {
                        console.error("CDPVIP Error:", err);
                        return message.reply(getLang("error", err.message));
                }
        }
};
