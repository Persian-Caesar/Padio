import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
  GuildMember,
  MessageFlags,
  PermissionsBitField
} from "discord.js";
import { CommandType } from "../../types/interfaces";
import { MusicPlayer } from "@persian-caesar/discord-player";
import { LanguageDB } from "../../types/database";
import { getOption } from "../../utils/interactionTools";
import DatabaseProperties from "../../utils/DatabaseProperties";
import checkPlayerPerms from "../../utils/checkPlayerPerms";
import selectLanguage from "../../utils/selectLanguage";
import responseError from "../../utils/responseError";
import EmbedData from "../../storage/EmbedData";
import response from "../../utils/response";
import config from "../../../config";
import error from "../../utils/error";

const defaultLanguage = selectLanguage(config.discord.default_language).commands.volume;
const ephemeral = selectLanguage(config.discord.default_language).replies.ephemeral;

export default {
  data: {
    name: "volume",
    description: defaultLanguage.description,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: new PermissionsBitField([
      "SendMessages"
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
        name: "input",
        description: defaultLanguage.options.input,
        type: ApplicationCommandOptionType.Number,
        required: false,
        min_value: 1,
        max_value: 200
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
  aliases: ["sp"],
  only_owner: false,
  only_slash: true,
  only_message: true,

  run: async (client, interaction, args) => {
    try {
      const db = client.db!;
      const database = DatabaseProperties(interaction.guildId!);
      const lang = (await db.get<LanguageDB>(database.language)) || config.discord.default_language;
      const language = selectLanguage(lang).commands.volume;

      // Check perms
      if (await checkPlayerPerms(interaction))
        return;

      // Change the player volume
      const queue = new MusicPlayer((interaction.member as GuildMember).voice.channel!);
      const input = getOption<number>(interaction, "getNumber", "input", 0, args);
      if (!queue.isPlaying())
        return await responseError(
          interaction,
          selectLanguage(lang).replies.noConnection
        )

      if (!input) {
        const embed = new EmbedBuilder()
          .setColor(EmbedData.color.theme.HexToNumber())
          .setDescription(
            language.replies.currentVolume.replaceValues({
              volume: queue.getVolume().toString()
            })
          )
          .setFooter(
            {
              text: language.replies.footer
            }
          );

        return await response(interaction, {
          embeds: [embed]
        });
      }

      if (+input < 0 || +input > 200)
        return await responseError(
          interaction,
          language.replies.invalidInput
        );

      queue.setVolume(+input);
      return await response(interaction, {
        content: language.replies.success.replaceValues({
          volume: input.toString()
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