
Error = function (aString) {
	
	var that = htmlCanvas.widget();

	that.renderOn = function(html) {
		html.span(aString).addClass('error');
	}

	return that;
}

function Comment(aString) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
			html.span(aString).addClass("comment");
	}
	
	return that;
	
}