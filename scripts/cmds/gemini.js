const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "gemini",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                category: "ai",
                guide: {
                        bn: '   {pn} <প্রশ্ন>: যেকোনো কিছু জিজ্ঞাসা করুন\n   অথবা কোনো ছবিতে রিপ্লাই দিয়ে প্রশ্ন করুন',
                        en: '   {pn} <prompt>: Ask anything to AI\n   Or reply to an image with a prompt',
                        vi: '   {pn} <câu hỏi>: Hỏi bất cứ điều gì\n   Hoặc phản hồi một hình ảnh'
                }
        },

        langs: {
                bn: {
                        noPrompt: "⚠️ বেবি, কিছু তো জিজ্ঞাসা করো! উদাহরণ: {pn} তুমি কে?",
                        noResponse: "× এআই থেকে কোনো উত্তর পাওয়া যায়নি।",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        noPrompt: "⚠️ Baby, please provide a question! Example: {pn} Who are you?",
                        noResponse: "× No response received from AI.",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        noPrompt: "⚠️ Cưng ơi, vui lòng nhập câu hỏi! Ví dụ: {pn} Bạn là ai?",
                        noResponse: "× Không nhận được phản hồi từ AI.",
                        error: "× Lỗi API: %1. Liên hệ MahMUD để được trợ giúp.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const prompt = args.join(" ");
                if (!prompt) return message.reply(getLang("noPrompt"));

                let requestBody = { prompt };
                if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
                        const attachment = event.messageReply.attachments[0];
                        if (attachment.type === "photo") {
                                requestBody.imageUrl = attachment.url;
                        }
                }

                return await handleGemini(api, event, requestBody, this.config.name, getLang);
        },

        onReply: async function ({ api, event, Reply, args, getLang }) {
                if (Reply.author !== event.senderID) return;
                const prompt = args.join(" ");
                if (!prompt) return;
                return await handleGemini(api, event, { prompt }, this.config.name, getLang);
        }
};

async function handleGemini(api, event, requestBody, commandName, getLang) {
        try {
                const baseUrl = await baseApiUrl();
                const response = await axios.post(`${baseUrl}/api/gemini`, requestBody, {
                        headers: { 
                                "Content-Type": "application/json",
                                "author": "MahMUD"
                        }
                });

                const replyText = response.data.response || getLang("noResponse");

                api.sendMessage(replyText, event.threadID, (error, info) => {
                        if (!error) {
                                global.GoatBot.onReply.set(info.messageID, {
                                        commandName: commandName,
                                        author: event.senderID,
                                        messageID: info.messageID,
                                        type: "reply"
                                });
                        }
                }, event.messageID);

        } catch (err) {
                api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
        }
}
