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
		//console.log(pk);
		key = new NodeRSA(pk.replace(/\r\n/g, '\n'));
		client = test.client;
		clients = {
			"clients": test.clients
		};

		db.set("pk2cc:" + pk, client);
		db.set("cc2clients:" + client, JSON.stringify(clients));
	},
	after = function() {
		if (db) {
			db.del("pk2cc:" + pk);
			db.del("cc2cilents:" + client);
			db.end();
		}
	},
	run = function(index, test) {
		before(index);

		request.post("http://localhost:1234/config")
			.type('text/plain')
			.send(pk)
			.end(function(res) {
				test.ok(res);
				console.log(res);
				test.ok(res.text);
				var decrypted = key.decrypt(res.text);
				test.equal(decrypted.toString(), JSON.stringify(clients.clients));

				after();
			})
	};

test('functional test', function(fun) {
	var len = config.test.length;
	fun.plan(3 * len);
	for (var i = 0; i < len; i++) {
		run(i, fun);
	}
});