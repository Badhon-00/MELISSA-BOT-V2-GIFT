const { exec } = require('child_process');

module.exports.config = {
    name: "shell",
    aliases: ["sh"],
    version: "1.0",
    author: "Badhon",
    role: 2,
    description: "Execute shell commands",
    category: "System",
    guide: {
      en: "{pn} <command>",
    },
    coolDowns: 5
};

module.exports.onStart = async ({ message, args }) => {
     // don't change author name otherwise you got ban
    if (!args.length) {
        return message.reply("Please provide a command to execute.");
    }
    const command = args.join(' ');

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return message.reply(`Error executing command: ${error.message}`);
        }
        if (stderr) {
            return message.reply(`Shell Error: ${stderr}`);
        }

 const output = stdout || "Command executed successfully with no output.";
        message.reply(`${output}`);
    });
};
