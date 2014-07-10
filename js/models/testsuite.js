function TestSuite(id, name, description, tccount)
{
	var testsuite = new Object();

	testsuite.description = description;
	testsuite.name = name;
	testsuite.tccount = tccount;
	testsuite.id = id;

	return this;
}

$(document).ready(function() {

	//when the create modal is shown
	$('#createtestsuite').on('shown.bs.modal', function () {

		//set focus to name input
	    $('#createname').focus();

		$( "#create-testsuite-form" ).validate({
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

