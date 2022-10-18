var express = require ('express');
const app = express()
var path=require('path');

const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var bodyParser= require ('body-parser');
const foodRouter = require('./routes/foods')

const port = 3000;

app.use(express.urlencoded({ extended: false }));

var url="mongodb+srv://test123:test@cluster0.vef7a.mongodb.net/?retryWrites=true&w=majority"

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
  console.log("Database created!");
    db.close();     });

    const connection=mongoose.connection;
    connection.once('open',()=>{
    console.log('connected..')});

    app.use(express.urlencoded({ extended: false }));
    app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
require('./routes/main')(app);

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs'); 
app.engine('html', require('ejs').renderFile);


//foodpage route displays food data
app.get('/foodpage', async (req, res) => {
   res.render('foods/index')
 });
 
app.use('/foods', foodRouter);

    
app.listen(port, () => console.log(`app is listening on port ${port}!`));
    