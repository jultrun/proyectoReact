const express = require('express');
const path = require('path');

const app = express();
//base de datos
const { mongoose } = require('./dataBase');
//puerto
app.set('port', process.env.PORT || 3000);

app.use(express.json());

// rutas
app.use('/api', require('./routes/api'));
//archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));;

//server
app.listen(app.get('port'), () => {
    console.log(`Server on http://localhost:${app.get('port')}`);
  });