var skills = [];
var currentSkills = [];

$(function() {
    var experienceTemplate = "<fieldset>" + $("#experience").html() + "</fieldset>";
    var schoolTemplate = "<fieldset>" + $("#school").html() + "</fieldset>";
    var pubTemplate = "<fieldset>" + $("#publication").html() + "</fieldset>";
    var affTemplate = "<fieldset>" + $("#affiliation").html() + "</fieldset>";
    var currJob = 1;
    var currSchool = 1;
    var currAff = 1;
    var currPub = 1;
    

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

        $("#expStartDate" + currJob).datepicker();
        $("#expEndDate" + currJob).datepicker();

        $("#addJob.submit").click(addJobFunc);
    };

    var addSchoolFunc = function() {
        var newSchool = schoolTemplate.replace(/1/g, ++currSchool);
        var addSchool = $("#addSchool");

        $("#numSchools").val(currSchool);

        addSchool.parent().after(newSchool);
        addSchool.remove();

        $("#addSchool.submit").click(addSchoolFunc);
    };

    var addAffiliationFunc = function() {
        var newAff = affTemplate.replace(/1/g, ++currAff);
        var addAff = $("#addAffiliation");

        $("#numAffiliations").val(currAff);

        addAff.parent().after(newAff);
        addAff.remove();

        $("#addAffiliation.submit").click(addAffiliationFunc);
    };

    var addPublicationFunc = function() {
        var newPub = pubTemplate.replace(/1/g, ++currPub);
        var addPub = $("#addPublication");

        $("#numPublications").val(currPub);

        addPub.parent().after(newPub);
        addPub.remove();

        $("#addPublication.submit").click(addPublicationFunc);
    };

    $("#addJob.submit").click(addJobFunc);
    $("#addSchool.submit").click(addSchoolFunc);
    $("#addPublication.submit").click(addPublicationFunc);
    $("#addAffiliation.submit").click(addAffiliationFunc);


    $("#expStartDate1").datepicker();
    $("#expEndDate1").datepicker();
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
