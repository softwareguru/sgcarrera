function loadData() {
    IN.API.Profile("me")
          .fields(["headline","summary","mainAddress"])
          .result(function(result) {
        alert(JSON.stringify(result));
        profile = result.values[0];
        $("#title").val(profile.headline);
        $("#summary").val(profile.summary);
    });
}
