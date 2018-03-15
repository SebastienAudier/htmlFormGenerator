/*
 * Copyright 2018 Sebastien AUDIER <sebastien.audier@gmail.com>
 * This file is released under MIT.
 * See the LICENSE file for more infos.
 *
 * A simple Form generator for htmlCanvas library
 *
 */


Condition = function () {
	
	this.label;

	this.init = function (aString) {
		if (typeof(aString) != "undefined") {
			this.label = aString;
		}
	}
}

NotEmptyCondition = function (aString) {
	
	this.label = 'This field is required !';
	this.init(aString);
	this.closure = function(val) {
			if(val.constructor === Array) {
				return val.length > 0
			} else {
				return val != ''	
			}
		}
}

NotEmptyCondition.prototype = new Condition();

NumberCondition = function (aString) {
	
	this.label = 'This field must be a number !';
	this.init(aString);
	this.closure = function(val) {return !isNaN(val)};
}

NumberCondition.prototype = new Condition();

EmailCondition = function (aString) {

	this.label = 'This field must be a valid email adress !';
	this.init(aString)
	this.closure = function(val) {return /\S+@\S+\.\S+/.test(val.toLowerCase())};
}

EmailCondition.prototype = new Condition();
