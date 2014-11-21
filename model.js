var db = require('redis').createClient(), 
	logger = require('winston'),
	model = exports = module.exports = {};

model.getClientByPK = function(pk, next) {
	logger.info("pk = " + pk);
	db.get('pk2cc:' + pk, function(err, value){
		var ret = {};
        if(err) {
        	ret.error = "Error occured when try to get client by public key!\n" + err;
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
// to improve
model.getConfigObjByClient = function(client, next) {
	db.hgetall(client, function(err, config) {
		var ret = {};
		if(err) {
			ret.error = "Error occured when try to get config object by client\n" + err;
		}
		else {
			if(config) {
				logger.info(console);
				ret.value  = config;
			}
			else {
				ret.error = "There is no config info for " + client;
			}
		}
		next(ret);
	});
}
