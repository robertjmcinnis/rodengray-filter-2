/*JS file for landing page*/


// Copy pasted from http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/
(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          }

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  };
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

// Get inline style value
(function ($) {
    $.fn.inlineStyle = function (prop) {
        return this.prop("style")[$.camelCase(prop)];
    };
}(jQuery));


rg15 = (typeof rg15 === 'undefined') ? {} : rg15;

// initialize when document ready / window resized
$(document).ready(function() {
    rg15.initFunc();

    $(window).smartresize(function() {
        rg15.initFunc();
    });
});

rg15.initFunc = function() {
    //var w = $(window).width();
    //var no_touch = $("html").hasClass('no-touch');
    var desk_flag = $("#background-layer").css("position") === "fixed";

    if ( desk_flag === true ) {
    //if ( desk_flag || no_touch === true ) {
        rg15.initNav();
        rg15.displayFigcaption();
        rg15.setFullScreenImage();
    } else {
        rg15.deleteImageInlineStyle();
        rg15.deleteNavInlineStyle();
    }
};

rg15.initNav = function() {

    var desk_flag;

    rg15.deleteNavInlineStyle();

    $(window).scroll(function() {
        desk_flag = $("#background-layer").css("position") === "fixed";
        if (desk_flag === true) {

            var y = $(document).scrollTop();

            // different values depending on logo size above
            // true: smaller size
            if ($("a.one-third.column.logo").css("width") === "310px") {
                if (y > 0) {
                  if(!$('.nav-container').hasClass('collapsed')) {
                    $('.nav-container').stop().animate({
                        top:-20,
                        height:88
                    }, 300).addClass('collapsed');
                    $('#background-layer').stop().animate({
                        height:68
                    }, 300);
                    $('.row.title').stop().animate({
                        marginTop:20
                    }, 300);
                    $('.searchbar').stop().animate({
                        opacity:0
                    }, 100);

                    $('.header-toolbar').stop().animate({
                        top:5
                    }, 300);
                    $('.toolbar-items-l').stop().animate({
                        marginTop:15
                    }, 300);
                    $('.toolbar-items-r').stop().animate({
                        marginTop:9
                    }, 300);
                    $('.change-dest').stop().animate({
                        marginTop:9
                    }, 300);


                    $('#nav').css({
                      position:"absolute"
                    });
                    $('.acctlink.alpha').css({
                      height:1
                    });
                    $('.cartlink.omega').css({
                      height:1
                    });
                  }
                } else {
                    $('.nav-container').stop().animate({
                        top:0,
                        height:150
                    }, 300).removeClass('collapsed');
                    $('#background-layer').stop().animate({
                        height:150
                    }, 300);
                    $('.row.title').stop().animate({
                        marginTop:40
                    }, 300);
                    $('.searchbar').stop().animate({
                        opacity:1
                    }, 300);
                    $('.header-toolbar').stop().animate({
                        top:0
                    }, 300);

                    $('.toolbar-items').stop().animate({
                        marginTop:0
                    }, 300);
                    $('.change-dest').stop().animate({
                        marginTop:0
                    }, 300);

                    $('#nav').css({
                      position:"static"
                    });

                }
            } else {
                if (y > 0) {
                  if(!$('.nav-container').hasClass('collapsed')) {
                    $('.nav-container').animate({
                        top:-20,
                        height:91
                    }, 300).addClass('collapsed');
                    $('#background-layer').animate({
                        height:71
                    }, 300);
                    $('.row.title').animate({
                        marginTop:-20
                    }, 300);
                    $('.searchbar').animate({
                        opacity:0
                    }, 100);

                    $('.header-toolbar').animate({
                        top:5
                    }, 300);
                    $('.toolbar-items-l').animate({
                        marginTop:18
                    }, 300);
                    $('.toolbar-items-r').animate({
                        marginTop:12
                    }, 300);
                    $('.change-dest').animate({
                        marginTop:12
                    }, 300);

                    $('#nav').css({
                      position:"absolute"
                    });
                    $('.acctlink.alpha').css({
                      height:1
                    });
                    $('.cartlink.omega').css({
                      height:1
                    });
                  }
                } else {
                    $('.nav-container').stop().animate({
                        top:0,
                        height:150
                    }, 300).removeClass('collapsed');
                    $('#background-layer').stop().animate({
                        height:150
                    }, 300);
                    $('.row.title').stop().animate({
                        marginTop:40
                    }, 300);
                    $('.searchbar').stop().animate({
                        opacity:1
                    }, 300);
                    $('.header-toolbar').stop().animate({
                        top:0
                    }, 300);

                    $('.toolbar-items').stop().animate({
                        marginTop:0
                    }, 300);
                    $('.change-dest').stop().animate({
                        marginTop:0
                    }, 300);

                    $('#nav').css({
                      position:"static"
                    });

                }
            }
        } else {
            rg15.deleteNavInlineStyle();
        }
    });
};

