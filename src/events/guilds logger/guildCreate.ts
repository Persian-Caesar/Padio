import { Guild } from "discord.js"
import selectLanguage from "../../utils/selectLanguage"
import SendGuildAlert from "../../utils/SendGuildAlert"
import DiscordClient from "../../model/Client"
import config from "../../../config"
import error from "../../utils/error"

export default async (client: DiscordClient, guild: Guild) => {
  try {
    const defaultLanguage = selectLanguage(config.discord.default_language);

    return await SendGuildAlert({
      client,
      guild,
      isWebhook: true,
      description: defaultLanguage.replies.guildCreate.replaceValues({
        guilds: client.guilds.cache.size.toLocaleString()
      })
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