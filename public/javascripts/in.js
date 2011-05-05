function loadData() {
    IN.API.Profile("me")
            .result(function(result) {
        profile = result.values[0];
        $("#title").val(profile.headline);
    });
}
