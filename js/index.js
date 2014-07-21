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
		$.getJSON( './wordpress/?json=get_recent_posts&count=2', function( json ) {
			if ( json.status !== "ok" ) {
				errorLoading();
			}
			divRecentPosts.empty();
			json.posts.forEach( function( post ) {
				if ( post['status'] !== "publish" ) {
					return;
				}

				/* Convert date to javascript object: */
				var postDate = new Date( post['date'] );
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

	function showAndFade( box, msg ) {
		box.hide();
		box.empty().html( msg );
		box.fadeIn( 200, function() {
			setTimeout( function() {
				box.fadeOut( 1000 );
			}, 3000 );
		});
	}

	function setUpContactForm() {
		$('.contactUs').each( function() {
			var name = $(this).find('.txtName');
			var email = $(this).find('.txtEmail');
			var message = $(this).find('.txtMessage');
			var submit = $(this).find('.btnSend');
			var error = $(this).find('.contactErrorMessage');
			error.empty();
			submit.unbind('click').click( function() {
				$.post( './email/index.php', { "from": email.val(), "name": name.val(), "message": message.val() }, function( msg ) {
					var json;
					try {
						json = JSON.parse( msg );
					} catch( e ) {
						json = { "success": false, "msg": "Could not parse response: " + msg };
					}
					if ( ! json.success ) {
						showAndFade( error, json.msg );
						return;
					}
					name.val("");
					email.val("");
					message.val("");
					showAndFade( error, "Your message was sent!" );
				}).fail( function( err ) {
					console.error( err );
					showAndFade( error, "Could not send email." );
				});
			});
		});
	}

	/* Return exports: */
	return {
		setUpContactForm: setUpContactForm,
		updateRecentPosts: updateRecentPosts
	};
} )();

$( function() {
	Index.setUpContactForm();
	Index.updateRecentPosts();
} );
