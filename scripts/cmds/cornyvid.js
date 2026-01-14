module.exports = {
  config: {
    name: "cornyvid",
    version: "1",
    author: "Badhon",
    category: "horny",
    role: "all user",
    usePrefix: true,
    forAdminUsePrefix: false,
    cooldown: 20
  },
  
  onStart: async function({ event, message, usersData, args, getLang, role, api }) {
    try {
      // Add waiting reaction
      api.setMessageReaction("🐣", event.messageID, (err) => {}, true);
      
      // List of video URLs
      const videos = [,
        "https://files.catbox.moe/8xs5v6.mp4",
        "https://files.catbox.moe/rlbhw8.mp4",
        "https://files.catbox.moe/4i06z1.mp4",
        "https://files.catbox.moe/s229ox.mp4",
        "https://files.catbox.moe/eqz3cc.mp4",
        "https://files.catbox.moe/faosm4.mp4",
        "https://files.catbox.moe/5cvgxp.mp4",
        "https://files.catbox.moe/drdj1j.mp4",
        "https://files.catbox.moe/8z7vay.mp4",
"https://files.catbox.moe/dty32d.mp4",
"https://files.catbox.moe/q0hrek.mp4",
"https://files.catbox.moe/1i3l9u.mp4",
"https://files.catbox.moe/03vl6j.mp4",
"https://files.catbox.moe/epnqxz.mp4",
"https://files.catbox.moe/cactm7.mp4",
"https://files.catbox.moe/ecs0qv.mp4",
"https://files.catbox.moe/hdj7jh.mp4", 
"https://files.catbox.moe/5fs4fr.mp4",
"https://files.catbox.moe/p5b90x.mp4",
"https://files.catbox.moe/yeagdv.mp4",
"https://files.catbox.moe/ark10q.mp4",
"https://files.catbox.moe/r9i5m5.mp4",
"https://files.catbox.moe/waftpn.mp4",
"https://files.catbox.moe/02y70j.mp4",
"https://files.catbox.moe/38s6za.mp4",
"https://files.catbox.moe/7a2nkw.mp4",
"https://files.catbox.moe/r1spro.mp4",
"https://files.catbox.moe/dmt6p7.mp4",
"https://files.catbox.moe/007z0k.mp4",
"https://files.catbox.moe/gactoc.mp4",
"https://files.catbox.moe/8y2f0h.mp4",
"https://files.catbox.moe/ls27ea.mp4",
"https://files.catbox.moe/8qzsy6.mp4",
"https://files.catbox.moe/b0v3s1.mp4",
"https://files.catbox.moe/2cel82.mp4",
"https://files.catbox.moe/7elp3l.mp4",
"https://files.catbox.moe/y7ppy2.mp4",
"https://files.catbox.moe/9lf67i.mp4",
"https://files.catbox.moe/wirvl5.mp4",
"https://files.catbox.moe/jxkg3j.mp4",
"https://files.catbox.moe/qhez56.mp4",
"https://files.catbox.moe/3svgsv.mp4",
"https://files.catbox.moe/qelfrh.mp4",
"https://files.catbox.moe/4gldl9.mp4"
      ];
      
      // Select a random video
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      
      // Form message
      const form = {
        body: "「 HERE IS YOUR HORNY VIDEO, 🥵 」",
        attachment: await global.utils.getStreamFromURL(randomVideo)
      };
      
      // Send the message
      await message.reply(form);
      
      // Add success reaction
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      
    } catch (error) {
      console.error("Error in cornyvid command:", error);
      message.reply("An error occurred while processing your request.");
    }
  },
  
  onChat: async function({ event, message, usersData, args, getLang, role, api }) {
    // This allows admin to use the command without prefix
    if (role === 1 || role === 2) { // Assuming 1 and 2 are admin roles
      const command = event.body.toLowerCase();
      if (command === "cornyvid") {
        this.onStart({ event, message, usersData, args, getLang, role, api });
      }
    }
  }
};
