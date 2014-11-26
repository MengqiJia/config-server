var app = require('express')(),
    model = require('./model'),
    logger = require('winston'),
    bodyParser = require('body-parser');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/get', bodyParser.json(), function(req, res) {
    model.getConfigure(req.body['client_id'], function(config) {
        res.send(config);
    })
});

app.post('/add', bodyParser.json(), function(req, res) {
    console.log(req.body);
    if(!(req && req.body)) {
        logger.error("收到的请求不合法, " + req);
        return res.end("收到的请求不合法");
    }

    var clientId = req.body['client_id'];
    var pk = req.body['public_key'];
    var clients = req.body["clients"];
    if(clientId && pk && clients) {
        model.saveConfigure(clientId, pk, clients);
    }
    res.end();
});

app.use(bodyParser);
app.listen(2345, function () {
    logger.info("config server started!");
})
