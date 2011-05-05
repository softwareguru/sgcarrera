function loadData() {
    IN.API.Profile("me")
            .result(function(result) {
        alert("Todo bien " + result);
    });
}
