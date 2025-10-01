module.exports = {
	config: {
		name: "tid",
		version: "1.2",
		author: "Badhon",
		countDown: 5,
		role: 0,
		description: {
			en: "View threadID of your group chat"
		},
		category: "utility",
		guide: {
			en: "{pn}"
		}
	},

	onStart: async function ({ message, event }) {
		message.reply(event.threadID.toString());
	}
};
