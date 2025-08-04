import {
  ActionRowBuilder,
  EmbedBuilder,
  Interaction,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  time,
  WebhookClient
} from "discord.js";
import { LanguageDB } from "../../types/database";
import DatabaseProperties from "../../utils/DatabaseProperties";
import selectLanguage from "../../utils/selectLanguage";
import DiscordClient from "../../model/Client";
import GetInvite from "../../utils/GetInvite";
import config from "../../../config";
import error from "../../utils/error";
import EmbedData from "../../storage/EmbedData";

export default async (client: DiscordClient, interaction: Interaction) => {
  try {
    const db = client.db!;
    const database = DatabaseProperties(interaction.guildId!);
    const lang = (await db.get<LanguageDB>(database.language)) || config.discord.default_language;
    const language = selectLanguage(lang);
    const defaultLanguage = selectLanguage(config.discord.default_language);

    if (interaction.isButton()) {
      if (interaction.customId === "reportButton") {
        const modal = new ModalBuilder()
          .setTitle(language.replies.modals.reportModalTitle)
          .setCustomId("reportModal")
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
              .addComponents(
                new TextInputBuilder()
                  .setCustomId("reportModalMessage")
                  .setLabel(language.replies.modals.reportModalLabel)
                  .setPlaceholder(language.replies.modals.reportModalPlaceholder)
                  .setStyle(TextInputStyle.Paragraph)
              )
          );

        return await interaction.showModal(modal);
      };

    }

    else if (interaction.isModalSubmit()) {
      if (interaction.customId === "reportModal") {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const
          webhook = new WebhookClient({ url: config.discord.support.webhook.url }),
          message = interaction.fields.getTextInputValue("reportModalMessage");

        if (interaction.guild) {
          const
            invite = await GetInvite(interaction.guild);

          let owner;
          try {
            owner = await (await interaction.guild.fetchOwner()).user ||
              await client.users.cache.get(interaction.guild.ownerId);
          } catch { }

          const guildCreatedAt = Date.parse(interaction.guild.createdAt.toString()) / 1000;

          const embed = new EmbedBuilder()
            .setAuthor(
              {
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: true })
              }
            )
            .setColor(EmbedData.color.theme.HexToNumber())
            .setDescription(
              language.replies.modals.reportEmbedDescription.replaceValues({
                message: message.toString().length < 3900 ? message.toString() : message.toString().slice(0, 3900) + " and more...",
                user: `${interaction.user} | \`${interaction.user?.tag}\` | \`${interaction.user?.id}\``
              })

            )
            .addFields(
              [
                {
                  name: `${EmbedData.emotes.default.owner}| ${defaultLanguage.replies.guild.owner}`,
                  value: `${EmbedData.emotes.default.reply} **${owner} | \`${owner?.tag}\` | \`${owner?.id}\`**`,
                  inline: false
                },
                {
                  name: `${EmbedData.emotes.default.server}| ${defaultLanguage.replies.guild.guild}`,
                  value: `${EmbedData.emotes.default.reply} **${invite ? `[${interaction.guild.name}](${invite.url})` : `${interaction.guild.name}`} | \`${interaction.guild.id}\` | \`${interaction.guild.memberCount}\` Members**`,
                  inline: false
                },
                {
                  name: `${EmbedData.emotes.default.date}| ${defaultLanguage.replies.guild.createdAt}`,
                  value: `${EmbedData.emotes.default.reply} **${time(guildCreatedAt, "D")} | ${time(guildCreatedAt, "R")}**`,
                  inline: false
                }
              ]
            )
            .setThumbnail(interaction.guild.iconURL({ forceStatic: true }))
            .setTimestamp();

          await webhook.send({
            embeds: [embed],
            username: interaction.user.displayName,
            avatarURL: interaction.user.displayAvatarURL({ forceStatic: true }),
            threadId: config.discord.support.webhook.threads.report
          });
        } else {
          const embed = new EmbedBuilder()
            .setColor(EmbedData.color.theme.HexToNumber())
            .setDescription(
              language.replies.modals.reportEmbedDescription.replaceValues({
                message: message.toString().length < 3900 ? message.toString() : message.toString().slice(0, 3900) + " and more...",
                user: `${interaction.user} | \`${interaction.user?.tag}\` | \`${interaction.user?.id}\``
              })

            )
            .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: true }))
            .setTimestamp();

          await webhook.send({
            embeds: [embed],
            username: interaction.user.displayName,
            avatarURL: interaction.user.displayAvatarURL({ forceStatic: true }),
            threadId: config.discord.support.webhook.threads.report
          });
        }

        return await interaction.editReply({
          content: language.replies.modals.sendReport
        });
      }
    }
  } catch (e: any) {
    error(e);
  }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA and Aria Fendereski | https://github.com/Sobhan-SRZA | https://github.com/ariafi
 * Teams: Persian Caesar, HyCom, Vixium Team | https://discord.gg/xh2S2h67UW | https://discord.gg/wEZmuzRQPp | https://discord.gg/vefvUNyPQu
 */