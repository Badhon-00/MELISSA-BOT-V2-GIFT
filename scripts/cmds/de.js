module.exports = {
  config: {
    name: "de",
    aliases: ["del"],
    author: "BaDhon",
role: 2,
    category: "system"
  },

  onStart: async function ({ api, event, args }) {
    const fs = require('fs');
    const path = require('path');

    const fileName = args[0];

    if (!fileName) {
      api.sendMessage("Please provide a file name to delete.", event.threadID);
      return;
    }

    const filePath = path.join(__dirname, fileName);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
        api.sendMessage(`🤔 𝙺𝙸 𝚅𝚄𝙻𝙱𝙰𝙻 𝙻𝙸𝙺𝙷𝙲𝙷𝙾 𝚃𝚄𝙼𝙸?${fileName}.𝙰𝙸 𝙽𝙰𝙼 𝙰 𝚃𝙾 𝙺𝙾𝙽𝙾 𝙵𝙸𝙻𝙴 𝙴 𝙽𝙴𝙸`, event.threadID);
        return;
      }
      api.sendMessage(`✅ 𝙱𝙰𝙱𝚈 ➪ ( ${fileName} ) 𝙰𝙸 𝙿𝙾𝙲𝙷𝙰 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝚃𝙰 𝚁𝙴𝙼𝙾𝚅𝙴 𝙺𝙾𝚁𝙴 𝙳𝙸𝚈𝙴𝙲𝙷𝙸 𝚁𝙰𝙶 𝙺𝙾𝚁𝙾 𝙽𝙰 𝙰𝚁😌`, event.threadID);
    });
  }
};
