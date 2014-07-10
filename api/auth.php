<?php

require 'config.php';

if (!function_exists('logininfo')) {
	function logininfo($data)
	{
		if(!is_null($data->apikey))
		{
			create_connection_auth();
			
			$query = "SELECT * FROM wp_users WHERE apikey='".$data->apikey."'";
			
			$user = R::getRow($query);
			
			close_connection();
			
			if(!is_null($user['apikey']))
			{
				return prepare_result(200, 'Success', $user);
			}
			else
			{
				return prepare_result(401, 'Not Authorized', NULL);
			}
		}
		else
		{
			return prepare_result(false, 'API Key is not provided', NULL);
		}
	}
}

?>