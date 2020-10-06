const mongoose = require('mongoose');
const URI = process.env.MONGO_URL


mongoose.connect(URI, {useUnifiedTopology: true,useNewUrlParser:true,useFindAndModify: false,useCreateIndex: true,})
  .then(db => console.log('Db is connected'))
  .catch(error => console.error(error));

module.exports = mongoose;