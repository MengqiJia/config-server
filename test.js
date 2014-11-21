var redis = require('redis'),
	db = redis.createClient(),	
	request = require('superagent'),
	assert = require('assert'),
	path = require('path'),
    NodeRSA = require('node-rsa'),
    config = require('config'),
    test = require('tape'),
    pk, key, client, configuration,   
    before = function(i) {
    	var test = config.test[i];
		pk = require('fs').readFileSync(path.join(__dirname, test.pk.path), 'utf-8');
		key = new NodeRSA(pk.replace(/\r\n/g, '\n'));
		client = test.client;
		configuration = test.config;

		db.set("pk2cc:" + pk, client);
		db.set("cc2clients:" + client, JSON.stringify(configuration));
		db.hmset(client, configuration);
	},
	after = function() {
		if(db) {
			db.del("pk2cc:" + pk);
			db.del("cc2cilents:" + client);
			db.del(client);
			db.end();
		}
	},
	run = function(index, fun) {
		before(index);

		request.post("http://localhost:8000/config")
		.type('application/json')
		.send({public_key: pk})
		.end(function (res) {
			fun.ok(res);
			fun.ok(res.text);

			var decrypted = key.decrypt(res.text, 'utf-8');
			console.log(decrypted);
			
			fun.equal(decrypted, JSON.stringify(configuration));

			after();
		})
	};

test('functional test', function(fun) {
	var len = config.test.length;
	fun.plan(3 * len);
	for(var i=0; i<len; i++) {
		run(i, fun);
	}
})



