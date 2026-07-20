module.exports = {
        config: {
                name: "ping",
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "বোটের রেসপন্স টাইম বা পিং চেক করুন",
                        en: "Check the bot's response time or ping",
                        vi: "Kiểm tra thời gian phản hồi hoặc ping của bot"
                },
                category: "general",
                guide: {
                        bn: '   {pn}: পিং চেক করতে',
                        en: '   {pn}: To check ping',
                        vi: '   {pn}: Để kiểm tra ping'
                }
        },

        onStart: async function ({ api, message, event }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68); 
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const timeStart = Date.now();
                const checkingMsg = await message.reply("⏳ Checking bot ping...");
                const ping = Date.now() - timeStart;

                const response = `✅ 𝐏𝐢𝐧𝐠 𝐂𝐡𝐞𝐜𝐤 𝐑𝐞𝐬𝐮𝐥𝐭\n` +
                                 `───────────────\n` +
                                 `📶 𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐓𝐢𝐦𝐞: ${ping}ms`;

                return api.editMessage(response, checkingMsg.messageID);
        }
};
