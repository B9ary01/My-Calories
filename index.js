var express = require ('express');
const app = express()
var path=require('path');

const port = 3000;

app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
require('./routes/main')(app);

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs'); 
app.engine('html', require('ejs').renderFile);
    
    
app.listen(port, () => console.log(`app is listening on port ${port}!`));
    