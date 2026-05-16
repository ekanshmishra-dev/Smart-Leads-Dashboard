const mongoose = require('mongoose');
const uri = "mongodb://mishrakrishna893_db_user:ekansh123@ac-qbdyscg-shard-00-00.czff9lp.mongodb.net:27017,ac-qbdyscg-shard-00-01.czff9lp.mongodb.net:27017,ac-qbdyscg-shard-00-02.czff9lp.mongodb.net:27017/smartleads?ssl=true&authSource=admin";

async function checkUsers() {
  try {
    await mongoose.connect(uri);
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log("--- User Data in Database ---");
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
