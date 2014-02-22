//= require_self
//= require jquery.ui.all

$(function(){
    
    var create_folder = function(name){
        var i = $('<i></i>').addClass('icon-plus-sign-alt');;
        var span = $('<span></span>').text(name);
        return $('<a></a>').attr('href', '#').append(i).append(span);
    };

    var create_list = function(list) {
        var ul = $('<ul></ul>');
        $.each(list, function(i, e){
            ul.append($('<li></li>').text(e.name));
        });
        return ul;
    };

    var ul = $('#sortable');
    ul.sortable();
    ul.find('li i').addClass('icon-plus-sign-alt');

    var create_menu_button = $('<li></li>').html($('<a></a>').attr('href', '#').html($('<i></i>').addClass('icon-plus')));
    $('#sortable').append(create_menu_button);
    
    ul.find('li span').each(function(i, span){
        var s = $(span);
        $.post('/api/list', {q: s.attr('id')}, function(list){
            var list_ul = $('<ul></ul>');
            $.each(list, function(j, item){
                if (item.list != null) {
                    var f = create_folder(item.name);     
                    list_ul.append(f);
                    f.after(create_list(item.list));
                } else {
                    list_ul.append($('<li></li>').text(item.name));
                }
            });
            s.parent().after(list_ul);
            list_ul.sortable();
            list_ul.toggle();
            list_ul.append(create_menu_button.clone());
        });
    });

    //ul.find('li span ul').toggle();
    ul.find('li a').click(function(ev){
        var li = $(ev.currentTarget).parent();
        var ul = li.find('ul').first();
        var i = li.find('i[class!="icon-plus"]').first();
        ul.toggle();
        i.removeClass();
        if (ul.is(':visible'))
            i.addClass('icon-minus-sign-alt');
        else
            i.addClass('icon-plus-sign-alt');
    });
});
