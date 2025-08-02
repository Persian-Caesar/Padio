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
 * Coded by Sobhan-SRZA and Aria Fendereski | https://github.com/Sobhan-SRZA | https://github.com/ariafi
 * Teams: Persian Caesar, HyCom, Vixium Team | https://discord.gg/xh2S2h67UW | https://discord.gg/wEZmuzRQPp | https://discord.gg/vefvUNyPQu
 */