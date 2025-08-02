import { StatusActivityType } from "../../types/types";
import { ActivityType } from "discord.js";
import DiscordClient from "../../model/Client";
import config from "../../../config";
import error from "../../utils/error";

export default async (client: DiscordClient) => {
  try {
    const db = client.db!;

    // Change Bot Status
    setInterval(async function () {
      if (config.discord.status.activity.length < 1) return;

      const
        Presence = (config.discord.status.presence || ["online"]).random(),
        Activity = config.discord.status.activity.random(),
        Type = (config.discord.status.type || ["Custom"])
          .random()
          .toLowerCase()
          .toCapitalize() as StatusActivityType,

        stateName = Activity.replaceValues({
          username: client.user!.displayName.toLocaleString(),
          servers: client.guilds.cache.size.toLocaleString(),
          members: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString(),
          prefix: config.discord.prefix,
          usedCommands: (await db.get("totalCommandsUsed") || 0).toLocaleString()
        });

      client.user!.setPresence({
        status: Presence,
        activities: [
          {
            type: ActivityType[Type],
            name: stateName,
            state: Type === "Custom" ? stateName : ""
          }
        ]
      });
    }, 30000);

    // Add Slash Commands Id to Commands
    Promise.all(
      client.commands.map(async (command) => {
        const
          cmd = client.commands.get(command.data.name)!,
          slashCommand = (await client.application!.commands.fetch({ cache: true, force: true }))
            .find(a => a.name === command.data.name);

        return client.commands.set(
          cmd.data.name,
          {
            ...cmd,
            data: {
              ...cmd.data,
              id: slashCommand?.id
            }
          }
        );
      })
    )
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