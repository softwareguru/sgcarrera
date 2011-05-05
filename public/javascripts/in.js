function loadData() {
    IN.API.Profile("me")
            .result(function(result) {
        $("#title").val(result.headline);
    });
}
