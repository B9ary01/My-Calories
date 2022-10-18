module.exports = function (app) {
     

    app.get('/', function (req, res) { res.render('index.html') });
    app.get('/register', function (req, res) { res.render('register.html'); })

    app.get('/login', function (req, res) { res.render('login.html'); })

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://test123:test@cluster0.vef7a.mongodb.net/?retryWrites=true&w=majority"
//bcrypt enhances password security
const bcrypt = require('bcrypt');

    //register user
    app.post('/registered', function (req, res) {
       
        const plainPassword = req.body.password;
        const firstName = req.body.fname;

        MongoClient.connect(url, function (err, client) {
            if (err) throw err;

            var db = client.db('mydb');
            const saltRounds = 10;

            if (!plainPassword) {
                res.redirect('./register');
            } else {
                db.collection('users').findOne({
                    //if new user email matches with the registered users, below message is displayed

                    username: req.body.username
                }).then(function (user) {
                    if (user) {
                        res.send('<a href=' + 'http://localhost:3000/' + '>Home</a>' +
                            '<br />' + '<br />'
                            + "<p style='text-align:center;color:#c4511f;font-size:19px;'> Please try again! this username address already exists in the database.</p>");
                    } else {
                        //hashing password to insert into database using bcrypt hash which outputs unique password by adding salt
                        bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
                            //saving username, hashed password and email into database	
                            db.collection('users').insertOne({
                                fname: firstName,
                                lname: req.body.lname,
                                username: req.body.username,
                                password: hash,
                                email: req.body.email
                            }).then(function (data) {
                                if (data) {
                                    res.send('<a href=' + 'http://localhost:3000/' + '>Home</a>' + '<br />' +
                                        '<p style="text-align:center;color:#339933;font-size:19px;">You are now registered, Your username is: ' + req.body.username
                                        + ', your password is: ' + plainPassword +
                                        ' and your hashed password is: ' + hash + '</p>');
                                };
                            });
                        });
                    }
                });
            }
        });
    });



    //login user
    app.post('/loggedin', function (req, res) {
       
        const plainPassword = req.body.password;
       
        MongoClient.connect(url, function (err, client) {
            if (err) throw err;

            var db = client.db('mydb');
            //match username saved in the database
            db.collection('users').findOne({
                username: req.body.username
            }).then(function (user) {

                //display invalid message if the username is wrong
                if (!user) {
                    res.send('<a style="padding-left:10px;" href=' + 'http://localhost:3000/login' + '>Back</a>' + '<br />' + '<br />'
                        + "<p style='text-align:center;color:red;font-size:19px;'> Please try again! you entered wrong Username</p>");
                }
                else {

                    //compare the password and hashed password from the database
                    bcrypt.compare(plainPassword, user.password, function (err, result) {
                        if (result == true) {
                            //if result is true, display successful and unsuccessful if it is false
                            res.send('<a style="padding-left:10px;" href=' +
                                'http://localhost:3000/' + '>Home</a>' + '<br />' +
                                '<br />' + "<p style='text-align:center;color:#B16627;font-size:19px;'> Login Successful!</p>");
                        }
                        else {
                            res.send('<a style="padding-left:10px;" href=' +
                                'http://localhost:3000/login' +
                                '>Back</a>' + '<br />' + '<br />' +

                                "<p style='text-align:center;color:red;font-size:19px;'> Please try again! Your password is not correct, Login UnSuccessful!</p>");
                        }
                    });
                }
            });
        });
    });






}