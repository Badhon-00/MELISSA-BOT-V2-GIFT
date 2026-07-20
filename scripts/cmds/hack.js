const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const mahmhd = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
        config: {
                name: "hack",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "কাউকে হ্যাক করার প্র্যাঙ্ক ছবি তৈরি করুন",
                        en: "Create a prank hack image of someone"
                },
                category: "fun",
                guide: {
                        bn: '   {pn} <@tag>: কাউকে ট্যাগ করে হ্যাক করুন'
                                + '\n   {pn} <uid>: UID এর মাধ্যমে হ্যাক করুন'
                                + '\n   (অথবা কারো মেসেজে রিপ্লাই দিয়ে এটি ব্যবহার করুন)',
                        en: '   {pn} <@tag>: Hack a tagged user'
                                + '\n   {pn} <uid>: Hack by UID'
                                + '\n   (Or reply to someone\'s message)'
                }
        },

        langs: {
                bn: {
                        success: "✅ এই ইউজারকে সফলভাবে হ্যাক করা হয়েছে: %1",
                        error: "× হ্যাক করতে গিয়ে সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        success: "✅ Successfully Hacked This User: %1",
                        error: "× Failed to hack: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, message, args, event, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const cacheDir = path.join(__dirname, "cache");
                await fs.ensureDir(cacheDir);
                const outPath = path.join(cacheDir, `hack_${Date.now()}.png`);

                try {
                        let targetId = event.senderID;
                        if (event.messageReply) {
                                targetId = event.messageReply.senderID;
                        } else if (Object.keys(event.mentions).length > 0) {
                                targetId = Object.keys(event.mentions)[0];
                        } else if (args[0] && !isNaN(args[0])) {
                                targetId = args[0].trim();
                        }

                        let displayName = "User";
                        try {
                                const info = await api.getUserInfo([targetId]);
                                if (info && info[targetId]) {
                                        displayName = info[targetId].name;
                                }
                        } catch (e) {
                                displayName = targetId;
                        }

                        const baseApi = await mahmhd();
                        const apiUrl = `${baseApi}/api/hack?id=${encodeURIComponent(targetId)}&name=${encodeURIComponent(displayName)}`;
                        
                        const res = await axios.get(apiUrl, { responseType: "arraybuffer", timeout: 20000 });
                        await fs.writeFile(outPath, Buffer.from(res.data));

                        await message.reply({
                                body: getLang("success", displayName),
                                attachment: fs.createReadStream(outPath)
                        });

                        await fs.remove(outPath);
                } catch (err) {
                        console.error("Error in hack command:", err);
                        if (fs.existsSync(outPath)) await fs.remove(outPath);
                        return message.reply(getLang("error", err.message));
                }
        }
};
