// Prevent default action on click on menus with childrens if touch screen
$('.has-children > a').on('click',function(e){
    var isTouch = ('ontouchstart' in document.documentElement);
    if( isTouch ){
        e.preventDefault();
    }
});

// Add a link tag to each h3 heading on post-content
$('.post-content > h3').each(function(){
    var headingid = $(this).attr('id');
    var isTouch = ('ontouchstart' in document.documentElement);
    $(this).append('<aside class="post-heading-link"><a href="#' + headingid + '"><svg class="icon-link" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M6.879 9.934c-0.208 0-0.416-0.079-0.575-0.238-1.486-1.486-1.486-3.905 0-5.392l3-3c0.72-0.72 1.678-1.117 2.696-1.117s1.976 0.397 2.696 1.117c1.486 1.487 1.486 3.905 0 5.392l-1.371 1.371c-0.317 0.317-0.832 0.317-1.149 0s-0.317-0.832 0-1.149l1.371-1.371c0.853-0.853 0.853-2.241 0-3.094-0.413-0.413-0.963-0.641-1.547-0.641s-1.134 0.228-1.547 0.641l-3 3c-0.853 0.853-0.853 2.241 0 3.094 0.317 0.317 0.317 0.832 0 1.149-0.159 0.159-0.367 0.238-0.575 0.238z"></path><path d="M4 15.813c-1.018 0-1.976-0.397-2.696-1.117-1.486-1.486-1.486-3.905 0-5.392l1.371-1.371c0.317-0.317 0.832-0.317 1.149 0s0.317 0.832 0 1.149l-1.371 1.371c-0.853 0.853-0.853 2.241 0 3.094 0.413 0.413 0.962 0.641 1.547 0.641s1.134-0.228 1.547-0.641l3-3c0.853-0.853 0.853-2.241 0-3.094-0.317-0.317-0.317-0.832 0-1.149s0.832-0.317 1.149 0c1.486 1.486 1.486 3.905 0 5.392l-3 3c-0.72 0.72-1.678 1.117-2.696 1.117z"></path></svg></a></aside>');
    if ( isTouch ){
        $('.post-heading-link').css("display", "inline");
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