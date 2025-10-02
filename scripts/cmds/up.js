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
    model: cpus[0]?.model || "Unknown",
    cores: cpus.length,
    speed: `${(cpus[0]?.speed / 1000).toFixed(1)} GHz`
  };
}

function getNetworkInfo() {
  try {
    const interfaces = os.networkInterfaces();
    const wifi = Object.values(interfaces).flat().find(i => i.family === 'IPv4' && !i.internal);
    return wifi ? wifi.address : '127.0.0.1';
  } catch {
    return '127.0.0.1';
  }
}

function getDiskInfo() {
  try {
    
    let df;
    try {
      df = execSync("df -k /").toString();
    } catch {
      try {
        df = execSync("df -k .").toString();
      } catch {
        return getFallbackDiskInfo();
      }
    }
    
    const lines = df.split("\n");
    if (lines.length < 2) return getFallbackDiskInfo();
    
    const dataLine = lines[1].split(/\s+/);
    if (dataLine.length < 4) return getFallbackDiskInfo();
    
    const used = parseInt(dataLine[2]) * 1024;
    const total = parseInt(dataLine[1]) * 1024;
    const percent = Math.round((used / total) * 100);
    
    return {
      used,
      total,
      bar: createProgressBar(percent),
      percentage: percent
    };
  } catch (e) {
    return getFallbackDiskInfo();
  }
}

function getFallbackDiskInfo() {
  return {
    used: 0,
    total: 1,
    bar: createProgressBar(0),
    percentage: 0
  };
}

module.exports = {
  config: {
    name: "uptime",
    aliases: ["up", "upt", "status"],
    version: "2.0",
    author: "Badhon",
    shortDescription: "Show bot status & system info",
    longDescription: "Displays comprehensive bot uptime, system specifications, and resource usage statistics.",
    category: "system",
    guide: "{pn}"
  },

  onStart: async function ({ message, threadsData, usersData }) {
    try {
      const uptime = getUptime();
      const threads = await threadsData.getAll();
      const groups = threads.filter(t => t.threadInfo?.isGroup).length;
      const users = (await usersData.getAll()).length;
      
    
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
      
      const botName = "🎀 𝗠𝗘𝗟𝗜𝗦𝗦𝗔 𝗕𝗢𝗧 𝗩𝟯 🎀";
      
      const loadAvg = os.loadavg().map(load => load.toFixed(2)).join(', ');
      const homeDir = os.homedir();
      const operator = process.env.USER || process.env.USERNAME || 'Unknown';

      const msg =
`┌───  ${botName}  ───┐
│
├─── 🏃 𝗨𝗣𝗧𝗜𝗠𝗘 ───
│
├ ➤ ${uptime}
│
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

      message.reply(msg);
    } catch (err) {
      console.error("Uptime command error:", err);
      message.reply("❌ | Uptime command failed. Please try again later.");
    }
  }
};
