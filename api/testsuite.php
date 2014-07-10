<?php

require 'config.php';

function testsuites($data)
{
	create_connection();
	
	$id = $_GET['id'];
	
	close_connection();
	
	if(!empty($id))
	{
		$testsuite = R::load( 'testsuite', $id );
		
		if(!empty($testsuite))
		{
			return prepare_result(200, 'Success', $testsuite->export());
		}
		else
		{
			return prepare_result(500, 'Testsuite can not be retrieved', NULL);
		}
	}
	else
	{
		$query = "SELECT * FROM testsuite WHERE apikey='".$data->apikey."'";
	
		$testsuites = R::getAll($query);
		
		if(count($testsuites) > 0)
		{
			return prepare_result(200, 'Success', $testsuites);
		}
		else
		{
			return prepare_result(500, 'Testsuite can not be retrieved', NULL);
		}
	}
}

?>