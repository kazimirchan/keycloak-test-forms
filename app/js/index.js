window.onload = () => {
    console.log('onloaded');
    $('a').click((data) => {
        console.log(data);
        var templateName = data.target.id;
        try {
            $('#iframe-template').attr("src", './html/' + templateName + '.html');
        } catch (e) {
            throw new Error(e);
        }
       
    });
}
