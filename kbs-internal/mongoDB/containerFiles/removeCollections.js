const { MongoClient } = require("mongodb");
const stringify = require('stringify-object')
const { dbConfig } = require("../../mainConfig/db.config");
const { roleConfig } = require("../../mainConfig/roles.config");
const dbUrl = `${dbConfig.HOST}:${dbConfig.PORT}/`;
const { GetDatabase, CloseConnection } = require("./mongo");


async function DeleteAll() {
    let qcollName, collName, database;
    const collectionsArr = [
        `${dbConfig.DBADMINCOLL}`,
        `${dbConfig.USERADMINCOLL}`,
        `${dbConfig.DBOWNERCOLL}`,
    ];

   /*
    const conn = await MongoClient.connect(dbUrl, { useUnifiedTopology: true });
    const db = await conn.db(`${dbConfig.ADMINDB}`);
   */

    database = await GetDatabase();
    let i;
    for (i = 0; i < collectionsArr.length; i++) {
        qcollName = await stringify(collectionsArr[i]);
        collName = await qcollName.replace(/['"]+/g, '');
        let collDeletion = await database.dropCollection(collName, { capped: false });
        console.log("deleted? " + collDeletion);
        if (collDeletion) {
            console.log(`${collName} Collection Deleted Successfully.... \n`);
            console.log(
                "=========================================================================="
            );
            console.log(
                "=========================================================================="
            );
        } else {
            console.log(`Could not delete ${collName}`);
        }
    }
   
   
   // conn.close();
    return 1;
}

DeleteAll();
//ConstructDatabases(dbsArr);
