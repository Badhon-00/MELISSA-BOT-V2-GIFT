const fs = require("fs-extra");
const { utils } = global;


const BOT_ADMIN_IDS = ["100028239582347", "61557409693409", "61571421696077"];

module.exports = {
	config: {
		name: "prefix",
		version: "4.0",
		author: "BADHON",
		countDown: 5,
		role: 0,
		description: "Change bot command prefix - Badhon access only",
		category: "system",
		guide: {
			en: "   {pn} <new prefix>: Change prefix for current chat\n   Example: {pn} !\n\n   {pn} <new prefix> -g: Change system-wide prefix (Badhon only)\n   Example: {pn} ! -g\n\n   {pn} reset: Reset to default prefix"
		}
	},

	langs: {
		en: {
			reset: "Prefix successfully reset to default: %1",
			onlyBadhon: "Only Badhon can change my prefix",
			confirmGlobal: "Please react to confirm changing prefix for all chats",
			confirmThisThread: "Please react to confirm changing prefix for this chat",
			successGlobal: "System prefix changed to: %1",
			successThisThread: "Chat prefix changed to: %1",
			myPrefix: `┌───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───
│
├➤ 𝗛𝗲𝘆 𝗦𝗲𝗻𝗽𝗮𝗶, 𝗵𝗲𝗿𝗲 𝗶𝘀 𝗠𝗲𝗹𝗶𝘀𝘀𝗮'𝘀 𝗽𝗿𝗲𝗳𝗶𝘅!
│
├───  𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗦𝘆𝘀𝘁𝗲𝗺 𝗣𝗿𝗲𝗳𝗶𝘅: %1
├ ➤ 𝗖𝗵𝗮𝘁 𝗣𝗿𝗲𝗳𝗶𝘅: %2
│
├───  𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗗𝗮𝘁𝗲: %3
├ ➤ 𝗗𝗮𝘆: %4
├ ➤ 𝗧𝗶𝗺𝗲: %5
├ ➤ 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: Bangladesh (Dhaka)
│
├───  𝗔𝗗𝗠𝗜𝗡 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗢𝘄𝗻𝗲𝗿: 𝗕𝗮𝗱𝗵𝗼𝗻
├ ➤ 𝗔𝗰𝗰𝗲𝘀𝘀: 𝗘𝘅𝗰𝗹𝘂𝘀𝗶𝘃𝗲
│
└───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───`,
			invalidPrefix: "Invalid prefix! Maximum 5 characters allowed",
			systemReset: "System prefix reset to default: %1"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		
		if (!BOT_ADMIN_IDS.includes(event.senderID)) {
			return message.reply(
`┌───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───
│
├➤ 𝗔𝗰𝗰𝗲𝘀𝘀 𝗗𝗲𝗻𝗶𝗲𝗱!
│
├───  𝗥𝗘𝗦𝗧𝗥𝗜𝗖𝗧𝗘𝗗  ───
├ ➤ Only my master Badhon can change my settings
├ ➤ This feature is specially reserved 
├ ➤ for my beloved owner
│
├───  𝗖𝗢𝗡𝗧𝗔𝗖𝗧  ───
├ ➤ Please contact Badhon if you need help
│
└───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───`
			);
		}

		if (!args[0])
			return message.SyntaxError();

		const now = new Date();
		const bangladeshTime = new Date(now.getTime() + (6 * 60 * 60 * 1000)); // UTC+6
		const date = bangladeshTime.toLocaleDateString('en-GB'); // DD/MM/YYYY
		const day = bangladeshTime.toLocaleDateString('en-US', { weekday: 'long' });
		const time = bangladeshTime.toLocaleTimeString('en-US', { 
			hour: '2-digit', 
			minute: '2-digit',
			hour12: true 
		});

		if (args[0] === 'reset') {
			if (args[1] === "-g") {
				global.GoatBot.config.prefix = global.GoatBot.config.defaultPrefix || "!";
				fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
				return message.reply(
`┌───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───
│
├➤ 𝗣𝗿𝗲𝗳𝗶𝘅 𝗥𝗲𝘀𝗲𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹
│
├───  𝗦𝗬𝗦𝗧𝗘𝗠 𝗥𝗘𝗦𝗘𝗧  ───
├ ➤ ${getLang("systemReset", global.GoatBot.config.prefix)}
│
├───  𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗗𝗮𝘁𝗲: ${date}
├ ➤ 𝗗𝗮𝘆: ${day}
├ ➤ 𝗧𝗶𝗺𝗲: ${time}
├ ➤ 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: Bangladesh (Dhaka)
│
├───  𝗔𝗗𝗠𝗜𝗡 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗔𝗰𝘁𝗶𝗼𝗻 𝗯𝘆: 𝗕𝗮𝗱𝗵𝗼𝗻
├ ➤ 𝗧𝘆𝗽𝗲: System Reset
│
└───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───`
				);
			}
			
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(
`┌───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───
│
├➤ 𝗣𝗿𝗲𝗳𝗶𝘅 𝗥𝗲𝘀𝗲𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹
│
├───  𝗖𝗛𝗔𝗧 𝗥𝗘𝗦𝗘𝗧  ───
├ ➤ ${getLang("reset", global.GoatBot.config.prefix)}
│
├───  𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗗𝗮𝘁𝗲: ${date}
├ ➤ 𝗗𝗮𝘆: ${day}
├ ➤ 𝗧𝗶𝗺𝗲: ${time}
├ ➤ 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: Bangladesh (Dhaka)
│
├───  𝗔𝗗𝗠𝗜𝗡 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗔𝗰𝘁𝗶𝗼𝗻 𝗯𝘆: 𝗕𝗮𝗱𝗵𝗼𝗻
├ ➤ 𝗧𝘆𝗽𝗲: Chat Reset
│
└───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───`
			);
		}

		const newPrefix = args[0];
		

		if (newPrefix.length > 5) {
			return message.reply(
`┌───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───
│
├➤ 𝗢𝗵 𝗻𝗼! 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗣𝗿𝗲𝗳𝗶𝘅
│
├───  𝗘𝗥𝗥𝗢𝗥  ───
├ ➤ ${getLang("invalidPrefix")}
│
├───  𝗧𝗜𝗠𝗘  ───
├ ➤ 𝗗𝗮𝘁𝗲: ${date}
├ ➤ 𝗧𝗶𝗺𝗲: ${time}
│
└───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───`
			);
		}

		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g") {
			formSet.setGlobal = true;
		} else {
			formSet.setGlobal = false;
		}

		const confirmMessage = args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread");
		
		return message.reply(
`┌───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───
│
├➤ 𝗣𝗿𝗲𝗳𝗶𝘅 𝗖𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘁𝗶𝗼𝗻
│
├───  𝗖𝗢𝗡𝗙𝗜𝗥𝗠  ───
├ ➤ ${confirmMessage}
│
├───  𝗡𝗘𝗪 𝗣𝗥𝗘𝗙𝗜𝗫  ───
├ ➤ 「 ${newPrefix} 」
│
├───  𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗗𝗮𝘁𝗲: ${date}
├ ➤ 𝗗𝗮𝘆: ${day}
├ ➤ 𝗧𝗶𝗺𝗲: ${time}
├ ➤ 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: Bangladesh (Dhaka)
│
├───  𝗔𝗗𝗠𝗜𝗡  ───
├ ➤ 𝗔𝗰𝘁𝗶𝗼𝗻 𝗯𝘆: 𝗕𝗮𝗱𝗵𝗼𝗻
│
├───  𝗔𝗖𝗧𝗜𝗢𝗡  ───
├ ➤ 𝗥𝗲𝗮𝗰𝘁 𝘁𝗼 𝘁𝗵𝗶𝘀 𝗺𝗲𝘀𝘀𝗮𝗴𝗲 𝘁𝗼 𝗰𝗼𝗻𝗳𝗶𝗿𝗺
│
└───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───`
		, (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		

		if (!BOT_ADMIN_IDS.includes(event.userID)) {
			return;
		}
		
		const now = new Date();
		const bangladeshTime = new Date(now.getTime() + (6 * 60 * 60 * 1000)); // UTC+6
		const date = bangladeshTime.toLocaleDateString('en-GB'); // DD/MM/YYYY
		const day = bangladeshTime.toLocaleDateString('en-US', { weekday: 'long' });
		const time = bangladeshTime.toLocaleTimeString('en-US', { 
			hour: '2-digit', 
			minute: '2-digit',
			hour12: true 
		});

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(
`┌───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───
│
├➤ 𝗬𝗮𝘆! 𝗣𝗿𝗲𝗳𝗶𝘅 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆
│
├───  𝗦𝗬𝗦𝗧𝗘𝗠  ───
├ ➤ ${getLang("successGlobal", newPrefix)}
│
├───  𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗗𝗮𝘁𝗲: ${date}
├ ➤ 𝗗𝗮𝘆: ${day}
├ ➤ 𝗧𝗶𝗺𝗲: ${time}
├ ➤ 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: Bangladesh (Dhaka)
│
├───  𝗔𝗗𝗠𝗜𝗡 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗔𝗰𝘁𝗶𝗼𝗻 𝗯𝘆: 𝗕𝗮𝗱𝗵𝗼𝗻
├ ➤ 𝗧𝘆𝗽𝗲: System Update
│
└───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───`
			);
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(
`┌───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───
│
├➤ 𝗬𝗮𝘆! 𝗣𝗿𝗲𝗳𝗶𝘅 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆
│
├───  𝗖𝗛𝗔𝗧  ───
├ ➤ ${getLang("successThisThread", newPrefix)}
│
├───  𝗧𝗜𝗠𝗘 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗗𝗮𝘁𝗲: ${date}
├ ➤ 𝗗𝗮𝘆: ${day}
├ ➤ 𝗧𝗶𝗺𝗲: ${time}
├ ➤ 𝗧𝗶𝗺𝗲𝘇𝗼𝗻𝗲: Bangladesh (Dhaka)
│
├───  𝗔𝗗𝗠𝗜𝗡 𝗜𝗡𝗙𝗢  ───
├ ➤ 𝗔𝗰𝘁𝗶𝗼𝗻 𝗯𝘆: 𝗕𝗮𝗱𝗵𝗼𝗻
├ ➤ 𝗧𝘆𝗽𝗲: Chat Update
│
└───  🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀  ───`
			);
		}
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const now = new Date();
			const bangladeshTime = new Date(now.getTime() + (6 * 60 * 60 * 1000)); 
			const date = bangladeshTime.toLocaleDateString('en-GB'); 
			const day = bangladeshTime.toLocaleDateString('en-US', { weekday: 'long' });
			const time = bangladeshTime.toLocaleTimeString('en-US', { 
				hour: '2-digit', 
				minute: '2-digit',
				hour12: true 
			});
			
			return message.reply(getLang("myPrefix", 
				global.GoatBot.config.prefix, 
				utils.getPrefix(event.threadID),
				date,
				day,
				`${time} (Bangladesh)`
			));
		}
	}
};
