var skills = new Array();
var currentSkills = new Array();

$(function() {

    

    $.get('/skills/all', function(data) {

        $.each(data, function(index, value) {
            skills.push(value.name);
        });

        $.get('/skills/current', function(data) {
            $.each(data, function(index, value) {
                currentSkills.push(value.name);
            });

            //This might look weird but I don't fill the skills until
            //both current and all skills have been loaded
            $("#skills").tagit({
                availableTags: skills,
                startingTags: currentSkills,
                name: 'skills[]'
            });

            $("#skills").tagit({ action: 'add', value: 'Tosto' });

        });

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
