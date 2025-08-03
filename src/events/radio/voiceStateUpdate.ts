import {
  GuildMember,
  MessageFlags,
  StringSelectMenuInteraction,
  VoiceChannel,
  VoiceState
} from "discord.js";
import { MusicPlayer } from "@persian-caesar/discord-player";
import DatabaseProperties from "../../utils/DatabaseProperties";
import checkPlayerPerms from "../../utils/checkPlayerPerms";
import selectLanguage from "../../utils/selectLanguage";
import DiscordClient from "../../model/Client";
import radiostation from "../../storage/radiostation.json";
import config from "../../../config";
import error from "../../utils/error";
import { afkDB, stationDB } from "../../types/database";

export default async (client: DiscordClient, oldState: VoiceState, newState: VoiceState) => {
  try {

    const db = client.db!;
    const state = oldState || newState;
    const database = DatabaseProperties(state.guild.id);

    const channelId = await db.get<afkDB>(database.afk);
    const station = await db.get<stationDB>(database.station) || "Lofi Radio";
    const oldHumansInVoiceSize = oldState.channel?.members?.filter(a => !a.user.bot)?.size || 0;
    const newHumansInVoiceSize = newState.channel?.members?.filter(a => !a.user.bot)?.size || 0;
    const botDisconnected = oldState.member?.id === client.user!.id && !newState.channelId;

    const channel = state.guild.channels.cache.get(channelId!) as VoiceChannel;

    const player = new MusicPlayer(channel);

    if (!channel) return;

    if (newHumansInVoiceSize === 0 && oldHumansInVoiceSize > 0)
      return player.stop();

    if (oldHumansInVoiceSize === 0 && newHumansInVoiceSize > 0)
      return await player.startRadio(radiostation[station as "Anime Radio"]);

    if (botDisconnected)
      return player.();

  } catch (e: any) {
    error(e);
  }
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */