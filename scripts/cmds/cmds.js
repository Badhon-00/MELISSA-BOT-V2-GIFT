const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "cmdstore",
                aliases: ["cmds", "cs"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                category: "utility",
                description: {
                        en: "Browse, search, and view detailed information of commands from the online store.",
                        vi: "Duyệt, tìm kiếm và xem thông tin chi tiết các lệnh từ cửa hàng trực tuyến."
                },
                guide: {
                        en: "• View command list: {pn}\n• View specific page: {pn} <page_number>\n• Search commands by name: {pn} <search_query>\n• View trending/top commands: {pn} top\n• View detailed info: {pn} info <command_name>\n\n💡 Note: Reply with the corresponding number in the list to view quick info.",
                        vi: "• Xem danh sách lệnh: {pn}\n• Xem trang cụ thể: {pn} <số_trang>\n• Tìm kiếm lệnh theo tên: {pn} <từ_khóa>\n• Xem các lệnh thịnh hành/top: {pn} top\n• Xem thông tin chi tiết: {pn} info <tên_lệnh>\n\n💡 Lưu ý: Phản hồi (reply) bằng số thứ tự trong danh sách để xem thông tin nhanh."
                }
        },

        langs: {
                en: {
                        notFound: "❌ | No \"%1\" commands found.",
                        notYourReply: "❌ | not your reply baby 🐸",
                        invalidSelection: "❌ | Invalid selection! Please enter a valid number.",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        notFound: "❌ | Không tìm thấy lệnh \"%1\".",
                        notYourReply: "❌ | Không phải phản hồi của bạn đâu cưng 🐸",
                        invalidSelection: "❌ | Lựa chọn không hợp lệ!",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, event, args, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        const baseURL = await baseApiUrl();

                        if (args[0]?.toLowerCase() === "info") {
                                const cmdName = args.slice(1).join(" ").trim();
                                if (!cmdName) {
                                        return api.sendMessage("❌ | Please provide a command name.\nExample: !cmds info baby", event.threadID, event.messageID);
                                }

                                const { data } = await axios.get(`${baseURL}/api/cmdstore/info?name=${encodeURIComponent(cmdName)}&source=info`);

                                if (!data.success) {
                                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                                        return api.sendMessage(getLang("notFound", cmdName), event.threadID, event.messageID);
                                }

                                api.setMessageReaction("🪽", event.messageID, () => {}, true);
                                return api.sendMessage(data.displayText, event.threadID, event.messageID);
                        }

                        let apiUrl = `${baseURL}/api/cmdstore`;
                        if (args[0]?.toLowerCase() === "top") {
                                apiUrl += `?type=top`;
                        } else {
                                const query = args.join(" ").trim();
                                if (query) {
                                        if (!isNaN(query)) apiUrl += `?page=${query}`;
                                        else apiUrl += `?q=${encodeURIComponent(query)}`;
                                }
                        }

                        const { data } = await axios.get(apiUrl);

                        if (!data.success || !data.commands.length) {
                                api.setMessageReaction("❌", event.messageID, () => {}, true);
                                return api.sendMessage(getLang("notFound", args[0] || "all"), event.threadID, event.messageID);
                        }

                        api.setMessageReaction("🪽", event.messageID, () => {}, true);
                        api.sendMessage(data.displayText, event.threadID, (err, info) => {
                                if (!err) {
                                        global.GoatBot.onReply.set(info.messageID, {
                                                commandName: this.config.name,
                                                messageID: info.messageID,
                                                author: event.senderID,
                                                page: data.page,
                                                commands: data.commands
                                        });
                                }
                        }, event.messageID);

                } catch (err) {
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
                }
        },

        onReply: async function ({ api, event, Reply, getLang }) {
                if (Reply.author !== event.senderID) {
                        return api.sendMessage(getLang("notYourReply"), event.threadID, event.messageID);
                }

                const index = parseInt(event.body);
                const list = Reply.commands;

                if (isNaN(index) || index < 1 || index > list.length) {
                        return api.sendMessage(getLang("invalidSelection"), event.threadID, event.messageID);
                }

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        const baseURL = await baseApiUrl();
                        const selected = list[index - 1];

                        if (!selected || !selected.name) {
                                return api.sendMessage(getLang("invalidSelection"), event.threadID, event.messageID);
                        }

                        const { data } = await axios.get(`${baseURL}/api/cmdstore/info?name=${encodeURIComponent(selected.name)}`);

                        if (!data.success) {
                                api.setMessageReaction("❌", event.messageID, () => {}, true);
                                return api.sendMessage(getLang("notFound", selected.name), event.threadID, event.messageID);
                        }

                        api.unsendMessage(Reply.messageID);
                        api.setMessageReaction("🪽", event.messageID, () => {}, true);

                        return api.sendMessage(data.displayText, event.threadID, event.messageID);

                } catch (err) {
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return api.sendMessage(getLang("error", err.message), event.threadID, event.messageID);
                }
        }
};
