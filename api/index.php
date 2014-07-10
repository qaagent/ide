<?php

require 'httpdata.php';
require 'auth.php';
require 'testsuite.php'; 
require 'testcase.php';
require 'database.php';

header("Content-Type:application/json");

$fn = $_GET['function'];

if(!empty($fn))
{
	$body = file_get_contents('php://input');
	$json_body = json_decode($body);
	$json_body->res_id = $res_id;
	
	try
	{
		if(function_exists($fn))
		{
			$auth = logininfo($json_body);
			
			if($auth->code == 200)
			{
				$result = call_user_func($fn, $json_body);
				
				if($result)
				{
					echo prepare_response($result->code, $result->message, $result->payload);
				}
				else
				{
					echo prepare_response(500,"Resource can't be executed",NULL);
				}
			}
			else
			{
				echo prepare_response(401,$auth->message,NULL);
			}
		}
		else
		{
			echo prepare_response(404,"Resource is not available",NULL);
		}
	}catch(Exception $e)
	{
		echo prepare_response(404,$e->getMessage(),NULL);
	}
}
else
{
	echo prepare_response(500,"Resource is not provided",NULL);
}

?>