# Melissa Bot V3 - Replit Setup

## Project Overview
**Melissa Bot V3** is a Facebook Messenger chatbot that runs on a personal Facebook account. It includes hundreds of commands for entertainment, utilities, AI features, moderation, and more.

### Current Status
✅ Environment configured with Node.js 20
✅ All dependencies installed successfully  
✅ Bot application starts and runs
⚠️ Waiting for Facebook login credentials

## Quick Start Guide

### Step 1: Configure Facebook Login
You need to provide your Facebook account credentials in the `config.json` file:

1. Open `config.json`
2. Find the `facebookAccount` section
3. Fill in your credentials:
   ```json
   "facebookAccount": {
     "email": "your-facebook-email@example.com",
     "password": "your-password",
     "2FASecret": "your-2fa-secret-if-enabled",
     ...
   }
   ```

### Step 2: Configure Bot Admins
Update the admin IDs in `config.json`:
- `adminBot`: Array of Facebook user IDs who can use admin commands
- `developers`: Array of developer Facebook user IDs with full access

**To find your Facebook ID:**
- Go to your Facebook profile
- Copy the numeric ID from the URL, or
- Use: `https://findmyfbid.com/`

### Step 3: Start the Bot
The bot will automatically start when you provide valid credentials. Just save the `config.json` file and the workflow will restart automatically.

## Project Architecture

### Core Files
- `index.js` - Entry point that spawns the main bot process
- `Goat.js` - Main bot logic and initialization
- `config.json` - Configuration file (credentials, settings, admins)

### Directory Structure
```
├── bot/                    # Bot core logic
│   ├── handler/           # Event and command handlers
│   └── login/             # Facebook login and authentication
├── database/              # Database models and controllers
│   ├── controller/        # Data access layer
│   └── models/           # MongoDB and SQLite schemas
├── fb-chat-api/          # Facebook chat API integration
├── scripts/
│   ├── cmds/             # 200+ bot commands
│   └── events/           # Event handlers (welcome, leave, etc.)
├── logger/               # Logging utilities
└── utils.js              # Helper functions
```

### Database
- **Type**: MongoDB (configurable to SQLite)
- **Connection**: Configured in `config.json`
- **Current**: MongoDB Atlas connected

## Features

### Commands (200+)
Located in `scripts/cmds/`:
- **AI**: GPT, Claude, Gemini, DALL-E, Midjourney
- **Media**: YouTube download, TikTok, image generation
- **Utilities**: Weather, translate, reminders
- **Fun**: Games, memes, pair matching
- **Admin**: User management, group moderation
- **Economy**: Balance, daily rewards, gambling

### Events
Located in `scripts/events/`:
- Welcome messages for new members
- Leave notifications
- Auto-reactions
- Message logging

### Admin Features
- Ban/unban users
- Group management
- Command permissions
- Prefix customization
- Auto-moderation

## Important Notes

### Security
⚠️ **IMPORTANT**: 
- Never share your `config.json` with credentials
- Use app-specific passwords if possible
- Enable 2FA and provide the secret key for better security

### Database
- Current: MongoDB Atlas (cloud-hosted)
- Can switch to SQLite in `config.json` → `database.type`

### Customization
- **Prefix**: Change in `config.json` → `prefix` (default: `^`)
- **Bot Name**: `config.json` → `nickNameBot`
- **Language**: `config.json` → `language` (en/vi)

## Troubleshooting

### Bot won't login
1. Check email/password in `config.json`
2. Verify 2FA secret if enabled
3. Check if Facebook account is not locked
4. Try using app-specific password

### Commands not working
1. Check prefix is correct
2. Verify you're an admin for admin commands
3. Check command file exists in `scripts/cmds/`

### Database errors
1. Verify MongoDB connection string in `config.json`
2. Check network connectivity
3. Can switch to SQLite for local database

## Recent Changes
**Date: October 3, 2025**
- ✅ Installed Node.js 20 environment
- ✅ Installed all npm dependencies (1408 packages)
- ✅ Configured system dependencies (libuuid)
- ✅ Set up workflow to run the bot automatically
- ✅ Bot successfully starts and waits for Facebook credentials

## Next Steps
1. Configure Facebook account credentials in `config.json`
2. Add your Facebook ID to admin lists
3. Test the bot by sending messages to your account
4. Customize commands and features as needed

## Support
- **Creator**: Badhon Rahman Shanto
- **Email**: badhonrohman946@outlook.com
- **Repository**: https://github.com/Badhon-00/ayanesan-gift.git

---
*Last Updated: October 3, 2025*
