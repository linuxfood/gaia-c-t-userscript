// ==UserScript==
// @name SteezyCTTT
// @namespace http://github.com/kirindave
// @description Steezes up Gaia's C&T:TT forum!
// @include http://www.gaiaonline.com/forum/c-t-tech-talk/*
// ==/UserScript==
 
/* ========================================
   General support
   ======================================== */

function injectScript(url) {
  var s_tag = document.createElement('script');
  s_tag.src = url;
  s_tag.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(s_tag);
}
  
/* ========================================
   Gist support
   ======================================== */

function extract_gist_reference($link) {
  var gr = $link.attr("text").match(/https?\:\/\/gist\.github\.com\/\w{1,}/)
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
  var posts = $('div.post')
  if(posts.length > 0) {
    var max_post = posts.length
    var post_offset = 0;
    
    var up_post = function(e) {
      if(post_offset > 0 && (e.which == 112 && no_modifiers(e))) {
        post_offset = post_offset - 1
        $.scrollTo(posts[post_offset], 'fast')
        return false;
      }
      else {
        return true;
      }
    }
    
    var down_post = function(e) {
      if(post_offset + 1 < max_post && (e.which == 110 && no_modifiers(e))) {
        post_offset = post_offset + 1
        $.scrollTo(posts[post_offset], 'fast')
        return false;
      }
      else {
        return true;
      }
    }
    
    var top_bottom_post = function(e) {
      if(e.which == 116 && no_modifiers(e)) {
        $.scrollTo(posts[0], 'normal') ; post_offset = 0 ; return false;
      }
      if(e.which == 98 && no_modifiers(e)) {
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
    if(e.which == 91 && no_modifiers(e) && $('a.page_jump').length > 0) {
      var lset = $('a.page_jump:first')
      if(lset.attr("title") == "previous page") {
        document.location = $(lset).attr('href');
        return false;
      }
    }
    if(e.which == 93 && no_modifiers(e) && $('a.page_jump').length > 0) {
      var lset = $('a.page_jump:last')
      if(lset.attr("title") == "next page") {
        document.location = lset.attr('href');
        return false;
      }
    }
    if(e.which == 114 && no_modifiers(e) && $('a.postReply').length > 0) {
    	var lset = $('a.postReply:first')
    	document.location = $(lset).attr('href');
    	return false;
    }
    return true;
  })
}

// Mainline
// All your GM code must be inside this function
function letsJQuery() {
  make_hot_gists($);
  make_hot_skitchs($);
  install_key_navigation($);
  forum_navigation_fixes($);
}
 
// Step 1, grab jquery & jquery.scrollto
injectScript('http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js');
injectScript('http://flesler-plugins.googlecode.com/files/jquery.scrollTo-1.4.0.js')

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