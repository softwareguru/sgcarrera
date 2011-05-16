var skills = [];
var currentSkills = [];

$(function() {
    var experienceTemplate = "<fieldset>" + $("#experience").html() + "</fieldset>";
    var currJob = 1;
    

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

        });

    });


    var addJobFunc = function() {
        var newExp = experienceTemplate.replace(/1/g, ++currJob);
        var addJob = $("#addJob");

        $("#numJobs").val(currJob);

        addJob.parent().after(newExp);
        addJob.remove();

        $("#addJob.submit").click(addJobFunc);
    };

    $("#addJob.submit").click(addJobFunc);


});

function loadData() {
    IN.API.Profile("me")
          .fields(["headline","summary","mainAddress", "skills", "positions","publications", "educations"])
          .result(function(result) {
        profile = result.values[0];
        $("#title").val(profile.headline);
        $("#summary").val(profile.summary);
        $.each(profile.skills.values, function(index, value) {
            $("#skills").tagit({ action: 'add', value: value.skill.name });
        });
    });
}
