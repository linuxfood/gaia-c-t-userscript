// ==UserScript==
// @name SteezyCTTT
// @namespace http://github.com/kirindave
// @description Steezes up Gaia's C&T:TT forum!
// @include http://www.gaiaonline.com/forum/c-t-tech-talk/*
// ==/UserScript==

/* ========================================
   Key vars
   ======================================== */
   
/* Default keybindings */
var keys = {
  nextPage:93,
  prevPage:91,
  topPost:116,
  botPost:98,
  nextPost:112,
  prevPost:110,
  reply:114
};

/* Vi-like keybindings */
/*
var keys = {
  nextPage: 93,
  prevPage: 91,
  topPost: 116,
  botPost: 98,
  nextPost: 107,
  prevPost: 106,
  reply: 114
};
*/

/* ========================================
   General support
   ======================================== */
   
function injectScript(url) {
  var s_tag = document.createElement('script');
  s_tag.src = url;
  s_tag.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(s_tag);
}

function injectCss() {
  var c_tag = document.createElement('style');
  c_tag.innerHTML = '.selected { border: 3px solid red; }'
  document.getElementsByTagName('head')[0].appendChild(c_tag);
}

/* ========================================
   Gist support
   ======================================== */
   
function extract_gist_reference($link) {
  var gr = $link.attr("text").match(/https?\:\/\/gist\.github\.com\/\d{1,}/)
  unsafeWindow.bab = gr;
  if(gr) { return gr[0]; }
  else { return null }
}

function make_hot_gists($){
  $("div:not(.quoted) > a[href*=gist.github.com]").each(
    function() {
      var $elem = $(this);
      var gist_reference = extract_gist_reference($elem);
      if(gist_reference) {
        $elem.attr("href", gist_reference)
        $elem.wrap('<div class="gist-wrapper">')
        $(this.parentNode).append($('<iframe style="width:100%; padding:0; margin:0;" frameborder="0" src="' +
                         gist_reference +
                         ".pibb\" />"));
      }
    });
  $(".gist-wrapper").css({"background-color": "#eeeeee", border: "solid #cccccc 1px",});
  $("div.gist-wrapper > a").css({display: "block", padding: "1em",
                                 "border-bottom": "solid 1px", "font-family": "Consolas,sans-serif",
                                 "text-align": "center"});
}

/* ========================================
   Skitch support
   ======================================== */
   
function make_hot_skitchs($) {
  $("a[href*=img.skitch.com]").each(function() {
    this.innerHTML = "<img src=\"" + $(this).attr("text") + "\">"
  })
}
 
/* ========================================
   Keynav support
   ======================================== */
   
function no_modifiers(event) {
  return !(event.ctrlKey || event.altKey || event.metaKey)
}

function install_key_navigation($) {
  if(posts.length > 0) {
    
    var up_post = function(e) {
      if(e.which == keys.nextPost && no_modifiers(e)) {
        if(post_offset > 0) {
          post_offset = post_offset - 1
          $.scrollTo(posts[post_offset], 'fast')
          return false;
        }
        if(post_offset == 0 && $('a.page_jump').length > 0) {
          // Jump to previous page instead!
          $('a.page_jump').each( function (i) {
            if($(this).attr("title") == "previous page") {
              document.location = $(this).attr('href');
              return false;
            }
          })
          return false;
        }
        return true;
      }
    }
    
    var down_post = function(e) {
      if(e.which == keys.prevPost && no_modifiers(e)) {
        if(post_offset + 1 < max_post) {
          post_offset = post_offset + 1
          $.scrollTo(posts[post_offset], 'fast')
          return false;
        }
        if(post_offset == max_post -1 && $('a.page_jump').length > 0) {
          // Jump to next page instead!
          $('a.page_jump').each( function (i) {
            if($(this).attr("title") == "next page") {
              document.location = $(this).attr('href');
              return false;
            }
          })
          return false;
        }
        return true;
      }
    }
    
    var top_bottom_post = function(e) {
      if(e.which == keys.topPost && no_modifiers(e)) {
        $.scrollTo(posts[0], 'normal') ; post_offset = 0 ; return false;
      }
      if(e.which == keys.botPost && no_modifiers(e)) {
        $.scrollTo(posts[max_post - 1], 'normal') ; post_offset = max_post - 1 ;return false;
      }
      return true;
    }
    
    $('*').keypress(up_post).keypress(down_post).keypress(top_bottom_post);
  }
}

function forum_navigation_fixes($) {
  $("div.forum_detail_pagination > a").css("font-size", "2.0em") // Kiyo requested for his old-man eyes.
  $("*").keypress(function(e) {
    if(e.which == keys.prevPage && no_modifiers(e) && $('a.page_jump').length > 0) {
      var lset = $('a.page_jump:first')
      if(lset.attr("title") == "previous page") {
        document.location = $(lset).attr('href');
        return false;
      }
    }
    if(e.which == keys.nextPage && no_modifiers(e) && $('a.page_jump').length > 0) {
      var lset = $('a.page_jump:last')
      if(lset.attr("title") == "next page") {
        document.location = lset.attr('href');
        return false;
      }
    }
    if(e.which == keys.reply && no_modifiers(e) && $('a.postReply').length > 0) {
      if(reply_count == 0) {
        reply_timer = $.timer(700, function (timer) {
          GM_log("doing standard reply")
          var lset = $('a.postReply:first');
          timer.stop()
          document.location = $(lset).attr('href');
          reply_count = 0
        })
        reply_count++
        GM_log("reply_count = " + reply_count.toString())
        var post = $(posts[post_offset])
        $($(post).children('div.postcontent')[0]).toggleClass('selected')
      }
      else if( reply_count > 0 ) {
        GM_log("doing quoted reply of: " + post_offset.toString())
        var opts = $(posts[post_offset]).children('div.options')[0]
        var quote = $(opts).children('a.post-quote')
        reply_timer.stop()
        document.location = $(quote).attr('href')
        reply_count = 0
      }
      return false
    }
    return true;
  })
}

/* ========================================
Signature Switch support
==========================================

	::::	switch_signature(), hit_the_sig_switch() are injected into head
	::::	jquery.signature.js
	
function switch_signature(which, name){
	if(which == 'Disable'){$.cookie(name, 1, {expires: 30, path: '/', domain: 'gaiaonline.com'});hit_the_sig_switch(name);}
	else if (which == 'Enable'){$.cookie(name, null);hit_the_sig_switch(name);}
}

function hit_the_sig_switch(user){
	$('a.signature_switch').each(function(){ var $sig_switch = $(this);
		var newswitch;
		if($sig_switch.attr("href").search("'Disable','"+user+"'")!=-1){
			newhref = $sig_switch.attr("href").replace("Disable", "Enable");
			newtitle = $sig_switch.attr("title").replace("Disable", "Enable");
			$sig_switch.attr("href", newhref);
			$sig_switch.attr("title", newtitle);
			$('div[class*="'+user+'"]').css({display: "none"});			
		} else if($sig_switch.attr("href").search("'Enable','"+user+"'")!=-1){
			newhref = $sig_switch.attr("href").replace("Enable", "Disable");
			newtitle = $sig_switch.attr("title").replace("Enable", "Disable");
			$sig_switch.attr("href", newhref);
			$sig_switch.attr("title", newtitle);
			$('div[class*="'+user+'"]').css({display: "block"});
		}		
	});	
}

Todo: clean up sigs after enabling on a post other than the last post on page by that user.
*/

function make_signature_switches($){ // Creates switches in Gaian post status bars
	$('div.statuslinks').each(function(){	var $block = $(this);	
		
		//get user of current post
		var user = $block.html().match(/profiles\/\w{1,}\/?/).toString();	
		user = user.substring(9,user.lastIndexOf('/'));
		
		//name and check for cookie, set action for switch
		var acookie = 'signature-'+user;
		var action = ($.cookie(acookie))?'Enable':'Disable';
		
		//creat markup and inject into status bar
		var newhtml = '</span><a title="'+action+' Signature" class="signature_switch" href="javascript:switch_signature(\''+action+'\',\'signature-'+user+'\')">'+action+' Signature</a>';		
		$block.html($block.html().replace('</span>', newhtml));	
		$('a.signature_switch').css({background: 'url(http://gaia.aephex.com/cttt/switch_sig.gif) top left no-repeat', width: '22px'});
		
		//hide cookied signatures
		if($.cookie(acookie)==1){
			$('div[class*="'+acookie+'"]').css({display: "none"});
		 }		
    });	
}

// Mainline
// All your GM code must be inside this function
var posts
var post_offset = 0
var max_post = 0
var reply_count = 0;
var reply_timer
function letsJQuery() {

/* ========================================
 *
 *  jQuery Timer plugin v0.1
 *    Matt Schmidt [http://www.mattptr.net]
 *
 *  Licensed under the BSD License:
 *    http://mattptr.net/license/license.txt
 *
 * ========================================*/
 
 $.timer = function (interval, callback)
 {
 /**
  *
  * timer() provides a cleaner way to handle intervals  
  *
  * @usage
  * $.timer(interval, callback);
  *
  *
  * @example
  * $.timer(1000, function (timer) {
  *   alert("hello");
  *   timer.stop();
  * });
  * @desc Show an alert box after 1 second and stop
  * 
  * @example
  * var second = false;
  * $.timer(1000, function (timer) {
  *   if (!second) {
  *     alert('First time!');
  *     second = true;
  *     timer.reset(3000);
  *   }
  *   else {
  *     alert('Second time');
  *     timer.stop();
  *   }
  * });
  * @desc Show an alert box after 1 second and show another after 3 seconds
  *
  *
  */
  
   var interval = interval || 100;
   if (!callback)
     return false;
   _timer = function (interval, callback) {
     this.stop = function () {
       clearInterval(self.id);
     };
     this.internalCallback = function () {
       callback(self);
     };
     this.reset = function (val) {
       if (self.id)
         clearInterval(self.id);
       var val = val || 100;
       this.id = setInterval(this.internalCallback, val);
     };
     this.interval = interval;
     this.id = setInterval(this.internalCallback, this.interval);
     var self = this;
   };
  return new _timer(interval, callback);
 };
 
  posts = $('div.post')
  max_post = posts.length
  make_hot_gists($);
  make_signature_switches($);
  make_hot_skitchs($);
  install_key_navigation($);
  forum_navigation_fixes($);
}
 
// Step 1, grab jquery & plugin libraries
injectScript('http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js');
injectScript('http://gaia.aephex.com/cttt/jquery.cookie.js');
injectScript('http://flesler-plugins.googlecode.com/files/jquery.scrollTo-1.4.0.js');
injectScript('http://gaia.aephex.com/cttt/jquery.signature.js');
injectCss()

// Step 2, Check if jQuery's loaded and if so launch into it.
// Working on getting this script to work under greasekit in safari. This approach doesn't seem to work?
function FF_GM_wait() {
  if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(FF_GM_wait,100); }
  else { $ = unsafeWindow.jQuery; letsJQuery(); }
}

function SF_GM_wait() {
  if( typeof window.jQuery == 'undefined' ) { window.setTimeout(SF_GM_WAIT, 100); }
  else {$ = window.jQuery; letsJQuery(); } // Once we have it, jumpstart the processing!
}
if(this.unsafeWindow) {
  FF_GM_wait();
}
else {
  SF_GM_wait();
}
