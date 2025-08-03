const { writeFileSync } = require("fs");
const { MongoDriver } = require("quickmongo");
const { QuickDB } = require("quick.db");

require("dotenv").config()

async function uploadDataToMongoFromJson() {
    const driver = new MongoDriver(process.env.database_mongoURL)
    await driver.connect()
    const db = new QuickDB({ driver })
    const allJsonData = require("./quickdb.json")

    for (const { id, value } of allJsonData) {
        await db.set(id, value);
        console.log(`Database - ${id} is added to mongodb!`);
    }


    console.log("Done");
    process.exit()
}

async function saveDataFromMongo() {
    const driver = new MongoDriver(process.env.database_mongoURL)
    await driver.connect()
    const db = new QuickDB({ driver })


    writeFileSync("./quickdb.json", JSON.stringify(await db.all()))
    console.log("File saved.");
    process.exit()
}

saveDataFromMongo()
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */