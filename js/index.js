var Index = ( function() {

	var shortMonths = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	function formatDate( jsDate ) {
		var out = "";
		out = out.concat( shortMonths[ jsDate.getMonth() ] );
		out = out.concat( " ", jsDate.getDate().toString() );
		var now = new Date();
		if ( jsDate.getYear() !== now.getYear() ) {
			out = out.concat( ", ", jsDate.getYear().toString() );
		}
		return out;
	}

	function updateRecentPosts() {
		var divRecentPosts = $('#divBlogPreview');

		function errorLoading() {
			divRecentPosts.empty().append(
				$('<p>').addClass('errorText').text( "Recent blog posts could not be loaded.  We're sorry for the inconvenience." )
			);
		}
		$.get('./wordpress/?json=get_recent_posts&count=2', function( json ) {
			console.log( json );
			if ( json.status !== "ok" ) {
				errorLoading();
			}
			divRecentPosts.empty();
			json.posts.forEach( function( post ) {
				if ( post['status'] !== "publish" ) {
					return;
				}

				/* Convert date to javascript object: */
				console.log( post['date'] );
				var postDate = new Date( post['date'] );
				console.log( postDate );
				var formattedDate = formatDate( postDate );

				var container = $('<div>').addClass('col-lg-6').addClass('blogItem_Container');
				container.append( $('<h3>').addClass('blogItem_Title').append(
					$('<a>').attr('href', post['url']).text( post['title'] ) 
				) );
				container.append( 
					$('<div>').addClass('blogItem_AuthorDate')
						.append( "by ")
						.append( $('<span>').addClass('blogItem_Author').text( post['author']['name'] ) )
						.append( " on ")
						.append( $('<span>').addClass('blogItem_Date').text( formattedDate ) )
				);
				if ( post['thumbnail'] ) {
					container.append( $('<img>').addClass('blogItem_thumbnail').attr('src', post['thumbnail'] ) );
				}
				container.append( $('<div>').addClass('blogItem_Excerpt').html( post['excerpt'] ) );
				container.append( $('<a>').addClass('blogItem_ReadMore').attr('href', post['url']).text("Read More") );
				divRecentPosts.append( container );
			});
		}).fail( function( err ) {
			console.error( err );
			errorLoading();
		})
	}

	/* Return exports: */
	return {
		updateRecentPosts: updateRecentPosts
	};
} )();

$( function() {
	Index.updateRecentPosts();
} );
