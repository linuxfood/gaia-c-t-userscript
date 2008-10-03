function switch_signature(which, user){	
	
	//set or destory cookie
	(which == 'Disable')?$.cookie(user, 1, {expires: 30, path: "/"}):$.cookie(user, null, {path: "/"});	
	
	//get all switches
	$('a.signature_switch').each(function(){ var $sig_switch = $(this);	
		var newswitch;
		
		//only use switches for this user
		if($sig_switch.attr("href").search("'Disable','"+user+"'")!=-1){
		
			//swap disable for enable in title,text, and link
			newhref = $sig_switch.attr("href").replace("Disable", "Enable");
			newtitle = $sig_switch.attr("title").replace("Disable", "Enable");			
			$sig_switch.attr("href", newhref);
			$sig_switch.attr("title", newtitle);
			$sig_switch.text(newtitle);
			
			//hide all sigs for this user
			$('div[class*="'+user+'"]').css({display: "none"});		
			
		} else if($sig_switch.attr("href").search("'Enable','"+user+"'")!=-1){
			
			//swap enable for disable in title and link
			newhref = $sig_switch.attr("href").replace("Enable", "Disable");
			newtitle = $sig_switch.attr("title").replace("Enable", "Disable");
			$sig_switch.attr("href", newhref);
			$sig_switch.attr("title", newtitle);
			$sig_switch.text(newtitle);
			
			// Get last sig for this user and show it
			$last_sig = $('div[@class*="'+user+'"]').slice(-1);
			$last_sig.css({display: "block"});			
		}	
		
	});	
}
