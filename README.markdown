zcarousel
=========
A crossfading carousel jQuery plugin.

Requires [spin.js](http://fgnass.github.com/spin.js/).

Images are stretched to fit the width of the carousel, and vertically centered in that space. The 'offset' option adds a vertical offset.

Live Demo
=========
[http://zephod.github.com/jquery.zcarousel](http://zephod.github.com/jquery.zcarousel)

Usage
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
