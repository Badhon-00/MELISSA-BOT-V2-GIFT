const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "pastebin",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "আপনার API পেস্টবিনে কমান্ড ফাইল আপলোড করুন",
                        en: "Upload command file to your API pastebin",
                        vi: "Tải tệp lệnh lên pastebin API của bạn"
                },
                category: "utility",
                guide: {
                        bn: '   {pn} <কমান্ডের নাম>: ফাইলের নাম লিখুন',
                        en: '   {pn} <cmd name>: Type the command name',
                        vi: '   {pn} <tên lệnh>: Nhập tên tệp lệnh'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, একটি কমান্ডের নাম তো বলো!",
                        notFound: "× ফাইলটি খুঁজে পাওয়া যায়নি: %1.js",
                        success: "✅ সফলভাবে আপলোড হয়েছে!\n\n• শিরোনাম: %1\n• র লিঙ্ক: %2",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD|\n•WhatsApp: 01836298139"
                },
                en: {
                        noInput: "× Baby, please enter a command name!",
                        notFound: "× File not found: %1.js",
                        success: "✅ Upload Successful!\n\n• Title: %1\n• Raw Link: %2",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        noInput: "× Cưng ơi, hãy nhập tên lệnh!",
                        notFound: "× Không tìm thấy tệp: %1.js",
                        success: "✅ Tải lên thành công!\n\n• Tiêu đề: %1\n• Liên kết thô: %2",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const fileName = args[0];
                if (!fileName) return message.reply(getLang("noInput"));

                const filePath = path.join(__dirname, "..", "cmds", fileName.endsWith(".js") ? fileName : fileName + ".js");

                if (!fs.existsSync(filePath)) {
                        return api.sendMessage(getLang("notFound", fileName), event.threadID, event.messageID);
                }

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        
                        const code = fs.readFileSync(filePath, "utf8");
                        const baseUrl = await baseApiUrl();                   
                        const res = await axios.post(`${baseUrl}/api/pastebin`, {
                                text: code,
                                title: fileName
                        });

                        if (res.data && res.data.success) {
                                api.setMessageReaction("✅", event.messageID, () => {}, true);
                                return api.sendMessage(
                                        getLang("success", res.data.title, res.data.rawPaste),
                                        event.threadID,
                                        event.messageID
                                );
                        } else {
                                throw new Error(res.data.message || "Upload failed");
                        }

                } catch (err) {
                        console.error("Pastebin Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        const errorMsg = err.response?.data?.error || err.message;
                        return api.sendMessage(getLang("error", errorMsg), event.threadID, event.messageID);
                }
        }
};
