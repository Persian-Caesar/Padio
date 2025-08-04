import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  PermissionsBitField,
  VoiceChannel
} from "discord.js";
import {
  afkDB,
  LanguageDB
} from "../../types/database";
import { getChannel } from "../../utils/interactionTools";
import { CommandType } from "../../types/interfaces";
import { MusicPlayer } from "@persian-caesar/discord-player";
import DatabaseProperties from "../../utils/DatabaseProperties";
import selectLanguage from "../../utils/selectLanguage";
import responseDelete from "../../utils/responseDelete";
import responseError from "../../utils/responseError";
import EmbedData from "../../storage/EmbedData";
import response from "../../utils/response";
import config from "../../../config";
import error from "../../utils/error";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.afk;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "afk",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      "SendMessages",
      "ManageGuild"
    ]),
    default_bot_permissions: new PermissionsBitField([
      "SendMessages",
      "EmbedLinks",
      "Connect",
      "Speak"
    ]),
    dm_permission: true,
    options: [
      {
        name: "channel",
        description: defaultLanguage.options.channel,
        type: ApplicationCommandOptionType.Channel,
        channel_types: [ChannelType.GuildVoice],
        required: false
      },
      {
        name: "ephemeral",
        description: ephemeral.description,
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: ephemeral.choices.yes,
            value: "true"
          },
          {
            name: ephemeral.choices.no,
            value: "false"
          }
        ],
        required: false
      }
    ]
  },
  category: "music",
  cooldown: 5,
  usage: "[channel | id]",
  only_owner: false,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    try {
      const db = client.db!;
      const database = DatabaseProperties(interaction.guildId!);
      const lang = (await db.get<LanguageDB>(database.language)) || config.discord.default_language;
      const language = selectLanguage(lang).commands.afk;

      const  queue = client.playerManager.getPlayer(interaction.guildId!);
        const afk = client.commands.get("afk")!;

      let channel = getChannel<VoiceChannel>(interaction, "channel");
      if (!channel && queue)
        channel = (interaction.member as GuildMember)?.voice?.channel as VoiceChannel;

      const afkChannel = await db.get<afkDB>(database.afk);
      if (!channel && afkChannel) {
        const message = (await response(
          interaction,
          {
            embeds: [
              new EmbedBuilder()
                .setColor(EmbedData.color.red.HexToNumber())
                .setFooter(
                  {
                    text: EmbedData.footer.footerText,
                    iconURL: EmbedData.footer.footerIcon
                  }
                )
                .setTitle(selectLanguage(lang).replies.error)
                .setDescription(`${language.replies.doDeleteChannel.replaceValues({
                  channel: afkChannel
                })}`)
            ],
            components: [
              new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId("afk-accept")
                    .setEmoji("✅")
                    .setLabel(selectLanguage(lang).replies.buttons.buttonYes)
                    .setStyle(ButtonStyle.Success),

                  new ButtonBuilder()
                    .setCustomId("afk-cancel")
                    .setEmoji("❌")
                    .setLabel(selectLanguage(lang).replies.buttons.buttonNo)
                    .setStyle(ButtonStyle.Secondary)
                )
            ]
          }))!;

        const collector = message.createMessageComponentCollector({
          time: 60 * 1000,
          componentType: ComponentType.Button
        });
        collector.on("collect", async (button) => {
          if (button.user.id !== interaction.member!.user.id)
            return await responseError(
              button,
              selectLanguage(lang).commands.help.replies.invalidUser.replaceValues({
                mention_command: `</${afk.data.name}:${afk.data?.id}>`,
                author: interaction.member?.toString()!
              })
            );

          switch (button.customId) {
            case "afk-accept": {
              await button.deferUpdate();
              await db.delete(database.afk);
              return await button.editReply({
                content: language.replies.deleteChannel,
                embeds: [],
                components: []
              });
            };
            case "afk-cancel": {
              collector.stop();
            };
          }
        });
        collector.on("end", async () => {
          return await responseDelete(interaction, message);
        });

        return;
      }

      if (!channel || !queue)
        return await responseError(
          interaction,
          language.replies.noChannelError
        );

      if (!queue.isPlaying())
        return await responseError(
          interaction,
          language.replies.noPlayerError
        );

      await db.set(database.afk, channel!.id);
      return await response(interaction, {
        content: language.replies.success.replaceValues({
          channel: channel?.toString()!
        })
      });
    } catch (e: any) {
      error(e)
    }
  }
} as CommandType;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */