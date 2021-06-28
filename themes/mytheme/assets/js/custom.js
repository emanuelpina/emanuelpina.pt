// Prevent default action on click on menus with childrens if touch screen
$('.has-children > a').on('click',function(e){
    var isTouch = ('ontouchstart' in document.documentElement);
    if( isTouch ){
        e.preventDefault();
    }
});

// Scroll up button
$('.scroll-up').css('opacity', 0);
$(window).scroll(function () {
        var windowScrollTop = $(window).scrollTop(),
            windowHeight = $(window).outerHeight(),
            bodyHeight = $(document).height(),
            trigger = windowHeight * 2, // the page content is at least twice the size of the window
            opacity = (windowScrollTop / (bodyHeight - windowHeight)) * 4
        if (bodyHeight > trigger) {
            $('.scroll-up').css('opacity', opacity);
        }
});
$(window).on('resize', function(){
    var windowScrollTop = $(window).scrollTop(),
        windowHeight = $(window).outerHeight(),
        bodyHeight = $(document).height(),
        trigger = windowHeight * 2, // the page content is at least twice the size of the window
        opacity = (windowScrollTop / (bodyHeight - windowHeight)) * 4
    if ( !(bodyHeight > trigger)) {
        $('.scroll-up').css('opacity', 0);
    } else {
        $('.scroll-up').css('opacity', opacity);
    }
});
$(document).on('click', '.scroll-up a', function(e) {
    var scroll = $(window).scrollTop(),
        scrollspeed = (scroll * 0.133); // scroll 7500px per second
    e.preventDefault();
    $("html, body").animate({scrollTop: 0}, scrollspeed);
});