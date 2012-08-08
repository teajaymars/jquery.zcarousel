/*
   [ Requires spin.js: http://fgnass.github.com/spin.js/ ]

   zcarousel
   =========
   A crossfading carousel jQuery plugin.
   Images are stretched to fit the width of the carousel, and vertically
   centered in that space. The 'offset' option adds a vertical offset.

   usage
   =====
   jQuery('#carousel-div').zcarousel(
    [
      { caption: 'Here is the first image.',         
        url: 'http://somewhere.com/image1.jpg', 
        offset: '10' 
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
    width: 4, // The line thickness
    trail: 60, // Afterglow percentage
    shadow: false // Whether to render a shadow
  };

  // Build the DOM
  var carousel = this;
  carousel.addClass('zcarousel');
  var linkPrev = jQuery('<a href="#" class="zcarousel-nav zcarousel-nav-left" />').html('‹').appendTo(carousel);
  var linkNext = jQuery('<a href="#" class="zcarousel-nav zcarousel-nav-right"/>').html('›').appendTo(carousel);
  var spinner = null;
  var captionBox = jQuery('<div class="zcarousel-caption"/>').appendTo(carousel);

  // Called when an image has downloaded
  function prepareImage(obj) {
    var img = obj.existing;

    // Set the aspect ratio
    var w = img.width();
    var h = img.height();
    
    // Resize the image to fit in width
    var fRatio = w/h;
    img.css({
      'width'  : carousel.width(),
      'height' : Math.round(carousel.width() * (1/fRatio))
    });

    // Vertically center the image
    var vOffset = ((carousel.height() - img.height()) / 2) - parseInt(obj.offset);
    img.css('top',vOffset+'px');
    fadeToImage(img);
  }

  function fadeToImage(img) {
    // Move image to the front
    img.hide();
    img.remove().appendTo(carousel);
    // Kill spinner
    if (spinner) {
      spinner.stop();
      spinner = null;
    }
    // All future spinners need to be white
    spinner_settings.color = '#fff';
    // Trigger animations
    img.fadeIn('fast', function() {
      jQuery('.zcarousel-image').not(img).hide();
    });
  };

  // Set the carousel state
  function navigateToImage(obj) {
    var oldCaption = captionBox.find('div');
    var caption = null;
    var targetHeight = 0;
    var targetOpacity = 0;
    if (obj.caption) {
        // If a caption has been supplied...
        caption = jQuery('<div/>').html(obj.caption).appendTo(captionBox);
        targetHeight = caption.height();
        targetOpacity = 1;
        caption.hide();
    }

    // Cross fade the caption
    var fadeSpeed = 100;
    var heightSpeed = 500;
    if (oldCaption.length) {
      oldCaption.stop().fadeOut( 
          fadeSpeed, 
          'linear', 
          function() { 
            oldCaption.remove(); 
            if (caption) caption.fadeIn( fadeSpeed ) 
          } 
      );
    }
    else {
      if (caption) caption.fadeIn( fadeSpeed );
    }
    // Animate the box height
    captionBox.stop().animate( 
        { 'opacity': targetOpacity, 'height':targetHeight }, 
        heightSpeed 
    );

    // Images might be cached in the document
    if (obj.existing) {
      fadeToImage(obj.existing);
    }
    else {
      if (!spinner) spinner = new Spinner(spinner_settings).spin(carousel[0]);
      // Add the new image
      var img = jQuery('<img class="zcarousel-image"/>');
      // Hook before setting src="..." to avoid an ugly race condition
      img.load( function(){prepareImage(obj)} );
      img.attr('src',obj.url).appendTo(carousel);
      obj.existing = img;
    }
  }

  // Auto-scroll
  function onAutoScroll() {
    current = (current+1) % dataArray.length;
    navigateToImage(dataArray[current]);
  }
  var autoScrollTime = 12000;
  var autoScroll = window.setInterval(onAutoScroll, autoScrollTime);

  // Handle state changes
  var current = 0;
  function clickNav(e) {
    e.preventDefault();
    var offset = e.target==linkPrev[0] ? -1 : 1;
    current = (current + offset + dataArray.length) % dataArray.length;
    navigateToImage(dataArray[current]);
    window.clearInterval(autoScroll);
  }
  linkNext.click(clickNav);
  linkPrev.click(clickNav);

  // Set up initial state
  navigateToImage(dataArray[current]);
};

