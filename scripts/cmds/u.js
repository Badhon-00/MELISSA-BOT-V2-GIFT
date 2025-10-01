module.exports = {
	config: {
		name: "u",
		version: "1.2",
		author: "Badhon",
		countDown: 5,
		role: 0,
		description: {
			en: "Unsend bot's message"
		},
		category: "utility",
		guide: {
			en: "reply the message you want to unsend and call the command {pn}"
		}
	},

	langs: {
		en: {
			syntaxError: "Please reply the message you want to unsend"
		}
	},

	onStart: async function ({ message, event, api, getLang }) {
		if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID())
			return message.reply(getLang("syntaxError"));
		message.unsend(event.messageReply.messageID);
	}
};
