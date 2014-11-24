var db = require('redis').createClient(), 
	logger = require('winston'),
	model = exports = module.exports = {};

model.getClientByPK = function(pk, next) {
	logger.info("pk = " + pk);
	db.get('pk2cc:' + pk, function(err, value){
		var ret = {};
        if(err) {
        	ret.error = "Error occured when try to get client by public key!\n" + err;
        	logger.error(ret.error);
        }
        else {
            if(value) {
            	logger.info("" + value);
                ret.value = value;
            }
            else {
                ret.error = "No valid data for" + pk;
            }
        }
        next(ret);
    });
}

model.getConfigStrByClient = function(client, next) {
	db.get("cc2clients:" + client, function(err, value) {
		var ret = {};
		if(err) {
			ret.error = "Error occured when try to get config info by client!\n" + err;
		}
		else {
			if(value) {
				logger.info(value);
				ret.value = value;
			}
			else {
				ret.error = "There is no config info for " + client;
			}
		}
		next(ret);
	});
}
model.saveConfigure = function(clientID, publicKey, clients) {
	logger.info("new configure: \nclientID = " + clientID + " publicKey = " + publicKey + " clients = " + clients);
	
	db.set('cc2pk:' + clientID, publicKey);
	db.set('pk2cc:' + publicKey, clientID);
	if(!clients) {
		clients = {"clients" :[]};
	}
	db.set('cc2clients:' + clientID, clients.toString());	
}

model.getConfigure = function(clientID, next) {
	db.get('cc2pk:' + clientID, function(err, value) {
		var ret = {};
		if(err) {
			ret.error = "Error occured when try to get config info by client!\n" + err;
			logger.error(ret.error);
		}
		else {
			if(value) {
				logger.info(value);
				ret.value = value;
			}
			else {
				ret.error = "没有请求数据" + clientID;
			}
		}
		next(ret);
	});
}