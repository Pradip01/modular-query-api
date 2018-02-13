/**
 * Created by Kanchan Amre on 26/5/17.
 */
$(document).ready(function() {
    $("#s-menu").affix({
        offset: {
            top: 10
        }

    });

    /* activate scrollspy menu */
    var $body   = $(document.body);
    var navHeight = $('.navbar').outerHeight(true) + 82;

    $body.scrollspy({
        target: '.left-sidebar',
        offset: navHeight
    });

    $('.left-sidebar').on('activate.bs.scrollspy', function () {
        $('.active').each(function(){
            $(this).parents().removeClass('active')
        });
    });

    $('.active').each(function(){
        $(this).parents().removeClass('active')
    });

    if(window.location.hash) {
        // smooth scroll to the anchor id
        setTimeout(function(){
            $('html, body').animate({
                scrollTop: $(window.location.hash).offset().top - 80
            }, 1, function(){
                // console.log($('.active ').offset().top)
                $('#s-menu').animate({
                    scrollTop: $('.active ').position().top
                }, 2);

            });
        },500);
    }

    /* smooth scrolling sections */
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                var hash = this.hash;
                $('html,body').animate({
                    scrollTop: target.offset().top - 80
                }, 1000, function(){
                    window.location.hash = hash;
                    $(window).scrollTop(target.offset().top - 80);
                });
                return false;
            }
        }
    });
    $(".content-area h2,h3").on('click', function(e) {
        e.preventDefault();
        var hash = $(this).attr("id");
        $('html, body').animate({
            scrollTop: $(this).offset().top - 80
        }, 500, function () {
            window.location.hash = hash;
        });
    });
 });

