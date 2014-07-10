// Tag of the current entity (the IDE script)
// The meaning of this constant is actually the answer to the existence question "Who am I?" 
var TAG = 'IDE';

// Name of the client (content script) which should be able to comunicate with this ide
var CONTENTSCRIPT = 'C_S';

var testcaseEditor = angular.module('testcase-editor', ["xeditable"]);

testcaseEditor.run(function(editableOptions, editableThemes) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

testcaseEditor.controller('TestCaseEditor', function($scope)
{
    var injector = new Injector(rxMessage); 

    window.onload = function()
    {
        codeEditor = new SourceCodeEditor();
        var version = "Not Installed";
        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        if(is_chrome)
        {
            if(typeof(injector.init()) === "undefined")
            {
                $("#installextension").modal('show');
            }
            else
            {
                version = $('#qaagent-ide').text();
            }
        }
        else
        {
            $("#notsupportedbrowser").modal('show');
        }

        //Get test suite id
        $scope.testSuiteName = getParameterByName('tsname');
        if($scope.testSuiteName !== 'undefined' && 
            $scope.testSuiteName.length > 2)
        {
            setBreadcrumb($scope.testSuiteName, "ts-explorer.html?qakey=" + $scope.qaKeyVal);
        }
        else
        {
            setBreadcrumb('Test Explorer', "ts-explorer.html?qakey=" + $scope.qaKeyVal);
        }

        _initSettings();

        _getTestCases(add, refresh);


        if(Number(version) < latestExtensionVersion)
        {
            version = "<a href='https://chrome.google.com/webstore/detail/qa-agent/mogbehdhjcnopiepkggdpabfogfdnopj' target='_blank'>" + version + "&nbsp;" + "Update Available</a>"
        }

        logger.info("Extension version: " + version);
        logger.info("Testsuite '" + $scope.testSuiteName + "' is loaded...");
    }

    $scope.qaKeyVal = getParameterByName('qakey');
    $scope.testSuiteId = getParameterByName('tsid');


    $scope.testcase = {};

    $scope.testcases = [];
    $scope.settings = {};
    $scope.predicate = 'status';

    function prepareRequest(obj)
    {
        if(typeof(obj) === 'undefined')
        {
            obj = {};
        }

        obj.qakey = $scope.qaKeyVal;
        obj.testsuite = $scope.testSuiteId;

        return obj;
    }

    function _initSettings()
    {
        Parse.Cloud.run('getSettings', prepareRequest(), {
            success: function (settings) {
                if(typeof(settings) !== 'undefined')
                {
                    $scope.settings = settings.attributes;
                    $scope.settings.id = settings.id;
                }
            },
            error: function (error) {
                logger.error("Settings CAN NOT be retrived");
            }
        });
    }

    $scope.saveSettings = function()
    {
        Parse.Cloud.run('saveSettings', prepareRequest($scope.settings), {
            success: function (saved) {
                logger.info("Settings saved");
            },
            error: function (error) {
                logger.error("Settings CAN NOT be saved");
            }
        });
    }


    function _getTestCases(collect, callback)
    {
        loading.show();

        Parse.Cloud.run('getTestCases', prepareRequest(), {
            success: function (testcases) {
                if(testcases)
                {
                    for(var idx = 0; idx < testcases.length; idx++)
                    {
                        var testData = testcases[idx].attributes;
                        testData.id = testcases[idx].id;

                        collect(testData);
                    }

                    callback();
                    loading.hide();
                }
            },
            error: function (error) {
                loading.hide();
                logger.error("Tests CAN'T be retrived");
            }
        });
    }

    function add(testcase)
    {
        $scope.testcases.push(testcase);
    }

    $scope.clear = function()
    {
        $scope.testcase = new Object();
    }

    $scope.selectedTest = function(testcase)
    {
        $scope.testcase = testcase;
        codeEditor.setValue(testcase.source);
    }

    function refresh()
    {
        if(!$scope.$$phase) {
           $scope.$apply();
        }
    }

    //Validate that the object is not undefined, null and is not empty
    function _validate(object)
    {
        return (typeof(object) !== 'undefined' && 
            object !== null && 
            jQuery.isEmptyObject(object) === false);
    }

    $scope.createTestcase = function()
    {       
        var isUpdated = _validate($scope.testcase.id);

       //Validate input
        if(_validate($scope.testcase))
        {
            //Assure that the test suite name is with length between 3 to 25 symbols
            if($scope.testcase.name.length > 2 && $scope.testcase.name.length < 26)
            {   
                //Hide the create test suite modal
                $( "#createtestcase" ).modal('hide');   

                _saveTestCase($scope.testcase).done(function(testcase)
                    {
                        if(!isUpdated)
                        {
                            add(testcase);
                            $scope.testcase = testcase;
                            codeEditor.setValue("");
                            logger.info("Test '" + testcase.name + "' was created");
                        }
                        else
                        {
                            logger.info("Test '" + testcase.name + "' was updated");
                        }

                        refresh();

                    })
                    .fail(function() {
                        logger.error("Test '" + testcase.name + "' was NOT created");
                      });
            }
        }
    }

    function _saveTestCase(testcase)
    {
        var test = new Object();

        if(typeof(testcase.id) !== 'undefined')
        {
            test.id = testcase.id;
            test.updated = true;
        }
        else
        {
            loading.show();
        }

        if(typeof(testcase.name) !== 'undefined')
        {
            test.name = testcase.name;
        }

        if(typeof(testcase.description) !== 'undefined')
        {
            test.description = testcase.description;
        }

        if(typeof(testcase.source) !== 'undefined')
        {
            test.source = testcase.source;
        }

        if(typeof(testcase.url) !== 'undefined')
        {
            test.url = testcase.url;
        }

        if(typeof(testcase.testsuite) !== 'undefined')
        {
            test.testsuite = testcase.testsuite;
        }

        if(typeof(testcase.status) !== 'undefined')
        {
            test.status = testcase.status;
        }

        var deferred = $.Deferred();

        Parse.Cloud.run('saveTestCase', prepareRequest(test), {
            success: function (testid) {
                if(testid)
                {
                    test.id = testid;
                    deferred.resolve(test); 
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

    $scope.saveTestcase = function()
    {   
        //Validate the input
        if(_validate($scope.testcase))
        {
            if($scope.testcase.name.length > 2 && $scope.testcase.name.length < 26)
            {
                $scope.testcase.source = codeEditor.getValue();

                //Save testcase into the backend
                _saveTestCase($scope.testcase).done(function()
                {
                    //Add notification
                    logger.info("Test '" + $scope.testcase.name + "' was updated");
                })
                .fail(function() {
                    logger.error("Test '" + $scope.testcase.name + "' was NOT updated");
                });
            }
        }
    }

    function _deleteTestCase(testcase, callback)
    {
        //Validate the input
        if(_validate(testcase))
        {
            Parse.Cloud.run('deleteTestCase', prepareRequest(testcase), {

                success: function () {
                    if(typeof(callback) != 'undefined')
                    {
                        callback(); 
                    }
                    logger.info("Test '" + testcase.name + "' was deleted");
                    codeEditor.setValue("");
                },
                error: function (error) {
                    logger.error("Test is not deleted");
                }
            });
        }
    }

    //Show delete dialog
    $scope.showDeleteDialog = function(testcase)
    {
        $('#deleteDialog').modal('show');

        $('#delete-test-case-btn').click(function(){
            _delete(testcase);
        });

    }

    $scope.clearConsole = function()
    {
        $('#console-output').text('');
    }

     function _delete(testcase)
    {
        //Loop through all test suites
        for(var idx=0; idx < $scope.testcases.length; idx++)
        {
            if($scope.testcases[idx].id === testcase.id)
            {
                //Remove the test suite from the array
                $scope.testcases.splice(idx, 1);

                //Refresh the view
                refresh();

                //Delete it
                _deleteTestCase(testcase);
            }
        }

    }

    $scope.runTestcase = function()
    {
        if(_validate($scope.testcase))
        {
            $scope.testcase.source = codeEditor.getValue();
            logger.info("Test '" + $scope.testcase.name + "' started...");

            var actions = [];
            actions = $scope.testcase.source.split("\n");

            injector.inject("open", $scope.testcase.url, $scope.settings, $scope.testcase.id);
            actions.forEach(function(action){
                injector.inject("*", action, "*", $scope.testcase.id);
            });
            injector.inject("end", "end", "end", $scope.testcase.id);
        }
        else
        {
            notification.warning("Please select a test case");
        }
    }

    $scope.runAllTestcases = function()
    {
        if($scope.testcases.length > 0)
        {
            for(var testId = 0; testId < $scope.testcases.length; testId++)
            {
                var currentTest = $scope.testcases[testId];
                if(_validate(currentTest))
                {
                    logger.info("Test '" + currentTest.name + "' started...");

                    var actions = [];
                    actions = currentTest.source.split("\n");

                    injector.open(currentTest.url, currentTest.id, currentTest.settings);
                    actions.forEach(function(action){
                        injector.inject("*", action, "*", currentTest.id);
                    });
                    injector.end(currentTest.id);
                }
                else
                {
                    notification.warning("Please select a test");
                }
            }
        }
        else
        {
            notification.warning("There are no tests");
        }
    }

    $scope.openSettings = function()
    {   
        $('#settingswindow').modal('show');
    }

    //Parse all message attributes and their values
    function parse(message)
    {
        //Message content which will be logged into browser console
        var messageInfo = "IDE ";

        //Iterate through all the message attributes
        for(var key in message) {

            //Get attribute
            var value = message[key];

            //Apend attribute name and its value
            messageInfo += "| " + key + ": " + value + "  ";
        }

        //Add the message info into browser console
        console.log(messageInfo);
    }

    function rxMessage(message)
    {
        if(typeof(message.text) !== 'undefined' && typeof(message.error) !== 'undefined')
        {
            if(message.error === true && message.text !== 'end')
            {
                logger.error(message.text);
            }
        }

        console.log(message);

        if(message.command === 'end')
        {
            var oldStatus = $scope.testcase.status;
            $scope.testcase.status = !message.error;
            refresh();

            //Update status if it is different than existing one 
            if($scope.testcase.status !== oldStatus)
            {
                //Save testcase into the backend
                _saveTestCase($scope.testcase);
            }

            if(!message.error)
            {
                logger.success("Test - PASS");
            }
            else
            {
                logger.error("Test - FAILED");
            }
        }
    }
});