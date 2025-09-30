module.exports = {
	config: {
		name: "all",
		version: "1.2",
		author: "Badhon",
		countDown: 5,
		role: 0,
		description: {
			en: "Tag all members in your group chat"
		},
		category: "utility",
		guide: {
	   	en: "   {pn} [content | empty]"
		}
	},

	onStart: async function ({ message, event, args }) {
		const { participantIDs } = event;
		const lengthAllUser = participantIDs.length;
		const mentions = [];
		let body = "Tora shobai koi ree " + (args.join(" ") || "@all");
		let bodyLength = body.length;
		let i = 0;
		for (const uid of participantIDs) {
			let fromIndex = 0;
			if (bodyLength < lengthAllUser) {
				body += body[bodyLength - 1];
				bodyLength++;
			}
			if (body.slice(0, i).lastIndexOf(body[i]) != -1)
				fromIndex = i;
			mentions.push({
				tag: body[i],
				id: uid, fromIndex
			});
			i++;
		}
		message.reply({ body, mentions });
	}
};
