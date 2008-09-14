// ==UserScript==
// @name SteezyCTTT
// @namespace http://github.com/kirindave
// @description Steezes up Gaia's C&T:TT forum!
// @include http://www.gaiaonline.com/forum/c-t-tech-talk/*
// ==/UserScript==
 
 
function extract_gist_reference($link) {
  var gr = $link.attr("text").match(/https?\:\/\/gist\.github\.com\/\w{1,}/)
  unsafeWindow.bab = gr;
  if(gr) { return gr[0]; }
  else { return null }
}
 
// All your GM code must be inside this function
function letsJQuery() {
  $("div:not(.quoted) > a[href*=gist.github.com]").each(
    function() {
      var $elem = $(this); var $parent = $(this.parentNode);
      var gist_reference = extract_gist_reference($elem);
      if(gist_reference) {
        $elem.wrap('<div class="gist-wrapper">')
        $parent.append($('<iframe style="width:100%; padding:0; margin:0;" frameborder="0" src="' +
                         gist_reference +
                         ".pibb\" />"));
      }
    });
  $(".gist-wrapper").css({"background-color": "#eeeeee", border: "solid #cccccc 1px",});
  $("div.gist-wrapper > a").css({display: "block", padding: "1em",
                                 "border-bottom": "solid 1px", "font-family": "Consolas,sans-serif",
                                 "text-align": "center"});
}
 
// Step 1, get jquery into gaia.
// Add jQuery
var GM_JQ = document.createElement('script');
GM_JQ.src = 'http://jquery.com/src/jquery-latest.js';
GM_JQ.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JQ);
 
 
// Check if jQuery's loaded
// Working on getting this script to work under greasekit in safari. This approach doesn't seem to work?
function FF_GM_wait() {
  if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(FF_GM_wait,100); }
  else { $ = unsafeWindow.jQuery; letsJQuery(); }
}
function SF_GM_wait() {
  if( typeof window.jQuery == 'undefined' ) { window.setTimeout(SF_GM_WAIT, 100); }
  else {$ = window.jQuery; letsJQuery(); }
}
if(this.unsafeWindow) {
  FF_GM_wait();
}
else {
  SF_GM_wait();
}