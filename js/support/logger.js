function Logger()
{
	function format2Digits(text)
	{
		if(text < 10)
		{
			text = "0" + text;
		}

		return text;
	}

	function format3Digits(text)
	{
		if(text < 100)
		{
			text = "0" + text;
		}

		if(text < 10)
		{
			text = "00" + text;
		}

		return text;
	}

	function getCurrentTimestamp()
	{
		var date = new Date();

		var year = date.getFullYear();
		var day = format2Digits(date.getDate());
		var month = format2Digits(date.getMonth() + 1);

		var hour = format2Digits(date.getHours());
		var minutes = format2Digits(date.getMinutes());
		var secconds = format2Digits(date.getSeconds());
		var milliseconds = format3Digits(date.getMilliseconds());

		return "[" + year + "-" + month + "-" + day + "&nbsp&nbsp" + hour + ":" + minutes + ":" + secconds + "." + milliseconds + "]&nbsp&nbsp"
	}

	function info(text)
	{
		var current = $('#console-output').html() + getCurrentTimestamp() + text + "<br>";
		$('#console-output').html(current);
		scrollConsoleToBottom();
	}

	function error(text)
	{
		var current = $('#console-output').html() + "<span style='color: red'>" + getCurrentTimestamp() + text + "</span><br>";
		$('#console-output').html(current);
		scrollConsoleToBottom();
	}

	function success(text)
	{
		var current = $('#console-output').html() + "<span style='color: green'>" + getCurrentTimestamp() + text + "</span><br>";
		$('#console-output').html(current);
		scrollConsoleToBottom();
	}

	function scrollConsoleToBottom()
	{
		$('#console-output').animate({
            scrollTop: 2000
        }, 500);
	}

	this.info = info;
	this.error = error;
	this.success = success;

	return this;
}

var logger = new Logger();