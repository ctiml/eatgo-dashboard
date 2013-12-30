$(document).ready(function(){

    var default_category = 'home';

    // {{{ Global Events
    $(window).on('resize', function(ev){
        var left = $('.list-left');
        var right = $('.list-right');
        var nav = $('.navbar-inner');
        left.height($(window).height() - nav.height());
        right.height($(window).height() - nav.height());
        right.width($(window).width() - left.width() - (8+1));
    });
    $('ul.nav li a').on('click', function(ev){
        var q = $(ev.currentTarget).attr('href').substr(1)
        if (q.length == 0) { q = default_category; }
        fetch(q);
        active_link(q);
    });
    // }}}
    
    // {{{ Events
    var registerEvents = function() {
        $('a.list-item').on('click', function(ev) {
            var a = $(ev.currentTarget);
            var url = a.data('url');
            if (is_supported(url)) {
                $('.iframe-container').attr('src', url);
            } else {
                window.open(url);
            }
            $('.list-left li').removeClass('active');
            a.parent().addClass('active');
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

    var is_supported = function(url) {
        if (url.match(/^http(s)?:\/\/docs\.google\.com\//)) { return true; }
        return false;
    };

    var build_list = function(list, container) {
        var ul = $('<ul></ul>');
        container.append(ul);
        $.each(list, function(index, item){
            var li = $('<li></li>');
            ul.append(li);
            if (item.list != null) {
                var folder = $('<a href="#"></a>');
                folder.addClass('folder').text(item.name);
                li.append(folder);
                build_list(item.list, li);
            } else {
                var a = $('<a></a>');
                a.text(item.name);
                a.attr('data-url', item.url);
                a.attr('href', '#');
                a.addClass('list-item');
                li.append(a);
            }
        });
    };

    var fetch = function(q){
        var container = $('.list-left');
        container.html('');
        $.post('/api/list', {q: q}, function(list) {
            build_list(list, container);
            registerEvents();
            var first = $('a.list-item').first();
            if (is_supported(first.data('url'))) {
                first.click();
            }
        });
    };

    var active_link = function(q) {
        if (q == default_category) {q = "";}
        var li = $('ul.nav li a.category[href="#' + q + '"]').parent();
        li.addClass('active');
        li.siblings().removeClass('active');
    };

    $(window).trigger('resize');

    var q = default_category;
    //var category = window.location.pathname.match(/^\/category\/(.*)/)
    var category = window.location.hash.substr(1)
    if (category.length > 0) {
        q = category;
    }

    fetch(q);
    active_link(q);
});
