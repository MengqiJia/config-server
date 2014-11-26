$('#submit').click(function() {
	$.post("/save", {
		"client_id": $("#clientID").val().strim(),
		"public_key": $("#publicKey").val().strim(),
		"clients": $("#config").val().strim()
	}, function() {
		location.reload();
	}, "json");
});