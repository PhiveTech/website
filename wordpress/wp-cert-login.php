<?php

require_once( __DIR__ . '/../config.php' );

if ( isDebugging() ) {
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
}

require_once( __DIR__ . '/wp-blog-header.php' );
require_once( getIdentifyLocation() . '/identify_client.php' );

function fail() {
	header('Location: ' . getHost() . getRootPath() . '/wordpress/wp-login.php' );
	die();
}

function auto_login( $email ) {
    $user = get_user_by( "email", $email );
    if ( ! $user ) {
    	fail();
    	return;
    }
    $user_id = $user->ID;
    wp_set_current_user( $user_id );
    wp_set_auth_cookie( $user_id );
    do_action( 'wp_login' ); // , $user_login );
	header('Location: ' . getHost() . getRootPath() . '/wordpress/wp-admin/' );
	die();
}

// If the client is receiving a response...
if ( isset( $_POST['response'] ) ) { 
    $response = processResponse( $_POST['response'] );
    // Do whatever you want to do with the response
    if ( ! $response || ! $response['hasCert'] || $response['cert']['issuer'] != "Massachusetts Institute of Technology" ) {
    	fail();
    	return;
    }
    auto_login( strtolower( trim( $response['cert']['email'] ) ) );
    // Then...
    die();
}

// Otherwise, redirect for validation:
makeRequest( getHost() . getRootPath() . '/wordpress/wp-cert-login.php' ); /* or whatever the url of this page (or the page which should receive the response) is */

?>