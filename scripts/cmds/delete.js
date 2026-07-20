const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "delete",
    aliases: ["del"],
		version: "1.7",
		author: "MahMUD",
		countDown: 10,
		role: 2,
		description: {
			vi: "Xóa một lệnh",
			en: "Delete a command"
		},
		category: "admin",
		guide: {
			vi: "   {pn} <tên lệnh>: xóa lệnh",
			en: "   {pn} <command name>: delete command"
		}
	},

	langs: {
		vi: {
			noArgs: "❌ Vui lòng cung cấp tên lệnh cần xóa",
			notFound: "❌ Không tìm thấy lệnh: %1",
			deleted: "✅ Đã xóa lệnh: %1",
			error: "✗ Đã xảy ra lỗi: %1"
		},
		en: {
			noArgs: "❌ Please provide command name to delete",
			notFound: "❌ The Command not found: %1",
			deleted: "✅ Deleted The command: %1",
			error: "✗ An error occurred: %1"
		}
	},

	onStart: async function ({ args, message, getLang }) {
		if (!args.length) {
			return message.reply(getLang("noArgs"));
		}

		const commandName = args[0].toLowerCase();
		const commandPath = path.join(__dirname, `${commandName}.js`);

		try {
			if (!fs.existsSync(commandPath)) {
			return message.reply(getLang("notFound", commandName));
			}

	    fs.unlinkSync(commandPath);
			return message.reply(getLang("deleted", commandName));
		} catch (err) {
			return message.reply(getLang("error", err.message));
		}
	}
};
