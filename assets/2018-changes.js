window.onpageshow = function(event) {
    if (event.persisted) {
	$("body").fadeIn();
    } else {
    $("body").fadeIn(); 
    }
};

$("body").not(".welcome").addClass("no-col");

// Remove "News"
$(".top-depts li").last().remove();

// Search Action
$("body").on("click","#show-search",function(){
  	$("body").addClass("no-scroll");
  	$(".searchbar").addClass("searching");
  	$("#st-search-input").focus();
});
$("body").on("click",".searching .close-srch",function(){
    $("body").removeClass("no-scroll");
	$(".searchbar").removeClass("searching");
});

$("body").on("click",".sticking.sticky.stuck .icon-search",function(){
    $("body").addClass("no-scroll");
  	$(".searchbar").addClass("searching");
  	$("#st-search-input").focus();
});

$("body").on("click","#show-search-mobile",function(){

});
$(".topsearch-field").attr("placeholder","Search");

// Headband Action
$("body").on("click",".headband",function(){
	$(".nav-container").addClass("perma-stuck").addClass("sticking");
	$(".headband").addClass("perma-stuck").addClass("sticky");
	$(".subscribe-wrap").fadeIn();
	$(".lightbox-overlay").fadeIn();
  	$(window).trigger("resize");
});

// Lightbox Action
$("body").on("click",".lightbox-overlay",function(){
	$(".subscribe-wrap").fadeOut();
	$(".lightbox-overlay").fadeOut();
  	$(window).trigger("resize");
});

$("body").on("click",".mce-success-response a",function(){
	$(".subscribe-wrap").fadeOut();
	$(".lightbox-overlay").fadeOut();
  	$(window).trigger("resize");
});





equalheight = function(container){
var currentTallest = 0,
     currentRowStart = 0,
     rowDivs = new Array(),
     $el,
     topPosition = 0;
 $(container).each(function() {
   $el = $(this);
   $($el).height('auto')
   topPostion = $el.position().top;
   if (currentRowStart != topPostion) {
     for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
       rowDivs[currentDiv].height(currentTallest);
     }
     rowDivs.length = 0;
     currentRowStart = topPostion;
     currentTallest = $el.height();
     rowDivs.push($el);
   } else {
     rowDivs.push($el);
     currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
  }
   for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
     rowDivs[currentDiv].height(currentTallest);
   }
 });
}

equalheightX = function(container){
var currentTallest = 0,
     currentRowStart = 0,
     rowDivs = new Array(),
     $el,
     topPosition = 0;
 $(container).each(function() {
   $el = $(this);
   $($el).height('auto')
   topPostion = $el.position().top;
   if (currentRowStart != topPostion) {
     for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
       rowDivs[currentDiv].height(currentTallest);
     }
     rowDivs.length = 0;
     currentRowStart = topPostion;
     currentTallest = $el.height();
     rowDivs.push($el);
   } else {
     rowDivs.push($el);
     currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
  }
   for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
     rowDivs[currentDiv].height(currentTallest);
   }
 });
}


// Sticky Navigation
$(document).ready(function() {
  $(".product-title").addClass("balance-text");
  $(".ed-p,.ed-img,.ed-vid").addClass("wow fadeIn");
  
  if(!$("body").hasClass("welcome")){
   	$(".nav-container").addClass("sticking perma-stuck perma-stuck2 sticky stuck");
  }
//   	$(".rg-content").css("padding-top",$(".nav-container").outerHeight() + $(".headband").height());  
	var stickyNavTop = 90;
	var stickyNav = function(){
		      var scrollTop = $(window).scrollTop();
      var screenWidth = $(window).width();
	  var marginAdjust;
      var adjustBreakpoint;
      
      if (screenWidth > 767) {
        marginAdjust = 274;
        adjustBreakpoint = 236;
      } else {
        marginAdjust = 138;
        adjustBreakpoint = 136;
      }
      
      if ($('body').hasClass('welcome') && scrollTop > adjustBreakpoint) {
          	
            //$('body').css('top',$(".nav-container").height() + 112);
            $('body').css('margin-top', marginAdjust);
            $('.nav-container').addClass('sticky');
          setTimeout(function(){
       			$('.nav-container').addClass('stuck');
   			}, 500);	
		} else {
          	//$('body').css('top',0);
            $('body').css('margin-top', '0px');
		    $('.nav-container:not(.perma-stuck2)').removeClass('sticky').removeClass('stuck'); 
		    setTimeout(function(){
       			$('.nav-container:not(.perma-stuck2)').removeClass('stuck');
   			}, 500);
		}
		if (scrollTop > 136) { 
			$('.nav-container').addClass('sticking');
		    $('.headband').addClass('sticky');
		} else {
			$('.nav-container').not(".perma-stuck").removeClass('sticking'); 
		    $('.headband').not(".perma-stuck").removeClass('sticky');
		}
	};
	stickyNav();
	$(window).scroll(function() {
	  stickyNav();
	});
  $("body").animate({"opacity":1},500);
});

