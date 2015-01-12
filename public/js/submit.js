$('#submit').click(function() {
    $.post("/save", {
        "client_id": $("#clientID").val().trim(),
        "public_key": $("#publicKey").val().trim(),
        "clients": $("#config").val().trim()
    }, function() {
        location.reload();
    }, "json");
});