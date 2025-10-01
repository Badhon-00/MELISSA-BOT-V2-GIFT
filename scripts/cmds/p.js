module.exports = { 
  config: { 
    name: "p", 
    version: "3.1", 
    author: "Badhon", 
    countDown: 5, 
    role: 2, 
    shortDescription: { vi: "", en: "Manage pending group requests" }, 
    longDescription: { vi: "", en: "Approve or cancel pending group requests with Melissa Bot V3" }, 
    category: "admin" 
  },

  langs: { 
    en: { 
      invalidNumber: "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗘𝗥𝗥𝗢𝗥 🎀 ───\n│\n├ ❌ 『%1』 is not a valid number!\n│\n├ ⚠️  If any problem, contact: BADHON\n│\n└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
      cancelSuccess: "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗢𝗣𝗘𝗥𝗔𝗧𝗜𝗢𝗡 🎀 ───\n│\n├ 🚫 Refused 『%1』 thread(s)!\n│\n├ ⚠️  If any problem, contact: BADHON\n│\n└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
      approveSuccess: "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗢𝗣𝗘𝗥𝗔𝗧𝗜𝗢𝗡 🎀 ───\n│\n├ ✅ Approved 『%1』 thread(s)!\n│\n├ ⚠️  If any problem, contact: BADHON\n│\n└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
      cantGetPendingList: "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗘𝗥𝗥𝗢𝗥 🎀 ───\n│\n├ 💢 Unable to retrieve pending list!\n│\n├ ⚠️  If any problem, contact: BADHON\n│\n└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
      returnListPending: "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 🎀 ───\n│\n├ 📊 Total Requests: %1\n│\n%2\n│\n├ 💫 𝗨𝘀𝗮𝗴𝗲 𝗚𝘂𝗶𝗱𝗲:\n├ ➤ Approve: 1 2 3\n├ ➤ Cancel: c 1 2\n├ ➤ Approve All: -all\n│\n├ ⚠️  If any problem, contact: BADHON\n│\n└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
      returnListClean: "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 🎀 ───\n│\n├ ✅ No pending requests found!\n├ 🌟 All clear and up to date!\n│\n├ ⚠️  If any problem, contact: BADHON\n│\n└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
      approveAllSuccess: "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗢𝗣𝗘𝗥𝗔𝗧𝗜𝗢𝗡 🎀 ───\n│\n├ 🌠 Successfully approved ALL 『%1』 threads!\n│\n├ ⚠️  If any problem, contact: BADHON\n│\n└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───"
    } 
  },

  onReply: async function ({ api, event, Reply, getLang, Users }) { 
    if (String(event.senderID) !== String(Reply.author)) return; 
    const { body, threadID, messageID } = event; 
    let count = 0;


    const approverInfo = await Users.getData(event.senderID);
    const approverName = approverInfo.name || "Admin";


    const isAll = body.toLowerCase() === "-all";
    const isCancel = body.toLowerCase().startsWith("c") || body.toLowerCase().startsWith("cancel");
    const indices = isAll ? 
      Reply.pending.map((_, index) => index + 1) : 
      body.replace(/^[cC]ancel?\s*/, "").split(/\s+/);

    for (const index of indices) {
      const num = parseInt(index);
      if (!isAll && (isNaN(num) || num <= 0 || num > Reply.pending.length)) {
        return api.sendMessage(getLang("invalidNumber", num), threadID, messageID);
      }

      if (isCancel) {
        api.removeUserFromGroup(api.getCurrentUserID(), Reply.pending[num - 1].threadID);
      } else {
        const prefix = global.utils.getPrefix(Reply.pending[num - 1].threadID);

        api.sendMessage(
          "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───\n" +
          "│\n" +
          "├ 🤖 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗜𝗦 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗 𝗜𝗡 𝗬𝗢𝗨𝗥 𝗚𝗥𝗢𝗨𝗣\n" +
          "│\n" +
          `├ 📛 𝗚𝗿𝗼𝘂𝗽 𝗡𝗮𝗺𝗲: ${Reply.pending[num - 1].name}\n` +
          "├ ✅ 𝗦𝗧𝗔𝗧𝗨𝗦: 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗\n" +
          "│\n" +
          `├ ⚡ 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n` +
          `├ 📖 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${prefix}help\n` +
          `├ 👤 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗕𝘆: ${approverName}\n` +
          `├ 🕐 𝗧𝗶𝗺𝗲: ${new Date().toLocaleString()}\n` +
          "│\n" +
          "├ 🎯 𝗙𝗲𝗮𝘁𝘂𝗿𝗲𝘀 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲:\n" +
          "├ ➤ 🤖 AI Chat System\n" +
          "├ ➤ 🎵 Media & Entertainment\n" +
          "├ ➤ 🛠️ Utility Commands\n" +
          "├ ➤ 🎮 Games & Fun\n" +
          "├ ➤ 📊 Group Management\n" +
          "│\n" +
          "├ 💫 𝗡𝗲𝗲𝗱 𝗵𝗲𝗹𝗽? 𝗧𝘆𝗽𝗲: " + prefix + "help\n" +
          "├ ⚠️  𝗜𝗳 𝗮𝗻𝘆 𝗽𝗿𝗼𝗯𝗹𝗲𝗺, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁: 𝗕𝗔𝗗𝗛𝗢𝗡\n" +
          "├ 🌟 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝗰𝗵𝗼𝗼𝘀𝗶𝗻𝗴 𝗠𝗲𝗹𝗶𝘀𝘀𝗮 𝗕𝗼𝘁 𝗩𝟯!\n" +
          "│\n" +
          "└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
          Reply.pending[num - 1].threadID
        );
      }
      count++;
    }

    if (isAll) {
      return api.sendMessage(getLang("approveAllSuccess", count), threadID, messageID);
    } else if (isCancel) {
      return api.sendMessage(getLang("cancelSuccess", count), threadID, messageID);
    } else {
      return api.sendMessage(getLang("approveSuccess", count), threadID, messageID);
    }
  },

  onStart: async function ({ api, event, getLang, commandName, Users, args }) { 
    const { threadID, messageID } = event; 
    let msg = "", index = 1;


    const adminInfo = await Users.getData(event.senderID);
    const adminName = adminInfo.name || "Admin";

    try {
      const spam = (await api.getThreadList(100, null, ["OTHER"])) || [];
      const pending = (await api.getThreadList(100, null, ["PENDING"])) || [];
      const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);


      if (args[0] === "-all") {
        let count = 0;
        const approverName = adminName;


        for (const group of list) {
          const prefix = global.utils.getPrefix(group.threadID);
          
          api.sendMessage(
            "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───\n" +
            "│\n" +
            "├ 🤖 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗜𝗦 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗 𝗜𝗡 𝗬𝗢𝗨𝗥 𝗚𝗥𝗢𝗨𝗣\n" +
            "│\n" +
            `├ 📛 𝗚𝗿𝗼𝘂𝗽 𝗡𝗮𝗺𝗲: ${group.name}\n` +
            "├ ✅ 𝗦𝗧𝗔𝗧𝗨𝗦: 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗\n" +
            "│\n" +
            `├ ⚡ 𝗣𝗿𝗲𝗳𝗶𝘅: ${prefix}\n` +
            `├ 📖 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${prefix}help\n` +
            `├ 👤 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗕𝘆: ${approverName}\n` +
            `├ 🕐 𝗧𝗶𝗺𝗲: ${new Date().toLocaleString()}\n` +
            "│\n" +
            "├ 🎯 𝗙𝗲𝗮𝘁𝘂𝗿𝗲𝘀 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲:\n" +
            "├ ➤ 🤖 AI Chat System\n" +
            "├ ➤ 🎵 Media & Entertainment\n" +
            "├ ➤ 🛠️ Utility Commands\n" +
            "├ ➤ 🎮 Games & Fun\n" +
            "├ ➤ 📊 Group Management\n" +
            "│\n" +
            "├ 💫 𝗡𝗲𝗲𝗱 𝗵𝗲𝗹𝗽? 𝗧𝘆𝗽𝗲: " + prefix + "help\n" +
            "├ ⚠️  𝗜𝗳 𝗮𝗻𝘆 𝗽𝗿𝗼𝗯𝗹𝗲𝗺, 𝗰𝗼𝗻𝘁𝗮𝗰𝘁: 𝗕𝗔𝗗𝗛𝗢𝗡\n" +
            "├ 🌟 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝗰𝗵𝗼𝗼𝘀𝗶𝗻𝗴 𝗠𝗲𝗹𝗶𝘀𝘀𝗮 𝗕𝗼𝘁 𝗩𝟯!\n" +
            "│\n" +
            "└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
            group.threadID
          );
          count++;
        }

        return api.sendMessage(
          "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗢𝗣𝗘𝗥𝗔𝗧𝗜𝗢𝗡 🎀 ───\n" +
          "│\n" +
          "├ 🌠 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗 𝗔𝗟𝗟 𝗥𝗘𝗤𝗨𝗘𝗦𝗧𝗦\n" +
          "│\n" +
          `├ 📊 Total Groups: ${count}\n` +
          `├ 👤 Approved By: ${approverName}\n` +
          `├ ⏰ Time: ${new Date().toLocaleTimeString()}\n` +
          "│\n" +
          "├ ⚠️  If any problem, contact: BADHON\n" +
          "│\n" +
          "└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
          threadID, 
          messageID
        );
      }

      for (const group of list) {
        msg += `├ ➤ ${index}. ${group.name}\n├    └─ 🆔 ${group.threadID}\n│\n`;
        index++;
      }

      if (list.length !== 0) {
        const pendingList = "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 🎀 ───\n" +
                          "│\n" +
                          `├ 👤 Admin: ${adminName}\n` +
                          `├ 📊 Total Requests: ${list.length}\n` +
                          "│\n" +
                          msg +
                          "├ 💫 𝗨𝘀𝗮𝗴𝗲 𝗜𝗻𝘀𝘁𝗿𝘂𝗰𝘁𝗶𝗼𝗻𝘀:\n" +
                          "├ ➤ To approve: Type numbers (1 2 3)\n" +
                          "├ ➤ To cancel: Type 'c' + numbers (c 1 2)\n" +
                          "├ ➤ Approve All: Type -all\n" +
                          "├ ➤ Multiple selection supported\n" +
                          "│\n" +
                          "├ ⏳ Session expires in: 5 minutes\n" +
                          "├ ⚠️  If any problem, contact: BADHON\n" +
                          "│\n" +
                          "└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───";

        return api.sendMessage(pendingList, threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            pending: list
          });
        }, messageID);
      } else {
        return api.sendMessage(
          "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗣𝗘𝗡𝗗𝗜𝗡𝗚 🎀 ───\n" +
          "│\n" +
          `├ 👤 Admin: ${adminName}\n` +
          "├ ✅ Status: No pending requests\n" +
          "├ 🌟 Everything is up to date!\n" +
          `├ 🕐 Checked: ${new Date().toLocaleTimeString()}\n` +
          "│\n" +
          "├ ⚠️  If any problem, contact: BADHON\n" +
          "│\n" +
          "└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
          threadID, 
          messageID
        );
      }
    } catch (e) {
      return api.sendMessage(
        "┌─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗘𝗥𝗥𝗢𝗥 🎀 ───\n" +
        "│\n" +
        `├ 👤 Admin: ${adminName}\n` +
        "├ ❌ Error: Unable to retrieve pending list\n" +
        "├ 💡 Solution: Please try again later\n" +
        `├ 🕐 Time: ${new Date().toLocaleTimeString()}\n` +
        "│\n" +
        "├ ⚠️  If any problem, contact: BADHON\n" +
        "│\n" +
        "└─── 🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀 ───",
        threadID, 
        messageID
      );
    }
  }
};
