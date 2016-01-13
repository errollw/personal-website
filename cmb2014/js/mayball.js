var MOBILE_WIDTH = 480;

function resize_page_fn(){

    is_mobile = $(window).width() < MOBILE_WIDTH;

    $('.mobile-only').toggle(is_mobile);
    $('.desktop-only').toggle(!is_mobile);

    place_clock();
    resize_vortex();
}

function resize_vortex(){

    var new_w = $('#vortexCanvas').parent().outerWidth(),
        new_h = $('#vortexCanvas').parent().outerHeight();

    document.getElementById("vortexCanvas").width = new_w; 
    document.getElementById("vortexCanvas").height = new_h; 

    // call paper js resizer handler
    paper.view.viewSize = [new_w, new_h];
}

function place_clock(){

    if (is_mobile) {

        $('#clock').insertBefore('#application-buttons')

        $('#clock').css({ left: 0, top:  0 });
        $('#clock_nebula').css({
            left: $(window).width()/2 - $('#clock_nebula').width()/2,
            top:  $('#clock').offset().top + 180/2 - 800/2
        });

    } else {

        $('#application-buttons').insertBefore('#clock')

        var max_w = $('#pageTitle').offset().left + $('#pageTitle').outerWidth(),
        mid_h = $('#pageTitle').offset().top + $('#pageTitle').outerHeight()/2

        $('#clock').css({
            left: max_w - $('#clock').width(),
            top:  mid_h - $('#clock').height()/2
        });

        $('#clock_nebula').css({
            left: max_w - $('#clock').width()/2 - $('#clock_nebula').width()/2,
            top:  mid_h - $('#clock_nebula').height()/2
        });

    }
}

$(function () {

    // Load clock assets, and update clock as callback
    $('#clock').load('assets/clock.svg', resize_page_fn);

    paper.setup(document.getElementById("vortexCanvas"));

    $(window).resize(resize_page_fn);
    resize_page_fn();
});