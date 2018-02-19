window.onload = () => {
    console.log('onloaded');
    $('a').click( (data) => {
        var templateName = data.target.id;
        $.ajax({
            type: "POST",
            url: `/${templateName}`,
            data: JSON.stringify({templateName: `${templateName}`, templateMode: 'base'}),
            dataType: "json",
            contentType: "application/json",
            complete: function(response) {
                console.log(response);
                var htmlResponse = document.createElement('html');
                htmlResponse.innerHTML = response.responseText;
                $('#iframe-template').attr('src', `${window.location.href}/${templateName}.html`);
            }
            });
    });
    $('input').click( (data) => {
        var mode = data.target.id;
        console.log('mode', mode);
    });
}
