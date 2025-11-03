# **Persian Caesar Radio Bot – Full Developer Documentation**

> **Version:** `0.0.2`  
> **Language:** English  
> **Developed by:** Sobhan-SRZA (mr.sinre)  
> **GitHub:** [https://github.com/Sobhan-SRZA](https://github.com/Sobhan-SRZA)  
> **Support Server:** [https://dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)  
> **Copyright © Persian Caesar** – All rights reserved.

---

## **1. Project Overview**

**Persian Caesar Radio Bot** is a **Discord voice radio bot** built using **TypeScript** and **Discord.js v14**, designed to stream high-quality online radio stations directly into voice channels.

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

## **2. How It Works (Architecture)**

```
Client (DiscordClient)
│
├── Events → interactionCreate, ready, guildCreate/Delete
├── Handlers → Load commands & events
├── Utils → Helper functions (response, error, cooldown, etc.)
├── Storage → Embed data, radio stations, language list
├── Types → Interfaces, global extensions
├── Model → Client, Database, MusicPlayer
└── locales/ → Language JSON files
```

### Core Flow:
1. **Bot starts** → Loads config → Connects to database → Loads commands/events
2. **User runs command** → `interactionCreate` → Permission & cooldown check → Execute command
3. **Radio play** → `play` command → Join voice → Stream from URL → Create control panel
4. **Panel interaction** → Button/menu → Update player state (pause, resume, volume, stop)

---

## **3. Policies & Guidelines**

- **Credit Required**: You **must** credit **"Persian Caesar"** in any public use, documentation, or communication.
- **No Token Sharing**: Never expose `.env` or bot token.
- **No Malicious Use**: Do not use for spam, harassment, or illegal activities.
- **Forking Allowed**: You may fork, but **keep the copyright notice**.
- **Support**: Issues → Open GitHub issue or join support server.

---

## **4. Technologies & Packages**

| Package | Version | Purpose |
|--------|--------|--------|
| `discord.js` | `^14.15.3` | Discord API wrapper |
| `quick.db` | `^9.1.7` | Lightweight database (JSON/MySQL/SQLite) |
| `@discordjs/voice` | `^0.16.1` | Voice connection & audio streaming |
| `@discordjs/builders` | `^1.8.2` | Slash command builder |
| `@discordjs/rest` | `^2.3.0` | REST API for slash commands |
| `quickmongo` | `^5.2.1` | MongoDB driver (optional) |
| `chalk` | `^4.1.2` | Console color logging |
| `os` | Built-in | System stats (CPU, RAM) |
| `fs`, `path` | Built-in | File system operations |

> **Node.js Version**: `>=18.0.0`

---

## **5. Project Structure**

```
src/
├── events/
│   ├── report/                  → Report modal handler
│   ├── slash command handler/   → Main slash command router
│   └── trigger/                 → Bot status & join/leave alerts
├── functions/
│   ├── logger.ts                → Console logger
│   ├── post.ts                  → Colored console output
│   ├── setupGlobalExtensions.ts → Extend JS natives (Array.random, String.replaceValues, etc.)
│   ├── sleep.ts                 → Async delay
│   └── strToMs.ts               → Convert "1h" → milliseconds
├── handlers/
│   ├── commandHandler.ts        → Load & register commands
│   └── eventsHandler.ts         → Load & register events
├── model/
│   ├── Client.ts                → Extended Discord Client
│   ├── Database.ts              → DB wrapper
│   └── MusicPlayer.ts           → Voice player manager
├── storage/
│   ├── locales/
│   │   ├── en.json                  → English
│   │   ├── per.json                 → فارسی
│   │   ├── tr.json                  → Türkçe
│   │   ├── zh.json                  → 中文
│   │   ├── jp.json                  → 日本語
│   │   └── th.json                  → ภาษาไทย
│   ├── EmbedData.ts             → Colors, emotes, footer, update message
│   ├── languages.json          → List of supported languages
│   └── radiostation.json        → All radio URLs
├── types/
│   ├── database.ts              → DB type aliases
│   ├── global.d.ts              → Global extensions (Array.random, String.HexToNumber, etc.)
│   ├── interfaces.ts            → Command, Language, Config interfaces
│   └── types.ts                 → General types
├── utils/
│   ├── checkCmdCooldown.ts      → Cooldown system
│   ├── checkCmdPerms.ts         → Permission check
│   ├── checkPlayerPerms.ts      → Voice channel checks
│   ├── database.ts              → DB initialization
│   ├── DatabaseProperties.ts    → DB key generator
│   ├── error.ts                 → Send errors to webhook
│   ├── getAuthor.ts             → Get user from interaction/message
│   ├── GetInvite.ts             → Generate server invite
│   ├── interactionTools.ts      → Helper tools for interactions
│   ├── repeatAction.ts          → Retry failed actions
│   ├── response*.ts             → Unified reply/edit/delete
│   ├── selectLanguage.ts        → Load language JSON
│   ├── SendGuildAlert.ts        → Guild join/leave alert
│   ├── StatusEmbedBuilder.ts    → Bot status embed
│   └── yes-or-no.ts             → Yes/No confirmation
└── index.ts                     → Entry point
```

> **Note**: `locales/*.json` files contain full translation for all bot messages.

---

## **6. Setup Guide**

### Step 1: Clone & Install
```bash
git clone https://github.com/Sobhan-SRZA/Persian-Caesar-Radio-Bot.git
cd Persian-Caesar-Radio-Bot
npm install
```

### Step 2: Create `.env`
```env
# .env
TOKEN=your_bot_token_here
PREFIX=.
DEFAULT_LANGUAGE=en
OWNERS=your_user_id
SUPPORT_SERVER_ID=your_support_server_id
SUPPORT_INVITE=https://discord.gg/your-support
WEBHOOK_URL=https://discord.com/api/webhooks/...
WEBHOOK_AVATAR=https://...
WEBHOOK_USERNAME=Bot Logger
WEBHOOK_THREAD_STATUS=thread_id_for_status
WEBHOOK_THREAD_BUGS=thread_id_for_errors
WEBHOOK_THREAD_REPORT=thread_id_for_reports

# Database
DATABASE_TYPE=json
MONGO_URL=mongodb://localhost:27017/persian-caesar
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=persian_caesar

# Status
STATUS_LOOP_COUNT=30
STATUS_ACTIVITY=Playing Radio,Listening to {users} users,Watching {servers} servers
STATUS_TYPE=Playing,Listening,Watching
STATUS_PRESENCE=online,dnd,idle

# Invites
NOPERM_INVITE=your_no_perm_invite
ADMIN_INVITE=your_admin_invite
DEFAULT_INVITE=your_recommended_invite

# Misc
ANTI_CRASH=true
LOGGER=true
ONE_GUILD=false
DEFAULT_TIMEOUT=15000
```

### Step 3: Build & Run
```bash
npm run build    # Compile TS → JS
npm start        # Start bot
```

---

## **7. Config Explanation (`config.ts`)**

```ts
export default {
  source: {
    anti_crash: true,
    logger: true,
    database: {
      type: "json" | "mysql" | "sql" | "mongodb",
      mongoURL: "...",
      mysql: { host, user, password, database }
    }
  },
  discord: {
    default_language: "en",
    one_guild: false,
    delete_commands: false,
    status_loop: 30,
    token: process.env.TOKEN,
    prefix: ".",
    status: {
      activity: ["Playing Radio"],
      type: ["Playing"],
      presence: ["online"]
    },
    noperms_invite: "...",
    admin_invite: "...",
    default_invite: "...",
    support: {
      invite: "...",
      id: "...",
      stats_channel: "...",
      webhook: { url, avatar, username, threads: { status, bugs, report } },
      owners: ["123456789"]
    },
    discordbotlist: "https://top.gg/bot/..."
  }
}
```

---

## **8. Key Classes & Functions**

### `DiscordClient` (model/Client.ts)
```ts
class DiscordClient extends Client {
  commands: Collection<string, CommandType>;
  cooldowns: Collection<string, Collection<string, number>>;
  db?: QuickDB;
  readyTimestamp?: number;
  player: MusicPlayer;

  constructor() {
    super({ intents: [...] });
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.player = new MusicPlayer(this);
  }
}
```

### `MusicPlayer` (model/MusicPlayer.ts)
```ts
class MusicPlayer {
  client: DiscordClient;
  players: Map<string, RadioPlayer>;

  async play(guildId: string, station: string) { ... }
  pause(guildId: string) { ... }
  resume(guildId: string) { ... }
  stop(guildId: string) { ... }
  setVolume(guildId: string, volume: number) { ... }
}
```

### `checkCmdPerms` (utils/checkCmdPerms.ts)
```ts
// Usage in command
const hasPerm = await checkCmdPerms(interaction, command);
if (hasPerm) return;
```

### `checkCmdCooldown` (utils/checkCmdCooldown.ts)
```ts
const onCooldown = await checkCmdCooldown(interaction, command);
if (onCooldown) return;
```

### `response` (utils/response.ts)
```ts
await response(interaction, { content: "Hello!" });
```

### `selectLanguage` (utils/selectLanguage.ts)
```ts
const lang = selectLanguage("per"); // Returns full language object
```

### Global Extensions (types/global.d.ts)
```ts
"hello {name}".replaceValues({ name: "world" }) // → "hello world"
[1,2,3].random() // → 2
"#ff0000".HexToNumber() // → 16711680
"123".convertToPersianString() // → "۱۲۳"
```

---

## **9. Command Example**

### `/play` Command
```ts
{
  name: "play",
  description: "Play a radio station",
  options: [{
    name: "station",
    type: ApplicationCommandOptionType.String,
    required: true,
    autocomplete: true
  }],
  run: async (client, interaction) => {
    const station = interaction.options.getString("station")!;
    await client.player.play(interaction.guildId!, station);
    await response(interaction, { content: `Now playing: ${station}` });
  }
}
```

---

## **10. Localization System**

All text is stored in `locales/*.json`.

### Example: `locales/en.json`
```json
{
  "replies": {
    "error": "An error occurred!",
    "noChannelError": "You must be in a voice channel."
  },
  "commands": {
    "play": {
      "description": "Play a radio station"
    }
  }
}
```

### Usage:
```ts
const lang = selectLanguage(guildLang);
await response(interaction, { content: lang.replies.error });
```

---

## **11. Database Keys (via `DatabaseProperties`)**
```ts
DatabaseProperties(guildId) → {
  language: `language.${guildId}`,
  prefix: `prefix.${guildId}`,
  panel: `radioPanel.${guildId}`,
  afk: `radioAFK.${guildId}`,
  station: `radioStation.${guildId}`
}
```

---

## **12. Error Handling**

- All errors → `error(e)` → Sent to webhook if `logger: true`
- Anti-crash → Wraps critical sections
- `repeatAction` → Retries failed interactions

---

## **13. Deployment Tips**

- Use **PM2** or **systemd** for production
- Set `NODE_ENV=production`
- Use **MongoDB** for large-scale
- Enable `logger: true` in production

---

## **14. Contributing**

1. Fork the repo
2. Create branch: `feature/my-feature`
3. Commit with **English comments**
4. Open PR with description
5. **Credit Persian Caesar**

---

## **15. License & Credit**

```
Copyright © Persian Caesar
Developed by Sobhan-SRZA (mr.sinre)

You are allowed to:
- Use privately
- Modify
- Fork

You must:
- Keep copyright notice
- Credit "Persian Caesar" in docs
- Not sell or claim as your own
```

---

**Thank you for using Persian Caesar Radio Bot!**  
**Join our support server: [dsc.gg/persian-caesar](https://dsc.gg/persian-caesar)**

--- 

**Document Version:** 1.0  
**Last Updated:** November 03, 2025