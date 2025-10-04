## Complete Step Installation Guide
# Melissa Bot V3 - All Methods in One File
## 📱 METHOD 1: REPLIT.COM (Mobile/PC)
## Step 1: Replit Setup
bash
# Go to https://replit.com
# Create new repl → Bash template
# Run in console:

git clone https://github.com/Badhon-00/melissa-bot-v3 && cp -r melissa-bot-v3/. . && rm -rf melissa-bot-v3
npm install
Step 2: Facebook Cookie Setup
Install Cookie Editor extension in browser

Login to Facebook

Export cookies as JSON

Paste in account.txt or appState.json

Step 3: Configuration
bash
# Edit config.json
config.json

# Add your details:
{
  "prefix": "!",
  bot name:
  "admin": ["uid"],
  ## choose database
  Mongodb uri or sqilite
  if sqilite nothing changs
  but if you want to use Mongodb
  then replace sqilite to mongodb
  then past your db url "",

  # then go to appstate.json or account.txt
  "appState": "YOUR_COOKIE_HERE"
  "account.txt": "YOUR_COOKIE_HERE"
}
Step 4: Run Bot
bash
npm start
Step 5: Keep Alive
Use UptimeRobot for free pinging

Add your repl URL: https://your-repl-name.your-username.repl.co

☁️ METHOD 2: RENDER.COM (Free Hosting)
Step 1: GitHub Fork
bash
# Fork this repository:
https://github.com/Badhon-00/MELISSA-BOT-V2-GIFT
Step 2: Render Setup
Go to https://render.com

Sign up with GitHub

Click "New Web Service"

Connect your forked repository

Step 3: Configure Service
yaml
# Build Settings:
# Example name
Name: melissa-bot-badhon
Environment: Node
Region: Singapore
Branch: main

Build Command: npm install
Start Command: npm start
Step 4: Environment Variables
Add in Render dashboard:

text
PREFIX = !
ADMIN_ID = your_facebook_id
APP_STATE = your_facebook_cookie_json
AUTO_RESTART = true
LANGUAGE = en
Step 5: Deploy
Click "Create Web Service"

Wait for build to complete

Your bot URL: https://melissa-bot-badhon.onrender.com

Step 6: Uptime Setup
Go to https://uptimerobot.com

Add new monitor:

URL: https://melissa-bot-badhon.onrender.com

Type: HTTP(s)

Interval: 5 minutes

💻 METHOD 3: VPS (24/7 Professional)
Step 1: Purchase VPS
Recommended Providers:

DigitalOcean ($4/month)

Vultr ($2.5/month)

AWS EC2 (Free tier)

Google Cloud (Free credits)

Step 2: Connect to VPS
From PC:
bash
ssh root@your-server-ip
# Enter password
From Android (Termux):
bash
pkg update && pkg upgrade
pkg install openssh
ssh root@your-server-ip
Step 3: System Setup
bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install Git
apt install git -y

# Install PM2
npm install -g pm2
Step 4: Install Melissa Bot
bash
# Clone Badhon's repository
git clone https://github.com/Badhon-00/melissa-bot-v3
cd melissa-bot-v3

# Install dependencies
npm install
Step 5: Configuration
bash
# Edit config file
nano config.json

# Add your settings:
{
  "prefix": "!",
  "admin": ["100000000000000"],
  "appState": "your_facebook_cookie_here",
  "autoRestart": true,
  "listenEvents": true
}
Step 6: Run with PM2
bash
# Start bot
pm2 start melissa.js --name "melissa-bot"

# Auto-start on reboot
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs melissa-bot
Step 7: Firewall Setup
bash
# Enable firewall
ufw enable
ufw allow ssh
ufw allow 3000
🔧 ESSENTIAL CONFIGURATION FOR ALL METHODS
Facebook App State Setup:
Using Cookie Editor:
Login to Facebook in browser

Open Cookie Editor extension

Click Export → Export as JSON

Copy entire JSON data

Using c3c FB State:
Install c3c extension

Login to Facebook

Click extension → Get State

Copy generated code

Configuration File (config.json):
json
{
  "prefix": "!",
  "admin": ["100000000000000"],
  "appState": "YOUR_FACEBOOK_COOKIE_JSON",
  "autoRestart": true,
  "listenEvents": true,
  "selfListen": false,
  "online": true,
  "logLevel": "info"
}
🚀 QUICK START COMMANDS
For Replit:
bash
git clone https://github.com/Badhon-00/melissa-bot-v3 && cp -r melissa-bot-v3/. . && rm -rf melissa-bot-v3 && npm install && npm start
For VPS:
bash
apt update && apt upgrade -y && curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && apt-get install -y nodejs && apt install git -y && git clone https://github.com/Badhon-00/melissa-bot-v3 && cd melissa-bot-v3 && npm install && npm install -g pm2 && pm2 start melissa.js --name "melissa-bot" && pm2 startup && pm2 save
For Render:
Just fork and connect repository

Add environment variables

Deploy automatically

🔍 TROUBLESHOOTING
Common Issues & Solutions:
1. App State Invalid:
bash
# Solution:
- Re-export Facebook cookies
- Ensure you're logged into Facebook
- Check JSON format is correct
2. Bot Not Starting:
bash
# Check logs:
pm2 logs melissa-bot  # For VPS
# Render/Replit: Check deployment logs

# Reinstall dependencies:
rm -rf node_modules
npm install
3. High RAM Usage:
bash
# Solutions:
- Upgrade VPS/Render plan
- Optimize bot configuration
- Reduce concurrent operations
4. Free Service Sleeping:
bash
# For Replit/Render free tier:
- Use UptimeRobot to ping every 5 minutes
- Upgrade to paid plan for 24/7
📞 SUPPORT & UPDATES
Repository:
bash
https://github.com/Badhon-00/melissa-bot-v3
Update Bot:
bash
# For VPS/Replit:
cd melissa-bot-v3
git pull
npm install
pm2 restart melissa-bot  # VPS only

# For Render:
- Automatic updates from GitHub
- Or manual redeploy in dashboard
Features of Melissa Bot V3:
✅ AI Chat System
✅ Media Downloader
✅ Group Management
✅ Entertainment Commands
✅ Utility Tools
✅ Auto-Reconnect
✅ Multi-Language Support

🎉 এখন আপনার Melissa Bot V3 যে কোনো পদ্ধতিতে রান করতে প্রস্তুত!

Choose your method:

## Replit: Easy, free, good for testing

## Render: Free, reliable, good uptime

## VPS: paid but powerfull and Professional, 24/7, full control
