var request = require('superagent'),
	assert = require('assert')

request.post("http://localhost:8000/config")
	.type('application/json')
	.send({public_key: "publicKey1"})
	.end(function (res) {
		console.log(res.text);
		assert.ok(~res.text);
	})