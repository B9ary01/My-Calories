module.exports = function(app) {

    app.get('/',function(req,res){  res.render('index.html')  });	
    app.get('/register', function(req,res) { res.render('register.html');  })

    app.get('/login', function(req,res) { res.render('login.html');  })
   
}