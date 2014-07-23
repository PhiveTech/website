<?php
/**
 * Front to the WordPress application. This file doesn't do anything, but loads
 * wp-blog-header.php which does and tells WordPress to load the theme.
 *
 * @package WordPress
 */

ini_set('display_errors', 'On');
error_reporting(E_ALL);

require_once( __DIR__ . "/../config.php" );

if ( ! isset( $_GET['feed'] ) && ! isset( $_GET['json'] ) ) {
	$path = getRootPath() . "/blog";
	$joiner = "?";
	if ( isset( $_GET['p'] ) ) {
		$path .= $joiner . "p=" . urlencode( $_GET['p'] );
		$joiner = "&";
	}
	if ( isset( $_GET['author'] ) ) {
		$path .= $joiner . "author=" . urlencode( $_GET['author'] );
		$joiner = "&";
	}
	if ( isset( $_GET['members'] ) ) {
		$path .= $joiner . "members=" . urlencode( $_GET['members'] );
		$joiner = "&";
	}
	header( "Location: " . $path );
	die();
}

/**
 * Tells WordPress to load the WordPress theme and output it.
 *
 * @var bool
 */
define('WP_USE_THEMES', true);

/** Loads the WordPress Environment and Template */
require( dirname( __FILE__ ) . '/wp-blog-header.php' );
