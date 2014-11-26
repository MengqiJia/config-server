var express = require('express')
var app = express();
var model = require('./model');
var logger = require('winston');
var bodyParser = require('body-parser');
var clients = require('./clients');
var NodeRSA = require('node-rsa');
var encrypt = function(publicKey, orig) {
        var key = new NodeRSA(publicKey.replace(/\r\n/g, '\n')),
            ret = key.encrypt(orig, 'base64');
        return ret;
    };
var hbs = require('hbs');

app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('public'));
app.use(bodyParser());

app.post('/config', bodyParser.text(), function(req, res){
    var pk, result;
    if(!(req && req.body)) {
        logger.error("收到的请求不合法, " + req);
        return res.end("收到的请求不合法");
    }
    pk = req.body;
    logger.info("接到请求，public key参数为\n" + pk);
    pk = pk.replace(/\r\n/g, '\n');
    model.getClientByPK(pk, function(client) {
        if(!client || client.value == undefined) {
            logger.error(client.error || "请求Client时发生了错误, client = " + client);
            return res.end(client.error || "请求Client时发生了错误, client = " + client);
        }
        
        model.getConfigStrByClient(client.value, function(config) {
            var ret;
            if(!config || !config.value) {
                logger.error(config.error || "请求config时发生了错误, 参数 " + client.value);
                return res.end(config.error || "请求config时发生了错误, 参数 " + client.value);
            }

            logger.info("请求处理结束，结果为：\n" + config.value);
            ret = encrypt(pk, config.value);
            logger.info(config.value);
            logger.info("ret = " + ret);
            res.send(ret);
        });
    });
});

app.use('/', clients);

app.listen(1234, function () {
    logger.info("config server started!");
})