$(window).resize(function(){
//   	$(".rg-content").css("padding-top",$(".nav-container").outerHeight() + $(".headband:not(.perma-stuck)").height());
	//$(".nav-container + section").css("padding-top",$(".nav-container").outerHeight() + $(".headband:not(.perma-stuck)").height());
  	equalheight('.product-info');
	equalheightX('.filter-group');
  if ($(".related-items").length) {
  	$(".related-items").css("margin-top", ( $("#prod-details-r").offset().top + $("#prod-details-r").height() - $("#product").height() - 150 ) + "px");
  }
});

var flag = true;
var otherflag = true;
var anotherflag = true;

$(window).scroll(function() {
    clearTimeout($.data(this, 'scrollTimer'));
    $.data(this, 'scrollTimer', setTimeout(function() {
        //$(".rg-content").css("padding-top",$(".nav-container").outerHeight() + $(".headband:not(.perma-stuck)").height());
		//$(".nav-container + section").css("padding-top",$(".nav-container").outerHeight() + $(".headband:not(.perma-stuck)").height());
      	$(window).trigger("resize");
    }, 250));
  
if ($(".edge_to_edge").first().length) {
  $(".edge_to_edge").first().addClass("edge-top");
  var a = $(".edge-top").offset().top;
  var b = $(".edge-top").height();
  var c = $(window).height();
  var d = $(window).scrollTop();


 
  if ((d + 112)>(a+b)) {
      if(anotherflag){  
			$("body").addClass("no-col");
          	otherflag=anotherflag;  
      }
  } else {
		 $("body").removeClass("no-col");
   		 otherflag=anotherflag;
  }
  
}

  
  if ($("#product").length) {
  var a = $("#product").offset().top;
  var b = $("#product").height();
  var c = $(window).height();
  var d = $(window).scrollTop();

  if ((c+d)>(a+b)) {
      if(otherflag){  
          $("#prod-details-r").css("top", ($("#prod-details-r").offset().top - 160) );
          $("#prod-details-l").css("top", ($("#prod-details-l").offset().top - 160) );
          $(".product-details").addClass("done-scrolling-images");
          otherflag=false;  
      }
  } else {
    $("#prod-details-r").removeAttr("style");
    $("#prod-details-l").removeAttr("style");
    $(".product-details").removeClass("done-scrolling-images");
    otherflag=true;
  }

  var a2 = $("#prod-details-r").offset().top;
  var b2 = $("#prod-details-r").height();
  var c2 = $(window).height();
  var d2 = $(window).scrollTop();

// Keep PDP description at top of page
//   if ((c2+d2)>(a2+b2)) {
//     $("#prod-details-r:not()").addClass("det-stuck");
//       if(flag){  
//           $("#prod-details-r").attr("data-stuck",d2);
//           flag=false;  
//       }
//   }

//   if (d2 < $("#prod-details-r").attr("data-stuck")) {
//     $("#prod-details-r").removeClass("det-stuck");
//     flag=true;
//   }
}
  
  if ($(".related-items").length) {
  	$(".related-items").css("margin-top", ( $("#prod-details-r").offset().top + $("#prod-details-r").height() - $("#product").height() - 150 ) + "px");
  }  

});

$(document).ready(function(){
	equalheight('.product-info');
  	equalheightX('.filter-group');
    //if ($("figure.product").length < 41) {
    //	$(".collection-nav, .collections-pagination").hide();
  	//}
});
 
$(window).load(function(){
	equalheight('.product-info');
  	equalheightX('.filter-group');  
});

window.onbeforeunload = function () {
  $("body").fadeOut("fast",function(){
  	window.scrollTo(0, 0);
  });
}

// Breakpoints

$(document).ready(function() {
	$(window).on('enterBreakpoint480',function() {
	    $(".tablet-row .four.columns").after($(".four.columns.contact"));
      	$(".product-images").before($(".product-details"));
	});
	$(window).on('exitBreakpoint480',function() {
	   	$(".tablet-row").after($(".four.columns.contact"));
      	$(".product-images").after($(".product-details"));
	});
  	$(window).on('enterBreakpoint1',function() {
      	$(".product-images").before($(".product-details"));
	});
	$(window).setBreakpoints();
});

