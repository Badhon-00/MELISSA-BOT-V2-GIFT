const axios = require("axios");

module.exports = {
  config: {
    name: "nude",
    version: "1.0",
    author: "MOSTAKIM × BADHON",
    countDown: 5,
    role: 0,
    shortDescription: "Generate nude image (API demo)",
    longDescription: "Fetch a NSFW image using a fixed UID",
    category: "18+",
    guide: "{p}nude"
  },

  onStart: async function ({ message }) {
    const uid = "100085332887575";

    try {
      const res = await axios.get(`https://mostakim.onrender.com/nude?uid=${uid}`);
      const data = res.data;

      if (data.success && data.url) {
        const imageRes = await axios.get(data.url, { responseType: 'stream' });
        return message.reply({
          body: `Type: ${data.type}`,
          attachment: imageRes.data
        });
      } else {
        return message.reply("Failed to fetch image.");
      }
    } catch (err) {
      return message.reply("Error occurred: " + err.message);
    }
  }
};
