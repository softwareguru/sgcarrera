$(function() {

    var effect = 'blind';
    var effectTime = 500;

    function formatDate(date) {
        if(date !== undefined) {
            var result = date.year + "-";
            if(date.month !== undefined) {
                result = date.month + "-01";
            } else {
                result = "01-01";
            }
            return result;
        } else {
            return "";
        }
    }

    function formatSelfDate(date) {
        if(date) {
            date = new Date(date);

            return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        } else {
            return "";
        }
    }

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
        $(".formError").remove();

        $("#job" + numJobs + " .removeJob").click(function() {
            $(this).parent().parent().hide(effect, {}, effectTime);
            $(this).parent().parent().remove();
            $(".formError").remove();
        });

        $("#jobStart" + numJobs).datepicker({
            formatDate: "yy-mm-dd"
        });
        $("#jobEnd" + numJobs).datepicker({
            formatDate: "yy-mm-dd"
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
        $(".formError").remove();

        $("#school" + numSchools + " .removeSchool").click(function() {
            $(this).parent().parent().hide(effect, {}, effectTime);
            $(this).parent().parent().remove();
            $(".formError").remove();
        });
        $("#schoolStart" + numSchools).datepicker({
            formatDate: "yy-mm-dd"
        });
        $("#schoolEnd" + numSchools).datepicker({
            formatDate: "yy-mm-dd"
        });
    };

    var addPublication = function(title, url) {
        var numPublications = Number($("#numPublications").val()) + 1;
        var htmlText = "<div class='publication' id='publication" + numPublications + "' style='display:none;'>" + $("#hidden .publication").html() + "</div>";

        title = title || '';
        url = url || '';

        htmlText = htmlText.replace(/numPublication/g, numPublications);
        htmlText = htmlText.replace('titleValue', title);
        htmlText = htmlText.replace('urlValue', url);

        $("#publicationPlaceholder").before(htmlText);

        $("#publication" + numPublications).show(effect, {}, effectTime);
        $("#numPublications").val(numPublications);
        $(".formError").remove();

        $("#publication" + numPublications + " .removePublication").click(function() {
            $(this).parent().parent().hide(effect, {}, effectTime);
            $(this).parent().parent().remove();
            $(".formError").remove();
        });
    };

    var addAffiliation = function(title) {
        var numAffiliations = Number($("#numAffiliations").val()) + 1;
        var htmlText = "<div class='affiliation' id='affiliation" + numAffiliations + "' style='display:none;'>" + $("#hidden .affiliation").html() + "</div>";


        title = title || '';


        htmlText = htmlText.replace(/numAffiliation/g, numAffiliations);
        htmlText = htmlText.replace('titleValue', title);

        $("#affiliationPlaceholder").before(htmlText);

        $("#affiliation" + numAffiliations).show(effect, {}, effectTime);
        $("#numAffiliations").val(numAffiliations);
        $(".formError").remove();

        $("#affiliation" + numAffiliations + " .removeAffiliation").click(function() {
            $(this).parent().parent().hide(effect, {}, effectTime);
            $(this).parent().parent().remove();
            $(".formError").remove();
        });
    };

    var fill = function() {
        $.getJSON('/interact/self', function(data) {
            $("#title").val(data.title || '');
            $("#summary").val(data.summary || '');
            $("#name").val(data.name || '');
            $("#lastName").val(data.lastNames || '');
            $("#place").val(data.place || '');
            $("#url").val(data.url[0] || '');

            if(data.jobs) {
                $.each(data.jobs, function(index, job) {
                    addJob(
                        job.title,
                        job.company,
                        job.summary,
                        formatSelfDate(job.start),
                        formatSelfDate(job.end)
                    );
                });
            }

            if(data.educations) {
                $.each(data.educations, function(index, school) {
                    addSchool(
                        school.title,
                        school.school,
                        school.summary,
                        formatSelfDate(school.start),
                        formatSelfDate(school.end)
                    );
                });
            }

            if(data.publications) {
                $.each(data.publications, function(index, publication) {
                    addPublication(
                        publication.title,
                        publication.url
                    );
                });
            }

            if(data.affiliations) {
                $.each(data.affiliations, function(index, affiliation) {
                    addAffiliation(
                        affiliation
                    );
                });
            }

        });
    };

    var fillLinkedin = function() {
        $('.removeJob').click();
        $('.removeSchool').click();
        $('.removePublication').click();
        $('.removeAffiliation').click();

        $.getJSON('/interact/importLinkedin', function(data) {
            $("#title").val(data.headline || '');
            $("#summary").val(data.summary || '');
            $("#name").val(data.firstName || '');
            $("#lastName").val(data.lastName || '');
            $("#place").val((data.location && data.location.name) || '');
            $("#url").val((data.memberUrlResources && data.memberUrlResources.values[0] && data.memberUrlResources.values[0].url) || '');


            if(data.positions && data.positions.values) {
                $.each(data.positions.values, function(index, position) {
                    addJob(
                        position.title,
                        position.company.name,
                        position.summary,
                        formatDate(position.startDate),
                        formatDate(position.endDate)
                    );
                });
            }

            if(data.educations && data.educations.values) {
                $.each(data.educations.values, function(index, school) {
                    addSchool(
                        school.fieldOfStudy,
                        school.schoolName,
                        school.summary,
                        formatDate(school.startDate),
                        formatDate(school.endDate)
                    );
                });
            }

        });

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
        addPublication();
    });
    $("#addAffiliation").click(function() {
        addAffiliation();
    });

    $("#form-container").validationEngine();

    fill();

});
