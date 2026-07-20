const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "gistbin",
                aliases: ["gbin"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 2,
                description: {
                        bn: "আপনার কমান্ড ফাইলটি Gist এ আপলোড করুন",
                        en: "Upload your command file to Gist",
                        vi: "Tải tệp lệnh của bạn lên Gist"
                },
                category: "owner",
                guide: {
                        bn: '   {pn} <ফাইলের নাম>: কমান্ডের নাম লিখুন',
                        en: '   {pn} <fileName>: Type the command name',
                        vi: '   {pn} <tên tệp>: Nhập tên tệp lệnh'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, ফাইলের নাম তো বলো!",
                        notFound: "× ফাইলটি খুঁজে পাওয়া যায়নি!",
                        success: "✅ Gist তৈরি হয়েছে\n\n📄 র লিঙ্ক: %2",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD|\n•WhatsApp: 01836298139"
                },
                en: {
                        noInput: "× Baby, please enter a file name!",
                        notFound: "× File not found!",
                        success: "✅ Gist Created\n\n📄 Raw: %2",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        noInput: "× Cưng ơi, hãy nhập tên tệp!",
                        notFound: "× Không tìm thấy tệp!",
                        success: "✅ Đã tạo Gist\n\n📄 Thô: %2",
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

                const filePathWithoutExtension = path.join(__dirname, "..", "cmds", fileName);
                const filePathWithExtension = path.join(__dirname, "..", "cmds", fileName + ".js");

                if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
                        return api.sendMessage(getLang("notFound"), event.threadID, event.messageID);
                }

                const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        
                        const fileData = fs.readFileSync(filePath, "utf8");
                        const baseUrl = await baseApiUrl();                   
                        
                        const res = await axios.post(`${baseUrl}/api/gist`, {
                                name: fileName,
                                text: fileData
                        });

                        if (res.data && res.data.success) {
                                api.setMessageReaction("✅", event.messageID, () => {}, true);
                                return api.sendMessage(
                                        getLang("success", res.data.url, res.data.raw),
                                        event.threadID,
                                        event.messageID
                                );
                        } else {
                                throw new Error(res.data.message || "Failed to create gist");
                        }

                } catch (err) {
                        console.error("Gistbin Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        const errorMsg = err.response?.data?.error || err.message;
                        return api.sendMessage(getLang("error", errorMsg), event.threadID, event.messageID);
                }
        }
};
