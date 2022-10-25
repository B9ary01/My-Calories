

module.exports = function(app) {

	        //bcrypt enhances password security
        	const bcrypt = require('bcrypt');
               
	       //if user is not loggedin, the user is redirected to the login page
	       const redirectLogin = (req, res, next) => { if (!req.session.userId ) {
                res.redirect('./login') }
                      else { next (); }
                       }
	       //express validator helps to check inputs like email format, password length
               const { check,validationResult }= require('express-validator');
		app.get('/',function(req,res){  res.render('index.html')  });	
                app.get('/about',function(req,res){  res.render('about.html')  });
          	app.get('/register', function(req,res) { res.render('register.html');  })
                app.get('/foods/saved',function(req,res){  res.render('saved.html')  });
                
        	app.get('/login',function(req,res){res.render('login.html'); });
	        app.get('/weatherform', function(req,res){res.render('weatherform.html'); });
                app.get('/searchfood',function(req,res){res.render('foodsearch.ejs'); });
				app.get('/myapp2',function(req,res){  res.send("my app2")  });	

				var url="mongodb+srv://user123:user@cluster0.vef7a.mongodb.net/?retryWrites=true&w=majority"

// advance food search
app.get('/registeredfood/', function(req, res, next) {
var MongoClient = require('mongodb').MongoClient;
	var regex= new RegExp(req.query["term"],'i'); 
	MongoClient.connect(url, function (err, client) {
		var db = client.db ('fooddata');
		//search saved food using foodname from the database
db.collection('foods').find({
	name:regex},
	{'name':1}).toArray((findErr,results)=>{
 
		var result=[];
	if(!err){  
if(results && results.length>0){
	results.forEach(item=>{
		let obj={id:item.id,
		label:"Foodname: "+item.name+" , typical value: "+
		item.typicalvalues +" , unit value: "+
		item.unitvalue+" , calorie: "+
		item.calories +" , fat: "+ 
		item.fat+" , protein: "+ 
	        item.protein +" , salt: "+ 
		item.salt +" , and sugar: "+ 
		item.sugar };
		result.push(obj);
	}); }
res.jsonp(result);
}; });}); });

//display result for foodsearch
app.post('/registeredfood/', function(req, res, next) {
var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect(url, function (err, client) {
		var db = client.db ('fooddata');
		//check foodname in the foods collection and match the foodname with user input
db.collection('foods').findOne({name:req.body.name}).then(function (userdata) {
	if(userdata){
//if userdata matches with the foodname in the database, it redirects user to foodpage 
//displays err message if the foodname is invalid
	res.redirect('./foodpage');
}else res.send('<a style="padding-left:8px;" href='+
'http://localhost:8000/'+ '>Home</a>'+'<br />'+ '<br />'+
'<p style="text-align:center; color:red;font-size:20px;">Error, food not found!</p>');
});  });  });



//displays food in JSON format
app.get('/food', function (req,res) {   
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(url, function (err, client) {        
	if (err) throw err
	var db = client.db ('test');
//find available food from collection and return in JSON 
db.collection('foods').find().toArray((findErr, results) => {
if (findErr) throw findErr;
else
res.json(results); 
client.close();
}); }); });



//weather API
app.get('/weather',[check('myCity').isString()], function(req, res) {
const request = require('request');
        const errors = validationResult(req);
const cities = require('all-the-cities');
let apiKey ='066e761a1f65e5afc2a220a339c61afc';
let myCity =req.query.cityname;

let url = `http://api.openweathermap.org/data/2.5/weather?q=${myCity}&units=metric&appid=${apiKey}`	
	request(url, function (err, response, body) {
	if(err){
	res.send(' please try again!');          
	console.log('error:', error);
	}
	var weather=JSON.parse(body);
	console.log(weather);
	
	var cods=weather.cod;
	//checking weather cods value
		if(cods !=200){
return res.redirect('http://localhost:8000/weatherform'); 
			next();
		}
		else
//display all the weather description in tabular format
	var wmsg ='<h1 style="text-align: center;color:green"><bold>Weather Description</bold></h1>'+'<br/>'+'</br>'+'<table style=" margin-left: auto; margin-right: auto;border: 2px solid black;float:center; background:whitesmoke"><tr style="border: 2px solid black";><th style="border: 2px solid black";>Country</th><th style="border:2px solid black";>City</th><th style="border: 2px solid black";>Temperature</th><th style="border: 2px solid black";>Wind</th> <th style="border: 2px solid black";>Pressure</th><th style="border: 2px solid black">Visibility</th> <th style="border:2px solid black">Timezone</th> <th style="border:2px solid black">Distance</th> <th style="border:2px solid black">Humidity</th><th style="border:2px solid black">Description</th></tr>'		+ '<tr style="float:center; background:whitesmoke"><td style="float:center;text-align: center;border: 1px solid black";>'
		+'  '+ weather.sys.country+'</td>'
		+ '<td style="border: 1px solid black;text-align: center;">'+weather.name+'</td>'
		+ '<td style="border: 1px solid black;text-align: center;">'+ weather.main.temp +'</td>'
	 + '<td style="border: 1px solid black;text-align: center;">'+ weather.wind.speed +'</td>'
	  + '<td style="border: 1px solid black;text-align: center;">'+weather.main.pressure+'</td>'
	+ '<td style="border: 1px solid black;text-align: center;">'+weather.visibility+ '</td>' 
	 + '<td style="border: 1px solid black;text-align: center;">'+weather.timezone+ '</td>' 
	 + '<td style="border: 1px solid black;text-align: center;">'+weather.dt+'</td>'
		 + '<td style="border: 1px solid black;text-align: center;">'+weather.main.humidity+'</td>'
 + '<td style="border: 1px solid black;text-align: center;">'+weather.weather[0].description
		+'</td></tr></table>';
		res.send('<a href='+'http://localhost:8000/'+'>Home</a>'+ 
		'<br />'+ '<br />'+wmsg);
	      
	});
});


//register using username,firstname,lastame, email and hashed password
//express validator implementation using 'isLength({min:8})'to check password length is at least 8 characters long
//check username input field is not empty using 'notEmpty()' and email address is valid using 'isEmail()'

//implementation of sanitisation using 'normalizeEmail()' to ensure the email address is in a safe and standard format and req.sanitize(req.body.fname) to sanitize the fname input before storing

//'trim()' trims characters (whitespace by default) at the beginning and at the end of a string

app.post('/registered',[check('username').notEmpty(),check('fname').trim(),check('lname').trim(), check('password').isLength({min:8}), check('email').isEmail().normalizeEmail()] ,function (req, res) { 
        const errors = validationResult(req);
	//express sanitizer implementation
	const plainPassword = req.sanitize(req.body.password);
        const firstName = req.sanitize(req.body.fname);
	var MongoClient = require('mongodb').MongoClient;
     MongoClient.connect(url, function(err, client) {    
	if (err) throw err;
	var db = client.db ('fooddata');
        var bcrypt = require('bcrypt'); 
	const saltRounds = 10;

	  if (!errors.isEmpty()) {
		res.redirect('./register');
	}else{
   db.collection('users').findOne({
	   //if new user email matches with the registered users, below message is displayed
	  
	  username:req.body.username
   }).then(function (user) {
 if(user){res.send( '<a href='+'http://localhost:8000/'+'>Home</a>'+
	'<br />'+ '<br />'
+"<p style='text-align:center;color:#c4511f;font-size:19px;'> Please try again! this username address already exists in the database.</p>");	}else{
 //hashing password to insert into database using bcrypt hash which outputs unique password by adding salt
	bcrypt.hash(plainPassword,saltRounds, function (err, hash) {
//saving username, hashed password and email into database	
	db.collection('users').insertOne({
	fname:firstName,
        lname:req.body.lname,
	username:req.body.username,
	password:hash,
	email:req.body.email
}).then(function(data) {
   if (data){
	   res.send( '<a href='+'http://localhost:8000/'+'>Home</a>'+ '<br />'+
	'<p style="text-align:center;color:#339933;font-size:19px;">You are now registered, Your username is: '+ req.body.username
	  + ', your password is: '+ plainPassword +
	  ' and your hashed password is: '+ hash+'</p>');
   }; });  });} });}  });  });


//logout page
app.get('/logout', (req,res) => {
	req.session.destroy(err => {
	if (err) {
	 return res.redirect('./')
		}
	res.send('<a style="padding-left:10px;" href='+'/'+'>Home</a>'+
'<p style="text-align:center;font-size:19px;color:#B16627">You are now logged out, Hope to see you again!');
 }); });


//login page
app.post('/loggedin', function (req,res) {
	const bcrypt = require('bcrypt');
        const plainPassword = req.body.password;
	const saltRounds = 10;
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect(url,function(err, client) {
	if (err) throw err;
	var db = client.db('fooddata');
//match username saved in the database
	db.collection('users').findOne({	
	username:req.body.username
	}).then(function (user) {

//display invalid message if the username is wrong
 if(!user){res.send( '<a style="padding-left:10px;" href='+'http://localhost:8000/'+'>Home</a>'+ '<br />'+ '<br />'
	 +"<p style='text-align:center;color:red;font-size:19px;'> Please try again! you entered invalid Username</p>");}
 else{

//compare the password and hashed password from the database
 bcrypt.compare(plainPassword,user.password, function(err, result) {
	if(result==true){
  // **** save user session here, when login is successful
		req.session.userId = req.body.username;
	//if result is true, display successful and unsuccessful if it is false
	res.send('<a style="padding-left:10px;" href='+
	'http://localhost:8000/'+'>Home</a>'+ '<br />'+ 
          '<br />'+ "<p style='text-align:center;color:#B16627;font-size:19px;'> Login Successful!</p>");
          } 
	 else{res.send( '<a style="padding-left:10px;" href='+
		'http://localhost:8000/'+
		'>Home</a>'+ '<br />'+ '<br />'+
		
		 "<p style='text-align:center;color:red;font-size:19px;'> Please try again! Your password is not correct, Login UnSuccessful!</p>");} 
 }); }  });  });   });




}








