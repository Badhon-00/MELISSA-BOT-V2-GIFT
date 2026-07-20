const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "github",
                aliases: ["git"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                description: {
                        bn: "গিটহাব ইউজারের তথ্য দেখুন",
                        en: "View GitHub user information",
                        vi: "Xem thông tin người dùng GitHub"
                },
                category: "github",
                guide: {
                        bn: '   {pn} <ইউজারনেম>: গিটহাব ইউজারনেম লিখুন',
                        en: '   {pn} <username>: Type GitHub username',
                        vi: '   {pn} <username>: Nhập tên người dùng GitHub'
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, একটি গিটহাব ইউজারনেম তো দাও!\n\nউদাহরণ: {pn} Mahmudx7",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD|\n•WhatsApp: 01836298139",
                        info: `>🎀 ইউজার গিটহাব তথ্য
• নাম: %1
• ইউজারনেম: %2
• আইডি: %3
• টাইপ: %4
• ভেরিফাইড: %5
• বায়ো: %6
• প্রিয় ভাষা: %7

👥 ফলোয়ার
• ফলোয়ার: %8
• ফলোয়িং: %9

📧 কন্টাক্ট
• ইমেইল: %10
• লোকেশন: %11
• ওয়েবসাইট: %12

📦 রিপোজিটরি তথ্য
• পাবলিক রিপো: %13
• টোটাল ফর্ক: %14
• টোটাল স্টার: %15
• কোড সাইজ: %16 MB

🔗 টপ রিপোজিটরি
• নাম: %17
• স্টার: %18 | ফর্ক: %19
• লিঙ্ক: %20

📅 জয়েন ও আপডেট
• জয়েনিং: %21
• একাউন্ট বয়স: %22 বছর
• লাস্ট প্রোফাইল আপডেট: %23`
                },
                en: {
                        noInput: "× Baby, please provide a GitHub username!\n\nExample: {pn} Mahmudx7",
                        error: "× API error: %1. Contact MahMUD for help.\n•WhatsApp: 01836298139",
                        info: `>🎀 USER GITHUB INFO
• Name: %1
• Username: %2
• ID: %3
• Type: %4
• Verified: %5
• Bio: %6
• Top Language: %7

👥 AUDIENCE 
• Followers: %8
• Following: %9

📧 CONTACT 
• Public Email: %10
• Location: %11
• Website: %12

📦 REPOSITORY STATS 
• Public Repos: %13
• Total Forks: %14
• Total Stars: %15
• Code Size: %16 MB

🔗 TOP REPOSITORY
• Repo Name: %17
• Star: %18 | Fork: %19
• Repo Link: %20

📅 TIMELINE 
• Joined: %21
• Account Age: %22 years
• Last Profile Update: %23`
                },
                vi: {
                        noInput: "× Cưng ơi, vui lòng cung cấp tên người dùng GitHub!\n\nVí dụ: {pn} Mahmudx7",
                        error: "× Lỗi: %1. Liên hệ MahMUD để hỗ trợ.\n•WhatsApp: 01836298139",
                        info: `>🎀 THÔNG TIN GITHUB
• Tên: %1
• Tên người dùng: %2
• ID: %3
• Loại: %4
• Xác minh: %5
• Tiểu sử: %6
• Ngôn ngữ: %7

👥 NGƯỜI THEO DÕI
• Người theo dõi: %8
• Đang theo dõi: %9

📧 LIÊN HỆ
• Email: %10
• Vị trí: %11
• Trang web: %12

📦 KHO LƯU TRỮ
• Repos công khai: %13
• Tổng số Fork: %14
• Tổng số Sao: %15
• Kích thước mã: %16 MB

🔗 KHO LƯU TRỮ HÀNG ĐẦU
• Tên: %17
• Sao: %18 | Fork: %19
• Liên kết: %20

📅 THỜI GIAN
• Tham gia: %21
• Tuổi tài khoản: %22 năm
• Cập nhật lần cuối: %23`
                }
        },

        onStart: async function ({ api, event, args, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                const username = args[0];
                if (!username) return api.sendMessage(getLang("noInput"), event.threadID, event.messageID);

                try {
                        api.setMessageReaction("⏳", event.messageID, () => {}, true);
                        
                        const apiUrl = await baseApiUrl();
                        const res = await axios.get(`${apiUrl}/api/github?user=${encodeURIComponent(username)}`);
                        const d = res.data.data;

                        const infoText = getLang("info", 
                                d.profile.name || "N/A", d.profile.username, d.profile.id, d.profile.type,
                                d.profile.is_staff ? "GitHub Staff" : "No", d.profile.bio || "N/A", d.stats.favorite_language,
                                d.stats.followers, d.stats.following,
                                d.contact.email || "Not Found", d.contact.location || "N/A", d.contact.website || "N/A",
                                d.stats.public_repos, d.stats.total_forks, d.stats.total_stars, d.stats.code_size_mb,
                                d.highlights.top_repo ? d.highlights.top_repo.name : "N/A",
                                d.highlights.top_repo ? d.highlights.top_repo.stars : "0",
                                d.highlights.top_repo ? d.highlights.top_repo.forks : "0",
                                d.highlights.top_repo ? d.highlights.top_repo.url : "N/A",
                                new Date(d.meta.joined_at).toDateString(), d.meta.account_age_years, new Date(d.meta.updated_at).toDateString()
                        );

                        api.setMessageReaction("✅", event.messageID, () => {}, true);

                        return api.sendMessage({
                                body: infoText,
                                attachment: await global.utils.getStreamFromURL(d.profile.avatar)
                        }, event.threadID, event.messageID);

                } catch (err) {
                        console.error("Github Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        const errorMsg = err.response?.data?.error || err.message;
                        return api.sendMessage(getLang("error", errorMsg), event.threadID, event.messageID);
                }
        }
};
