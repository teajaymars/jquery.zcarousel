/*
   [ Requires spin.js: http://fgnass.github.com/spin.js/ ]

   zcarousel
   =========
   A crossfading carousel jQuery plugin.
   Images are stretched to fit the width of the carousel, and vertically
   centered in that space. The 'offset' option adds a vertical offset.

   usage
   =====
   $('#carousel-div').zcarousel(
    [
      { caption: 'Here is the first image.',         
        url: 'http://somewhere.com/image1.jpg', 
        offset: '10px' 
      },
      { caption: 'Second image now appearing here.', 
        url: 'http://somewhere.com/image2.jpg', 
        offset: '0'    
      }
    ] );
 */

jQuery.fn.zcarousel = function(dataArray) {
  var spinner_settings = {
    lines: 13, // The number of lines to draw
    length: 7, // The length of each line
    width: 4, // The line thickness
    radius: 10, // The radius of the inner circle
    rotate: 0, // The rotation offset
    color: '#000', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };

  // Build the DOM
  var carousel = this;
  carousel.addClass('zcarousel-main');
  var linkPrev = $('<a href="#" class="zcarousel-nav zcarousel-nav-left" />').html('‹').appendTo(carousel);
  var linkNext = $('<a href="#" class="zcarousel-nav zcarousel-nav-right"/>').html('›').appendTo(carousel);
  var spinner = null;
  var captionBox = $('<div class="zcarousel-caption"/>').appendTo(carousel);

  // Called when an image has downloaded
  function imgLoaded(e) {
    var img = $(e.target);

    // Set the aspect ratio
    var w = img.width();
    var h = img.height();
    
    // Resize the image to fit in width
    var fRatio = w/h;
    img.css({
      'width'  : carousel.width(),
      'height' : Math.round(carousel.width() * (1/fRatio))
    });
    
    if (spinner) {
      spinner.stop();
      spinner = null;
    }
    spinner_settings.color = '#fff';

    // Vertically center the image
    var vOffset = Math.min(0, (carousel.height() - img.height()) / 2);
    img.css('top',vOffset+'px');

    img.fadeIn('fast', function() {
      $('.carousel-image').hide();
      img.show();
    });
  };

  // Set the carousel state
  function setCarousel(obj) {
    var oldCaption = captionBox.find('div');
    var caption = $('<div/>').html(obj.caption).appendTo(captionBox);
    var targetHeight = caption.height();
    caption.hide();

    // Cross fade the caption
    var fadeSpeed = 100;
    var heightSpeed = 500;
    if (oldCaption.length) {
      oldCaption.stop().fadeOut( 
          fadeSpeed, 
          'linear', 
          function() { 
            oldCaption.remove(); 
            caption.fadeIn( fadeSpeed ) 
          } 
      );
    }
    else {
      caption.fadeIn( fadeSpeed );
    }
    // Animate the box height
    captionBox.stop().animate( 
        { 'opacity': 1, 'height':targetHeight }, 
        heightSpeed 
    );

    // Fade out old items
    if (obj.domElement) {
      obj.domElement.hide();
      obj.domElement.remove().appendTo(carousel);
      obj.domElement.fadeIn('fast', function() {
        $('.carousel-image').hide();
        obj.domElement.show();
      });
      if (spinner) {
        spinner.stop();
        spinner = null;
      }
    }
    else {
      if (!spinner) spinner = new Spinner(spinner_settings).spin(carousel[0]);
      // Add the new image
      var img = $('<img class="carousel-image"/>');
      img.css({
        'position' : 'absolute',
        'z-index'  : -1,
        'left'     : 0,
        'top'      : 0,
        'display'  : 'none'
      });
      img.load(imgLoaded);
      img.attr('src',obj.url).appendTo(carousel);
      obj.domElement = img;
    }
  }

  // Handle state changes
  var current = 0;
  function clickNav(e) {
    e.preventDefault();
    var offset = e.target==linkPrev[0] ? -1 : 1;
    current = (current + offset + dataArray.length) % dataArray.length;
    setCarousel(dataArray[current]);
  }
  linkNext.click(clickNav);
  linkPrev.click(clickNav);

  // Set up initial state
  setCarousel(dataArray[current]);
};

