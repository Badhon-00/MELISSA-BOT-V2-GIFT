module.exports = {
        config: {
                name: "fork",
                version: "2.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "বোটের গিটহাব লিঙ্ক এবং টিউটোরিয়াল ভিডিও পান",
                        en: "Get the GitHub fork link and tutorial video",
                        vi: "Lấy liên kết fork GitHub và video hướng dẫn"
                },
                category: "github",
                guide: {
                        bn: '   {pn}: গিটহাব লিঙ্ক পেতে',
                        en: '   {pn}: Get the fork link',
                        vi: '   {pn}: Lấy liên kết fork'
                }
        },

        onStart: async function ({ api, message, event }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68); 
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const githubLink = "https://github.com/mahmudx7/Hinata-Bot-v3";
                const youtubeLink = "https://youtu.be/zJsemXLaRbY?si=8O-O-nSXgQlsNvnU";

                const response = `✓ | Fork this project here:\n` +
                                 `•${githubLink}\n\n` +
                                 `#Tutorial video:\n` +
                                 `•${youtubeLink}\n\n` +
                                 `#Updated\n` +
                                 `• Extreme performance\n` +
                                 `• Now using mahmud-fca log out issue solved\n` +
                                 `• Id suspended Issue almost fix and run long time.\n` +
                                 `• added new more premium command\n\n` +
                                 `Note: If you want to use mahmud-fca please install mahmud-fca@latest`;

                return api.sendMessage(response, event.threadID, event.messageID);
        }
};
