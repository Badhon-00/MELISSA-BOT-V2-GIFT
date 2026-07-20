const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "birthday",
        aliases: ["bdy"],
        version: "1.0",
        author: "RUBISH",
        countDown: 5,
        role: 0,
        shortDescription: "Wish your friend ",
        longDescription: "",
        category: "👥 | Member",
        guide: {
            vi: "{pn} [@tag someone]",
            en: "{pn} [@tag someone]"
        }
    },

    onStart: async function ({ message, args, api, event }) {
        const mention = event.mentions;
        if (!mention) return message.reply("⚠️ | please mention someone");

        const mentionedUserId = Object.keys(mention)[0];

        try {
            const mentionedUser = await api.getUserInfo(mentionedUserId);

            if (mentionedUser && mentionedUser[mentionedUserId]) {
                const userName = mentionedUser[mentionedUserId].name;
                const currentDate = moment().tz("Asia/Dhaka").format("YYYY-MM-DD");
                const currentTime = moment().tz("Asia/Dhaka").format("hh:mm:ss A");

                bal(mentionedUserId).then(ptth => {
                    message.reply({
                        body: `
┏┓｡･ﾟﾟ･｡｡ﾟ♡🎈🎈
┃┗┛ 𝐚𝐩𝐩𝐲•°•♡🎁
┃┏┓┃　.  𝐛𝐢𝐫𝐭𝐡𝐝𝐚𝐲 🧁🍰
┗┛┗┛　

╔╦══••✠•❀❀•✠••══╦╗
           ${userName}
╚╩══••✠•❀❀•✠••══╩╝

- 𝚃𝚑𝚒𝚜 𝚑𝚊𝚙𝚙𝚢 𝚋𝚒𝚛𝚝𝚑𝚍𝚊𝚢 𝚂𝚝𝚊𝚝𝚞𝚜 𝚒𝚜 𝚜𝚑𝚘𝚛𝚝 𝙱𝚞𝚝 𝚠𝚒𝚜𝚑𝚒𝚗𝚐 𝚢𝚘𝚞 𝚎𝚟𝚎𝚛𝚢𝚝𝚑𝚒𝚗𝚐 𝚝𝚑𝚊𝚝 𝚋𝚛𝚒𝚗𝚐𝚜 𝚢𝚘𝚞 𝚑𝚊𝚟𝚙𝚒𝚗𝚎𝚜𝚜 𝚝𝚘𝚍𝚊𝚢 𝚊𝚗𝚍 𝚊𝚕𝚜𝚘 𝚠𝚊𝚢𝚜... 🍩🎉🎁

- 𝙤𝙣𝙘𝙚 𝙖𝙜𝙖𝙞𝙣 𝙝𝙖𝙥𝙥𝙮 𝙗𝙞𝙧𝙩𝙝𝙙𝙖𝙮 𝙩𝙤 𝙮𝙤𝙪 ${userName}🎂🎀🌹

- 𝙼𝚊𝚗𝚢 𝙼𝚊𝚗𝚢 𝙷𝚊𝚙𝚙𝚢 𝚁𝚎𝚝𝚞𝚛𝚗𝚜 𝙾𝚏 𝚃𝚑𝚎 𝙳𝚊𝚢🥰

- 𝙃𝙖𝙥𝙥𝙮 𝙗𝙞𝙧𝙩𝙝𝙙𝙖𝙮 𝙩𝙤 𝙮𝙤𝙪 𝘿𝙚𝙖𝙧 ${userName}🖤

  🌹❤ 𝙻𝚘𝚟𝚎 𝚞 𝚊𝚕𝚠𝚊𝚢𝚜 ❤🌹

- 𝐞𝐯𝐞𝐫𝐲 𝐝𝐚𝐲 𝐢𝐬 𝐬𝐩𝐞𝐜𝐢𝐚𝐥

    - 𝙃𝙖𝙥𝙥𝙮 𝙗𝙞𝙧𝙩𝙝𝙙𝙖𝙮 𝙩𝙤 𝙮𝙤𝙪.!

  🌹${userName}🌹

- Date ⇏ ${currentDate} 

- Time ⇏ ${currentTime}
`,
                        attachment: fs.createReadStream(ptth)
                    });
                });
            } else {
                message.reply("⚠️ | please mention someone");
            }
        } catch (error) {
            console.error("Error fetching user information:", error);
            message.reply("Error fetching user information.");
        }
    }
};

async function bal(mentionedUserId) {
    let avMentionedUser = await jimp.read(`https://graph.facebook.com/${mentionedUserId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avMentionedUser.circle();
    let pth = `${__dirname}/tmp/wish.jpg`;
    let img = await jimp.read("https://i.ibb.co/9cYzw3J/Hpbd-name-1655b9480a850c.jpg");
    img.resize(1000, 667).composite(avMentionedUser.resize(320, 320), 346, 82);

    await img.writeAsync(pth);
    return pth;
        }
