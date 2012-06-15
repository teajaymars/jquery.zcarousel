#!/bin/bash

java -jar ~/util/closure/compiler.jar jquery.zcarousel.js  >jquery.zcarousel.min.js 

zip jquery.zcarousel.zip jquery.zcarousel.css jquery.zcarousel.js
zip jquery.zcarousel.min.zip jquery.zcarousel.css jquery.zcarousel.min.js
