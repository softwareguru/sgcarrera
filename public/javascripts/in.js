function loadData() {
    IN.API.Profile("me")
          .fields(["headline","summary","mainAddress"])
          .result(function(result) {
        profile = result.values[0];
        $("#title").val(profile.headline);
        $("#summary").val(profile.summary);
        alert(JSON.stringify(profile));
    });
}
