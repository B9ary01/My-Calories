require('dotenv').config();
var MongoClient = require('mongodb').MongoClient;
var express = require ('express');
const mongoose = require('mongoose');
const Food= require('./models/food')
const foodRouter = require('./routes/foods')
const methodOverride = require('method-override')
var session = require ('express-session');
var flash = require('express-flash');
var bodyParser= require ('body-parser');
var path=require('path');
 
const expressSanitizer = require('express-sanitizer');
const app = express()
const port = 8000;

//connecting to mongodb
var url="mongodb+srv://user123:user@cluster0.vef7a.mongodb.net/?retryWrites=true&w=majority"

MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		console.log("Database created!");
		  db.close();     });

//connecting to database using mongoose library
mongoose.connect(url, {
	useNewUrlParser: true,
	 useUnifiedTopology: true 
});

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(expressSanitizer());                                                                                          

//added for session management 
app.use(session({
	secret: process.env.COOKIE_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: { expires: 600000 } })); 

app.use(flash());
app.set('views', path.join(__dirname, 'views'));
require('./routes/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs'); 
app.engine('html', require('ejs').renderFile);

//if user is not loggedin, the user is redirected to the login page
const redirectLogin = (req, res, next) => { if 
(!req.session.userId ) {
	res.redirect('./login') }
else { next (); } }

//foodpage route displays food data
app.get('/foodpage', async (req, res) => {
   const foods = await Food.find().sort({ createdAt: 'desc' })
  res.render('foods/index', { foods: foods })
});

//save page route
app.get('/savedpage', function (req, res) {
res.render('foods/save.html');});

app.use('/foods', foodRouter);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
