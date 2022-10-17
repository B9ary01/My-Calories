var express = require ('express');
const app = express()
const port = 3000;


app.get('/hello', function (req, res) {
    res.send("this is hello route.")});
    
    
app.listen(port, () => console.log(`app is listening on port ${port}!`));
    