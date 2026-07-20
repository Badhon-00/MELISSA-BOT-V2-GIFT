module.exports = {
  config: {
    name: "slot",
    version: "1.0",
    author: "BADHON",
    shortDescription: {
      en: "Slot game",
    },
    longDescription: {
      en: "Slot game.",
    },
    category: "Game",
  },
  langs: {
    en: {
      invalid_amount: "**Enter a valid and positive amount to have a chance to win double**",
      not_enough_money: "**BABY TUMI TO GORIB MATRO %1 ROYECHE**",
      spin_message: "**Spinning...**",
      win_message: "┌─── 𝗦𝗟𝗢𝗧 𝗥𝗘𝗦𝗨𝗟𝗧 ───\n│\n├ ➤ 🎉 𝗪𝗜𝗡𝗡𝗘𝗥!\n├ ➤ 💰 𝗪𝗶𝗻𝗻𝗶𝗻𝗴 𝗔𝗺𝗼𝘂𝗻𝘁: $%1\n├ ➤ 🏦 𝗠𝗮𝗶𝗻 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $%2\n├ ➤ 💎 𝗡𝗲𝘄 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $%3\n│\n└─── 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘 ───\n│\n├ ➤ 🎰 [ %4 | %5 | %6 ]\n│\n└───────────────",
      lose_message: "┌─── 𝗦𝗟𝗢𝗧 𝗥𝗘𝗦𝗨𝗟𝗧 ───\n│\n├ ➤ 😢 𝗟𝗢𝗦𝗧!\n├ ➤ 💸 𝗟𝗼𝘀𝘁 𝗔𝗺𝗼𝘂𝗻𝘁: $%1\n├ ➤ 🏦 𝗠𝗮𝗶𝗻 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $%2\n├ ➤ 💎 𝗡𝗲𝘄 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $%3\n│\n└─── 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘 ───\n│\n├ ➤ 🎰 [ %4 | %5 | %6 ]\n│\n└───────────────",
      super_win_message: "┌─── 𝗦𝗟𝗢𝗧 𝗥𝗘𝗦𝗨𝗟𝗧 ───\n│\n├ ➤ 🎊 𝗦𝗨𝗣𝗘𝗥 𝗪𝗜𝗡!\n├ ➤ 💰 𝗪𝗶𝗻𝗻𝗶𝗻𝗴 𝗔𝗺𝗼𝘂𝗻𝘁: $%1\n├ ➤ 🎯 𝗧𝗵𝗿𝗲𝗲 %2 𝘀𝘆𝗺𝗯𝗼𝗹𝘀!\n├ ➤ 🏦 𝗠𝗮𝗶𝗻 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $%3\n├ ➤ 💎 𝗡𝗲𝘄 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: $%4\n│\n└─── 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘 ───\n│\n├ ➤ 🎰 [ %5 | %6 | %7 ]\n│\n└───────────────",
    },
  },
  onStart: async function ({ args, message, event, envCommands, usersData, commandName, getLang }) {
    const { senderID } = event;
    const userData = await usersData.get(senderID);
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply(getLang("invalid_amount"));
    }

    if (amount > userData.money) {
      const currentBalance = formatMoney(userData.money);
      return message.reply(getLang("not_enough_money", currentBalance));
    }

    const slots = ["💚", "💛", "💙", "💜"];
    const slot1 = slots[Math.floor(Math.random() * slots.length)];
    const slot2 = slots[Math.floor(Math.random() * slots.length)];
    const slot3 = slots[Math.floor(Math.random() * slots.length)];

    const winnings = calculateWinnings(slot1, slot2, slot3, amount);
    const newBalance = userData.money + winnings;

    await usersData.set(senderID, {
      money: newBalance,
      data: userData.data,
    });

    const messageText = getSpinResultMessage(slot1, slot2, slot3, winnings, amount, userData.money, newBalance, getLang);

    return message.reply(messageText);
  },
};

function calculateWinnings(slot1, slot2, slot3, betAmount) {
  if (slot1 === "💜" && slot2 === "💜" && slot3 === "💜") {
    return betAmount * 10;
  } else if (slot1 === "💚" && slot2 === "💚" && slot3 === "💚") {
    return betAmount * 5;
  } else if (slot1 === "💛" && slot2 === "💛" && slot3 === "💛") {
    return betAmount * 3;
  } else if (slot1 === slot2 && slot2 === slot3) {
    return betAmount * 2;
  } else if (slot1 === slot2 || slot1 === slot3 || slot2 === slot3) {
    return betAmount * 1.5;
  } else {
    return -betAmount;
  }
}

function getSpinResultMessage(slot1, slot2, slot3, winnings, betAmount, mainBalance, newBalance, getLang) {
  const formattedMainBalance = formatMoney(mainBalance);
  const formattedNewBalance = formatMoney(newBalance);
  
  if (winnings > 0) {
    if (slot1 === "💜" && slot2 === "💜" && slot3 === "💜") {
      const formattedWinnings = formatMoney(winnings);
      return getLang("super_win_message", formattedWinnings, "💜", formattedMainBalance, formattedNewBalance, slot1, slot2, slot3);
    } else {
      const formattedWinnings = formatMoney(winnings);
      return getLang("win_message", formattedWinnings, formattedMainBalance, formattedNewBalance, slot1, slot2, slot3);
    }
  } else {
    const lostAmount = -winnings;
    const formattedLostAmount = formatMoney(lostAmount);
    return getLang("lose_message", formattedLostAmount, formattedMainBalance, formattedNewBalance, slot1, slot2, slot3);
  }
}

function formatMoney(amount) {
  if (amount >= 1000000000000) {
    return (amount / 1000000000000).toFixed(2) + ' Trillion';
  } else if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(2) + ' Billion';
  } else if (amount >= 1000000) {
    return (amount / 1000000).toFixed(2) + ' Million';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(2) + ' Thousand';
  } else {
    return amount.toFixed(2);
  }
  }
