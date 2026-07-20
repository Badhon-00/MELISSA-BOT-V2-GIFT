const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "ckban",
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "মিডিয়া ব্যান স্ট্যাটাস চেক করুন",
                        en: "Check media ban status",
                        vi: "Kiểm tra trạng thái cấm phương tiện"
                },
                category: "general",
                guide: {
                        bn: '   {pn}: মিডিয়া চেক করতে ব্যবহার করুন',
                        en: '   {pn}: Use to check media status',
                        vi: '   {pn}: Sử dụng để kiểm tra trạng thái'
                }
        },

        langs: {
                bn: {
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD|\n•WhatsApp: 01836298139",
                        banned: "❌ মিডিয়া ব্যানড করা হয়েছে!",
                        auth: "You are not authorized to change the author name."
                },
                en: {
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139",
                        banned: "❌ Media is banned!",
                        auth: "You are not authorized to change the author name."
                },
                vi: {
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ.\n•WhatsApp: 01836298139",
                        banned: "❌ Phương tiện bị cấm!",
                        auth: "You are not authorized to change the author name."
                }
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage(getLang("auth"), event.threadID, event.messageID);
                }

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);

                        const baseUrl = await baseApiUrl();
                        const res = await axios.get(`${baseUrl}/api/ckban`);

                        const apiImageUrl = res.data.url;

                        if (!res.data.banned && apiImageUrl) {
                                const imgStream = await axios({
                                        method: "GET",
                                        url: apiImageUrl,
                                        responseType: "stream",
                                        headers: {
                                                "User-Agent": "Mozilla/5.0"
                                        }
                                });

                                api.setMessageReaction("✅", event.messageID, () => {}, true);
                                return message.reply({
                                        body: `✅ ${res.data.message || "Success"}`,
                                        attachment: imgStream.data
                                });
                        } else {
                                api.setMessageReaction("❌", event.messageID, () => {}, true);
                                return message.reply(res.data.message || getLang("banned"));
                        }

                } catch (e) {
                        console.error("CKBAN Error:", e);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        const errorInfo = e.response?.data?.error || e.message;
                        return message.reply(getLang("error", errorInfo));
                }
        }
};
