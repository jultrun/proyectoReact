const mongoose = require('mongoose');
const URI = 'mongodb://localhost/proyectoreact';


mongoose.connect(URI, {useUnifiedTopology: true,useNewUrlParser:true})
  .then(db => console.log('Db is connected'))
  .catch(error => console.error(error));

module.exports = mongoose;