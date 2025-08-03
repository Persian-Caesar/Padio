import {
  afkDB,
  stationDB
} from "../../types/database";
import { MusicPlayer } from "@persian-caesar/discord-player";
import DatabaseProperties from "../../utils/DatabaseProperties";
import DiscordClient from "../../model/Client";
import radiostation from "../../storage/radiostation.json";
import config from "../../../config";
import error from "../../utils/error";
import { VoiceChannel } from "discord.js";

export default async (client: DiscordClient) => {
  try {
    await Promise.all(
      client.guilds.cache.map(async (guild) => {
        const db = client.db!;
        const database = DatabaseProperties(guild.id!);
        const lang = (await db.get<string>(database.language)) || config.discord.default_language;
        const channelId = await db.get<afkDB>(database.afk);
        const channel = guild.channels.cache.get(channelId!) as VoiceChannel;
        const station = await db.get<stationDB>(database.station) || "Lofi Radio";

        if (channel)
          return await new MusicPlayer(channel)
            .startRadio(radiostation[station as "Lofi Radio"]);

      })
    );
  } catch (e: any) {
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