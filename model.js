var config = require('config');
var db = require('./db');
var logger = require('winston');
var model = exports = module.exports = {};
var getPublicKey = function(clientID, next) {
	console.log("Here");
	db.get('cc2pk:' + clientID, function(err, value) {
		var ret = {};
		if (err) {
			ret.error = "Error occured when try to get pk info by client!\n" + err;
			logger.error(ret.error);
		} else {
			if (value) {
				logger.info(value);
				ret.value = value;
			} else {
				ret.error = "没有请求数据" + clientID;
			}
		}
		next(ret);
	});
}

var getConfigure = function(clientID, next) {
	db.get('cc2clients:' + clientID, function(err, value) {
		var ret = {};
		if (err) {
			ret.error = "Error occured when try to get config info by client!\n" + err;
			logger.error(ret.error);
		} else {
			if (value) {
				logger.info(value);
				ret.value = value;
			} else {
				ret.error = "没有请求数据" + clientID;
			}
		}
		next(ret);
	});
}

model.getClientByPK = function(pk, next) {
	logger.info("pk = " + pk);
	db.get('pk2cc:' + pk, function(err, value) {
		var ret = {};
		if (err) {
			ret.error = "Error occured when try to get client by public key!\n" + err;
			logger.error(ret.error);
		} else {
			if (value) {
				logger.info("" + value);
				ret.value = value;
			} else {
				ret.error = "No valid data for" + pk;
			}
		}
		next(ret);
	});
}

model.getConfigStrByClient = function(client, next) {
	db.get("cc2clients:" + client, function(err, value) {
		var ret = {};
		if (err) {
			ret.error = "Error occured when try to get config info by client!\n" + err;
		} else {
			if (value) {
				logger.info(value);
				ret.value = value;
			} else {
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
	if (!clients) {
		clients = {
			"clients": []
		};
	}
	db.set('cc2clients:' + clientID, clients.toString());
}

model.getClientIDs = function(next) {
	db.keys('cc2clients:*', function(err, rep) {
		console.log(typeof rep);
		rep.forEach(function(id) {
			console.log("id = " + id);
			next(id.split(":")[1]);
		});
	});
}

model.getClientInfo = function(clientID, next) {
	var ret = {};
	getPublicKey(clientID, function(config) {
		ret["public_key"] = config.value;
		getConfigure(clientID, function(config) {
			var val = config.value;
			var obj = JSON.parse(val);
			logger.info(JSON.stringify(obj));
			logger.info(JSON.stringify(obj, null, 4));

			ret["clients"] = JSON.stringify(obj, null, 4);
			ret["client_id"] = clientID;
			next(ret);
		})
	});
}