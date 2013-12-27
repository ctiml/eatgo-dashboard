$(document).ready(function(){
    $('.list-left a').on('click', function(ev) {
        var url = $(ev.currentTarget).data('url');
        $('.iframe-container').attr('src', url);
    });
});
