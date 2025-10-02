const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "✨ 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 ✨";
const activeHelpMessages = new Map();

module.exports = {
	config: {
		name: "help",
		version: "1.21",
		author: "Badhon",
		countDown: 5,
		role: 0,
		description: {
			en: "View command usage and information"
		},
		category: "info",
		guide: {
			en: "{pn} [empty | <page number> | <command name>]"
		},
		priority: 1
	},

	langs: {
		en: {
			help: "╭──  🌸 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 🌸  ──╮\n│\n%1\n│\n├ ➤ 📄 Page [ %2/%3 ]\n├ ➤ 📊 Total Commands: %4\n├ ➤ 🔮 Prefix: %5\n│\n╰───  ✨ 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 ✨  ───╯",
			help2: "╭──  🌸 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 🌸  ──╮\n│\n%1\n│\n├ ➤ 📊 Total Commands: %2\n├ ➤ 🔮 Prefix: %3\n│\n╰───  ✨ 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 ✨  ───╯",
			commandNotFound: "❌ Command \"%1\" does not exist",
			getInfoCommand: "╭───  🔍 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 🔍  ───╮\n│\n├ 🌸 Name: %1\n├ 📖 Description: %2\n├ 🏷 Aliases: %3\n├ 🎯 Group Aliases: %4\n├ 🔢 Version: %5\n├ ⚡ Role: %6\n├ ⏰ Cooldown: %7s\n├ 👑 Author: %8\n│\n├ 💫 Usage:\n│%9\n│\n├ 🔤 All Available Names:\n│%10\n│\n├ 📌 Notes:\n├ • Content inside < > can be changed\n├ • Content inside [a|b|c] is a or b or c\n╰───  ✨ 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 ✨  ───╯",
			onlyInfo: "╭───  🔍 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 🔍  ───╮\n│\n├ 🌸 Name: %1\n├ 📖 Description: %2\n├ 🏷 Aliases: %3\n├ 🎯 Group Aliases: %4\n├ 🔢 Version: %5\n├ ⚡ Role: %6\n├ ⏰ Cooldown: %7s\n├ 👑 Author: %8\n│\n├ 🔤 All Available Names:\n│%9\n╰───  ✨ 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 ✨  ───╯",
			onlyUsage: "╭───  💫 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗨𝗦𝗔𝗚𝗘 💫  ───╮\n│\n│%1\n╰───  ✨ 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 ✨  ───╯",
			onlyAlias: "╭───  🏷 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗔𝗟𝗜𝗔𝗦𝗘𝗦 🏷  ───╮\n│\n├ 🌍 Global Aliases: %1\n├ 🎯 Group Aliases: %2\n├ 🔤 All Available Names:\n│%3\n╰───  ✨ 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 ✨  ───╯",
			onlyRole: "╭───  ⚡ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗥𝗢𝗟𝗘 ⚡  ───╮\n│\n│%1\n╰───  ✨ 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 ✨  ───╯",
			doNotHave: "🚫 None",
			roleText0: "👥 0 (All users)",
			roleText1: "🛡 1 (Group administrators)",
			roleText2: "👑 2 (Admin bot)",
			roleText0setRole: "👥 0 (set role, all users)",
			roleText1setRole: "🛡 1 (set role, group administrators)",
			pageNotFound: "❌ Page %1 does not exist",
			navigation: "├ ➤ 🔄 Type %1help <page> to navigate\n├ ➤ 🔍 Type %1help <cmd> for command details\n├ ➤ ⏳ Message auto-deletes in 1 minute",
			categoryTitle: "├───  📋 %1  ───"
		}
	},

	onStart: async function ({ message, args, event, threadsData, getLang, role, globalData }) {
		const langCode = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
		let customLang = {};
		const pathCustomLang = path.normalize(`${process.cwd()}/languages/cmds/${langCode}.js`);
		if (fs.existsSync(pathCustomLang))
			customLang = require(pathCustomLang);

		const { threadID, messageID } = event;
		const threadData = await threadsData.get(threadID);
		const prefix = getPrefix(threadID);
		
		
		if (activeHelpMessages.has(threadID)) {
			const previousMessage = activeHelpMessages.get(threadID);
			try {
				await message.unsend(previousMessage.messageID);
			} catch (e) {}
			clearTimeout(previousMessage.timeout);
			activeHelpMessages.delete(threadID);
		}

		let sortHelp = threadData.settings.sortHelp || "category";
		if (!["category", "name"].includes(sortHelp))
			sortHelp = "category";
		
		const commandName = (args[0] || "").toLowerCase();
		let command = commands.get(commandName) || commands.get(aliases.get(commandName));
		const aliasesData = threadData.data.aliases || {};
		
		if (!command) {
			for (const cmdName in aliasesData) {
				if (aliasesData[cmdName].includes(commandName)) {
					command = commands.get(cmdName);
					break;
				}
			}
		}

		
		if (!command) {
			const globalAliasesData = await globalData.get('setalias', 'data', []);
			for (const item of globalAliasesData) {
				if (item.aliases.includes(commandName)) {
					command = commands.get(item.commandName);
					break;
				}
			}
		}

		if (!command && !args[0] || !isNaN(args[0])) {
			const arrayInfo = [];
			let msg = "";
			
			if (sortHelp == "category") {
				const categoryMap = new Map();
				
				
				for (const [name, cmd] of commands) {
					if (cmd.config.role > 1 && role < cmd.config.role)
						continue;
					
					const category = cmd.config.category?.toLowerCase() || "uncategorized";
					if (!categoryMap.has(category)) {
						categoryMap.set(category, []);
					}
					categoryMap.get(category).push(name);
				}

				const sortedCategories = Array.from(categoryMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
				
				const page = parseInt(args[0]) || 1;
				const numberOfOnePage = 5; 
				const { allPage, totalPage } = global.utils.splitPage(sortedCategories, numberOfOnePage);
				
				if (page < 1 || page > totalPage)
					return message.reply(getLang("pageNotFound", page));

				const currentPage = allPage[page - 1] || [];
	
				currentPage.forEach(([category, cmdNames], categoryIndex) => {
			
					const categoryTitle = getLang("categoryTitle", `𝗕𝗢𝗟𝗗 ${category.toUpperCase()}`).replace('𝗕𝗢𝗟𝗗', '');
					msg += `${categoryTitle}\n`;
					
					cmdNames.sort().forEach((cmdName, index) => {
						msg += `├ ➤ ${cmdName}\n`;
					});
					
					msg += "│\n";
				});

				const helpMessage = await message.reply(getLang("help", msg, page, totalPage, commands.size, prefix, getLang("navigation", prefix)));
				
				const timeout = setTimeout(async () => {
					try {
						await message.unsend(helpMessage.messageID);
						activeHelpMessages.delete(threadID);
					} catch (e) {}
				}, 60000);

				activeHelpMessages.set(threadID, {
					messageID: helpMessage.messageID,
					timeout: timeout
				});
			}
			else if (sortHelp == "name") {
				const page = parseInt(args[0]) || 1;
				const numberOfOnePage = 20; 
				const commandArray = [];
				
				for (const [name, value] of commands) {
					if (value.config.role > 1 && role < value.config.role)
						continue;
					
					commandArray.push({
						data: name,
						priority: value.priority || 0
					});
				}

				commandArray.sort((a, b) => a.data.localeCompare(b.data));
				commandArray.sort((a, b) => a.priority > b.priority ? -1 : 1);
				
				const { allPage, totalPage } = global.utils.splitPage(commandArray, numberOfOnePage);
				if (page < 1 || page > totalPage)
					return message.reply(getLang("pageNotFound", page));

				const returnArray = allPage[page - 1] || [];
				const startNumber = (page - 1) * numberOfOnePage + 1;
				
				msg += (returnArray || []).reduce((text, item, index) => {
					const commandNumber = index + startNumber;
					return text + `├➤ ${commandNumber}. ${item.data}\n`;
				}, '');

				const helpMessage = await message.reply(getLang("help", msg, page, totalPage, commands.size, prefix, getLang("navigation", prefix)));
				
				const timeout = setTimeout(async () => {
					try {
						await message.unsend(helpMessage.messageID);
						activeHelpMessages.delete(threadID);
					} catch (e) {}
				}, 60000);

				activeHelpMessages.set(threadID, {
					messageID: helpMessage.messageID,
					timeout: timeout
				});
			}
		}
		else if (!command && args[0]) {
			return message.reply(getLang("commandNotFound", args[0]));
		}
		else {
			
			const formSendMessage = {};
			const configCommand = command.config;

			let guide = configCommand.guide?.[langCode] || configCommand.guide?.["en"];
			if (guide == undefined)
				guide = customLang[configCommand.name]?.guide?.[langCode] || customLang[configCommand.name]?.guide?.["en"];

			guide = guide || { body: "" };
			if (typeof guide == "string")
				guide = { body: guide };
				
			const guideBody = guide.body
				.replace(/\{prefix\}|\{p\}/g, prefix)
				.replace(/\{name\}|\{n\}/g, configCommand.name)
				.replace(/\{pn\}/g, prefix + configCommand.name);

			const aliasesString = configCommand.aliases ? configCommand.aliases.join(", ") : getLang("doNotHave");
			const aliasesThisGroup = threadData.data.aliases ? (threadData.data.aliases[configCommand.name] || []).join(", ") : getLang("doNotHave");

			const allNames = new Set();
			allNames.add(configCommand.name);
			
			if (configCommand.aliases) {
				configCommand.aliases.forEach(alias => allNames.add(alias));
			}
			
			if (threadData.data.aliases && threadData.data.aliases[configCommand.name]) {
				threadData.data.aliases[configCommand.name].forEach(alias => allNames.add(alias));
			}
			
			const globalAliasesData = await globalData.get('setalias', 'data', []);
			for (const item of globalAliasesData) {
				if (item.commandName === configCommand.name) {
					item.aliases.forEach(alias => allNames.add(alias));
				}
			}
			
			const allNamesString = Array.from(allNames).sort().join(', ');

			let roleOfCommand = configCommand.role;
			let roleIsSet = false;
			if (threadData.data.setRole?.[configCommand.name]) {
				roleOfCommand = threadData.data.setRole[configCommand.name];
				roleIsSet = true;
			}

			const roleText = roleOfCommand == 0 ?
				(roleIsSet ? getLang("roleText0setRole") : getLang("roleText0")) :
				roleOfCommand == 1 ?
					(roleIsSet ? getLang("roleText1setRole") : getLang("roleText1")) :
					getLang("roleText2");

			const author = configCommand.author;
			const descriptionCustomLang = customLang[configCommand.name]?.description;
			let description = checkLangObject(configCommand.description, langCode);
			if (description == undefined)
				if (descriptionCustomLang != undefined)
					description = checkLangObject(descriptionCustomLang, langCode);
				else
					description = getLang("doNotHave");

			let sendWithAttachment = false;

			// ALWAYS show full command info when command name is provided
			formSendMessage.body = getLang(
				"getInfoCommand",
				configCommand.name,
				description,
				aliasesString,
				aliasesThisGroup,
				configCommand.version,
				roleText,
				configCommand.countDown || 1,
				author || "",
				guideBody.split("\n").join("\n│ "),
				allNamesString.split(', ').join('\n│ ')
			);
			sendWithAttachment = true;

			if (sendWithAttachment && guide.attachment) {
				if (typeof guide.attachment == "object" && !Array.isArray(guide.attachment)) {
					const promises = [];
					formSendMessage.attachment = [];

					for (const keyPathFile in guide.attachment) {
						const pathFile = path.normalize(keyPathFile);

						if (!fs.existsSync(pathFile)) {
							const cutDirPath = path.dirname(pathFile).split(path.sep);
							for (let i = 0; i < cutDirPath.length; i++) {
								const pathCheck = `${cutDirPath.slice(0, i + 1).join(path.sep)}${path.sep}`;
								if (!fs.existsSync(pathCheck))
									fs.mkdirSync(pathCheck);
							}
							const getFilePromise = axios.get(guide.attachment[keyPathFile], { responseType: 'arraybuffer' })
								.then(response => {
									fs.writeFileSync(pathFile, Buffer.from(response.data));
								});

							promises.push({
								pathFile,
								getFilePromise
							});
						}
						else {
							promises.push({
								pathFile,
								getFilePromise: Promise.resolve()
							});
						}
					}

					await Promise.all(promises.map(item => item.getFilePromise));
					for (const item of promises)
						formSendMessage.attachment.push(fs.createReadStream(item.pathFile));
				}
			}

			const helpMessage = await message.reply(formSendMessage);
			
			const timeout = setTimeout(async () => {
				try {
					await message.unsend(helpMessage.messageID);
					activeHelpMessages.delete(threadID);
				} catch (e) {}
			}, 60000);

			activeHelpMessages.set(threadID, {
				messageID: helpMessage.messageID,
				timeout: timeout
			});
		}
	}
};

function checkLangObject(data, langCode) {
	if (typeof data == "string")
		return data;
	if (typeof data == "object" && !Array.isArray(data))
		return data[langCode] || data.en || undefined;
	return undefined;
}

function cropContent(content, max) {
	if (content.length > max) {
		content = content.slice(0, max - 3);
		content = content + "...";
	}
	return content;
				}
