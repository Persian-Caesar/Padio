import {
  AfkDB,
  StationDB
} from "../../types/database";
import DatabaseProperties from "../../utils/DatabaseProperties";
import DiscordClient from "../../model/Client";
import radiostation from "../../storage/radiostation.json";
import MusicPlayer from "../../model/MusicPlayer";
import error from "../../utils/error";

export default async (client: DiscordClient) => {
  try {
    await Promise.all(
      client.guilds.cache.map(async (guild) => {
        const db = client.db!;
        const database = DatabaseProperties(guild.id!);
        const channelId = await db.get<AfkDB>(database.afk);
        const station = await db.get<StationDB>(database.station) || "Lofi Radio";

        if (channelId) {
          const player = new MusicPlayer()
            .setData({
              channelId: channelId,
              guildId: guild.id,
              adapterCreator: guild.voiceAdapterCreator
            });

          await player.radio(radiostation[station as "Lofi Radio"]);

          return;
        }

        return;
      })

    );

    return;
  }

  catch (e: any) {
    error(e);
  }
};
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */