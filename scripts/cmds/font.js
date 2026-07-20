const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "font",
                aliases: ["style"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "আপনার টেক্সটকে বিভিন্ন স্টাইলিশ ফন্টে রূপান্তর করুন",
                        en: "Convert your text into various stylish fonts",
                        vi: "Chuyển đổi văn bản của bạn thành nhiều phông chữ phong cách khác nhau"
                },
                category: "general",
                guide: {
                        bn: '   {pn} <নাম্বার> <টেক্সট>: স্টাইলিশ টেক্সট পান'
                                + '\n   {pn} list: সব ফন্ট লিস্ট দেখুন',
                        en: '   {pn} <number> <text>: Get stylish text'
                                + '\n   {pn} list: See all font styles',
                        vi: '   {pn} <số> <văn bản>: Nhận văn bản phong cách'
                                + '\n   {pn} list: Xem tất cả danh sách phông chữ'
                }
        },

        langs: {
                bn: {
                        noList: "× কোনো ফন্ট স্টাইল খুঁজে পাওয়া যায়নি।",
                        invalid: "× ভুল ফরম্যাট! সঠিক নিয়ম: {pn} <নাম্বার> <টেক্সট>",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।\n•WhatsApp: 01836298139"
                },
                en: {
                        noList: "× No font styles found.",
                        invalid: "× Invalid usage! Format: {pn} <number> <text>",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139"
                },
                vi: {
                        noList: "× Không tìm thấy kiểu phông chữ nào.",
                        invalid: "× Sử dụng sai! Định dạng: {pn} <số> <văn bản>",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ.\n•WhatsApp: 01836298139"
                }
        },

        onStart: async function ({ api, message, args, event, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                try {
                        const apiUrl = await mahmud();

                        if (args[0] === "list") {
                                const res = await axios.get(`${apiUrl}/api/font/list`);
                                const fontList = res.data.replace("Available Font Styles:", "").trim();
                                return fontList ? message.reply(`🎀 Available Font Styles:\n${fontList}`) : message.reply(getLang("noList"));
                        }

                        const [number, ...textParts] = args;
                        const text = textParts.join(" ");

                        if (!text || isNaN(number)) return message.reply(getLang("invalid"));

                        const { data: { data: fontData } } = await axios.post(`${apiUrl}/api/font`, { number, text });
                        const fontStyle = fontData[number];
                        
                        if (!fontStyle) return message.reply(getLang("noList"));

                        const convertedText = text.split("").map(char => fontStyle[char] || char).join("");
                        return message.reply(convertedText);

                } catch (err) {
                        console.error("Font Style Error:", err);
                        return message.reply(getLang("error", err.message));
                }
        }
};
