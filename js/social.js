var Social = ( function() {
	/* Found at http://ostr.io/code/html-social-like-share-buttons-no-javascript.html */
	var template = '<div class="btn-group"><button class="btn btn-default disabled"> Share: </button><!--<a class="btn btn-default" target="_blank" title="Like On Facebook" href="http://www.facebook.com/plugins/like.php?href={LINK_LOCATION}"><i class="fa fa-thumbs-o-up fa-lg fb"></i></a>--><!--<a class="btn btn-default google-plus-one" target="_blank" title="+1 On Google" href="https://apis.google.com/_/+1/fastbutton?usegapi=1&size=large&hl=en&url={LINK_LOCATION}" ><i class="fa fa-google-plus fa-2x google"></i><span class="google">1</span></a>--><a class="btn btn-default" target="_blank" title="On Facebook" href="http://www.facebook.com/sharer.php?u={LINK_LOCATION}&t={TEXT_LOCATION}"><i class="fa fa-facebook fa-lg fb"></i></a><a class="btn btn-default" target="_blank" title="On Twitter" href="http://twitter.com/share?url={LINK_LOCATION}&text={TEXT_LOCATION}" ><i class="fa fa-twitter fa-lg tw"></i></a><a class="btn btn-default" target="_blank" title="On Google Plus" href="https://plusone.google.com/_/+1/confirm?hl=en&url={LINK_LOCATION}" ><i class="fa fa-google-plus fa-lg google"></i></a><a class="btn btn-default" target="_blank" title="On LinkedIn" href="http://www.linkedin.com/shareArticle?mini=true&url={LINK_LOCATION}" ><i class="fa fa-linkedin fa-lg linkin"></i></a><a class="btn btn-default" target="_blank" title="Pin It" href="http://www.pinterest.com/pin/create/button/?url={LINK_LOCATION}&description={TEXT_LOCATION}&media={IMAGE_LOCATION}" ><i class="fa fa-pinterest fa-lg pinterest"></i></a></div>';
	
	function generate( url, text, image ) {
		if ( ! text ) {
			text = "";
		}
		if ( ! image ) {
			image = "";
		}
		if ( ! url ) {
			throw new Error( "A url is required to generate share buttons!" );
		}
		var filled = template.slice(0).replace( /\{LINK_LOCATION\}/g, encodeURIComponent( url ) )
			.replace( /\{TEXT_LOCATION\}/g, encodeURIComponent( text ) )
			.replace( /\{IMAGE_LOCATION\}/g, encodeURIComponent( image ) );
		return $(filled);
	}

	/* Return exports: */
	return {
		generate: generate
	};
})();