rg15.deleteNavInlineStyle = function() {
    $('.nav-container').attr( "style", "" );
    $('#background-layer').attr( "style", "" );
    $('.row.title').attr( "style", "" );
    $('.searchbar').attr( "style", "" );
    $('.header-toolbar').attr( "style", "" );

    $('.toolbar-items').attr( "style", "" );
    $('.change-dest').attr( "style", "" );

    $('#nav').attr( "style", "" );
};

rg15.displayFigcaption = function() {
    $(".full-width").hover(
        function() {
            $("figcaption", ".full-width").addClass('desk-show-op');
        },
        function() {
            $("figcaption", ".full-width").removeClass('desk-show-op');
        }
    );

    $(".half-width-right").hover(
        function() {
            $("figcaption", ".half-width-right").addClass('desk-show-op');
        },
        function() {
            $("figcaption", ".half-width-right").removeClass('desk-show-op');
        }
    );

    $(".half-width-left").hover(
        function() {
            $("figcaption", ".half-width-left").addClass('desk-show-op');
        },
        function() {
            $("figcaption", ".half-width-left").removeClass('desk-show-op');
        }
    );
};

rg15.setFullScreenImage = function() {

    var landing_first = $(".landing-first.full-width");
    var w_height = $(window).height();
    var full_img_h = w_height - 150;
    if (landing_first.length > 0) {
        var img_src = $(".mobile-hide", ".figure_row1_1").attr('srcset');
        var img_src_safari = $(".mobile-hide", ".figure_row1_1").attr('src');

        if (img_src.length > 0) {
            landing_first.css({
                background: "url(" + img_src + ")",
                height: full_img_h
            });
        } else {
            landing_first.css({
                background: "url(" + img_src_safari + ")",
                height: full_img_h
            });
        }
        $(".figure_row1_1").addClass('visibility-hidden');
    } else {
        var landing_left = $(".half-width-left-bg");
        var landing_right = $(".half-width-right-bg");
        var img_src_l = $(".mobile-hide", ".figure_row1_2_l").attr('srcset');
        var img_src_l_safari = $(".mobile-hide", ".figure_row1_2_l").attr('src');
        var img_src_r = $(".mobile-hide", ".figure_row1_2_r").attr('srcset');
        var img_src_r_safari = $(".mobile-hide", ".figure_row1_2_r").attr('src');

        if ((img_src_l !== undefined && img_src_l.length > 0) && (img_src_r !==undefined && img_src_r.length > 0)) {
            landing_left.css({
                background: "url(" + img_src_l + ")",
                height: full_img_h
            });
            landing_right.css({
                background: "url(" + img_src_r + ")",
                height: full_img_h
            });
        } else {
            landing_left.css({
                background: "url(" + img_src_l_safari + ")",
                height: full_img_h
            });
            landing_right.css({
                background: "url(" + img_src_r_safari + ")",
                height: full_img_h
            });
        }
        $("figure", ".landing-first").addClass('visibility-hidden');
    }
};

rg15.deleteImageInlineStyle = function() {
    $(".landing-first.full-width").attr( "style", "" );
    $(".half-width-left-bg").attr( "style", "" );
    $(".half-width-right-bg").attr( "style", "" );
    $("figure", ".landing-first").removeClass('visibility-hidden');

};