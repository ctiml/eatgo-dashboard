$(document).ready(function(){

    // {{{ Global Events
    $(window).on('resize', function(ev){
        var left = $('.list-left');
        var right = $('.list-right');
        var nav = $('.navbar-inner');
        left.height($(window).height() - nav.height());
        right.height($(window).height() - nav.height());
        right.width($(window).width() - left.width() - (8+1));
    });
    // }}}
    
    // {{{ Events
    var registerEvents = function() {
        $('a.list-item').on('click', function(ev) {
            var url = $(ev.currentTarget).data('url');
            $('.iframe-container').attr('src', url);
            return false;
        });

        $('a.list-item').on('mouseover', function(ev) {
            $(ev.currentTarget).addClass('focus-on');
        });

        $('a.list-item').on('mouseleave', function(ev) {
            $(ev.currentTarget).removeClass('focus-on');
        });

        $('.list-left').on('click', function(ev) {
            var left = $('.list-left');
            var right = $('.list-right');
            var nav = $('.navbar-inner');

            if (left.width() > 10) {
                right.width(right.width() + left.width());
                left.width(0);
                left.css('cursor', 'e-resize');
            } else {
                left.width(230);
                right.width(right.width() - left.width());
                left.css('cursor', 'w-resize');
            }
        });
    }
    // }}}

    $(window).trigger('resize');

    $.post('/api/list', function(list) {
        $.each(list, function(i, item){
            var a = $('<a></a>');
            a.text(item.name);
            a.attr('data-url', item.url);
            a.attr('href', '#');
            a.addClass('list-item');
            var li = $('<li></li>');
            li.append(a);
            $('.list-left ul').append(li);
        });
        registerEvents();
        $('a.list-item').first().click();
    });
});
