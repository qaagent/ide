function TestCase(name, description, source, url, id)
{
	var test = new Object();

	test.description = description;
	test.name = name;
	test.source = source;
	test.url = url;
	test.id = id;

	return test;
}

$(document).ready(function() {

	//when the create modal is shown
	$('#createtestcase').on('shown.bs.modal', function () {

		//set focus to name input
	    $('#createname').focus();

		$( "#create-testcase-form" ).validate({
		  rules: {
		    createname: {
		      required: true,
		      minlength: 3,
		      maxlength: 25
		    }
		  }
		});
	});

});