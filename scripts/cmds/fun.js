const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "fun",
                aliases: ["dig", "funny"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                category: "fun",
                description: {
                        bn: "বিভিন্ন ইমেজ ইফেক্ট দিয়ে মজার ছবি তৈরি করুন",
                        en: "Create funny images with various image effects",
                        vi: "Tạo ảnh hài hước với nhiều hiệu ứng hình ảnh khác nhau"
                },
                guide: {
                        bn: "{pn} [টাইপ] [মেনশন/রিপ্লাই/UID] | {pn} list",
                        en: "{pn} [type] [mention/reply/UID] | {pn} list",
                        vi: "{pn} [loại] [gợi ý/trả lời/UID] | {pn} list"
                }
        },

        langs: {
                bn: {
                        noType: "❌ বেবি, একটি ইফেক্ট টাইপ দাও! সব ইফেক্ট দেখতে টাইপ করো: !fun list",
                        listFetchErr: "❌ ইফেক্ট লিস্ট লোড করতে ব্যর্থ হয়েছে।",
                        noTarget: "❌ Please message reply or mention someone", // আপনার কাস্টম রিকোয়েস্ট অনুযায়ী চেঞ্জ করা হয়েছে
                        authErr: "You are not authorized to change the author name.",
                        error: "❌ সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        noType: "❌ Provide a DIG type! Use 'fun list' to see all available effects.",
                        listFetchErr: "❌ Failed to fetch the effects list.",
                        noTarget: "❌ Please message reply or mention someone",
                        authErr: "You are not authorized to change the author name.",
                        error: "❌ Error occurred: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        noType: "❌ Vui lòng cung cấp loại hiệu ứng! Sử dụng 'fun list' để xem tất cả.",
                        listFetchErr: "❌ Không thể tải danh sách hiệu ứng.",
                        noTarget: "❌ Please message reply or mention someone",
                        authErr: "You are not authorized to change the author name.",
                        error: "❌ Đã xảy ra lỗi: %1. Liên hệ MahMUD để được hỗ trợ.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, event, usersData, args, getLang }) {
                const { threadID, messageID, messageReply, senderID, mentions } = event;

                const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== obfuscatedAuthor) {
                        return api.sendMessage(getLang("authErr"), threadID, messageID);
                }

                const type = args[0]?.toLowerCase();
                const baseUrl = await baseApiUrl();

                if (!type) return api.sendMessage(getLang("noType"), threadID, messageID);
        
                if (type === "list") {
                        try {
                                const res = await axios.get(`${baseUrl}/api/dig/list`);
                                let types = res.data.types || [];
                                return api.sendMessage(`• Available Effects:\n\n${types.join(", ")}`, threadID, messageID);
                        } catch (err) {
                                return api.sendMessage(getLang("listFetchErr"), threadID, messageID);
                        }
                }

                let targetID;
                if (messageReply) {
                        targetID = messageReply.senderID;
                } else if (Object.keys(mentions).length > 0) {
                        targetID = Object.keys(mentions)[0];
                } else if (args[1]) {
                        targetID = args[1];
                }
                if (!targetID) return api.sendMessage(getLang("noTarget"), threadID, messageID);

                try {
                        api.setMessageReaction("⏳", messageID, () => { }, true);

                        let url = `${baseUrl}/api/dig?type=${type}&user=${targetID}`;
                        let response;

                        try {
                                response = await axios.get(url, { responseType: "arraybuffer" });
                        } catch (err) {
                                if (err.response && err.response.status === 400) {
                                        url = `${baseUrl}/api/dig?type=${type}&user=${senderID}&user2=${targetID}`;
                                        response = await axios.get(url, { responseType: "arraybuffer" });
                                } else {
                                        throw err; 
                                }
                        }

                        const isGif = ["trigger", "triggered"].includes(type);
                        const ext = isGif ? "gif" : "png";
            
                        const cacheDir = path.join(__dirname, "cache");
                        if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
                        const filePath = path.join(cacheDir, `fun_${Date.now()}.${ext}`);

                        fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

                        const targetData = await usersData.get(targetID);
                        const targetName = targetData.name || "User";

                        const finalBody = [
                                "It's just for fun, don't take it seriously. <🐸",
                                "",
                                `• Target: ${targetName}`,
                                `• Effect name: ${type.charAt(0).toUpperCase() + type.slice(1)}`
                        ].filter(Boolean).join("\n");

                        return api.sendMessage({
                                body: finalBody,
                                attachment: fs.createReadStream(filePath)
                        }, threadID, async () => {
                                api.setMessageReaction("🪽", messageID, () => { }, true);
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        }, messageID);

                } catch (err) {
                        api.setMessageReaction("❌", messageID, () => { }, true);
                        let errMsg = err.message;
                        if (err.response && err.response.data) {
                                try {
                                        const errorJson = JSON.parse(err.response.data.toString());
                                        if (errorJson.error) errMsg = errorJson.error;
                                } catch (e) {}
                        }
                        console.error(err);
                        return api.sendMessage(getLang("error", errMsg), threadID, messageID);
                }
        }
};
