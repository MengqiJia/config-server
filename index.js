var app = require('express')(),
    model = require('./model'),
    logger = require('winston'),
    bodyParser = require('body-parser'),
    NodeRSA = require('node-rsa'),
    encrypt = function(publicKey, orig) {
        var key = new NodeRSA(publicKey.replace(/\r\n/g, '\n')),
            ret = key.encrypt(orig, 'base64');
        return ret;
    };
    
app.post('/config', bodyParser.json(), function(req, res){
    var pk, result;
    if(!(req && req.body && req.body["public_key"])) {
        logger.error("收到的请求不合法, " + req);
        return res.end("收到的请求不合法");
    }
    pk = req.body["public_key"];
    logger.info("接到请求，public key参数为\n" + pk);

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
            logger.info("ret = " + ret);
            res.send(ret);
        });
    });
});

app.use(bodyParser);
app.listen(8000, function () {
    logger.info("config server started!");
})

