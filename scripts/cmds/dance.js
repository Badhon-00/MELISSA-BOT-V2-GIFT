module.exports = {
  config: {
    name: "dance",
    version: "1.0",
    author: "Badhon",
    category: "cuties",
    role: 0,
    usePrefix: true,
    description: "Send a random dance video",
    usage: "Just type {p}dance and the bot will send a random dance video",
    cooldown: 2,
  },
  
  onStart: async function({ message }) {
    try {
      const videos = [
        "https://files.catbox.moe/y3sqhf.mp4",
        "https://files.catbox.moe/9vd8ay.mp4",
        "https://files.catbox.moe/3s8cio.mp4",
        "https://files.catbox.moe/7bk7wm.mp4",
        "https://files.catbox.moe/855ye4.mp4",
        "https://files.catbox.moe/9vd8ay.mp4"
      ];
      
 
      const randomIndex = Math.floor(Math.random() * videos.length);
      const randomVideo = videos[randomIndex];
      
   
      message.reply({
        body: "💃 COME BABY'S 🥵!",
        attachment: await global.utils.getStreamFromURL(randomVideo)
      });
      
    } catch (error) {
      console.error("Error in dance command:", error);
      message.reply("❌ An error occurred while sending the dance video. Please try again later.");
    }
  }
};