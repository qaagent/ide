<?php

if (!function_exists('prepare_response')) {
	function prepare_response($status, $status_message, $data)
	{
		header("HTTP/1.1 $status $status_message");
		
		$response->status=$status;
		$response->status_message=$status_message;
		$response->payload=$data;
		
		$json_response=json_encode($response);
		
		log_message($json_response);
		
		echo $json_response;
	}
}

?>