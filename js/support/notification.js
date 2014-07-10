function NotificationManager()
{
	var timeout = 2*1000;

	function info(text)
	{
		$('#notification').text(text).attr('class','notify-info').fadeIn(400).delay(timeout).fadeOut(400);
	}

	function success(text)
	{
		$('#notification').text(text).attr('class','notify-success').fadeIn(400).delay(timeout).fadeOut(400);
	}

	function warning(text)
	{
		$('#notification').text(text).attr('class','notify-warning').fadeIn(400).delay(timeout).fadeOut(400);
	}

	function error(text)
	{
		$('#notification').text(text).attr('class','notify-error').fadeIn(400).delay(timeout).fadeOut(400);
	}

	this.info = info;
	this.error = error;
	this.warning = warning;
	this.success = success;

	return this;
}

var notification = new NotificationManager();