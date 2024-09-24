const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.MONGOURI;

 mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
 });
 
const db = mongoose.connection
db.on('error', console.error.bind(console,"Mongodb Connection error"))
  // mFpYrfJU42u2tJwu

