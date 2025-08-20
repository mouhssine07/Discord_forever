// Add compatibility shim at the very top
if (typeof File === 'undefined') {
  global.File = class File {
    constructor() {
      throw new Error('File class is not available in this environment');
    }
  };
}

const { Client } = require("discord.js-selfbot-v13");

const client = new Client({
  checkUpdate: false,
});

const SERVER_ID = "1244273472792957022";
const CHANNEL_ID = "1407818644603408395";

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.log("❌ ERROR: DISCORD_TOKEN environment variable is not set");
  process.exit(1);
}

console.log("✅ Starting Discord voice bot...");

let connection = null;

async function joinVoiceChannel() {
  try {
    const server = client.guilds.cache.get(SERVER_ID);
    if (!server) {
      console.log("❌ Server not found");
      console.log("Available servers:", client.guilds.cache.map(g => `${g.name} (${g.id})`));
      return;
    }

    const voiceChannel = server.channels.cache.get(CHANNEL_ID);
    if (!voiceChannel) {
      console.log("❌ Voice channel not found");
      console.log("Available channels:", server.channels.cache.map(c => `${c.name} (${c.id}) - Type: ${c.type}`));
      return;
    }

    // DEBUG: Check what type the channel actually is
    console.log(`Channel found: ${voiceChannel.name} (${voiceChannel.id})`);
    console.log(`Channel type: ${voiceChannel.type}`);
    console.log(`Channel type number: ${typeof voiceChannel.type === 'number' ? voiceChannel.type : 'unknown'}`);

    // Try to join regardless of type check (let Discord.js handle it)
    try {
      connection = await client.voice.joinChannel(voiceChannel, {
        selfDeaf: true,
        selfMute: false,
      });

      console.log(`🎵 Successfully joined voice channel: ${voiceChannel.name}`);
      
      connection.on('error', error => {
        console.error('🔇 Voice error:', error.message);
      });
      
      connection.on('disconnect', () => {
        console.log('🔌 Disconnected, reconnecting in 5 seconds...');
        setTimeout(joinVoiceChannel, 5000);
      });

    } catch (joinError) {
      console.log(`❌ Failed to join channel: ${joinError.message}`);
      console.log('🔄 Retrying in 10 seconds...');
      setTimeout(joinVoiceChannel, 10000);
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    setTimeout(joinVoiceChannel, 10000);
  }
}

client.on("ready", async () => {
  console.log(`✅ Client is ready! Logged in as ${client.user.tag}`);
  await joinVoiceChannel();
});

client.on("disconnect", () => {
  console.log("🔌 Bot disconnected from Discord");
});

client.on("error", error => {
  console.error("❌ Client error:", error.message);
});

setInterval(() => {
  console.log('🔄 Periodic reconnect...');
  if (connection) {
    try {
      connection.destroy();
    } catch (e) {}
  }
  joinVoiceChannel();
}, 3600000);

client.login(TOKEN).catch(error => {
  console.log("❌ LOGIN FAILED:", error.message);
  process.exit(1);
});

setInterval(() => {}, 1000);
