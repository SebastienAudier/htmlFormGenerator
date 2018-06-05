/*
 * Copyright 2018 Sebastien AUDIER <sebastien.audier@gmail.com>
 * This file is released under MIT.
 * See the LICENSE file for more infos.
 *
 * A simple Form generator for htmlCanvas library
 *
 */

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

function BreakLine() {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
			html.div().addClass("clear");
	}
	
	return that;
	
	
}