import { Guild } from "discord.js"
import SendGuildAlert from "../../utils/SendGuildAlert"
import error from "../../utils/error"
import DiscordClient from "../../model/Client"
import selectLanguage from "../../utils/selectLanguage"
import config from "../../../config"

export default async (client: DiscordClient, guild: Guild) => {
  try {
      const defaultLanguage = selectLanguage(config.discord.default_language);

    return await SendGuildAlert({
      client,
      guild,
      isWebhook: true,
      description: defaultLanguage.replies.guildDelete.replaceValues({
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