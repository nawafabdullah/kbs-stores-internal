const { GetDatabase, CloseConnection } = require('../../../../../mongoDB/containerFiles/mongo');
const { dbConfig } = require('../../../../../mainConfig/db.config');
const bcrypt = require("bcrypt");

async function RetrieveUser(userData, dbPath) {
  const database = await GetDatabase(dbConfig.ADMINDB);
  try {
    let userExists = await database.collection(`${dbPath}`).findOne(
      { email: userData.email }
      //,{ _id: 0, 'name.first': 0, birth: 0 }
    );
    if (userExists) {
      console.log("UserName Found! \nAuthenticating...");
/*      //password = await Decrypt(userData, dbPath); */
      checkUser(userData.password, userExists.password);
    } else {
      console.log("Invalid UserName");
      return false;
    }
  } catch (error) {
    console.log("An Error Occured, Could Not Retrieve The Requested Database User: " + error);
    return false;
  }
  return true;
}

async function checkUser(insertedPass, retrievedPass) {
  try {
    const match = await bcrypt.compare(insertedPass, retrievedPass);
    if (match) {
      //login
      console.log("You Are Authoraized!");
      return true;
    } else {
      console.log("Password Does Not Match Our Records!");
      return false;
    }
  } catch (error) {
    console.log("Could Not Authenticate: " + error);
  }
}

module.exports = {
  RetrieveUser
};
