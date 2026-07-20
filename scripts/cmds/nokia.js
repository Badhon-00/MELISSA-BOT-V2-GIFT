const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "nokia",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "নোকিয়া স্ক্রিন ইফেক্ট তৈরি করুন",
                        en: "Generate Nokia screen style image",
                        vi: "Tạo hiệu ứng màn hình Nokia"
                },
                category: "fun",
                guide: {
                        bn: '   {pn} @mention: নির্দিষ্ট কাউকে মেনশন করুন' +
                                '\n   {pn} [reply]: রিপ্লাই দিয়ে ইফেক্ট তৈরি করুন' +
                                '\n   {pn} [UID]: ইউজার আইডি দিন',
                        en: '   {pn} @mention: Generate with mentioned user' +
                                '\n   {pn} [reply]: Generate with replied user' +
                                '\n   {pn} [UID]: Provide a user ID',
                        vi: '   {pn} @mention: Tạo với người được nhắc' +
                                '\n   {pn} [reply]: Tạo với người đã trả lời' +
                                '\n   {pn} [UID]: Cung cấp UID'
                }
        },

        langs: {
                bn: {
                        provide: "• দয়া করে কাউকে মেনশন, মেসেজ রিপ্লাই অথবা UID দিন।",
                        success: "📱 | এই নাও তোমার নোকিয়া স্ক্রিন ইফেক্ট!",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        provide: "• Please mention, message reply or provide a UID.",
                        success: "📱 | Here's your Nokia screen effect!",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        provide: "• Vui lòng gắn thẻ, trả lời tin nhắn hoặc cung cấp UID.",
                        success: "📱 | Hiệu ứng màn hình Nokia của bạn đây!",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                try {
                        const { mentions, type, messageReply } = event;
                        let uid;

                        if (Object.keys(mentions).length > 0) {
                                uid = Object.keys(mentions)[0];
                        } else if (type === "message_reply") {
                                uid = messageReply.senderID;
                        } else if (args[0]) {
                                uid = args[0];
                        } else {
                                return message.reply(getLang("provide"));
                        }

                        api.setMessageReaction("⏳", event.messageID, () => {}, true);

                        const baseURL = await mahmud();
                        const imageUrl = `${baseURL}/api/nokia?uid=${uid}`;
                        const stream = await global.utils.getStreamFromURL(imageUrl);

                        api.setMessageReaction("✅", event.messageID, () => {}, true);

                        return message.reply({
                                body: getLang("success"),
                                attachment: stream
                        });

                } catch (err) {
                        console.error("Nokia Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};
