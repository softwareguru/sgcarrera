function loadData() {
    IN.API.Profile("me")
            .result(function(result) {
        alert("Todo bien");
        $("#title").val(result.headline);
        alert("Todo bien 2");
    });
}
