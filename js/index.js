var Index = ( function() {

	/* Function taken from:  http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
	function shuffle(array) {
	  var currentIndex = array.length
	    , temporaryValue
	    , randomIndex
	    ;
	  /* While there remain elements to shuffle... */
	  while (0 !== currentIndex) {
	    /* Pick a remaining element... */
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    /* And swap it with the current element. */
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	  return array;
	}

	var regParts = /^[a-zA-Z]+:\/\/[^\/?]*(.*)$/;
	function adaptURL( url ) {
		var match = regParts.exec( url );
		if ( ! match ) {
			return url;
		}
		return match[1];
	}

	var toFind = "http://localhost";
	function adaptURLinContext( context ) {
		return context.replace( toFind, "" );
	}

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


	var excludeCategories = { "members": true };
	function updateRecentPosts() {
		var divRecentPosts = $('#divBlogPreview');

		function errorLoading() {
			divRecentPosts.empty().append(
				$('<p>').addClass('errorText').text( "Recent blog posts could not be loaded.  We're sorry for the inconvenience." )
			);
		}
		var max = 2;
		var printed = 0;
		var page = 0;
		divRecentPosts.empty();
		function getPostsLoop( success, error ) {
			if ( printed >= max ) {
				return;
			}
			$.getJSON( './wordpress/?json=get_recent_posts&count=3&page=' + ( ++page ).toString(), function( json ) {
				success( json );
				getPostsLoop( success, error );
			}).fail(  function( err ) {
				error( err );
			});
		}
		getPostsLoop( function( json ) {
			if ( json.status !== "ok" ) {
				errorLoading();
			}
			json.posts.forEach( function( post ) {
				if ( printed >= max ) {
					return;
				}
				if ( post['status'] !== "publish" ) {
					return;
				}

				/* Check to see if post has category which is to be excluded: */
				for ( var i = 0; i < post['categories'].length; i += 1 ) {
					var catName = post['categories'][i].title;
					if ( excludeCategories.hasOwnProperty( catName ) && excludeCategories[ catName ] ) {
						return;
					}
				}

				/* Convert date to javascript object: */
				var postDate = new Date( post['date'] );
				var formattedDate = formatDate( postDate );

				var container = $('<div>').addClass('col-lg-6').addClass('blogItem_Container');
				container.append( $('<h3>').addClass('blogItem_Title').append(
					$('<a>').attr('href', adaptURL( post['url'] ) ).text( post['title'] ) 
				) );
				container.append( 
					$('<div>').addClass('blogItem_AuthorDate')
						.append( "by ")
						.append( $('<span>').addClass('blogItem_Author').text( post['author']['name'] ) )
						.append( " on ")
						.append( $('<span>').addClass('blogItem_Date').text( formattedDate ) )
				);
				if ( post['thumbnail'] ) {
					container.append( $('<div>').addClass('blogItem_thumbnailContainer').append( $('<img>').addClass('blogItem_thumbnail').attr('src', adaptURL( post['thumbnail'] ) ) ) );
				}
				container.append( $('<div>').addClass('blogItem_Excerpt').html( adaptURLinContext( post['excerpt'] ) ) );
				container.append( $('<a>').addClass('blogItem_ReadMore').attr('href', adaptURL( post['url'] ) ).text("Read More") );
				divRecentPosts.append( container );

				printed += 1;
			});
		}, function( err ) {
			console.error( err );
			errorLoading();
		});
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

	var Members = ( function() {
		var GROUP_SIZE = 4;
		var FADE_TIME = 1000;
		var WAIT_TIME = 7000;

		var BOX_HEIGHT = 250;
		var BOX_WIDTH = 250;

		var members = [];
		var currentGroup = 0;

		var clearMembers = function() {
			members = [];
		}
		var template = "<li class=\"col-lg-3 col-md-3 col-sm-6 \"><div class=\"text-center\"><div class=\"member-thumb\"><img class=\"img-responsive rounded\" alt=\"{NAME}\"/><a><div class=\"thumb-overlay\"><span class=\"team-inner-overlay-text\">Get to know me!</span></div></a></div><div class=\"team-inner\"><div class=\"team-inner-header\"></div><div class=\"team-inner-subtext\"></div></div></div></li>"
		var addMember = function( post ) {
			var member = $(template);
			var img = ( post['thumbnail'] ) ? adaptURL( post['thumbnail'] ) : "./images/noprof.png";
			var memberThumb = member.find('.member-thumb');
			member.find('.member-thumb > img').attr( 'src', img ).attr( 'alt', post['title'] ).load( function() {
				/* Stretches picture to fill square */
				if ( this.width / this.height > BOX_WIDTH / BOX_HEIGHT ) {
					$( this ).css( 'width', 'auto' )
						.css( 'height', '100%' )
						.css( 'max-width', 'none' );
				}
			});;
			member.find('.thumb-overlay').unbind('hover').hover( hoverIn, hoverOut );
			member.find('.team-inner-header').text( post['title'] );
			member.find('.team-inner-subtext').html( adaptURLinContext( post['excerpt'] ) );
			console.log( post['url'] );
			member.find('.member-thumb > a').attr( 'href', adaptURL( post['url'] ) );
			members.push( member );
		}

		var parent;
		function init( jqueryParent ) {
			parent = jqueryParent;
			var existingItems = parent.find('.member-thumb');
			if ( existingItems.length > 0 ) {
				BOX_WIDTH = existingItems.width();
				BOX_HEIGHT = existingItems.height();
			}
			endDisplay();
			clearMembers();
		}

		var hover = false;
		var onOut;
		function hoverIn() {
			hover = true;
		}
		function hoverOut() {
			hover = false;
			if ( onOut ) {
				var temp = onOut;
				onOut = undefined;
				setTimeout( temp, 1000 );
			}
		}

		var batch = 0;
		function endDisplay() {
			++ batch;
		}
		function initDisplay() {
			endDisplay();
			parent.empty();
			shuffle( members );
			currentGroup = -1;
			var numGroups = Math.ceil( members.length / GROUP_SIZE );
			var fadeInterval = Math.round( FADE_TIME / 2 );
			var currentBatch = batch;
			function nextGroup() {
				if ( hover ) {
					onOut = nextGroup;
					return;
				}
				if ( currentBatch !== batch ) {
					return;
				}
				++ currentGroup;
				if ( currentGroup >= numGroups ) {
					shuffle( members );
					currentGroup = 0;
				}
				parent.fadeOut( fadeInterval, function() {	
					parent.empty();
					var maxIndex = ( currentGroup + 1 ) * GROUP_SIZE;
					for ( var i = currentGroup * GROUP_SIZE; i < maxIndex; ++ i ) {
						parent.append( members[i] );
					}
					$('.thumb-overlay').unbind('hover').hover( hoverIn, hoverOut );
					parent.fadeIn( fadeInterval, function() {
						if ( numGroups > 1 ) {
							setTimeout( nextGroup, WAIT_TIME );
						}
					});
				});
			}
			nextGroup();
		}

		return {
			addMember: addMember,
			init: init,
			initDisplay: initDisplay,
			endDisplay: endDisplay
		}
	} )();

	function updateMembers() {
		function errorLoading() {
			// TODO:  write implementation
		}
		$.getJSON('./wordpress/?json=get_category_posts&slug=members&count=100&status=publish', function(json) {
			if ( json.status !== "ok" ) {
				errorLoading();
			}
			Members.init( $('.team-animation') );
			json.posts.forEach( Members.addMember );
			Members.initDisplay();

		}).fail( function( err ) {
			console.error( err );
			errorLoading();
		});
	}

	/* Return exports: */
	return {
		setUpContactForm: setUpContactForm,
		updateRecentPosts: updateRecentPosts,
		updateMembers: updateMembers
	};

} )();

$( function() {
	Index.setUpContactForm();
	Index.updateMembers();
	Index.updateRecentPosts();
} );
