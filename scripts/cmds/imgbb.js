const axios = require("axios");

const getBase = async () => {
        const res = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return res.data.mahmud;
};

module.exports = {
        config: {
                name: "imgbb",
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "যেকোনো মিডিয়া ফাইলকে লিঙ্কে রূপান্তর করুন",
                        en: "Convert any media file into a URL link",
                        vi: "Chuyển đổi bất kỳ tệp phương tiện nào thành liên kết URL"
                },
                category: "tools",
                guide: {
                        bn: '   {pn} [রিপ্লাই মিডিয়া]: ফাইল লিঙ্কে রূপান্তর করতে রিপ্লাই দিন',
                        en: '   {pn} [reply media]: Reply to a file to get the link',
                        vi: '   {pn} [phản hồi phương tiện]: Phản hồi một tệp để lấy liên kết'
                }
        },

        langs: {
                bn: {
                        noMedia: "× বেবি, একটি ছবি বা ভিডিওতে রিপ্লাই দাও! 🐤",
                        success: "• 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 ✅\n• 𝐔𝐑𝐋: %1",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        noMedia: "× Baby, please reply to a media file (image/video)! 🐤",
                        success: "• 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 ✅\n• 𝐔𝐑𝐋: %1",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        noMedia: "× Cưng ơi, hãy phản hồi một tệp phương tiện! 🐤",
                        success: "• 𝐔𝐩𝐥𝐨𝐚𝐝 𝐭𝐡𝐚̀𝐧𝐡 𝐜𝐨̂𝐧𝐠 ✅\n• 𝐋𝐢ên 𝐤ế𝐭: %1",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                if (event.type !== "message_reply" || !event.messageReply.attachments.length) {
                        return message.reply(getLang("noMedia"));
                }

                try {
                        api.setMessageReaction("⌛", event.messageID, () => {}, true);

                        const attachmentUrl = encodeURIComponent(event.messageReply.attachments[0].url);
                        let baseUrl = await getBase();
                        
                        if (typeof baseUrl === 'object' && baseUrl !== null) {
                                baseUrl = baseUrl.url || baseUrl.api || Object.values(baseUrl)[0];
                        }
                        
                        baseUrl = String(baseUrl);

                        const apiUrl = `${baseUrl.replace(/\/$/, "")}/api/imgbb?url=${attachmentUrl}`;

                        const response = await axios.get(apiUrl, { timeout: 100000 });

                        if (response.data.status && response.data.link) {
                                return message.reply({
                                        body: getLang("success", response.data.link)
                                }, () => {
                                        api.setMessageReaction("✅", event.messageID, () => {}, true);
                                });
                        } else {
                                throw new Error("API returned false status.");
                        }

                } catch (err) {
                        console.error("ImgBB Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};
