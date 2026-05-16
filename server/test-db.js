const mongoose = require('mongoose');
const uri = "mongodb://mishrakrishna893_db_user:ekansh123@ac-qbdyscg-shard-00-00.czff9lp.mongodb.net:27017,ac-qbdyscg-shard-00-01.czff9lp.mongodb.net:27017,ac-qbdyscg-shard-00-02.czff9lp.mongodb.net:27017/smartleads?ssl=true&authSource=admin";

console.log("Connecting to direct shards...");
mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILURE:", err);
    process.exit(1);
  });