$("#nav-open-btn").mouseup(function(){
	if (!$(this).hasClass("hey-im-open")){
		$(this).addClass("hey-im-open");
		$("body").addClass("no-transition");
		$(".nav-container").addClass("perma-stuck2 sticking sticky stuck");
		$(".headband").hide();
		$(".new-nav .drop a").addClass("nogo");
		//$("html,body").addClass("no-scroll");
	} else {
		$(this).removeClass("hey-im-open");
		$("html,body").scrollTop(0);
      $("body.welcome .nav-container").removeClass("perma-stuck2 sticking sticky stuck");
		if ($(".headband").hasClass("perma-stuck")) {
			$(".nav-container").addClass("sticking");
		}
      	$(".welcome .headband").show();
		//$("html,body").removeClass("no-scroll");
		$("body").removeClass("no-transition");
      $(window).trigger("resize");
	}
});

/*
	Breakpoints.js
	version 1.0
	Creates handy events for your responsive design breakpoints
	Copyright 2011 XOXCO, Inc
	http://xoxco.com/
	Documentation for this plugin lives here:
	http://xoxco.com/projects/code/breakpoints
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php
*/
(function($) {
	var lastSize = 0;
	var interval = null;
	$.fn.resetBreakpoints = function() {
		$(window).unbind('resize');
		if (interval) {
			clearInterval(interval);
		}
		lastSize = 0;
	};
	$.fn.setBreakpoints = function(settings) {
		var options = jQuery.extend({
							distinct: true,
							breakpoints: new Array(1,480,768,1024)
				    	},settings);
		interval = setInterval(function() {
			var w = $(window).width();
			var done = false;
			for (var bp in options.breakpoints.sort(function(a,b) { return (b-a) })) {
				if (!done && w >= options.breakpoints[bp] && lastSize < options.breakpoints[bp]) {
					if (options.distinct) {
						for (var x in options.breakpoints.sort(function(a,b) { return (b-a) })) {
							if ($('body').hasClass('breakpoint-' + options.breakpoints[x])) {
								$('body').removeClass('breakpoint-' + options.breakpoints[x]);
								$(window).trigger('exitBreakpoint' + options.breakpoints[x]);
							}
						}
						done = true;
					}
					$('body').addClass('breakpoint-' + options.breakpoints[bp]);
					$(window).trigger('enterBreakpoint' + options.breakpoints[bp]);
				}				
				if (w < options.breakpoints[bp] && lastSize >= options.breakpoints[bp]) {
					$('body').removeClass('breakpoint-' + options.breakpoints[bp]);
					$(window).trigger('exitBreakpoint' + options.breakpoints[bp]);

				}
				if (
					options.distinct && 
					w >= options.breakpoints[bp] &&
					w < options.breakpoints[bp-1] &&
					lastSize > w &&
					lastSize >0 && 
					!$('body').hasClass('breakpoint-' + options.breakpoints[bp])
					) {					
					$('body').addClass('breakpoint-' + options.breakpoints[bp]);
					$(window).trigger('enterBreakpoint' + options.breakpoints[bp]);
				}						
			}
			if (lastSize != w) {
				lastSize = w;
			}
		},250);
	};
})(jQuery);

// Shoppable

$(document).ready(function(){
    $(".product-pop").remove();
    $(".shoppable").each(function(){
        $(this).find("span").each(function(){
            var theItem = $(this);
            theItem.css("left",theItem.attr("data-x"));
            theItem.css("top",theItem.attr("data-y"));
            $.getJSON(theItem.attr("data-url")+'.js', function(product) {
				theItem.addClass("active-product");
              	theItem.after("<div class='product-pop' style='top:"+theItem.attr("data-y")+";left:"+theItem.attr("data-x")+";'></div>");
                theItem.next(".product-pop").append('<div class="pod-title">'+product.title+'</div>');
                theItem.next(".product-pop").append('<div class="pod-type">'+product.vendor+'</div>');
                theItem.next(".product-pop").append('<div class="pod-type pop-price">$'+insertDecimal(product.price)+' CAD</div>');
                if (product.compare_at_price > 0) {
                    theItem.next(".product-pop").find(".pop-price").append(' <div class="pop-compare">$'+insertDecimal(product.compare_at_price)+' CAD</div>');
                }
                theItem.next(".product-pop").append("<img src='http://"+product.images[0]+"'>");
              	if (!theItem.find(".instagram-image").attr("src").length) {
                 	theItem.remove(); 
                }
            });
        });
    });
  balanceText();
  
});     

