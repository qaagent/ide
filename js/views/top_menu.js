(function()
{
	var menu = '<ul class="top-menu navbar-fixed-top"> \
				  <div class="logo">\
				    <a href="http://qaagent.com"><img src="img/qaagent_logo_ide.png" /></a>\
				    <li><a id="current-position" href="http://qaagent.com/ide">Test Suite Explorer</a></li> \
				  </div>\
				  <span id="notification"></span>\
		          <li><a href="http://qaagent.com/docs/" target="_blank"><i class="fa fa-book"></i>&nbsp;Docs</a></li> \
		        </ul>';

	$( document ).ready(function() {
    	$("#top_menu").append(menu);
	});
	
})();

function setBreadcrumb(value, url)
{
	$('#current-position').html(value);
	
	if(url !== 'undefined')
	{
		$('#current-position').attr("href", url);
	}
	
}
