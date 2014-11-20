var express, redis, http, app, db, bodyParser, NodeRSA;
express = require('express');

app = express();

redis = require('redis');
db = redis.createClient();

bodyParser = require('body-parser');
NodeRSA = require('node-rsa');

app.post('/config', bodyParser.json(), function(req, res){
    if(!(req && req.body && req.body["public_key"])) {
        res.send("收到的请求不合法");
        return;
    }
    var pk = req.body["public_key"];
    db.hgetall('pk2cc', function(err, obj){
        if(err) {
            res.send("Error occured!" + err);
        }
        else {
            if(obj && obj[pk]) {
                res.send(obj[pk]);
            }
            else {
                res.send("No valid data for" + pk);
            }
        }
    });
});

app.use(bodyParser);
app.listen(8000, function () {
    console.log("config server started!");
})

