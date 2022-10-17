module.exports = function(app) {

    app.get('/',function(req,res){  res.render('index.html')  });	

    app.get('/test',function(req,res){
     res.send("hello, this is test page")
    })
}