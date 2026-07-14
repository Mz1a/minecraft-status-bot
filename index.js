const { Client, GatewayIntentBits } = require("discord.js");
const { status } = require("minecraft-server-util");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const SERVER_IP = process.env.SERVER_IP;

let ultimoEstado = null;

client.once("ready", () => {
  console.log(`Conectado como ${client.user.tag}`);

  setInterval(async () => {
    let online = false;
    let jugadores = 0;

    try {
      const res = await status(SERVER_IP, 25565);
      online = true;
      jugadores = res.players.online;
    } catch (e) {
      online = false;
    }

    if (ultimoEstado === null) {
      ultimoEstado = online;
      return;
    }

    if (online !== ultimoEstado) {
      const canal = await client.channels.fetch(CHANNEL_ID);

      if (online) {
        canal.send(
          `🟢 **Servidor ONLINE**\n👥 Jugadores: ${jugadores}\n🎮 IP: \`${SERVER_IP}\``
        );
      } else {
        canal.send("🔴 **Servidor OFFLINE**");
      }

      ultimoEstado = online;
    }
  }, 60000);
});

client.login(TOKEN);
