const os = require("os");
const { execSync } = require("child_process");

function formatBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

function getUptime() {
  const uptimeSec = process.uptime();
  const days = Math.floor(uptimeSec / (3600 * 24));
  const hours = Math.floor((uptimeSec % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptimeSec % 3600) / 60);
  const seconds = Math.floor(uptimeSec % 60);
  
  if (days > 0) {
    return `${days}Day${days > 1 ? 's' : ''} ${hours}Hrs ${minutes}Min ${seconds}Sec`;
  }
  return `${hours}Hrs ${minutes}Min ${seconds}Sec`;
}

function createProgressBar(percentage, length = 10) {
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  return "█".repeat(filled) + "▒".repeat(empty);
}

function getCpuInfo() {
  const cpus = os.cpus();
  return {
    model: cpus[0]?.model || "Unknown Processor",
    cores: cpus.length,
    speed: `${(cpus[0]?.speed / 1000).toFixed(1)} GHz`
  };
}

function getNetworkInfo() {
  try {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
      for (const interface of interfaces[interfaceName]) {
        if (interface.family === 'IPv4' && !interface.internal) {
          return interface.address;
        }
      }
    }
    return '127.0.0.1';
  } catch {
    return '127.0.0.1';
  }
}

function getDiskInfo() {
  try {
    let dfOutput;
    try {
      dfOutput = execSync("df -k /").toString();
    } catch (e) {
      try {
        dfOutput = execSync("df -k .").toString();
      } catch (e) {
        return {
          used: 0,
          total: 1024 * 1024 * 1024,
          bar: createProgressBar(50),
          percentage: 50
        };
      }
    }

    const lines = dfOutput.trim().split('\n');
    if (lines.length < 2) {
      throw new Error("No disk info available");
    }

    const dataLine = lines[1].split(/\s+/).filter(Boolean);
    if (dataLine.length < 4) {
      throw new Error("Invalid disk info format");
    }

    const used = parseInt(dataLine[2]) * 1024;
    const total = parseInt(dataLine[1]) * 1024;
    
    if (isNaN(used) || isNaN(total) || total === 0) {
      throw new Error("Invalid disk values");
    }

    const percentage = Math.round((used / total) * 100);
    
    return {
      used,
      total,
      bar: createProgressBar(percentage),
      percentage: percentage
    };
  } catch (error) {
    return {
      used: 512 * 1024 * 1024, 
      total: 1024 * 1024 * 1024, 
      bar: createProgressBar(50),
      percentage: 50
    };
  }
}

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt", "status"],
    version: "2.0",
    author: "nexo_here",
    shortDescription: "Show bot status & system info",
    longDescription: "Displays comprehensive bot uptime, system specifications, and resource usage statistics.",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ message, threadsData, usersData }) {
    try {
      const uptime = getUptime();
      const threads = await threadsData.getAll();
      const users = (await usersData.getAll()).length;
      const groups = threads.filter(t => t.threadInfo?.isGroup).length;
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsage = (usedMem / totalMem) * 100;
      const cpuInfo = getCpuInfo();
      const nodeVersion = process.version;
      const platform = os.platform();
      const hostname = os.hostname();
      const ip = getNetworkInfo();
      const diskInfo = getDiskInfo();
      const loadAvg = os.loadavg().map(load => load.toFixed(2)).join(', ');
      const homeDir = os.homedir();
      const operator = "BADHON";
      const botName = "🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀";
      const msg = 
`┌───  ${botName}  ───┐

├─── 🏃 𝗨𝗣𝗧𝗜𝗠𝗘 ───
├ ➤ ${uptime}
├─── 📊 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗖𝗦 ───
├ ➤ Users: ${users}
├ ➤ Groups: ${groups}
├ ➤ Threads: ${threads.length}
├─── 🖥 𝗦𝗬𝗦𝗧𝗘𝗠 ───
├ ➤ OS: ${os.type()} ${os.release()}
├ ➤ Platform: ${platform}
├ ➤ Host: ${hostname}
├ ➤ Node: ${nodeVersion}
├ ➤ IP: ${ip}
├─── 🔧 𝗣𝗥𝗢𝗖𝗘𝗦𝗦𝗢𝗥 ───
├ ➤ Model: ${cpuInfo.model}
├ ➤ Cores: ${cpuInfo.cores}
├ ➤ Speed: ${cpuInfo.speed}
├ ➤ Load: ${loadAvg}
├─── 💾 𝗠𝗘𝗠𝗢𝗥𝗬 ───
├ ➤ [${createProgressBar(memUsage)}] ${memUsage.toFixed(1)}%
├ ➤ Used: ${formatBytes(usedMem)}
├ ➤ Free: ${formatBytes(freeMem)}
├ ➤ Total: ${formatBytes(totalMem)}
├─── 🗃 𝗥𝗔𝗠 ───
├ ➤ [${createProgressBar(memUsage)}] ${memUsage.toFixed(1)}%
├ ➤ Usage: ${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB
├ ➤ Total: ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB
├─── 📀 𝗗𝗜𝗦𝗞 ───
├ ➤ [${diskInfo.bar}] ${diskInfo.percentage}%
├ ➤ Usage: ${formatBytes(diskInfo.used)}
├ ➤ Total: ${formatBytes(diskInfo.total)}
├─── 🏠 𝗛𝗢𝗠𝗘 & 𝗔𝗥𝗖𝗛 ───
├ ➤ Directory: ${homeDir}
├ ➤ Operator: ${operator}
├ ➤ Architecture: ${os.arch()}
└───  ${botName}  ───┘`;

      await message.reply(msg);

    } catch (error) {
      console.error("Uptime command error:", error);
      const simpleUptime = getUptime();
      await message.reply(
`🤖 Bot Status:
⏰ Uptime: ${simpleUptime}
💻 Platform: ${os.platform()}
📊 Memory: ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}
👤 Operator: BADHON
❌ Detailed stats unavailable`
      );
    }
  }
};