$("body").on("click",".product-pop",function(e){
    window.location.href = $(this).prev("span").attr("data-url");
	e.preventDefault();
  	e.stopPropagation();
    //window.open($(this).prev("span").attr("data-url"),"_blank")
});

function insertDecimal(num) {
    return (num / 100).toFixed(2);
}

$(window).load(function(){
	$("body").addClass("is-totally-ready");
  	$(window).trigger("resize");
  
  
            setTimeout(function(){
  	$(window).trigger("resize");
              

              
   			}, 500);
  
});

$(document).ready(function(){
    var ww = $(window).width();
    var limit = 767;            

    function refresh() {
        ww = $(window).width();
        var w =  ww<limit ? (location.reload(true)) :  ( ww>limit ? (location.reload(true)) : ww=limit );
    }

    var tOut;
    $(window).resize(function() {
        var resW = $(window).width();
        clearTimeout(tOut);                 
        if ((ww>limit && resW<limit) || (ww<limit && resW>limit) ) {        
          $("body").hide();
          tOut = setTimeout(refresh, 100);
        }
    });
});


$(".video-play").mouseup(function(){
  	var whatisscroll = $("body,html").scrollTop();
  	$("body").append("<div id='video-lightbox-close'>Close Video</div>");
	$(".video-container").addClass("lightboxed-video");
  	$("body,html").scrollTop(400);
  
  
  	$("body").on("click","#video-lightbox-close", function(){
	    $(".video-play.active").trigger("click");
      	$("body,html").scrollTop(whatisscroll);
  		$(".video-container").removeClass("lightboxed-video");
      	$("#video-lightbox-close").remove();
  	});
  
});



// $(".collection-desc figcaption").click(function(){
//   if ($(this).hasClass("figopen")) {
//   	$(this).removeClass("figopen");
//   } else {
//     $(this).addClass("figopen");
//   }
// });

$(".measurements th:not(.title)").each(function(){
  $(this).text($(this).text().replace("Size",""));
});

$(".product-form").before("<div class='open-details'>Item Details</div>");
$("body").on("click",".open-details",function(){
	$("body").addClass("no-scroll");
  	$("#prod-details-r").addClass("open-det").append("<div class='close-det'><img src='https://cdn.shopify.com/s/files/1/0240/7285/t/15/assets/close-det.png?14210553750592280766'></div>").fadeIn();
});
$("body").on("click",".close-det",function(){
	$("body").removeClass("no-scroll");
  $("#prod-details-r").fadeOut(function(){
  	$("#prod-details-r").removeClass("open-det");
  });
  	$(".close-det").remove();
});


$(".welcome .wistia_responsive_padding").click(function(){
window.location.href= $(this).parent("a").attr("href");

});


$("body").on("change",".lightbox .mce-EMAIL", function(){
$("footer .mce-EMAIL").val($(this).val());
});

// Show a popup if the cart changes
jQuery.getJSON('/cart.js', function(cart) {
  var originalItems = cart.item_count;
  
  setInterval(function(){ 

    var cartCurrentItems = $("#cart-count").text();
    
    if(cartCurrentItems != originalItems) {
      
      $(".cart-popup").addClass("is-active");
        setTimeout(function(){
            $(".cart-popup").removeClass("is-active");
            cartCurrentItems = $("#cart-count").text();
        }, 4000);
    }
  }, 2000);
});


// Dynamically remove the 'Read More' text on the Designer Page main description
if($(".collection-desc figcaption").height() >= 150) {
  
  $(".collection-desc figcaption").removeClass("figopen").addClass("is-visible");

  $(".collection-desc figcaption").click(function(){
    if ($(this).hasClass("figopen")) {
      $(this).removeClass("figopen");
    } else {
      $(this).addClass("figopen");
    }
  });
} else {
	$(".collection-desc figcaption").addClass("is-visible");

}


// Shipping Rates Modal
$('.shipping-rates-cta').on('click', function(){
    var modalHeight = $(window).scrollTop() + $('.modal--shipping-rates').height()/2 + 140;
  	$('.modal--shipping-rates').css('top' , modalHeight);
	$('.modal--shipping-rates').addClass('is-visible'); 
  	$('.modal-background').addClass('is-visible'); 
});
                           
$('.js-shipping-rates-close').on('click', function(){
	$('.modal--shipping-rates').removeClass('is-visible');  
  	$('.modal-background').removeClass('is-visible'); 
});
  

// Insider Modal
$('.js-modal-close').on('click', function(){
	$('.lightbox').css('display' , 'none');
  	$('.lightbox-overlay').css('display' , 'none');
});


$('#footer_newsletter').on('focus', function() {
  
  setTimeout(function(){ $('.mc-banner').hide(); }, 300);
	
});