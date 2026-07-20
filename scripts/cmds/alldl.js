const axios = require("axios");
const fs = require("fs");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
        return base.data.mahmud69;
};

module.exports = {
        config: {
                name: "alldl",
                aliases: ["download", "dl"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "যেকোনো সোশ্যাল মিডিয়া ভিডিও ডাউনলোড করুন",
                        en: "Download videos from any social media"
                },
                category: "media",
                guide: {
                        bn: '   {pn} <লিংক>: ভিডিওর লিংক দিন'
                                + '\n   অথবা ভিডিও লিংকে রিপ্লাই দিয়ে {pn} লিখুন'
                                + '\n\nSupported Platforms:\n• TikTok\n• YouTube / Shorts\n• Facebook / FB Watch\n• Instagram / Reels\n• Twitter (X)\n• Threads\n• Snapchat\n• Pinterest\n• Spotify\n• SoundCloud\n• Reddit\n• LinkedIn\n• CapCut\n• Dailymotion\n• Kwai / Kuaishou\n• Douyin\n• Bluesky\n• Tumblr',
                        en: '   {pn} <link>: Provide the video link'
                                + '\n   Or reply to a link with {pn}'
                                + '\n\nSupported Platforms:\n• TikTok\n• YouTube / Shorts\n• Facebook / FB Watch\n• Instagram / Reels\n• Twitter (X)\n• Threads\n• Snapchat\n• Pinterest\n• Spotify\n• SoundCloud\n• Reddit\n• LinkedIn\n• CapCut\n• Dailymotion\n• Kwai / Kuaishou\n• Douyin\n• Bluesky\n• Tumblr'
                }
        },

        langs: {
                bn: {
                        noLink: "× বেবি, একটি সঠিক ভিডিও লিংক দাও অথবা লিংকে রিপ্লাই করো!",
                        error: "× ভিডিও ডাউনলোড করতে সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        noLink: "× Baby, please provide a valid video link or reply to one!",
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
                        mahmud.includes("tiktok.com") ||
                        mahmud.includes("youtube.com") || 
                        mahmud.includes("youtu.be") ||
                        mahmud.includes("twitter.com") || 
                        mahmud.includes("x.com") ||
                        mahmud.includes("facebook.com") || 
                        mahmud.includes("fb.watch") ||
                        mahmud.includes("instagram.com") ||
                        mahmud.includes("tumblr.com") ||
                        mahmud.includes("threads.net") ||
                        mahmud.includes("spotify.com") ||
                        mahmud.includes("soundcloud.com") ||
                        mahmud.includes("snapchat.com") ||
                        mahmud.includes("reddit.com") ||
                        mahmud.includes("pinterest.com") || 
                        mahmud.includes("pin.it") ||
                        mahmud.includes("linkedin.com") ||
                        mahmud.includes("kuaishou.com") || 
                        mahmud.includes("kwai.com") ||
                        mahmud.includes("douyin.com") ||
                        mahmud.includes("dailymotion.com") || 
                        mahmud.includes("dai.ly") ||
                        mahmud.includes("capcut.com") ||
                        mahmud.includes("bsky.app")
                )) {
                        return message.reply(getLang("noLink"));
                }

                if (!fs.existsSync(__dirname + "/cache")) fs.mkdirSync(__dirname + "/cache");
                const path = __dirname + `/cache/alldl_${Date.now()}.mp4`;

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

                        api.setMessageReaction("✅", event.messageID, () => {}, true);

                        return message.reply(
                                {
                                        body: caption,
                                        attachment: fs.createReadStream(path)
                                },
                                () => fs.unlinkSync(path)
                        );

                } catch (err) {
                        console.error("Error in alldl command:", err);
                        api.setMessageReaction("❎", event.messageID, () => {}, true);
                        if (fs.existsSync(path)) fs.unlinkSync(path);
                        return message.reply(getLang("error", err.message));
                }
        }
};
