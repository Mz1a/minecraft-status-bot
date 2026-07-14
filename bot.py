import os
import discord
from discord.ext import tasks
from mcstatus import JavaServer

TOKEN = os.getenv("DISCORD_TOKEN")
CHANNEL_ID = int(os.getenv("CHANNEL_ID"))
SERVER_IP = os.getenv("SERVER_IP")

intents = discord.Intents.default()
client = discord.Client(intents=intents)

estado_anterior = None

@client.event
async def on_ready():
    print(f"Conectado como {client.user}")
    comprobar_estado.start()

@tasks.loop(seconds=60)
async def comprobar_estado():
    global estado_anterior

    canal = client.get_channel(CHANNEL_ID)

    try:
        server = JavaServer.lookup(SERVER_IP)
        status = server.status()
        online = True
        jugadores = status.players.online
    except:
        online = False
        jugadores = 0

    if estado_anterior is None:
        estado_anterior = online
        return

    if online != estado_anterior:
        if online:
            await canal.send(
                f"🟢 **Servidor ONLINE**\n\n"
                f"👥 Jugadores: {jugadores}\n"
                f"🎮 IP: `{SERVER_IP}`"
            )
        else:
            await canal.send("🔴 **Servidor OFFLINE**")

        estado_anterior = online

client.run(TOKEN)
