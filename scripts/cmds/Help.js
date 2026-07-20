const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const axios = require("axios");

const videoUrl = "https://drive.google.com/uc?export=download&id=1e0QVVWacAv65KXEt6OYMbAAK7anWabsK";

const lastHelpMessage = new Map();

module.exports = {
	config: {
		name: "help",
		version: "1.8",
		author: "badhon",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "View command usage and list all commands"
		},
		longDescription: {
			en: "View command usage and list all commands directly"
		},
		category: "info",
		guide: {
			en: "{pn} [command name]"
		},
		priority: 1,
	},

	onStart: async function ({ message, args, event, threadsData, role }) {
		const { threadID } = event;
		const prefix = getPrefix(threadID);

		const previous = lastHelpMessage.get(threadID);
		if (previous) {
			try {
				await message.unsend(previous);
			} catch (error) {
				console.error("Help Error:", error);
			}
			lastHelpMessage.delete(threadID);
		}

		let attachment;
		try {
			const response = await axios.get(videoUrl, { responseType: "stream" });
			attachment = response.data;
		} catch (error) {
			console.error("Help Video Error:", error);
		}

		if (args.length === 0) {
			const categories = {};
			let msg = "";

			for (const [name, value] of commands) {
				if (value.config.role > 0 && role < value.config.role) continue;

				const category = value.config.category || "Uncategorized";
				categories[category] = categories[category] || { commands: [] };
				if (!categories[category].commands.includes(name)) {
					categories[category].commands.push(name);
				}
			}

			Object.keys(categories).sort().forEach((category) => {
				msg += `\n╭─────⭓ ${category.toUpperCase()}`;
				const names = categories[category].commands.sort();
				for (let i = 0; i < names.length; i += 3) {
					const cmds = names.slice(i, i + 3).map((item) => `✧${item}`);
					msg += `\n│ ${cmds.join("  ")}`;
				}
				msg += `\n╰────────────⭓\n`;
			});

			const totalCommands = commands.size;
			const helpHint = `Type ${prefix}help <cmd> to see details.`;

			msg += `\n\n⭔ Total Commands: ${totalCommands}\n⭔ ${helpHint}\n`;
			msg += `\n╭─✦ ADMIN: MEHEDI-BOSS\n├‣ WHATSAPP\n╰‣ `;

			try {
				const body = { body: msg };
				if (attachment) body.attachment = attachment;
				const hh = await message.reply(body);
				lastHelpMessage.set(threadID, hh.messageID);
				setTimeout(() => {
					message.unsend(hh.messageID);
					if (lastHelpMessage.get(threadID) === hh.messageID) {
						lastHelpMessage.delete(threadID);
					}
				}, 60000);
			} catch (error) {
				console.error("Help Error:", error);
			}

		} else {
			const commandName = args[0].toLowerCase();
			const command = commands.get(commandName) || commands.get(aliases.get(commandName));

			if (!command) {
				return message.reply(`❌ | Command "${commandName}" not found.`);
			}

			const config = command.config;
			const roleText = roleTextToString(config.role);

			const desc = config.description?.en || config.longDescription?.en || "No description";
			const guideBody = config.guide?.en || "";

			const usage = guideBody
				.replace(/{pn}/g, prefix + config.name)
				.replace(/{p}/g, prefix)
				.replace(/{n}/g, config.name);

			const responseText = `╭─────────⭓\n` +
				`│ 🎀 NAME: ${config.name}\n` +
				`│ 📃 Aliases: ${config.aliases ? config.aliases.join(", ") : "None"}\n` +
				`├──‣ INFO\n` +
				`│ 📝 Description: ${desc}\n` +
				`│ 👑 Author: ${config.author || "Unknown"}\n` +
				`│ 📚 Guide: ${usage || prefix + config.name}\n` +
				`├──‣ Details\n` +
				`│ ⭐ Version: ${config.version || "1.0"}\n` +
				`│ ♻️ Role: ${roleText}\n` +
				`╰────────────⭓`;

			const body = { body: responseText };
			if (attachment) body.attachment = attachment;
			const helpMessage = await message.reply(body);
			lastHelpMessage.set(threadID, helpMessage.messageID);
			setTimeout(() => {
				message.unsend(helpMessage.messageID);
				if (lastHelpMessage.get(threadID) === helpMessage.messageID) {
					lastHelpMessage.delete(threadID);
				}
			}, 60000);
		}
	}
};

function roleTextToString(role) {
	const roles = ["All users", "Group Admin", "Bot Admin", "Developer", "VIP User", "NSFW User"];
	if (role >= 0 && role <= 5) {
		return `${role} (${roles[role]})`;
	}
	return `${role} (Unknown)`;
}
