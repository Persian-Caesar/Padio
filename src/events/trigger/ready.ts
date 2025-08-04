import {
  AfkDB,
  LanguageDB,
  StationDB,
  StatusDB
} from "../../types/database";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, TextChannel, VoiceChannel } from "discord.js";
import DatabaseProperties from "../../utils/DatabaseProperties";
import StatusEmbedBuilder from "../../utils/StatusEmbedBuilder";
import selectLanguage from "../../utils/selectLanguage";
import DiscordClient from "../../model/Client";
import EmbedData from "../../storage/EmbedData";
import config from "../../../config";
import error from "../../utils/error";

export default async (client: DiscordClient) => {
  try {
    const trigger_interval = 1000 * 60 * 60; // every 1 hours

    const db = client.db!;
    const defaultLanguage = selectLanguage(config.discord.default_language);
    const guild = client.guilds.cache.get(config.discord.support.id)!;
    const database = DatabaseProperties(guild.id!);
    const channel = client.channels.cache.get(config.discord.support.stats_channel) as TextChannel;

    if (guild && channel) {
      setInterval(async () => {
        const status_message = await db.get<StatusDB>(database.status);

        const embed = EmbedBuilder.from((await StatusEmbedBuilder(client))!);
        const row = [
          new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel(defaultLanguage.replies.status.refresh)
                .setEmoji(EmbedData.emotes.default.update)
                .setCustomId("refreshStatus")
            ),

          new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(defaultLanguage.replies.status.invite)
                .setEmoji(EmbedData.emotes.default.invite)
                .setURL(config.discord.default_invite.replaceValues({ clientId: client.user!.id })),

              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(defaultLanguage.replies.status.vote)
                .setEmoji(EmbedData.emotes.default.topgg)
                .setURL(`https://top.gg/bot/${client.user!.id}/vote`)
            )
        ];

        let msg: Message | undefined;
        try {
          if (status_message)
            msg = channel.messages.cache.get(status_message);
        } catch { };

        if (status_message && msg) {
          // No auto update message
          // await msg.edit({
          //   embeds: [embed]
          // });

          return;
        }

        else {
          return await channel.send({
            embeds: [embed],
            components: row
          })
            .then(async (msg) => {
              await db.set(database.status, msg.id)

              return;
            });
        }
      }, trigger_interval);
    };

    return;
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