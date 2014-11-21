var db = require('redis').createClient(),
	fs = require('fs'),
	request = require('superagent'),
	assert = require('assert'),
	path = require('path'),
	pk = fs.readFileSync(path.join(__dirname, 'public_key'), 'utf-8'),
	NodeRSA = require('node-rsa'),
	config = {
      "name": "node",
      "id": "bddc1dbb-0fe9-44ef-a3dc-6bdce55bd95e",
      "secret": "118b58a26b5759bc68db33f196430d567ec4fd03e38a105cf8e6c8b75964a950",
      "access_token": "c7b2f60ea19e74d6fe99058ee0c7a42d8caba50cb0e82e8344b99bfe4a3e4148"
    },
    client = "client_test",
    key = new NodeRSA(pk.replace(/\r\n/g, '\n'));

db.set("pk2cc:" + pk, client);
db.set("cc2clients:" + client, JSON.stringify(config));
db.hmset(client, config);
request.post("http://localhost:8000/config")
	.type('application/json')
	.send({public_key: pk})
	.end(function (res) {
		console.log(res);
		var msg = res.text;
		console.log(msg);
		var decrypted = key.decrypt(msg, 'utf-8');
		console.log(decrypted);
		assert.ok(~res.text);

		db.del("pk2cc:" + pk);
		db.del("cc2cilents:" + client);
		db.del(client);
		db.end();
	})

