var clientsConfig = {},
    crypto = require('crypto'),
    exports = module.exports = clientsConfig;

function generateUUID() {
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return uuid;
};

clientsConfig.get = function() {
    var clients = [{
        "name": "node"
    }, {
        "name": "mobile"
    }];

    clients.forEach(function(ele) {
        ele.id = generateUUID();
        ele.secret = crypto.randomBytes(32).toString('hex');
    });

    console.log(JSON.stringify(clients, null, 4));
    return JSON.stringify(clients, null, 4);
};