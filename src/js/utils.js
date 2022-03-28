Error = function (aCondition) {
	
	var that = htmlCanvas.widget();

	that.renderOn = function(html) {
		if(aCondition instanceof EqualityCondition) {
			html.span(translate(aCondition.label)).addClass('error');
			ul = html.ul().asJQuery();
			for(i in aCondition.fields) {
				field = aCondition.fields[i];
				html.li(field.label).asJQuery().appendTo(ul);
				field.clean();
				StateComponent('unvalidated', field.fieldContainer).appendTo(field.fieldContainer);
			}	
		} else {
			html.span(translate(aCondition.label)).addClass('error')
		}
	}

	return that;
}

function Comment(aString) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
			html.span(translate(aString)).addClass("comment");
	}
	
	return that;
	
}

function BreakLine() {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
			html.div().addClass("clear");
	}
	
	return that;
	
	
}
