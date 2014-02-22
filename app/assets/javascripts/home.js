$(document).ready(function(){

    var default_category = 'home';

    // {{{ Global Events
    $(window).on('resize', function(ev){
        var left = $('.list-left');
        var right = $('.list-right');
        var nav = $('.navbar-inner');
        left.height($(window).height() - nav.height());
        right.height($(window).height() - nav.height());
        right.width($(window).width() - left.width() - (8+2));
    });
    $('ul.nav li a').click(function(ev){
        var target = $(ev.currentTarget);
        var q = target.attr('href').substr(1)
        if (q.length == 0) { q = default_category; }
        var li = target.parent();
        if (li.hasClass('dropdown')) {
            $('ul.nav ul').hide();
            fetch(q);
            active_link(q);
        } else {
            li.siblings().find('ul').hide();
            if (li.find('ul').size()) {
                var ul = li.find('ul');
                if (ul.is(":visible")) {
                    ul.hide();
                } else {
                    ul.show();
                    ul.offset({left: li.offset().left});
                }
                ev.preventDefault();
            } else {
                fetch(q);
                active_link(q);
            }
        }
    });
    // }}}
    
    // {{{ Events
    var registerEvents = function() {
        $('a.list-item').on('click', function(ev) {
            var a = $(ev.currentTarget);
            var url = a.data('url');
            if (is_supported(url)) {
                var right = $('.list-right');
                $('.iframe-container', right).hide();
                var iframe = $('.iframe-container[src="' + url + '"]', right);
                
                if (iframe.length == 0) {
                    var new_iframe = $('<iframe></iframe>');
                    right.append(new_iframe);
                    new_iframe.addClass('iframe-container').attr('src', url).show();
                } else {
                    iframe.show();
                }
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

        $('div.folder').on('click', function(ev){
            var folder = $(ev.currentTarget);
            var li = folder.parent();
            var ul = $('ul', li);
            ul.slideToggle(200, function(){
                var icon = (ul.css('display') == "none") ? "icon-folder-close" : "icon-folder-open";
                $('i', li).first().removeClass().addClass(icon);
            });
            return false;
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

    // {{{ Functions
    var is_supported = function(url) {
        if (!url) return false;
        if (url.match(/^http(s)?:\/\/docs\.google\.com/)) { return true; }
        if (url.match(/^http(s)?:\/\/\w+\.hackpad\.com/)) { return true; }
        if (url.match(/^http(s)?:\/\/ethercalc\.org\//)) { return true; }
        return false;
    };

    var build_list = function(list, container) {
        var ul = $('<ul></ul>');
        container.append(ul);
        $.each(list, function(index, item){
            var icon = $('<i></i>');
            var li = $('<li></li>');
            ul.append(li);
            if (item.list != null) {
                var a = $('<a href="#"></a>');
                a.text(item.name);
                var folder = $('<div></div>');
                folder.addClass('folder').append(icon.addClass('icon-folder-open')).append(a);
                li.append(folder);
                build_list(item.list, li);
            } else {
                var a = $('<a></a>').text(item.name).attr('data-url', item.url).attr('href', '#').addClass('list-item');
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
        var li = $('ul.nav > li').filter(function() {
            var result = false;
            $(this).find('a').each(function(i, a){
                if ($(a).attr('href') === '#' + q) result = true;
            });
            return result;
        });
        li.addClass('active');
        li.siblings().removeClass('active');
    };
    // }}}

    $(window).trigger('resize');

    var q = default_category;
    var category = window.location.hash.substr(1)
    if (category.length > 0) {
        q = category;
    }

    fetch(q);
    active_link(q);
});
