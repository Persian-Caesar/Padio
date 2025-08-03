import {
  Interaction,
  MessageFlags
} from "discord.js";
import checkCmdCooldown from "../../utils/checkCmdCooldown";
import checkCmdPerms from "../../utils/checkCmdPerms";
import DiscordClient from "../../model/Client";
import error from "../../utils/error";
import repeatAction from "../../utils/repeatAction";
import DatabaseProperties from "../../utils/DatabaseProperties";
import config from "../../../config";
import selectLanguage from "../../utils/selectLanguage";

export default async (client: DiscordClient, interaction: Interaction) => {
  try {
    const db = client.db!;
    const database = DatabaseProperties(interaction.guildId!);
    const lang = (await db.get<string>(database.language)) || config.discord.default_language;
    const language = selectLanguage(lang).replies;

    // Load Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      // Command Handler
      if (command && command.only_slash) {
        if (interaction.channel!.isDMBased() && !command.data.dm_permission)
          return;

        // Filter Owners Commands
        if (command.only_owner)
          if (!client.config.discord.support.owners.includes(interaction.user.id))
            return await interaction.reply({
              flags: MessageFlags.Ephemeral,
              content: language.onlyOwner
            })

        // Check command perms
        if (interaction.guild)
          if (await checkCmdPerms(interaction, command))
            return;

        // Command cooldown
        if (await checkCmdCooldown(interaction, command))
          return;

        // Use flags conditionally
        const ephemeralOption = interaction.options
          ? interaction.options.getString("ephemeral") === "true"
          : false;

        // Command Handler 
        await repeatAction(
          async () =>
            await interaction.deferReply({
              flags: ephemeralOption ? MessageFlags.Ephemeral : undefined,
              withResponse: true
            })
        );

        await db.add("totalCommandsUsed", 1);
        return await command.run(client, interaction);
      }
    }
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