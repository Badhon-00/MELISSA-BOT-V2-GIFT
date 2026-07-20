module.exports = {
        config: {
                name: "inbox",
                aliases: ["in", "ইনবক্স"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "ইউজারকে ইনবক্সে মেসেজ পাঠান",
                        en: "Send a message to the user's inbox",
                        vi: "Gửi tin nhắn vào hộp thư đến của người dùng"
                },
                category: "system",
                guide: {
                        bn: '   {pn}',
                        en: '   {pn}',
                        vi: '   {pn}'
                }
        },

        langs: {
                bn: {
                        reply: "বেবি তোমার ইনবক্স চেক করো 🐤",
                        inboxMsg: "হাই বেবি 😘",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        reply: "Baby, check your inbox 🐤",
                        inboxMsg: "Hi baby 😘",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        reply: "Cưng ơi, kiểm tra hộp thư đến nhé 🐤",
                        inboxMsg: "Chào cưng 😘",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                try {
                        
                        await message.reply(getLang("reply"));

                        await api.sendMessage(getLang("inboxMsg"), event.senderID);

                } catch (error) {
                        console.error("Inbox Error:", error);
                  
                        return message.reply(getLang("error", error.message));
                }
        }
};
