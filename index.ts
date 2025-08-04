/**
 * @license
  BSD 3-Clause License

  Copyright (c) 2025-2024, the respective contributors, as shown by Persian Caesar and Sobhan.SRZA (mr.sinre) file.

  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

  * Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Adding "toCapitalize" method to String class. | ts type is in ./src/types/global.d.ts
String.prototype.toCapitalize = function (): string {
    return String(this).toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}
// Adding "replaceValues" method to String class. | ts type is in ./src/types/global.d.ts
String.prototype.replaceValues = function (object: Record<string, any>): string {
    let string = String(this);
    Object
        .keys(object)
        .forEach(a => {
            string = string.replace(`{${a}}`, object[a]);
        });

    return string;
}
// Adding "HexToNumber" method to String class. | ts type is in ./src/types/global.d.ts
String.prototype.HexToNumber = function (): number {
    return parseInt(this.replace("#", ""), 16)
}
// Adding "convertToPersianString" method to String class. | ts type is in ./src/types/global.d.ts
String.prototype.convertToPersianString = function (): string {
    return this.replace(/\d+/g, (match) => {
        const number = parseInt(match, 10);

        return number.toLocaleString("fa-IR");
    });
}

// Adding "random" method to Array class. | ts type is in ./src/types/global.d.ts
Array.prototype.random = function () {
    const array = Array.from(this);
    return array[Math.floor(Math.random() * array.length)]
}
// Adding "chunk" method to Array class. | ts type is in ./src/types/array.d.ts
Array.prototype.chunk = function (size) {
    const array = Array.from(this);
    const result = [];
    for (let i = 0; i < array.length; i += size)
        result.push(array.slice(i, i + size));

    return result;
}

import { readdirSync } from "fs";
import selectLanguage from "./src/utils/selectLanguage";
import DiscordClient from "./src/model/Client";
import packageJSON from "./package.json";
import Database from "./src/model/Database";
import config from "./config";
import error from "./src/utils/error";
import post from "./src/functions/post";

const defaultLanguage = selectLanguage(config.discord.default_language);

// Add color to console messages.
import "colors";

// Load discord client
const client = new DiscordClient();
const handle = readdirSync(__dirname + "/src/handlers").filter(file => file.endsWith(".js"));

// Login 
const main = async () => {
    try {
        post(
            "Welcome to ".cyan + (packageJSON.name).blue + "! | Version: ".cyan + (packageJSON.version).blue + "\n" +
            "Coded By ".cyan + ("Sobhan-SRZA").yellow + " & ".cyan + ("Persian Caesar").yellow + " With ".cyan + ("❤️").red + "\n" +
            `Discord: ${("Mr.Sinre").blue}` + " | ".cyan + `${("mr.sinre").blue}` + " | ".cyan + `${("https://dsc.gg/persian-caesar").blue}`,
            "W",
            "magenta",
            "cyan"
        );
        post(
            defaultLanguage.replies.loadBot,
            "S"
        );

        // Initialize QuickDB
        post("Loading database...", "S")
        const databaseFile = await import("./src/utils/database");
        const loadDB = databaseFile.default || databaseFile;
        const database = await loadDB();

        if (database) {
            client.db = new Database(database.db);
            post(
                "Database Is Successfully Activated!! (Type: " + database.dbType.yellow + ")".green,
                "S"
            );
            post("Database was loaded!".green, "D")
        }

        // Load Handlers 
        let amount = 0;
        for (const file of handle) {
            const handlerFile = await import(`./src/handlers/${file}`);
            const handler = handlerFile.default || handlerFile;
            await handler(client);
            amount++;
        }

        post(
            defaultLanguage.replies.loadHandlers.split("{count}")[0].green
            + (amount.toString()).cyan
            + defaultLanguage.replies.loadHandlers.split("{count}")[1].green,
            "S"
        );
        if (client.token)
            await client
                .login(client.token)
                .catch(e => {
                    if (e.stack.toLowerCase().includes("connect"))
                        post(
                            defaultLanguage.replies.ipError,
                            "E",
                            "red",
                            "red"
                        );

                    else
                        post(
                            defaultLanguage.replies.loginError,
                            "E",
                            "red",
                            "red"
                        );

                    error(e);
                });

        else
            post(defaultLanguage.replies.noTokenError, "red", "red");

    } catch (e: any) {
        error(e);
        await client.destroy();
        process.exit(1);
    }
};
void main();

// Load Anti Crash
if (client.config.source.anti_crash) {
    process.on("unhandledRejection", (e: any) => error(e));
    process.on("rejectionHandled", (e: any) => error(e));
    process.on("uncaughtException", (e: any) => error(e));
    process.on("uncaughtExceptionMonitor", (e: any) => error(e));
}

// Export client
export default client;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */