const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "fluxpro",
                version: "1.7",
                author: "MahMUD",
                countDown: 15,
                role: 0,
                description: {
                        bn: "ফ্লাক্স প্রো মডেল দিয়ে উন্নত এআই ছবি তৈরি করুন",
                        en: "Generate high-quality AI images using Flux Pro model",
                        vi: "Tạo hình ảnh AI chất lượng cao bằng mô hình Flux Pro"
                },
                category: "image gen",
                guide: {
                        bn: '   {pn} <prompt> --ratio <value>: ছবি তৈরি করতে বর্ণনা ও রেশিও দিন',
                        en: '   {pn} <prompt> --ratio <value>: Provide description and ratio',
                        vi: '   {pn} <prompt> --ratio <value>: Cung cấp mô tả và tỷ lệ'
                }
        },

        langs: {
                bn: {
                        noPrompt: "× বেবি, ছবি তৈরি করার জন্য কিছু তো লেখো!",
                        wait: "✅ প্রো ছবি তৈরি হচ্ছে, একটু অপেক্ষা করো বেবি...!! <😘",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐟𝐥𝐮𝐱 𝐩𝐫𝐨 𝐢𝐦𝐚𝐠𝐞 𝐛𝐚𝐛𝐲 <😘",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
                en: {
                        noPrompt: "× Baby, please provide a prompt to generate image!",
                        wait: "🔄 | Generating your image, please wait...",
                        success: "𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐟𝐥𝐮𝐱 𝐩𝐫𝐨 𝐢𝐦𝐚𝐠 e 𝐛𝐚𝐛𝐲 <😘",
                        error: "× API error: %1. Contact MahMUD for help."
                },
                vi: {
                        noPrompt: "× Cưng ơi, vui lòng nhập mô tả để tạo ảnh!",
                        wait: "✅ Đang tạo ảnh Pro, vui lòng chờ chút...!! <😘",
                        success: "Ảnh Flux Pro của cưng đây <😘",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ."
                }
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const fullArgs = args.join(" ");
                if (!fullArgs) return message.reply(getLang("noPrompt"));

                const [prompt, ratio = "1:1"] = fullArgs.includes("--ratio") 
                        ? fullArgs.split("--ratio").map(s => s.trim()) 
                        : [fullArgs, "1:1"];

                const cacheDir = path.join(__dirname, "cache");
                const filePath = path.join(cacheDir, `fluxpro_${Date.now()}.png`);
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        const waitMsg = await message.reply(getLang("wait"));

                        const baseUrl = await baseApiUrl();
                        const url = `${baseUrl}/api/fluxpro?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`;

                        const response = await axios.get(url, { responseType: "arraybuffer", timeout: 120000 });
                        fs.writeFileSync(filePath, Buffer.from(response.data));

                        if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
                        api.setMessageReaction("✅", event.messageID, () => {}, true);

                        return message.reply({
                                body: getLang("success"),
                                attachment: fs.createReadStream(filePath)
                        }, () => {
                                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        });

                } catch (err) {
                        console.error("Flux Pro Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
