const fs = require("fs-extra");

module.exports = {
	config: {
		name: "rst",
		version: "1.1",
		author: "Badhon",
		countDown: 5,
		role: 2,
		description: "Restart bot",
		category: "System",
		guide: "{pn}: Restart bot"
	},

	langs: {
		en: {
			restartting: "┌───  🎀 MAHJABIN 🎀  ───\n├➤ 🐤 Mahjabin Bot is restarting... 🐤 \n└───  🎀 MAHJABIN 🎀  ───",
			restartSuccess: "┌───  🎀 MAHJABIN 🎀  ───\n├➤ 🎀 Mahjabin Bot has been successfully restarted! 🎀\n├➤ ⏰ Mahjabin's Restarting time: %1s\n└───  🎀 MAHJABIN 🎀  ───"
		}
	},

	onLoad: function ({ api }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;
		if (fs.existsSync(pathFile)) {
			const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
			const restartTime = ((Date.now() - time) / 1000).toFixed(2);
		
			const restartSuccessMsg = this.langs.en.restartSuccess.replace("%1", restartTime);
			api.sendMessage(restartSuccessMsg, tid);
			fs.unlinkSync(pathFile);
		}
	},

	onStart: async function ({ message, event, getLang }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;
		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
		await message.reply(getLang("restartting"));
		process.exit(2);
	}
};
