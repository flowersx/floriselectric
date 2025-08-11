(function ($) {
  
  "use strict";

  // Safeguard: only use appear/countTo if plugins exist
  if ($.fn.appear && $.fn.countTo) {
    jQuery('.counter-thumb').appear(function() {
      jQuery('.counter-number').countTo();
    });
  }

  // Backstretch hero slideshow only if plugin exists
  if ($.fn.backstretch) {
    $('.hero-section').backstretch([
      "images/slideshow/WhatsApp Image 2025-08-05 at 11.44.29_5c9db20b.jpg",
    
    ],  {duration: 4000, fade: 1000});
  }
  
  // CUSTOM LINK smooth scroll with safe navheight
  var navheight = ($('.navbar').outerHeight() || 0);
  $('.smoothscroll').on('click', function(e){
    e.preventDefault();
    var el = $(this).attr('href');
    var elWrapped = $(el);
    if (!elWrapped.length) return false;

    function scrollToDiv(element){
      var offset = element.offset();
      var offsetTop = offset.top;
      var totalScroll = offsetTop - navheight;
      $('html, body').animate({ scrollTop: totalScroll }, 300);
    }
    scrollToDiv(elWrapped);
    return false;
  });
})(window.jQuery);


