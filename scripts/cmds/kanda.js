const axios = require('axios');
module.exports = {
  config: {
    name: "Kanda",
    aliases: ["Kanda"],
    version: "1.0",
    author: "MILAN",
    countDown: 5,
    role: 2,
    shortDescription: "Kanda videos",
    longDescription: "get Kanda videos",
    category: "18+",
    guide: "{pn}"
  },

  onStart: async function ({ message, args }) {
    const BASE_URL = `https://apis.samirbadaila24.repl.co/kanda/apikey=samir`;
    message.reply("Processing your video please wait...it will be ready soon😍❤");
    try {
      const res = await axios.get(BASE_URL);
      if (!res.data || !res.data.url) {
        return message.reply("No video found. Please try again later.");
      }
      const kanda = res.data.url;
      const stream = await global.utils.getStreamFromURL(kanda);
      const form = {
        body: `How about this🥵🥵🥵`,
        attachment: stream
      };
      message.reply(form);
    } catch (e) {
      message.reply(`Something went wrong. Please try again later.`);
      console.error(e);
    }
  }
};
