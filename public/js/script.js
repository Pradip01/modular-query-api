$(document).ready(function() {

    var pathUrl = window.location.pathname;
    var winWidth = $(window).innerWidth();

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
        if($(window.location.hash).length){
            setTimeout(function(){
                $('html, body').animate({
                    scrollTop: $(window.location.hash).offset().top - 80
                }, 1, function(){
                    $('#s-menu').animate({
                        scrollTop: $('.active ').position().top
                    }, 2);
                });
            },500);
        }
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

    $(".content-area h2, .content-area h3").on('click', function(e) {
        e.preventDefault();
        var hash = $(this).attr("id");
        $('html, body').animate({
            scrollTop: $(this).offset().top - 80
        }, 1000, function () {
            if(history.pushState){
                history.pushState(null, null, '#'+hash)
            }
            else{
                window.location.hash = '#'+hash;
            }
        });
    });

    $('.actionName').on("click",function(){
        $("#main").addClass("content-slide");
        $(".slide-arrow").addClass("show");
        $(".api_links").addClass("apiLink");
    });

    if(pathUrl == '/'){
        $('.nav-wrap .homeLink').addClass('active');
    }else{
        $('.nav-wrap .homeLink').removeClass('active');
    }

    // Search field click to expand
    if(winWidth > 991) {
        var inputBtn = $('.input-bx'),
            searchDiv = $('.search'),
            defaultWidth = searchDiv.css('width'),
            expandWidth = "600px";
        inputBtn.attr('autocomplete', 'off');
        inputBtn.on('focus', function () {
            searchDiv.animate({
                width: expandWidth
            });
        }).on('blur', function () {
            searchDiv.animate({
                width: defaultWidth
            });
        });
    }

    //Scroll to top
    var scroll_ID = $("#back-top");
    $(window).scroll(function (event) {
        var scroll_top = $(window).scrollTop();
        if (scroll_top >= 250) {
            (scroll_ID).addClass("show-arr");
        } else {
            (scroll_ID).removeClass("show-arr");
        }
    });
    (scroll_ID).click(function () {
        $("html, body").animate({scrollTop: 0}, 300);
    });

    //Scroll for side nav when footer reached at bottom
    if(winWidth > 991) {
        $(window).on("load resize scroll",function(){
            var windowHeight = window.innerHeight,
                windowTopHeight = $(window).scrollTop(),
                totalHeight = windowTopHeight + windowHeight,
                footerOffset = $('footer').offset().top,
                exampleConsole = $('.sideColumExampleConsole'),
                backTop = $('#back-top'),
                sMenu = $('#s-menu'),
                gotoTop = $('.go-top');
            var scroll_top = $(window).scrollTop();
            var currentWinHeight = footerOffset - totalHeight;
            if (currentWinHeight <= 0) {
                sMenu.css('top', currentWinHeight);
                exampleConsole.css('top', currentWinHeight).addClass('exmplConsole');
                //backTop.addClass('top-arrow');
                gotoTop.css({'bottom': -(currentWinHeight-30)});
            }
            else {
                sMenu.css('top', '0px');
                exampleConsole.css('top', '55px').removeClass('exmplConsole');
                //backTop.removeClass('top-arrow');
                gotoTop.css({'bottom': '70px'});
                if(scroll_top == 0){
                    gotoTop.css({'bottom': '-45px'});
                }else{
                    gotoTop.css({'bottom': '70px'});
                }
            }
        });
    }

    $('.mob-search').on('click', function(){
        $('.search').show();
        $('.input-bx').val('').focus();
        $(this).hide();
    });
    $('.hide-search').on('click', function(){
        $('.search').hide();
        $('.mob-search').show();
    });

    $('.navbar-header').on('click', function(){
        $(this).siblings().toggleClass('visible');
        $('.overlay').toggleClass('visible');
    });
    $('.overlay, .left-sidebar #s-menu li a').on('click', function(){
        $('.navbar-header').siblings().removeClass('visible');
        $('.overlay').removeClass('visible');
    });

});


$(window).bind("load", function() {
    var _location = location.href;
    var _locationIndex = _location.substring(_location.indexOf('#') + 1);
    var anchorLinks = document.getElementsByClassName('actionName');
    for (var k = 0; k < anchorLinks.length; k++) {
        var _anchorHref = (anchorLinks[k].href);
        var _anchorHrefIndex = _anchorHref.substring(_anchorHref.indexOf('#') + 1);
        var target = $('[href="#'+_anchorHrefIndex+'"]');
        if (_locationIndex == _anchorHrefIndex) {
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 80
                }, 500, function () {
                });
            }
        }
    }
});