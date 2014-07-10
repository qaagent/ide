function Loading()
{
	var loadingModal = '<div class="modal fade" id="loading-screen-view" tabindex="-1" role="dialog" aria-labelledby="loadingLabel">\
						  <div class="modal-dialog">\
						    <div class="modal-content loading">\
						    	<img src="img/qaagent_logo_black.png" style="width: auto; height: 10%;">\
						    	<img src="img/loader.gif">\
						    </div>\
						  </div>\
						</div>';

	$(document).ready(function() {
    	$("#loading-screen").append(loadingModal);
	});

	function show()
	{
		$('#loading-screen-view').modal('show');
	}

    function hide()
	{
		$('#loading-screen-view').modal('hide');
	}

	this.show = show;
	this.hide = hide;

	return this;
}

var loading = new Loading();