function SourceCodeEditor()
{
	var sourceCodeEditor;

	function init()
	{
		sourceCodeEditor = CodeMirror.fromTextArea(document.getElementById('source_editor'), {
	      mode:  "javascript",
	      lineNumbers: true
	    });
	}

	function getValue()
	{
		return sourceCodeEditor.getValue();
	}

	function setValue(source)
	{
		if(typeof(source) === 'undefined')
		{
			source = "";
		}

		sourceCodeEditor.setValue(source);
	}

	init();

	this.init = init;
	this.getValue = getValue;
	this.setValue = setValue;

	return this;
}

//Init source code editor
var codeEditor;

window.onload = function() {

	codeEditor = new SourceCodeEditor();

};