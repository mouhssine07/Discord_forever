const { Client } = require("discord.js-selfbot-v13");

const client = new Client({
  checkUpdate: false,
});

const SERVER_ID = "1244273472792957022";
const CHANNEL_ID = "1407779809127432385";

client.on("ready", async () => {
  console.log(`Client is ready! Logged in as ${client.user.tag}`);

  try {
    const server = client.guilds.cache.get(SERVER_ID);
    if (!server) {
      console.log("Server not found");
      return;
    }

    const voiceChannel = server.channels.cache.get(CHANNEL_ID);
    if (!voiceChannel) {
      console.log("Voice channel not found");
      return;
    }

    // Try the voice adapter directly
    const voiceAdapter = client.voice;
    if (!voiceAdapter || !voiceAdapter.joinChannel) {
      console.log("Voice adapter not available");
      return;
    }

    // Join the channel
    const connection = await voiceAdapter.joinChannel(voiceChannel, {
      selfDeaf: true,
      selfMute: false,
      adapterCreator: server.voiceAdapterCreator,
    });

    console.log(`Joined voice channel: ${voiceChannel.name}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log("Full error:", error);
  }
});

client.on("error", console.error);

client.login(
  "ODcxMTAwMjc1MDg2MjE3Mjk2.G-PLWA.yeN5DyGaWV7NpFA8ZVRMfT5_PtXybPgYvJOIcc"
);
