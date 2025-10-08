# Discord Bot Scaffold

This folder contains a minimal scaffold for a Discord bot using discord.js (v14).

Quick start

1. Copy `.env.example` to `.env` and set your `DISCORD_TOKEN` and `CLIENT_ID`.
2. From `discord-bot` run:

```bash
npm install
npm start
```

Files

- `src/index.js` - bot entrypoint (simple ping command)
- `src/commands/ping.js` - example command
- `.env.example` - env variables sample

Next steps

- Add commands into `src/commands`
- Add event handlers into `src/events`
- Consider adding a command loader for dynamic commands
