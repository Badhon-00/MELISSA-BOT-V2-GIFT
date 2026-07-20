const axios = require('axios');

module.exports = {
  config: {
    name: 'cdn',
    category: 'MEDIA',
    author: 'Nyx × Xass',
    description: 'Uploads media from a replied message to a server and returns the new URL'
  },

  onStart: async ({ event, message }) => {
    try {
      const attachment = event.messageReply?.attachments?.[0];

      if (!attachment) {
       message.reply("Please reply to an image, video, or audio file.");
      }

      const originalUrl = attachment.url;
      const apiUrl = `http://160.191.129.54:5000/upload?url=${encodeURIComponent(originalUrl)}`;

      const response = await axios.get(apiUrl);
      const newUrl = response.data.url;

      if (!newUrl) {
     message.reply("No URL returned. Please check the API response.");
      }

      message.reply(`Uploaded URL:\n${newUrl}`);
    } catch (error) {
      message.reply("An error occurred: " + error.message);
    }
  }
};