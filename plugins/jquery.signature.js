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