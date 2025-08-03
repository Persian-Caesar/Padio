import {
  ActionRowBuilder,
  EmbedBuilder,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  WebhookClient
} from "discord.js";
import DiscordClient from "../../models/DiscordClient";
import GetInvite from "../../utils/GetInvite";
import EmbedData from "../../storage/EmbedData";
import error from "../../utils/error";

export default async (client: DiscordClient, interaction: Interaction) => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId === "reportButton") {
        const modal = new ModalBuilder()
          .setTitle("گزارش")
          .setCustomId("reportModal")
          .addComponents(
            new ActionRowBuilder()
              .addComponents(
                new TextInputBuilder()
                  .setCustomId("reportModalMessage")
                  .setLabel("چه چیزی را می‌خواهید گزارش کنید؟")
                  .setPlaceholder("مثال: سلام، در سایت مقاله ها در موبایل قابل رویت نیستند.")
                  .setStyle(TextInputStyle.Paragraph)
              ) as ActionRowBuilder<TextInputBuilder>
          );

        return await interaction.showModal(modal);
      };

    }

    else if (interaction.isModalSubmit()) {
      if (interaction.customId === "reportModal") {
        await interaction.deferReply({ ephemeral: true });
        const
          webhook = new WebhookClient({ url: client.config.discord.support.webhook.url }),
          message = interaction.fields.getTextInputValue("reportModalMessage");

        if (interaction.guild) {
          const
            invite = (await GetInvite(interaction.guild))!,
            guildCreatedAt = Date.parse(interaction.guild.createdAt.toString()) / 1000;

          let owner;
          try {
            owner = await (await interaction.guild.fetchOwner()).user ||
              await client.users.cache.get(interaction.guild.ownerId);
          } catch { }
          const embed = new EmbedBuilder()
            .setAuthor(
              {
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ forceStatic: true })
              }
            )
            .setColor(EmbedData.color.theme.HexToNumber())
            .setDescription(
              `**گزارش:**\n${message.toString().length < 3900 ?
                message.toString() : message.toString().slice(0, 3900) + " and more..."
              }\n\n-# **از طرف ${interaction.user} | \`${interaction.user?.tag}\` | \`${interaction.user?.id}\`**`
            )
            .addFields(
              [
                {
                  name: `${EmbedData.emotes.default.owner}| مالک سرور:`,
                  value: `${EmbedData.emotes.default.reply} **${owner} | \`${owner?.tag}\` | \`${owner?.id}\`**`,
                  inline: false
                },
                {
                  name: `${EmbedData.emotes.default.server}| سرور:`,
                  value: `${EmbedData.emotes.default.reply} **${invite ? `[${interaction.guild.name}](${invite.url})` : `${interaction.guild.name}`} | \`${interaction.guild.id}\` | \`${interaction.guild.memberCount}\` Members**`,
                  inline: false
                },
                {
                  name: `${EmbedData.emotes.default.date}| ایجاد شده در:`,
                  value: `${EmbedData.emotes.default.reply} **<t:${guildCreatedAt}:D> | <t:${guildCreatedAt}:R>**`,
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
            threadId: client.config.discord.support.webhook.threads.report
          });
        } else {
          const embed = new EmbedBuilder()
            .setColor(EmbedData.color.theme.HexToNumber())
            .setDescription(
              `**گزارش:**\n${message.toString().length < 3900 ?
                message.toString() : message.toString().slice(0, 3900) + " and more..."
              }\n\n-# **از طرف ${interaction.user} | \`${interaction.user?.tag}\` | \`${interaction.user?.id}\`**`
            )
            .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: true }))
            .setTimestamp();

          await webhook.send({
            embeds: [embed],
            username: interaction.user.displayName,
            avatarURL: interaction.user.displayAvatarURL({ forceStatic: true }),
            threadId: client.config.discord.support.webhook.threads.report
          });
        }
        return await interaction.editReply({
          content: "```diff\n+ گزارش شما با موفقیت به توسعه‌دهندگان ارسال شد و طی چند روز آینده بررسی می‌شود.```"
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