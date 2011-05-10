$(function() {
    $("#skills").tagit({
        availableTags: ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby", "python", "c", "scala", "groovy", "haskell", "perl"],
        name: 'skills[]'
    });
});

function loadData() {
    IN.API.Profile("me")
          .fields(["headline","summary","mainAddress", "skills", "positions","publications", "educations"])
          .result(function(result) {
        alert(JSON.stringify(result));
        profile = result.values[0];
        $("#title").val(profile.headline);
        $("#summary").val(profile.summary);
    });
}
