# Persian Caesar Discord Bot – Full Documentation  
**A High-Performance Radio & Utility Bot for Discord**  
*Developed by Sobhan-SRZA (mr.sinre)*  
GitHub: [Persian-Caesar](https://github.com/Persian-Caesar) | Support: [dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)  

> **Version:** `0.0.2`  
> **Language:** English  
> **Developed by:** Sobhan-SRZA (mr.sinre)  
> **GitHub:** [https://github.com/Sobhan-SRZA](https://github.com/Sobhan-SRZA)  
> **Support Server:** [https://dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)  
> **Copyright © Persian Caesar** – All rights reserved.

---

## Overview  
**Persian Caesar** is a modern, modular, and highly customizable Discord bot built with **TypeScript** and **Discord.js v14+**. It features:  
- Online radio streaming with voice channel control panels  
- Slash & message command hybrid system  
- Multi-language support (`en`, `per`, `jp`, `th`, `tr`, `zh`)  
- Dynamic status updates & server statistics  
- Cooldowns, permissions, and owner-only commands  
- QuickDB integration (JSON, MySQL, SQLite, MongoDB)  
- Advanced logging & error reporting via webhooks  

### Key Features:
- Play **50+ radio stations** (Persian Rap, Lofi, Anime, EDM, etc.)
- **Customizable per-server settings** (prefix, language, AFK channel, radio panel)
- **Interactive control panel** with buttons and select menus
- **Multilingual support** (English, Persian, Turkish, Chinese, Japanese, Thai)
- **Database support**: JSON, MySQL, SQLite, MongoDB
- **Slash & message commands**
- **Anti-crash system**, **error logging to Discord webhook**
- **Status loop**, **presence rotation**, **uptime tracking**
- **AFK mode**, **voice channel management**, **volume control**
- **Owner-only commands**, **cooldown system**, **permission checks**

---

## Core Features  

| Feature                     | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| **Radio Player**            | Stream high-quality online radio stations in voice channels          |
| **Control Panel**           | Interactive message panel with station selector                      |
| **AFK Mode**                | Auto-resume playback if users leave voice                            |
| **Slash & Prefix Commands** | Full hybrid command support                                          |
| **Multilingual**            | 6 languages with dynamic switching                                   |
| **Database Flexibility**    | JSON, MySQL, SQLite, MongoDB                                         |
| **Auto Status Updates**     | Live bot stats in support server                                     |
| **Error Logging**           | Webhook-based crash & error reporting                                |
| **Custom Extensions**       | Global `.toCapitalize()`, `.replaceValues()`, `.HexToNumber()`, etc. |

---

## Project Structure  

```
src/
├── events/                 # Event listeners
│   ├── slash command handler/
│   │   └── interactionCreate.ts
│   └── trigger/
│       ├── clientReady.ts
│       └── interactionCreate.ts
├── functions/              # Utility functions
│   ├── logger.ts
│   ├── post.ts
│   ├── setupGlobalExtensions.ts
│   ├── sleep.ts
│   └── strToMs.ts
├── handlers/               # Command & event loaders
│   ├── commandHandler.ts
│   └── eventsHandler.ts
├── model/                  # Core classes
│   ├── Client.ts
│   ├── Database.ts
│   └── MusicPlayer.ts
├── types/                  # TypeScript interfaces & types
│   ├── database.ts
│   ├── global.d.ts
│   ├── interfaces.ts
│   └── types.ts
├── utils/                  # Helper utilities
│   ├── checkCmdCooldown.ts
│   ├── checkCmdPerms.ts
│   ├── checkPlayerPerms.ts
│   ├── database.ts
│   ├── dbAccess.ts
│   ├── error.ts
│   ├── getAuthor.ts
│   ├── GetInvite.ts
│   ├── interactionTools.ts
│   ├── repeatAction.ts
│   ├── response*.ts
│   ├── selectLanguage.ts
│   ├── SendGuildAlert.ts
│   ├── StatusEmbedBuilder.ts
│   └── yes-or-no.ts
└── storage/
    ├── EmbedData.ts
    └── locales/            # Language JSON files
```

---

## Key Changes & Fixes (Latest Update)

| File             | Change                              | Description                                                                                                       |
| ---------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `clientReady.ts` | **Fixed `stats_channel` reference** | Previously used invalid `config.discord.support.stats_channel`. Now safely falls back to `support.id` if missing. |
| `MusicPlayer.ts` | **Improved stream handling**        | Uses `fetch()` with `AbortController` for timeout safety                                                          |
| `dbAccess.ts`    | **Fixed `deletePrefix` typo**       | Was deleting `language` instead of `prefix`                                                                       |
| `global.d.ts`    | **Global prototype extensions**     | `.random()`, `.chunk()`, `.replaceValues()`, etc.                                                                 |
| `error.ts`       | **Webhook error logging**           | Sends full stack trace + file attachment if >4096 chars                                                           |

---

## Setup Guide  

### 1. **Clone & Install**
```bash
git clone https://github.com/Persian-Caesar/Persian-Caesar.git
cd Persian-Caesar
npm install
```

### 2. **Configuration (`config.ts` or `.env`)**
```ts
discord: {
  token: "YOUR_BOT_TOKEN",
  default_language: "en",
  prefix: "!",
  default_invite: "https://discord.com/oauth2/authorize?client_id={clientId}&scope=bot%20applications.commands&permissions=274878258176"
},
source: {
  database: {
    type: "json", // json | mysql | sql | mongodb
    mysql: { host, user, password, database },
    mongoURL: "mongodb://..."
  },
  logger: true,
  anti_crash: true
}
```

### 3. **Run**
```bash
npm run build    # Compile TS → JS
npm start        # Start bot
```

---

## Command System  

### **Hybrid Commands**
- **Slash-only**: `only_slash: true`
- **Message-only**: `only_message: true`
- **Both**: Omit both flags

### **Cooldowns**
```ts
cooldown: 5 // seconds
```

### **Permissions**
```ts
default_member_permissions: PermissionsBitField.Flags.Administrator
default_bot_permissions: PermissionsBitField.Flags.SendMessages
```

---

## Music & Radio System  

### **Player Features**
- Queue shuffling
- Auto-reconnect
- Volume control (0–200%)
- Pause/resume
- Error recovery

### **Control Panel**
- Dropdown menu with radio stations
- Persistent message in text channel
- Auto-update on interaction

---

## Database (QuickDB Wrapper)

| Method                                             | Usage               |
| -------------------------------------------------- | ------------------- |
| `dbAccess.getLanguage(guildId)`                    | Get server language |
| `dbAccess.setPanel(guildId, { channel, message })` | Save panel          |
| `dbAccess.addTotalCommandsUsed(1)`                 | Track usage         |

Supports: **JSON**, **MySQL**, **SQLite**, **MongoDB**

---

## Logging & Error Handling  

### **Console Logger**
- Color-coded with `chalk`
- Supports strings, objects, booleans

### **Discord Webhook Logger**
- Sends errors to support server
- Thread-specific routing
- File attachment for long stacks

---

## Global Extensions (via `setupGlobalExtensions.ts`)

| Method                      | Example                                                 |
| --------------------------- | ------------------------------------------------------- |
| `.toCapitalize()`           | `"hello world".toCapitalize()` → `Hello World`          |
| `.replaceValues(obj)`       | `"{name} is {age}".replaceValues({name:"Ali", age:20})` |
| `.HexToNumber()`            | `"#ff0000".HexToNumber()` → `16711680`                  |
| `.convertToPersianString()` | `"123".convertToPersianString()` → `۱۲۳`                |
| `.random()`                 | `[1,2,3].random()` → `2`                                |
| `.chunk(size)`              | `[1,2,3,4].chunk(2)` → `[[1,2],[3,4]]`                  |

---

## Events

| Event                        | Purpose                       |
| ---------------------------- | ----------------------------- |
| `interactionCreate` (slash)  | Handle slash commands         |
| `interactionCreate` (button) | Refresh status embed          |
| `clientReady`                | Start status updater interval |

---

## Utilities

| Utility                          | Function                       |
| -------------------------------- | ------------------------------ |
| `repeatAction()`                 | Retry failed Discord API calls |
| `response()` / `responseError()` | Unified reply/edit system      |
| `checkCmdCooldown()`             | Per-user cooldown enforcement  |
| `checkCmdPerms()`                | Bot & user permission checks   |
| `StatusEmbedBuilder()`           | Dynamic bot stats embed        |

---

## Language System

### **Supported Languages**
`en` | `per` (Persian) | `jp` | `th` | `tr` | `zh`

### **Switch Language**
```ts
/setup language <lang>
```

---

## Support & Community

| Platform       | Link                                                            |
| -------------- | --------------------------------------------------------------- |
| Support Server | [dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)          |
| GitHub         | [github.com/Persian-Caesar](https://github.com/Persian-Caesar)  |
| Vote           | [top.gg/bot/padio](https://top.gg/bot/1282618377654898731/vote) |

---

## Credits & License

> **Code by Sobhan-SRZA (mr.sinre)**  
> **Developed for Persian Caesar**  
> 
> **If you use this code, you must credit "Persian Caesar" in your project.**

---

**Persian Caesar – Powering Discord with Music, Intelligence, and Elegance.**  
*Keep the servers alive. Keep the music playing.*