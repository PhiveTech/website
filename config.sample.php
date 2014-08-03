<?php
function isDebugging() {
	return true;
}
function getMySQLUser() {
	return "{MY_SQL_USERNAME}";
}
function getMySQLPass() {
	return "{MY_SQL_PASSWORD}";
}
function getMySQLDB() {
	return "{MY_SQL_DATABASE}";
}
function getDestinationEmail() {
	return "{EMAIL_ADDRESS_TO_SEND_CONTACT_MAIL}";
}
function getHost() {
	return "http://phive-alpha.mit.edu";
}
function getRootPath() {
	return "/testing/new_website";
}
function getIdentifyLocation() {
    return __DIR__ . "/gitignored/identify";
}
?>
