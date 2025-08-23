import {
  VoiceChannel,
  VoiceState
} from "discord.js";
import {
  AfkDB,
  StationDB
} from "../../types/database";
import DatabaseProperties from "../../utils/DatabaseProperties";
import DiscordClient from "../../model/Client";
import radiostation from "../../storage/radiostation.json";
import MusicPlayer from "../../model/MusicPlayer";
import error from "../../utils/error";

export default async (client: DiscordClient, oldState: VoiceState, newState: VoiceState) => {
  try {

    const db = client.db!;
    const state = oldState || newState;
    const database = DatabaseProperties(state.guild.id);

    const channelId = await db.get<AfkDB>(database.afk);
    const station = await db.get<StationDB>(database.station) || "Lofi Radio";
    const oldHumansInVoiceSize = oldState.channel?.members?.filter(a => !a.user.bot)?.size || 0;
    const newHumansInVoiceSize = newState.channel?.members?.filter(a => !a.user.bot)?.size || 0;
    const botDisconnected = oldState.member?.id === client.user!.id && !newState.channelId;

    if (!channelId) return;

    const player = new MusicPlayer()
      .setData({
        channelId: channelId,
        guildId: state.guild.id,
        debug: true,
        adapterCreator: state.guild.voiceAdapterCreator
      });

    if (newHumansInVoiceSize === 0 && oldHumansInVoiceSize > 0)
      return player.stop();

    if (oldHumansInVoiceSize === 0 && newHumansInVoiceSize > 0)
      return await player.radio(radiostation[station as "Anime Radio"]);

    if (botDisconnected)
      return player.join();

  }

  catch (e: any) {
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