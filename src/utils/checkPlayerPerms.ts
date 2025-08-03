import { Respondable } from "../types/types";
import { LanguageDB } from "../types/database";
import DatabaseProperties from "./DatabaseProperties";
import selectLanguage from "./selectLanguage";
import responseError from "./responseError";
import config from "../../config";
import client from "../..";
import error from "./error";

export default async function (interaction: Respondable) {
  try {
    const db = client.db!;
    const database = DatabaseProperties(interaction.guildId!);
    const lang = (await db.get<LanguageDB>(database.language)) || config.discord.default_language;
    const language = selectLanguage(lang);
    const member = interaction.guild!.members.cache.get(interaction.member!.user.id);
    const channel = member?.voice?.channel;

    if (!channel) {
      await responseError(
        interaction,
        language.replies.noChannelError
      );

      return true;
    }

    if (!channel.viewable) {
      await responseError(
        interaction,
        language.replies.noPermToView
      );

      return true;
    };

    if (!channel.joinable) {
      await responseError(
        interaction,
        language.replies.noPermToConnect
      );

      return true;
    }

    if (channel.full) {
      await responseError(
        interaction,
        language.replies.channelFull
      );

      return true;
    }

    if (member.voice.deaf) {
      await responseError(
        interaction,
        language.replies.userDeaf
      );

      return true;
    };

    // if (channel.id !== radio.data.channelId) {
    //   await responseError(
    //     interaction,
    //     language.replies.notMatchedVoice
    //   );

    //   return true;
    // }

    if (interaction.guild!.members.me?.voice?.mute) {
      await responseError(
        interaction,
        language.replies.clientMute
      );

      return true;
    }

    return false;
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