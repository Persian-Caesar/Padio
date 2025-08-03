import { Guild } from "discord.js"
import SendGuildAlert from "../../utils/SendGuildAlert"
import DiscordClient from "../../models/DiscordClient"
import error from "../../utils/error"

export default async (client: DiscordClient, guild: Guild) => {
  try {
    return await SendGuildAlert({
      client,
      guild,
      isWebhook: true,
      description: `-# **I’ve been removed from a server, but I’m still in \`${client.guilds.cache.size.toLocaleString()}\` servers.**`
    })
  } catch (e: any) {
    error(e)
  }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA and Aria Fendereski | https://github.com/Sobhan-SRZA | https://github.com/ariafi
 * Teams: Persian Caesar, HyCom, Vixium Team | https://discord.gg/xh2S2h67UW | https://discord.gg/wEZmuzRQPp | https://discord.gg/vefvUNyPQu
 */