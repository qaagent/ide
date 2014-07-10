<?php

require 'config.php';
require 'rb.phar';

$username = $GLOBALS['username'];
$password = $GLOBALS['password'];
$hostname = $GLOBALS['hostname']; 
$dbname = $GLOBALS['dbname'];
$authdbname = $GLOBALS['authdb'];

// Setup connection
R::addDatabase('idedb','mysql:host='.$hostname.';dbname='.$dbname,$username,$password);
R::addDatabase('authdb','mysql:host='.$hostname.';dbname='.$authdbname,$username,$password);

if (!function_exists('create_connection')) {
	function create_connection()
	{
		R::selectDatabase('idedb');
	}
}

if (!function_exists('create_connection_auth')) {
	function create_connection_auth()
	{
		R::selectDatabase('authdb');
	}
}

if (!function_exists('close_connection')) {
	function close_connection()
	{
		R::close();
	}
}

?>