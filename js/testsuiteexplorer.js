//Define angularjs applicatiion
var testsuiteExplorer = angular.module('testsuite-explorer', ["xeditable"]);

testsuiteExplorer.run(function(editableOptions, editableThemes) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

//Reverse order of the created test suites
testsuiteExplorer.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Define angularjs controller
testsuiteExplorer.controller('TestSuiteExplorer', function($scope)
{
	window.onload = function()
    {
		//Initialize qa key
		$scope.qaKeyVal = getParameterByName('qakey');

        if($('#qaagent-ide').text().length == 0)
        {
            _createDemoTestSuite().done(function()
				{
					_getTestSuites(add, refresh);
				})
				.fail(function() {
				    _getTestSuites(add, refresh);
				});
        }
        else
        {
			//Get all test suites on load
			_getTestSuites(add, refresh);
        }
    }

	//Array with all test suites
	$scope.testsuites = [];

	function prepareRequest(obj)
	{
		if(typeof(obj) === 'undefined')
		{
			obj = {};
		}

		obj.qakey = $scope.qaKeyVal;

		return obj;
	}

	function _createDemoTestSuite()
	{
		var deferred = $.Deferred();

		loading.show();

		Parse.Cloud.run('createDemoTestSuite', prepareRequest(), {
	        success: function (testsuites) {
	        	console.log("Demo test suite is created!");
	        	deferred.resolve();
	        	loading.hide();
	        },
	        error: function (error) {
	            console.log("Demo test suite is NOT created!");
	            deferred.reject();
	            loading.hide();
	        }
	    });

	    return deferred;
	}

	//Cloud code function which get all test suites
	function _getTestSuites(collect, callback)
	{
		loading.show();

		Parse.Cloud.run('getTestSuites', prepareRequest(), {
	        success: function (testsuites) {

	        	//If there are any test suites
	        	if(testsuites)
	        	{
	        		//Go through all testsuites
	        		for(var idx = 0; idx < testsuites.length; idx++)
	        		{
	        			//Get the test suite data from response
	        			var testSuitesData = testsuites[idx].attributes;

	        			//set its id
	        			testSuitesData.id = testsuites[idx].id;

	        			//Collect in into the provided data structure
	        			collect(testSuitesData);
	        		}

					//What to do when finish?
		            callback();
		            loading.hide();
	        	}
	        },
	        error: function (error) {
	        	loading.hide();
	            notification.error("Test Suites CAN'T be retrived");
	        }
	    });
	}

	//Add test suite into the collection
	function add(testsuite)
	{
  	    //Add testsuite into collection
		$scope.testsuites.push(testsuite);
	}

	//Refresh the view based on the current state of the model (safely)
	function refresh()
	{
		if(!$scope.$$phase) {
		   $scope.$apply();
		}
	}

	//Save test suite into backend
	function _saveTestSuite(testsuite)
	{
		//Validate input 
		if(_validate(testsuite))
		{

			var _testsuite = new Object();

			//Check input attributes
			if(typeof(testsuite.id) !== 'undefined')
			{
				_testsuite.id = testsuite.id;
			}
			else
			{
				loading.show();
			}

			if(typeof(testsuite.name) !== 'undefined')
			{
				_testsuite.name = testsuite.name;
			}

			if(typeof(testsuite.description) !== 'undefined')
			{
				_testsuite.description = testsuite.description;
			}

			if(typeof(testsuite.tccount) !== 'undefined')
			{
				_testsuite.tccount = testsuite.tccount;
			}
			else
			{
				_testsuite.tccount = 0;
			}

			var deferred = $.Deferred();

			//Save testsuite into the backend
			Parse.Cloud.run('saveTestSuite', prepareRequest(_testsuite), {
		        success: function (testsuiteid) {

		        	//If there are any test suites
		        	if(testsuiteid)
		        	{
		        		//set test suite id
		        		_testsuite.id = testsuiteid;

		        		//Resolve the promise passing the test suite
		        		deferred.resolve(_testsuite);
		        	}
		        	loading.hide();
		        },
		        error: function (error) {
		        	loading.hide();
		            deferred.reject(error);
		        }
	    	});

	    	return deferred.promise();
	    }
	}

	//Create test suite
	$scope.createTestsuite = function()
	{
		//Validate input
		if(_validate($scope.current))
		{
			//Assure that the test suite name is with length between 3 to 25 symbols
			if($scope.current.name.length > 2 && $scope.current.name.length < 26)
			{		
				//Hide the create test suite modal
				$( "#createtestsuite" ).modal('hide');	

				//Save test suite into the backend
				_saveTestSuite($scope.current).done(function(testsuite)
				{
					window.location.replace("tc-editor.html?qakey="+$scope.qaKeyVal+"&tsid="+testsuite.id+"&tsname="+testsuite.name);
					// //On success add it into the front end
					// add(testsuite);

					// //Refresh the view
					// refresh();

					// //Add notification
					// notification.success("Test suite '" + testsuite.name + "' was created");

					// //Remove the current test suite
					// $scope.current = null;

					// //Refresh the view
					// refresh();
				})
				.fail(function() {
				    notification.error("Test suite was NOT created");
				});
			}
		}
	}

	//Save test suite
	$scope.saveTestsuite = function(testsuite)
	{	
		//Validate the input
		if(_validate(testsuite))
		{

			//Assure that the testsuite name is between 3 and 25 symbols
			if(testsuite.name.length > 2 && testsuite.name.length < 26)
			{
				//Save testsuite into the backend
				_saveTestSuite(testsuite).done(function()
				{
					//Add notification
					//notification.success("Test suite '" + testsuite.name + "' was updated");
				})
				.fail(function() {
				    notification.error("Test suite '" + testsuite.name + "' was NOT updated");
				});
			}

		}
	}

	// Delete the testsuite from the backend
    function _deleteTestSuite(testsuite, callback)
	{
		//Validate the input
		if(_validate(testsuite))
		{
			//Call the cloud code method for delete test suite
			Parse.Cloud.run('deleteTestSuite', prepareRequest(testsuite), {
		        success: function () {

		        	//Add notification
		        	notification.error("Test suite '" + testsuite.name + "' was deleted");
		        	if(typeof(callback) != 'undefined')
	        		{
	        			//Call the provided method, if any
	        			callback();	
	        		}
		        },
		        error: function (error) {
					notification.error("Test suite was not deleted");
		        }
	    	});
		}
	}

	//Show delete dialog
	$scope.showDeleteDialog = function(testsuite)
	{
		$('#deleteDialog').modal('show');

		$('#delete-test-suite-btn').click(function(){
			_delete(testsuite);
		});

	}

	//Delete the testsuite
	function _delete(testsuite)
	{
		//Loop through all test suites
		for(var idx=0; idx < $scope.testsuites.length; idx++)
		{
			if($scope.testsuites[idx].id === testsuite.id)
			{
				//Remove the test suite from the array
				$scope.testsuites.splice(idx, 1);

				//Refresh the view
				refresh();

				//Delete it
				_deleteTestSuite(testsuite);
			}
		}
	}

	//Validate that the object is not undefined, null and is not empty
	function _validate(object)
	{
		return (typeof(object) !== 'undefined' && 
			object !== null && 
			jQuery.isEmptyObject(object) === false);
	}

	$scope.clear = function()
	{
		$scope.current = new Object();
	}

	$scope.checkName = function(data) {

	    if(data.length < 3 || data.length > 25) {
	      return "Name should be between 3 and 25 symbols";
	    }
	};

	$scope.run = function()
	{
		// if(typeof($scope.current) !== 'undefined')
		// {
		// 	var url = $scope.current.url;
		//     var source = codeEditor.getValue();
		//     if (source.length > 0 &&
		//         url.length > 0) {
		//         var commands = source.split("\n");

		//         SendMessage("open", url, $scope.settings, $scope.current.id);
		//         for (var idx = 0; idx < commands.length; idx++) {
		//             SendMessage("*", commands[idx], "*", $scope.current.id);
		//         }
		//         SendMessage("end", "end", "end", $scope.current.id);
		//     }
		// }
		// else
		// {
		// 	notification.info("Please select test case");
		// }
	};

});