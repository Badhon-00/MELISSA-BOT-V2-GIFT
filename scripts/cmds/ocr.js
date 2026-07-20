const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "ocr",
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                category: "tools",
                description: {
                        bn: "ছবি থেকে টেক্সট এক্সট্রাক্ট করুন (OCR)",
                        en: "Extract text from images (OCR)",
                        vi: "Trích xuất văn bản từ hình ảnh (OCR)"
                },
                guide: {
                        bn: '{pn}: একটি ছবিতে রিপ্লাই দিন টেক্সট পেতে।',
                        en: '{pn}: Reply to an image to get text.',
                        vi: '{pn}: Phản hồi một hình ảnh để lấy văn bản.'
                }
        },

        langs: {
                bn: {
                        replyOnly: "× বেবি, একটি ছবিতে রিপ্লাই দাও!",
                        noText: "× ছবি থেকে কোনো টেক্সট পাওয়া যায়নি।",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        replyOnly: "× Baby, please reply to an image!",
                        noText: "× No text found in the image.",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        replyOnly: "× Cưng ơi, vui lòng phản hồi một hình ảnh!",
                        noText: "× Không tìm thấy văn bản trong hình ảnh.",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                if (event.type !== "message_reply" || !event.messageReply.attachments.length || event.messageReply.attachments[0].type !== "photo") {
                        return message.reply(getLang("replyOnly"));
                }

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        
                        const apiBase = await mahmud();
                        const imageUrl = event.messageReply.attachments[0].url;
                        const ocrPrompt = "Extract all text from this image accurately.";

                        const response = await axios.post(`${apiBase}/api/gemini`, {
                                prompt: ocrPrompt,
                                imageUrl: imageUrl
                        }, {
                                headers: { 
                                        "Content-Type": "application/json",
                                        "author": "MahMUD"
                                }
                        });

                        const resultText = response.data.response || getLang("noText");
                        
                        api.setMessageReaction("🪽", event.messageID, () => {}, true);
                        return message.reply(resultText);

                } catch (err) {
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.response?.data?.error || err.message));
                }
        }
};
