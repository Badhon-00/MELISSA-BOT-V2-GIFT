const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
        return base.data.mahmud69;
};

module.exports = {
        config: {
                name: "pinterestdl",
                aliases: ["pindl"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "পিন্টারেস্ট ভিডিও ডাউনলোড করুন",
                        en: "Download videos from Pinterest"
                },
                category: "media",
                guide: {
                        bn: '   {pn} <লিংক>: পিন্টারেস্ট ভিডিওর লিংক দিন'
                                + '\n   অথবা ভিডিও লিংকে রিপ্লাই দিয়ে {pn} লিখুন'
                                + '\n\nSupported Platforms:\n• Pinterest / pin.it',
                        en: '   {pn} <link>: Provide the Pinterest video link'
                                + '\n   Or reply to a link with {pn}'
                                + '\n\nSupported Platforms:\n• Pinterest / pin.it'
                }
        },

        langs: {
                bn: {
                        noLink: "× বেবি, একটি সঠিক পিন্টারেস্ট ভিডিও লিংক দাও অথবা লিংকে রিপ্লাই করো!",
                        error: "× ভিডিও ডাউনলোড করতে সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        noLink: "× Baby, please provide a valid Pinterest video link or reply to one!",
                        error: "× Download error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, message, args, event, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const mahmud = args[0] || event.messageReply?.body;

                if (!mahmud || !mahmud.startsWith("http")) {
                        return message.reply(getLang("noLink"));
                }

                if (!(
                        mahmud.includes("pinterest.com") || 
                        mahmud.includes("pin.it")
                )) {
                        return message.reply(getLang("noLink"));
                }

                if (!fs.existsSync(__dirname + "/cache")) fs.mkdirSync(__dirname + "/cache");
                const path = __dirname + `/cache/pindl_${Date.now()}.mp4`;

                try {
                        api.setMessageReaction("🐤", event.messageID, () => {}, true);
                        
                        const base = await baseApiUrl();
                        const apiUrl = `${base}/api/download?url=${encodeURIComponent(mahmud)}`;
                        
                        const apiRes = await axios.get(apiUrl);
                        if (!apiRes.data || !apiRes.data.result) {
                                throw new Error("Failed to fetch video URL from API");
                        }

                        const videoUrl = apiRes.data.result;
                        const caption = apiRes.data.cp || "Downloaded Video"; 

                        const response = await axios({
                                method: 'get',
                                url: videoUrl,
                                responseType: 'arraybuffer'
                        });

                        fs.writeFileSync(path, Buffer.from(response.data, "binary"));

                        api.setMessageReaction("🪽", event.messageID, () => {}, true);

                        return message.reply(
                                {
                                        body: caption,
                                        attachment: fs.createReadStream(path)
                                },
                                () => fs.unlinkSync(path)
                        );

                } catch (err) {
                        console.error("Error in pinterestdl command:", err);
                        api.setMessageReaction("❎", event.messageID, () => {}, true);
                        if (fs.existsSync(path)) fs.unlinkSync(path);
                        return message.reply(getLang("error", err.message));
                }
        }
};
