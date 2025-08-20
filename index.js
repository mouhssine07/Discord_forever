const { Client } = require("discord.js-selfbot-v13");

const client = new Client({
  checkUpdate: false,
});

const SERVER_ID = "1244273472792957022";
const CHANNEL_ID = "1407779809127432385";

client.on("ready", async () => {
  console.log(`✅ Client is ready! Logged in as ${client.user.tag}`);
  
  try {
    const server = client.guilds.cache.get(SERVER_ID);
    if (!server) {
      console.log("❌ Server not found");
      return;
    }

    const voiceChannel = server.channels.cache.get(CHANNEL_ID);
    if (!voiceChannel || !voiceChannel.isVoiceBased()) {
      console.log("❌ Voice channel not found");
      return;
    }

    const connection = await client.voice.joinChannel(voiceChannel, {
      selfDeaf: true,
      selfMute: false,
    });
    
    console.log(`🎵 Successfully joined: ${voiceChannel.name}`);
    
    connection.on('error', error => {
      console.error('🔇 Voice error:', error);
    });
    
    connection.on('disconnect', () => {
      console.log('🔌 Disconnected from voice');
    });

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
});

client.on("disconnect", () => {
  console.log("🔌 Bot disconnected");
});

client.on("error", console.error);

// Use environment variable for token
client.login(process.env.DISCORD_TOKEN);
