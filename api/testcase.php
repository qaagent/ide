<?php

require 'config.php';

function testcases($data)
{
	create_connection();
	
	$id = $_GET['id'];
	
	close_connection();
	
	if(!empty($id))
	{
		$testcase = R::load( 'testcase', $id );
		
		if(!empty($testcase))
		{
			return prepare_result(200, 'Success', $testcase->export());
		}
		else
		{
			return prepare_result(500, 'Test case can not be retrieved', NULL);
		}
	}
	else
	{
		if(!empty($data->testsuite))
		{
			$query = "SELECT * FROM testcase WHERE apikey='".$data->apikey."' AND testsuite='".$data->testsuite."'";
		
			$testcases = R::getAll($query);
			
			if(count($testcases) > 0)
			{
				return prepare_result(200, 'Success', $testcases);
			}
			else
			{
				return prepare_result(500, 'Test cases can not be retrieved', NULL);
			}
		}
		else
		{
			return prepare_result(500, 'Test suite is not provided', NULL);
		}
	}
}

?>