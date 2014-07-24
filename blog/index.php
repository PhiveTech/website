<?php
    require_once('../config.php');

    function phpVariToJS( $phpVari, $jsName ) {
        $escapeBS = str_replace( "\\", "\\\\", $phpVari );
        $escapeQuote = str_replace( "\"", "\\\"", $escapeBS );
        return "var " . $jsName . " = \"" . $escapeQuote . "\";"; 
    }
?>

<!DOCTYPE html>
<!-- 
    Free Responsive Template by templatemo
    http://www.templatemo.com
-->
<html lang="en">
    <head>
        <title>Simmons Phive Alpha | Blog</title>
        <meta name="keywords" content="dorm, mit, massachusetts, engineering, eecs, cs, computer science, programming, servers, massachusetts institute of technology, prefrosh, simmons, lounges, simmons hall, rush, recruitment, events, hackathon" />
		<meta name="description" content="Simmons Phive Alpha:  A whacky group of engineering and science students living in the world's most porous dormitory" />
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" type="image/png" href="../images/logo.png">
        <link rel="icon" type="image/png" href="../images/logo.png">
        
        
        <!-- Google Web Font Embed -->
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic' rel='stylesheet' type='text/css'>


        <link href="../css/blog.css" rel="stylesheet" type="text/css">

        <link href="../css/style.css"  rel='stylesheet' type='text/css'>

        <link href="../css/social.css" rel="stylesheet" type='text/css'>
        <link href="../css/font-awesome.css" rel="stylesheet" type='text/css'>
        
        <!-- Bootstrap core CSS -->
        <link href="../css/bootstrap.css" rel='stylesheet' type='text/css'>

        <!-- Custom styles for this template -->
        <link href="../js/colorbox/colorbox.css"  rel='stylesheet' type='text/css'>
        <link href="../css/templatemo_style.css"  rel='stylesheet' type='text/css'>

        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
          <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
        <![endif]-->
    </head>
    
    <body>

        <div class="templatemo-top-bar" id="templatemo-top">
            <div class="container">
                <div class="subheader">
                    <div id="email" class="pull-right">
                            <img src="../images/email.png" alt="email"/>
                            phive-alpha@mit.edu
                    </div>
                </div>
            </div>
        </div>
        <div class="templatemo-top-menu">
            <div class="container">
                <!-- Static navbar -->
                <div class="navbar navbar-default" role="navigation">
                    <div class="container">
                        <div class="navbar-header">
                                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                </button>
                                <a class="navbar-brand" href="../" rel="nofollow">
                                    <img class='logo_img' src='../images/logo.png'>
                                    <span class ='logo'>  Simmons Phive Alpha </span>
                                </a>
                        </div>
                        <div class="navbar-collapse collapse" id="templatemo-nav-bar">
                            <ul class="nav navbar-nav navbar-right" style="margin-top: 40px;">
                                <li><a href="../#templatemo-top">HOME</a></li>
                                <li><a href="../#templatemo-about">MEMBERS</a></li>
                                <li><a href="../#templatemo-portfolio">NEWS</a></li>
                                <li><a href="../#templatemo-contact">CONTACT</a></li>
                                <li class="active"><a href="./">BLOG</a></li>
                                <!-- <li><a href="#templatemo-blog">BLOG</a></li> -->
                            </ul>
                        </div><!--/.nav-collapse -->
                    </div><!--/.container-fluid -->
                </div><!--/.navbar -->
            </div> <!-- /container -->
        </div>
        
        <div>
            <!-- Carousel -->
            <div id="templatemo-carousel" class="carousel slide backgroundOverride" data-ride="carousel">
                <!-- Indicators -->
                <div class="carousel-inner">
                    <div class="item active">
                        <div class="container">
                            <div class="carousel-caption positionOverride">
                                <div class="underlay">
                                    <h1>In the <span class="text_orange">Lounge</span></h1>
                                    <p>Take a look inside by exploring our blog!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
<!--                     <div class="item">
                        <div class="container">
                                <div class="carousel-caption">
                                    <div class="col-sm-6 col-md-6">
                                    	<h1>Beta</h1>
                                        <p>SPA FOR LIFE!</p>
                                    </div>
                                    <div class="col-sm-6 col-md-6">
                                    	<h1>Alpha</h1>
                                        <p>SPA FOR LIFE!</p>
                                    </div>
                                </div>
                        </div>
                    </div> -->

                </div>
    <!-- <a class="left carousel-control" href="#templatemo-carousel" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a>
    <a class="right carousel-control" href="#templatemo-carousel" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a> -->
            </div><!-- /#templatemo-carousel -->
        </div>

        <div class="blog-container">
            <div id="blog-section" class="row">

                <div id="posts" class="col-xs-12 col-sm-6 col-lg-8">

                    <div class="blog-item container page-blog-heading">
                        <button id="btnBack" type="button" class="btn btn-default btn-lg">
                            <span class="glyphicon glyphicon-arrow-left"></span> Back
                        </button>
                        <div class="row templatemo-line-header noMargins text-center">
                            <span class="txt_darkgrey uppercase page_title"><h2></h2></span>
                        </div>

                        <div class="clearfix"></div>
                    </div>


                    <div id="post_container"></div>
                </div>

                <div id="sidebar" class="col-xs-12 col-sm-6 col-lg-4">
                    <h3 class="uppercase">Share Blog</h3>
                    <div class="shareBlog"></div>
                    <h3 class="uppercase">Recent Posts</h3>
                    <div class="recentPosts"></div>
                </div>
            </div>
        </div>


        <div class="templatemo-tweets">
            <div class="container">
                <div class="row" style="margin-top:20px;">
                        <div class="col-md-2">
                        </div>
                        <div class="col-md-1">
                                <img src="../images/quote.png" alt="icon" />
                        </div>
                        <div class="col-md-7 tweet_txt" >
                                <span>SPA is a lounge with awesome people. We want you to join us.</span>
                                <br/>
                                <span class="twitter_user">-SPA Members</span>
                        </div>
                        <div class="col-md-2">
                        </div>
                 </div><!-- /.row -->
            </div><!-- /.container -->
        </div>

        <div class="templatemo-footer" >
            <div class="container">
                <div class="row">
                    <div class="text-center">

                        <div class="footer_container">
                            <div class="height30"></div>
                            <a class="btn btn-lg btn-orange" href="#" role="button" id="btn-back-to-top">Back To Top</a>
                            <div class="height30"></div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

        <script src="../js/jquery.min.js" type="text/javascript"></script>
        <script src="../js/bootstrap.min.js"  type="text/javascript"></script>
        <script src="../js/stickUp.min.js"  type="text/javascript"></script>
        <script src="../js/colorbox/jquery.colorbox-min.js"  type="text/javascript"></script>
        <script src="../js/templatemo_script.js"  type="text/javascript"></script>

        <script type="text/javascript">
        <?php
            echo phpVariToJS( $_GET['p'], "GET_P" );
            echo phpVariToJS( $_GET['author'], "GET_AUTHOR" );
            echo phpVariToJS( $_GET['members'], "GET_MEMBERS" );
            echo phpVariToJS( getHost(), "HOST" );
            echo phpVariToJS( getRootPath(), "ROOT_PATH" );
        ?>
        </script>

        <script src="../js/social.js" type="text/javascript"></script>
        <script src="../js/blog.js" type="text/javascript"></script>
        <!--<script src="js/index.js" type="text/javascript"></script>-->

    </body>
</html>
<!-- 
    Free Responsive Template from templatemo
    http://www.templatemo.com
-->
