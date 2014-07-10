<?php
	$GLOBALS['username'] = "qaagentc_admin";
	$GLOBALS['password'] = "Atsveta_68";
	$GLOBALS['hostname'] = "localhost";
	$GLOBALS['dbname'] = "qaagentc_ide";
	$GLOBALS['authdb'] = "qaagentc_site";	

if (!function_exists('prepare_result')) {
    function prepare_result($code, $message, $payload)
	{
		$res = new stdClass;
		$res->code = $code;
		$res->message = $message;
		$res->payload = $payload;
		
		return $res;
	}
}

if (!function_exists('log_message')) {
	function log_message($message) {
		error_log($message, 0, 'log.txt');   
	}
}
?>