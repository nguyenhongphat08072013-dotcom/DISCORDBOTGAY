const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

const userKeys = new Map();
const userTokens = new Map();
const userTokenVerified = new Map();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

function generateRandomKey() {
  return crypto.randomBytes(16).toString("hex");
}

function generateRandomToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getUserKey(userId) {
  if (!userKeys.has(userId)) {
    userKeys.set(userId, generateRandomKey());
  }
  return userKeys.get(userId);
}

function getUserToken(userId) {
  if (!userTokens.has(userId)) {
    userTokens.set(userId, generateRandomToken());
  }
  return userTokens.get(userId);
}

client.once("ready", () => {
  console.log(`✅ Bot đã đăng nhập thành công: ${client.user.tag}`);
  console.log(`🤖 Bot đang hoạt động!`);
});

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.find(
    (ch) =>
      ch.name === "cach-lam-de-di" ||
      ch.name === "cach lam de di" ||
      ch.name === "cach-lam-de" ||
      ch.name === "cach lam de",
  );

  if (channel) {
    try {
      await channel.permissionOverwrites.create(member.user, {
        ViewChannel: false,
      });
      console.log(`🔒 Đã ẩn kênh "${channel.name}" cho ${member.user.tag}`);
    } catch (error) {
      console.error(
        `❌ Không thể ẩn kênh cho ${member.user.tag}:`,
        error.message,
      );
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.reply("🏓 Pong!");
  }

  if (message.content === "!hello") {
    message.reply(`👋 Xin chào ${message.author.username}!`);
  }

  if (message.content === "!help") {
    message.reply(
      "📋 Lệnh có sẵn:\n!ping - Kiểm tra bot\n!hello - Chào hỏi\n!help - Hiển thị trợ giúp\n/laykey - Lấy key riêng của bạn\n/nhapkey <key> - Nhập key để vào kênh\n/token - Lấy token riêng của bạn\n/nhaptoken <token> - Xác thực token để sử dụng kênh\n/ankenhcachlamde - Ẩn kênh cho admin\n/hienkenhcachlamde - Hiện kênh cho admin",
    );
  }

  if (message.content === "/laykey") {
    const userKey = getUserKey(message.author.id);
    message.reply(
      `🔑 Key riêng của bạn: \`${userKey}\`\n💡 Dùng lệnh \`/nhapkey ${userKey}\` để vào kênh "cach lam de"`,
    );
  }

  if (message.content.startsWith("/nhapkey ")) {
    const inputKey = message.content.split(" ")[1];
    const userKey = getUserKey(message.author.id);

    if (inputKey === userKey) {
      const channel = message.guild.channels.cache.find(
        (ch) =>
          ch.name === "cach-lam-de-di" ||
          ch.name === "cach lam de di" ||
          ch.name === "cach-lam-de" ||
          ch.name === "cach lam de",
      );

      if (!channel) {
        return message.reply('❌ Không tìm thấy kênh "cach lam de"!');
      }

      try {
        await channel.permissionOverwrites.create(message.author, {
          ViewChannel: true,
        });

        await channel.send(
          `🎉 Chào mừng ${message.author} đã vào kênh! Key đã được xác nhận thành công!\n\n⚠️ **BƯỚC CUỐI:** Vui lòng nhập token để hoàn tất xác thực. Dùng lệnh \`/token\` để xem token của bạn, sau đó dùng \`/nhaptoken <token>\` để xác thực!`,
        );

        message.reply(
          `✅ Key đúng! Bạn đã được dẫn vào ${channel}. Kiểm tra notification và làm theo hướng dẫn!`,
        );
      } catch (error) {
        message.reply(
          '❌ Không thể cấp quyền vào kênh. Bot cần quyền "Manage Channels"!',
        );
      }
    } else {
      message.reply("❌ Key sai! Dùng lệnh `/laykey` để xem key của bạn.");
    }
  }

  if (message.content === "/ankenhcachlamde") {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)
    ) {
      return message.reply("❌ Bạn không có quyền quản lý kênh!");
    }

    const channel = message.guild.channels.cache.find(
      (ch) =>
        ch.name === "cach-lam-de-di" ||
        ch.name === "cach lam de di" ||
        ch.name === "cach-lam-de" ||
        ch.name === "cach lam de",
    );

    if (!channel) {
      return message.reply('❌ Không tìm thấy kênh "cach lam de"!');
    }

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        ViewChannel: false,
      });
      message.reply(`✅ Đã ẩn kênh ${channel.name} cho mọi người!`);
    } catch (error) {
      message.reply('❌ Không thể ẩn kênh. Bot cần quyền "Manage Channels"!');
    }
  }

  if (message.content === "/hienkenhcachlamde") {
    if (
      !message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)
    ) {
      return message.reply("❌ Bạn không có quyền quản lý kênh!");
    }

    const channel = message.guild.channels.cache.find(
      (ch) =>
        ch.name === "cach-lam-de-di" ||
        ch.name === "cach lam de di" ||
        ch.name === "cach-lam-de" ||
        ch.name === "cach lam de",
    );

    if (!channel) {
      return message.reply('❌ Không tìm thấy kênh "cach lam de"!');
    }

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        ViewChannel: true,
      });
      message.reply(`✅ Đã hiện kênh ${channel.name} cho mọi người!`);
    } catch (error) {
      message.reply('❌ Không thể hiện kênh. Bot cần quyền "Manage Channels"!');
    }
  }
});

app.get("/", (req, res) => {
  const status = client.user ? "🟢 Online" : "🔴 Offline";
  const botName = client.user ? client.user.tag : "Đang kết nối...";

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Discord Bot Status</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          background: #2c2f33;
          color: #ffffff;
          text-align: center;
        }
        h1 { color: #7289da; }
        .status { font-size: 24px; margin: 20px 0; }
        .info { background: #23272a; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .command { background: #40444b; padding: 10px; margin: 10px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <h1>🤖 Discord Bot</h1>
      <div class="status">${status}</div>
      <div class="info">
        <h3>Thông tin Bot</h3>
        <p><strong>Tên:</strong> ${botName}</p>
        <p><strong>Keys đã tạo:</strong> ${userKeys.size} người</p>
      </div>
      <div class="info">
        <h3>📋 Lệnh có sẵn</h3>
        <div class="command">!ping - Kiểm tra bot</div>
        <div class="command">!hello - Chào hỏi</div>
        <div class="command">!help - Hiển thị trợ giúp</div>
        <div class="command">/laykey - Lấy key riêng của bạn</div>
        <div class="command">/nhapkey &lt;key&gt; - Nhập key để vào kênh</div>
        <div class="command">/ankenhcachlamde - Ẩn kênh (Admin)</div>
        <div class="command">/hienkenhcachlamde - Hiện kênh (Admin)</div>
      </div>
      <div class="info">
        <h3>🔐 Hệ thống Key</h3>
        <p>✅ Mỗi người có 1 key riêng duy nhất</p>
        <p>✅ Key không đổi khi gọi lại lệnh</p>
        <p>✅ Tự động ẩn kênh khi member mới vào</p>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Web server đang chạy tại port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
