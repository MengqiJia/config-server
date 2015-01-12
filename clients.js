var express = require('express'),
    app = express(),
    router = express.Router(),
    bodyParser = require('body-parser'),
    model = require('./model'),
    clientsConfig = require('gencc'),
    exports = module.exports = router;

router.get('/', function(req, res) {
    res.send("请登录");
});

router.get('/index', function(req, res) {
    var clientList = [];
    model.getClientIDs(function(clientID) {
        clientList.push({
            "client_id": clientID
        });
    });

    res.render(__dirname + '/public/views/index.html', {
        client: clientList,
        clients: clientsConfig.get()
    });
});

router.get('/get', bodyParser.json(), function(req, res) {
    console.log("GET请求, /get接口: " + req.query);
    model.getClientInfo(req.query['client_id'], function(config) {
        console.log(config["public_key"]);
        console.log(config["client_id"]);
        console.log(config["clients"]);
        res.render(__dirname + '/public/views/client.html', {
            client_id: config["client_id"],
            public_key: config["public_key"],
            clients: config["clients"]
        });
    });
});

router.post('/save', bodyParser.json(), function(req, res) {
    console.log("POST请求, /save接口: " + req.body);
    if (!(req && req.body)) {
        logger.error("收到的请求不合法, " + req);
        return res.end("收到的请求不合法");
    }

    var clientId = req.body['client_id'];
    var pk = req.body['public_key'];
    var clients = req.body["clients"];
    var ret = {};
    if (clientId && pk && clients) {
        model.saveConfigure(clientId, pk, clients);
        ret.status = "ok";
    } else {
        ret.status = "error";
    }
    res.send(ret);
});