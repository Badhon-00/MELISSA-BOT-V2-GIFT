const fs = require("fs-extra");
const path = require("path");

module.exports = {
        config: {
                name: "file",
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 2,
                description: {
                        bn: "যেকোনো কমান্ডের সোর্স কোড সরাসরি দেখুন (অ্যাডমিন)",
                        en: "View the source code of any command (Admin)",
                        vi: "Xem mã nguồn của bất kỳ lệnh nào (Quản trị viên)"
                },
                category: "admin",
                guide: {
                        bn: '   {pn} <কমান্ডের নাম>: সোর্স কোড দেখতে ব্যবহার করুন',
                        en: '   {pn} <command name>: Use to view source code',
                        vi: '   {pn} <tên lệnh>: Sử dụng để xem mã nguồn'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, কমান্ডের নাম তো দাও",
                        notFound: "× এই নামে কোনো কমান্ড খুঁজে পাওয়া যায়নি!",
                        denied: "× অ্যাক্সেস ডিনাইড: পাথ ট্রাভার্সাল শনাক্ত হয়েছে!",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noInput: "× Baby, please provide a command name",
                        notFound: "× Command not found!",
                        denied: "× Access denied: Path traversal detected!",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noInput: "× Cưng ơi, hãy cung cấp tên lệnh",
                        notFound: "× Không tìm thấy lệnh!",
                        denied: "× Truy cập bị từ chối: Đã phát hiện truyền tải đường dẫn!",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const commandName = args[0]?.toLowerCase();
                if (!commandName) return message.reply(getLang("noInput"));

                const allCommands = global.GoatBot.commands;
                let command = allCommands.get(commandName) || [...allCommands.values()].find((c) => (c.config.aliases || []).includes(commandName));

                if (!command) return message.reply(getLang("notFound"));

                const actualName = command.config.name;
                const allowedDir = path.resolve(__dirname);
                const filePath = path.resolve(__dirname, `${actualName}.js`);

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);

                        if (!filePath.startsWith(allowedDir)) {
                                return message.reply(getLang("denied"));
                        }

                        if (!fs.existsSync(filePath)) {
                                return message.reply(getLang("notFound"));
                        }

                        const content = fs.readFileSync(filePath, "utf-8");
                        
                        const output = content.length > 4000 ? `${content.substring(0, 3997)}...` : content;

                        api.setMessageReaction("✅", event.messageID, () => {}, true);
                        return message.reply(output);

                } catch (err) {
                        console.error("File Command Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};
