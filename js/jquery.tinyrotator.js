/*
* TinyRotator 0.3 (2011-04-29)
* (c) 2011 Gabriel Svennerberg <gabriel@svennerberg.com>
*
* Requires: jQuery v1.3+
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
* 
* Author: Gabriel Svennerberg
* Email:  gabriel@svennerberg.com
* Web:    www.svennerberg.com
*
* Creates a simple image rotator
* 
* Just add the following HTML to your web page (where you obiously need to replace the url's with your own ones.)
* 
*   <ul class="tinyrotator">
*     <li><a href="urlToBigImage1"><img src="urlToThumbnail1" alt="" /></a></li>
*     <li><a href="urlToBigImage2"><img src="urlToThumbnail2" alt="" /></a></li>
*     <li><a href="urlToBigImage3"><img src="urlToThumbnail3" alt="" /></a></li>   
*   </ul>
*   
* Then include this library and initialize the plugin with
* 
*   $('.tinyrotator').tinyrotator();
* 
* Possible options are:
*  
*   interval    The time in millisecond that each image will be displayed 
*               Default value is 5000.
*   fade        How fast the fade should be, possible values are: 'fast', 'slow', 'medium', 'none' or the time in milliseconds
*               Default value is 'medium'
* 
* This is how you create a tinyrotator with an interval of 2 seconds and a fast fade.  
* 
*   $('.tinyrotator').tinyrotator({
*     interval: 2000,
*     fade: 'fast'
*   });
* 
* Change the styling by editing tinyrotator.css
*/

(function($) {
    $.fn.tinyrotator = function(options) {
        
      var opts = $.extend({}, $.fn.tinyrotator.defaults, options);
      
      return this.each(function() {
        
        var that = $(this);
		
		 // Resetting thumbnail attributes 
        $('li img', that).removeAttr('width').removeAttr('height').removeAttr('class');
        
        // Preload all images
        $('a', that).each(function() {
          $.fn.tinyrotator.preload(this.href);
        });
		
		var container = $('<div class="tinyrotator" />');
		that.removeClass('tinyrotator');
		that.wrapAll(container);
        
        $('li:first', that).addClass('selected');
        var firstSrc = $('li:first a', that).attr('href'); 
        var imageWrapper = $('<div />').append('<img src="' + firstSrc + '" alt="" />');
        that.closest('div').prepend(imageWrapper);
        
		// If there's only one image, there's no need to rotate 
        if ($('li', that).length < 2) {
          $('ul a', that).click(function(e) {
            e.preventDefault();
          });
          return;
        }
		        
        var loop = setInterval(function() {
          
          var selectedLi = $('li.selected', that);
         
          var nextLi = selectedLi.next('li');
          if (!nextLi.length) {
            nextLi = $('li:first', that);
          }
          
          switchImage(nextLi.find('a').attr('href'));
          selectElement(nextLi);
          
        }, opts.interval);

        $('a', that).click(function(e) {
          e.preventDefault();
          clearInterval(loop);
          var that = $(this);
          
          var li = that.closest('li');
          if (li.hasClass('selected')) return;      
          
          switchImage(this.href);
          selectElement(li);
          
        });
        
        function selectElement(element) {
          $('li.selected', that).removeClass('selected');
          element.addClass('selected');      
        }
        
        function switchImage(src) {
          var mainImage = $('> div img', that.closest('div'));
         
          if (opts.fade != 'none') {
            mainImage.fadeOut(opts.fade, function() {
              mainImage.attr('src', src).fadeIn(opts.fade);  
            });
          } else {
            mainImage.attr('src', src);
          }
        }
        
      });
      
    }
    /* Utility function */
    var preload;
    if (/*@cc_on!@*/false) {
      preload = function(file) {
        new Image().src = file;
      };
    } else {
      preload = function(file) {
        var obj = document.createElement('object'),
          body = document.body;
          obj.width = 0;
          obj.height = 0;
          obj.data = file;
          body.appendChild(obj);
      };
    }
    
    $.fn.tinyrotator.preload = preload;
    
    /* Defaults */
    $.fn.tinyrotator.defaults = {
      interval: 5000,
      fade: 'medium'
    };
      
})(jQuery);