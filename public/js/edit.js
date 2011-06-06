$(function() {

    var effect = 'blind';
    var effectTime = 500;

    var addJob = function(jobNum, title, company, summary, start, end) {
        var numJobs = Number($("#numJobs").val()) + 1;
        $("#jobPlaceholder").before("<div class='job' id='job" + numJobs + "' style='display:none;'>" + $("#hidden .job").html() + "</div>");

        $("#job" + numJobs).show(effect, {}, effectTime);
        $("#numJobs").val(numJobs);

        $("#job" + numJobs + " .removeJob").click(function() {
            var numJobs = Number($("#numJobs").val()) - 1;
            $(this).parent().parent().hide(effect, {}, effectTime);
            $(this).parent().parent().remove();
            $("#numJobs").val(numJobs);
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
    });
    $("#addPublication").click(function() {
    });
    $("#addAffiliation").click(function() {
    });
});
