//= require_self

$(document).ready(function(){
    var ta = $('textarea.content');
    if (ta.size()) {
        var w = $(window).width() - 40;
        var h = $(window).height() - 50;
        //$('textarea.content').width(w).height(h);

        $('input.submit').click(function(ev) {
            try {
                eval(ta.val());
            } catch (err) {
                ev.preventDefault();
                alter('內容格式錯誤，請修正');
            }
        });
    }
    
});
