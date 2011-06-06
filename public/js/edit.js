$(function() {

    var effect = 'blind';
    var effectTime = 500;

    var addJob = function(title, company, summary, start, end) {
        var numJobs = Number($("#numJobs").val()) + 1;
        var htmlText = "<div class='job' id='job" + numJobs + "' style='display:none;'>" + $("#hidden .job").html() + "</div>";

        title = title || '';
        company = company || '';
        summary = summary || '';
        start = start || '';
        end = end || '';


        htmlText = htmlText.replace(/numJob/g, numJobs);
        htmlText = htmlText.replace('titleValue', title);
        htmlText = htmlText.replace('companyValue', company);
        htmlText = htmlText.replace('summaryValue', summary);
        htmlText = htmlText.replace('startValue', start);
        htmlText = htmlText.replace('endValue', end);

        $("#jobPlaceholder").before(htmlText);

        $("#job" + numJobs).show(effect, {}, effectTime);
        $("#numJobs").val(numJobs);

        $("#job" + numJobs + " .removeJob").click(function() {
            var numJobs = Number($("#numJobs").val()) - 1;
            $(this).parent().parent().hide(effect, {}, effectTime);
            $(this).parent().parent().remove();
            $("#numJobs").val(numJobs);
        });
    };

    var addSchool = function(title, school, summary, start, end) {
        var numSchools = Number($("#numSchools").val()) + 1;
        var htmlText = "<div class='school' id='school" + numSchools + "' style='display:none;'>" + $("#hidden .school").html() + "</div>";

        title = title || '';
        school = school || '';
        summary = summary || '';
        start = start || '';
        end = end || '';


        htmlText = htmlText.replace(/numSchool/g, numSchools);
        htmlText = htmlText.replace('titleValue', title);
        htmlText = htmlText.replace('schoolValue', school);
        htmlText = htmlText.replace('summaryValue', summary);
        htmlText = htmlText.replace('startValue', start);
        htmlText = htmlText.replace('endValue', end);

        $("#schoolPlaceholder").before(htmlText);

        $("#school" + numSchools).show(effect, {}, effectTime);
        $("#numSchools").val(numSchools);

        $("#school" + numSchools + " .removeSchool").click(function() {
            var numSchools = Number($("#numSchools").val()) - 1;
            $(this).parent().parent().hide(effect, {}, effectTime);
            $(this).parent().parent().remove();
            $("#numSchools").val(numSchools);
        });
    };

    var fillLinkedin = function() {
    };

    $("#linkedDialog").dialog({
        autoOpen: false,
        resizable: false,
        modal: true,
        buttons: {
            Aceptar: function() {
                fillLinkedin();
                $("#linkedDialog").dialog('close');
            },
            Cancelar: function() {
                $("#linkedDialog").dialog('close');
            }
        }
    });

    $(".button").button();
    $("#linkedButton").click(function() {
        $("#linkedDialog").dialog('open');
    });

    $("#addJob").click(function() {
        addJob();
    });
    $("#addSchool").click(function() {
        addSchool();
    });
    $("#addPublication").click(function() {
    });
    $("#addAffiliation").click(function() {
    });
});
