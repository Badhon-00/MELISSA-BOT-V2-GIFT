module.exports = {
  config: {
    name: 'out',
    aliases: ['kickme'],
    version: '1.1',
    author: 'Rakib Adil 👑',
    countDown: 5,
    role: 1,
    shortDescription: 'Bot exits the group with savage grace',
    longDescription:
      'Bot leaves the group with an emotional yet savage farewell message.',
    category: 'system',
    guide: '{pn}'
  },

  onStart: async function ({ api, event }) {
    const { threadID, senderID } = event;
    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo.name;

    const goodbyeMsg = `╭─────────────────────╮
│   👋 𝐓𝐢𝐦𝐞 𝐭𝐨 𝐬𝐚𝐲 𝐠𝐨𝐨𝐝𝐛𝐲𝐞...  
╰─────────────────────╯

Dear mortals of this group,

I've laughed, I’ve seen drama, and I’ve witnessed chaos.

But it’s time I left this circus.

💔 Farewell from your beloved bot, invited by ${userName}.

⚔️ If you ever miss me...  
Just remember, I left with more grace than half of you got personality.

✨ Stay legendary, or at least... try..`;

    try {
      await api.sendMessage(
        {
          body: goodbyeMsg,
          effect: 'love'
        },
        threadID
      );
    } catch (e) {
      await api.sendMessage(goodbyeMsg, threadID);
    }

    setTimeout(() => {
      api.removeUserFromGroup(api.getCurrentUserID(), threadID);
    }, 2000);
  }
};
