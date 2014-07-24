var Blog = ( function() {
	var template = '<div class="blog-item"><div class="container"><div class="row"><div class="templatemo-line-header overrideMargins"><div class="text-center"><span class="txt_darkgrey uppercase blog-title"></span><span class="blog-tag"></span><div class="blog-thumb-container"></div></div></div></div><div class="clearfix"></div><div class="text-center blog-content"></div><div class="clearfix"></div></div></div>';
	
	var host;
	var rootPath;
	var rootUrl;
	var thisPath;

	var ajaxLoader;

	var useMembers;

	function init() {
		if ( GET_P === undefined || typeof GET_P !== 'string' ) {
			throw new Error( "GET_P not specified." );
		}
		host = HOST;
		rootPath = ROOT_PATH;
		rootUrl = host.concat( rootPath );
		thisPath = rootUrl.concat( "/blog" );

		$('.shareBlog').empty().append( Social.generate( thisPath, $('title').text() ) );

		ajaxLoader = $('.ajax-loader-container > img').hide();

		updateRecentPosts();

		var sep = "?";

		useMembers = false;
		if ( GET_MEMBERS.length > 0 ) {
			thisPath += sep + "members=" + encodeURIComponent( GET_MEMBERS );
			sep = "&";
			useMembers = true;
		}

		if ( GET_P.length > 0 ) {
			initPage( GET_P );
			thisPath += sep + "p=" + encodeURIComponent( GET_P );
			sep = "&";
		} else {
			var options = {};
			if ( GET_AUTHOR ) {
				options['author'] = GET_AUTHOR;
				thisPath += sep + "author=" + encodeURIComponent( GET_AUTHOR );
				sep = "&";
			}
			initBlog( options );
		}
	}

	function updateRecentPosts() {
		var container = $('.recentPosts');

		function condition( post ) {
			return ! containsCategory( post, "members" );
		}

		var numPosts = 5;
		getPosts( { 'goalNumber': numPosts, 'conditionFunc': condition, 'startPage': 0 }, function( err, posts ) {
			if ( err ) {
				console.error( err );
				return;
			}
			for ( var i = 0; i < posts.length && i < numPosts; ++ i ) {
				container.append(
					$('<div>').append(
						$('<a>').attr( 'href', adaptURL( posts[i].url ) ).html( posts[i].title ),
						' by ',
						MakeLink.author( posts[i].author ),
						' on ',
						formatDate( new Date( posts[i].date ) )
					)
				);
			}
		});
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

	function containsCategory( post, slug ) {
		for ( var i = 0; i < post.categories.length; i += 1 ) {
			if ( post.categories[i].slug === slug ) {
				return true;
			}
		}
		return false;
	}

	var MakeLink = ( function() { 

		function author( authorObj ) {
			return $('<a>').attr('href', './?author=' + encodeURIComponent( authorObj.slug ) ).html( authorObj.name );
		}

		/* Return exports: */
		return {
			author: author
		};
	})();

	/* possible keys for 'options':
		'goalNumber' an integer
		'conditionFunc' a function returning a boolean
		'increment' an integer (how many posts to fetch with each get)
		'startPage' an integer (which page to start on) 
		'p' a page id for requesting a single page 
		'loadedPostsSet' an object with post.id: true for every post which is currently loaded */
	function getPosts( options, callback ) {
		if ( ! options ) {
			options = {};
		}
		if ( typeof options !== 'object' ) {
			callback( new Error( "'options' is not an object." ) );
			return;
		}

		var posts = [];
		if ( ! options.startPage ) options.startPage = 0;
		if ( ! options.conditionFunc ) options.conditionFunc = function() { return true; };
		if ( ! options.goalNumber && options.goalNumber !== 0 ) options.goalNumber = 1; 
		if ( ! options.increment ) options.increment = options.goalNumber;

		if ( options.goalNumber <= 0 ) {
			callback( null, [] );
			return;
		}

		if ( options.page ) {
			options.goalNumber = 1;
		}

		function NotFoundError( msg ) {
			this.error = new Error( msg );
		}

		var loadedPosts = options.loadedPostsSet || {};

		function getMorePosts( page ) {
			var query = '../wordpress/?json=get_recent_posts&count=' + encodeURIComponent( options.increment.toString() ) + "&page=" + encodeURIComponent( page.toString() );
			if ( options.page ) {
				query = '../wordpress/?p=' + encodeURIComponent( options.page ) + '&json=1';
			}
			$.getJSON( query, function( json ) {
				if ( json.status !== "ok" ) {
					if ( json.error && json.error === "Not found" ) {
						callback( new NotFoundError( "Page not found." ) );
					} else {
						console.error( json );
						callback( new Error( "An error occurred when looking up posts." ) );
					}
					return;
				}
				if ( options.page ) {
					if ( json.post.status === "publish" && options.conditionFunc( json.post ) ) {
						callback( null, [ json.post ] );
					} else {
						callback( null, [] );
					}
					return;
				}
				if ( json.posts.length === 0 ) {
					/* All the posts that are going to be found have been found */
					callback( null, posts );
					return;
				}
				json.posts.forEach( function( post ) {
					if ( ! loadedPosts.hasOwnProperty( post.id ) && post.status === "publish" && options.conditionFunc( post ) ) {
						loadedPosts[ post.id ] = true; 
						posts.push( post );
					}
				});
				if ( posts.length >= options.goalNumber ) {
					callback( null, posts );
					return;
				}
				getMorePosts( page + 1 );
			}).fail( function( err ) {
				callback( err );
				return;
			});
		}
		getMorePosts( options.startPage );
	}

	function initPage( page ) {
		var blogItem = newBlogItem();

		var divPostsContainer = $('#posts');
		divPostsContainer.find('#post_container').empty().append( blogItem.jquery );;

		function handlerError( err ) {
			console.error( err );
			// TODO:  better error handling
		}

		getPosts( { 'page': page }, function( err, posts ) {
			if ( err ) {
				handlerError( err );
				return;
			}
			var isMember = ( !! posts[0] ) && containsCategory( posts[0], "members" );
			divPostsContainer.find('#btnBack').append( isMember ? " Members" : " Blog" ).click( function() {
				window.location.href = "./" + ( isMember ? "?members=1" : "" );
			});
			if ( posts.length === 0 ) {
				handlerError( new Error('No matching posts.') );
				return;
			}
			$('title').append( " | ", posts[0].title );
			updateBlogItem( blogItem, posts[0], true );
		} );

	}

	function toggleLoadingIcon( toggle ) {
		if ( toggle ) {
			ajaxLoader.show();
		} else {
			ajaxLoader.hide();
		}
	}

	var NUMBER_PER_PAGE = 10;
	function initBlog( options ) {
		if ( ! options ) {
			options = {};
		}

		var divPostsContainer = $('#posts');
		divPostsContainer.find('.page_title > h2').text( useMembers ? "Members" : "Blog" );
		var divPosts = divPostsContainer.find('#post_container').empty();

		divPostsContainer.find('#btnBack').append( " Home").click( function() {
			window.location.href = "../";
		});

		function handlerError( err ) {
			console.error( err );
			// TODO:  better error handling
		}

		var numberPerPage = NUMBER_PER_PAGE;

		function condition( post ) {
			return ( containsCategory( post, "members" ) === useMembers )
				&& ( ! options.author || post.author.slug === options.author );
		}

		/* Infinite scroll: */
		$(function(){
			$(window).scroll(function(){
				var aTop = divPosts.position().top + divPosts.height();
				if($(this).scrollTop()>=aTop){
					requestMore();
				}
			});
		});

		var loading = false;
		var noMoreToLoad = false;
		function requestMore() {
			if ( loading || noMoreToLoad ) {
				return;
			}
			loading = true;
			toggleLoadingIcon( true );
			loadMorePosts( function( err, numLoaded ) {
				toggleLoadingIcon( false );
				if ( err ) {
					console.error( err );
					return;
				}
				if ( numLoaded === 0 ) {
					noMoreToLoad = true;
				}
				loading = false;
			});
		}

		var loadedPosts = {};
		var currentPage = 0;
		function loadMorePosts( callback ) {
			if ( ! callback ) {
				callback = function( err ) {
					if ( err ){
						handlerError( err );
					}
				}
			}
			getPosts( { 'goalNumber': numberPerPage, 'startPage': currentPage, 'conditionFunc': condition, 'loadedPostsSet': loadedPosts }, function( err, posts ) {
				if ( err ) {
					callback( err );
					return;
				}
				if ( useMembers ) {
					shuffle( posts );
				}
				++ currentPage;
				for ( var i = 0; i < posts.length && i < numberPerPage; ++ i ) {
					var blogItem = newBlogItem();
					updateBlogItem( blogItem, posts[i], false );
					divPosts.append( $('<div>').addClass('horizontalRule') );
					divPosts.append( blogItem.jquery );
				}
				callback( null, posts.length );
			});
		}
		requestMore();
	}

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
	function updateBlogItem( blogItem, post, fullContent ) {
		blogItem.tag.empty();
		if ( ! containsCategory( post, "members" ) ) {
			blogItem.tag.append( "by ", MakeLink.author( post.author ), " on ", formatDate( new Date( post.date ) ) );
		}
		if ( post['thumbnail'] ) {
			blogItem.thumb.empty().append( $('<img>').attr( 'src', adaptURL( post['thumbnail' ] ) ) );
		} else {
			blogItem.thumb.empty();
		}
		if ( fullContent ) {
			blogItem.thumb.removeClass('preview');
			blogItem.title.html( post.title );
			blogItem.content.empty().append( adaptURLinContext( post.content ) ).after( Social.generate( thisPath, $('title').text() ) );
		} else {
			blogItem.thumb.addClass('preview');
			blogItem.title.empty().append( $('<a>').attr('href', adaptURL( post.url ) ).html( post.title ) );
			blogItem.readMore.find('a').attr('href', adaptURL( post.url ) );
			blogItem.content.empty().append( adaptURLinContext( post.excerpt ) ).after( blogItem.readMore );
		}
	}

	function newBlogItem() {
		var base = $(template);
		var title = base.find('.blog-title');
		var tag = base.find('.blog-tag');
		var content = base.find('.blog-content');
		var thumb = base.find('.blog-thumb-container');
		var readMore = $('<div>').addClass('blog-read-more').append( $('<a>').attr('href', '#').text('Read More') );
		return {
			jquery: base,
			title: title,
			tag: tag,
			thumb: thumb,
			content: content,
			readMore: readMore
		}
	}

	/* Return exports: */
	return {
		init: init
	};
})();

$( function() {
	Blog.init();
});