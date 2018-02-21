window.onload = () => {
    var templateName;
    var templateModes = '';
    console.log('onloaded');
    $('a').click( (data) => {
        templateName = data.target.id;
        $.ajax({
            type: "POST",
            url: `/${templateName}`,
            data: JSON.stringify({templateName: `${templateName}`, templateMode: ''}),
            dataType: "json",
            contentType: "application/json",
            complete: function(response) {
                console.log(response);
                var htmlResponse = document.createElement('html');
                htmlResponse.innerHTML = response.responseText;
                $('#iframe-template').attr('src', `${window.location.href}${templateName}.html`);
            }
        });
    });
    $('input').click( (data) => {
        //templateMode can be undefined
        var templateArray = data.target.id.split('-');
        var templateMode = templateArray.pop(); 
        if (templateArray.join('-') !== templateName) {
            templateName = templateArray.join('-');
            templateModes = templateMode;
            console.log('i want to change template name ======> ', templateName, templateModes);
        } else if (data.target.checked) {
            // add new mode
            templateModes = !(templateModes.length > 0) ? `${templateMode}` : `${templateModes}_${templateMode}`;
            console.log('i want to add template mode ======> ', templateName, templateModes);
        } else {
            // remove mode
            templateModes = templateModes.indexOf("_") !== -1 ? templateModes.replace(`_${templateMode}`, '') : templateModes.replace(`${templateMode}`);
            console.log('i want to remove template mode ======> ', templateName, templateModes);
        }
        if (templateModes === "undefined") {
            templateModes = '';
        }
        $.ajax({
            type: "POST",
            url: `/${templateName}_${templateModes}`,
            data: JSON.stringify({templateName: `${templateName}`, templateMode: `${templateModes}`}),
            dataType: "json",
            contentType: "application/json",
            complete: function(response) {
                // console.log(response);
                var htmlResponse = document.createElement('html');
                htmlResponse.innerHTML = response.responseText;
                $('#iframe-template').attr('src', `${window.location.href}/${templateName}.html`);
            }
        });
    });
}
