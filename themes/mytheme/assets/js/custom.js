$(window).scroll(function() {    
    var scroll = $(window).scrollTop();
    if (scroll > 0) {
        $(".navbar-wrap").addClass("scroll");
    } else {
        $(".navbar-wrap").removeClass("scroll");
    }
});

$(document).on('click', '.menu-trigger', function() {
    $('.navmenu').addClass('navmenu-show');
    $('.navbar-wrap').addClass('navbar-menu');
    $('.menu-trigger').addClass('menu-triggered');
    $('.menu-triggered > .icon-menu').replaceWith('<svg class="icon-close"><use xlink:href="/images/sprite.svg#close"></use></svg>');
});

$(document).on('click', '.menu-triggered', function() {
    $('.menu-triggered > .icon-close').replaceWith('<svg class="icon-menu"><use xlink:href="/images/sprite.svg#menu"></use></svg>');
    $('.menu-trigger').removeClass('menu-triggered');
    $('.navbar-wrap').removeClass('navbar-menu');
    $('.navmenu').removeClass('navmenu-show');
});

$(document).on('click', '.has-children > a', function(e) {
    var isTouch = ('ontouchstart' in document.documentElement);
    if ( isTouch ){
        console.log('Is touch');
        e.preventDefault();
    }
});

// Lazyload and responsive Youtube videos
$('.youtube').each(function(){
	var youtubeembed = $(this).attr("data-embed");
    $('[data-embed=' + youtubeembed + '] > .play').prepend('<svg class="icon-play" viewBox="0 0 68 48"><path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>');
    $('[data-embed=' + youtubeembed + ']').prepend('<img src="https://img.youtube.com/vi/' + youtubeembed + '/sddefault.jpg" />');
  $(document).on('click', '[data-embed=' + youtubeembed + ']', function() {
  	$('[data-embed=' + youtubeembed + '] > .play').replaceWith('<iframe src="https://www.youtube.com/embed/' + youtubeembed + '?autoplay=1&rel=0" frameborder="0" allowfullscreen="true" ></iframe>');
  });
});

// Lazyload and responsive Twitch videos
$('.twitch').each(function(){
	var twitchid = '0fi1un4gx6l39gwtz3j10eeqalv2mi'; //Twich API Client ID
	var twitchembed = $(this).attr("data-embed");
    $('[data-embed=' + twitchembed + '] > .play').prepend('<svg class="icon-play" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="M22.447 14.105l-14-7A1 1 0 0 0 7 8v14a.999.999 0 0 0 1.447.894l14-7a1 1 0 0 0 0-1.789"></path></svg>');
	$.getJSON('https://api.twitch.tv/kraken/videos/' + twitchembed + '?client_id=' + twitchid, function(data) {
  	var twitchthumb = data.preview;
  	var twitchthumblarge = twitchthumb.replace('320x240', '640x480');
  	$('[data-embed=' + twitchembed + ']').prepend('<img src=' + twitchthumblarge + ' />')
	});
  $(document).on('click', '[data-embed=' + twitchembed + ']', function() {
  	$('[data-embed=' + twitchembed + '] > .play').replaceWith('<iframe src="https://player.twitch.tv/?autoplay=true&video=v' + twitchembed + '&t=0h0m0s" frameborder="0" allowfullscreen="true" scrolling="no" ></iframe>');
  });
});

// GDPR box checker
$( '.contact-form' ).submit(function( event ) {
    if($('.contact-form-gdpr-box').prop('checked') == false){
        $('.contact-form-gdpr-wrap').addClass('unchecked');
        event.preventDefault();
    }
    $('.contact-form-gdpr-box').on('focus', function(){
        $('.contact-form-gdpr-wrap').removeClass('unchecked');
    });
});

// Click on site title to scroll up
$(window).scroll(function() {    
    var scroll = $(window).scrollTop();
        if (scroll > 200) {
            $('.site-title > a').addClass('to_top');
        } else {
            $('.site-title > a').removeClass('to_top');
        }
});
$(document).on('click', '.to_top', function(e) {
    var scroll = $(window).scrollTop(),
        scrollspeed = (scroll * 0.133); // scroll 7500px per second
    e.preventDefault();
    $("html, body").animate({scrollTop: 0}, scrollspeed);
 });

// Staticman
$(document).on('click', '.post-comment-reply-button', function() {
    var replyId = $(this).attr('replyto'),
        replyThread = $(this).attr('replythread');
        replyName = $(this).attr('replyname');
    $('.post-comments-form input[name="fields[replyId]"]').val(replyId);
    $('.post-comments-form input[name="fields[replyThread]"]').val(replyThread);
    $('.post-comments-form input[name="fields[replyName]"]').val(replyName);
    $('.post-comments-form-title').html('Responder a ' + replyName);
    $('html, body').animate({
        scrollTop: $('.post-comments-form-title').offset().top - 85
    }, 200);
    $('.post-comments-form-cancel').show();
 });

 $(document).on('click', '.post-comments-form-cancel', function() {
    var replyThread = $('.post-comments-form input[name="fields[replyThread]"]').val();
    $('.post-comments-form input[name="fields[replyId]"]').val('');
    $('.post-comments-form input[name="fields[replyThread]"]').val('');
    $('.post-comments-form input[name="fields[replyName]"]').val('');
    $('.post-comments-form-title').html('Deixe um comentário');
    $('html, body').animate({
        scrollTop: $('#' + replyThread).offset().top - 85
    }, 200);
    $('.post-comments-form-cancel').hide();
 });