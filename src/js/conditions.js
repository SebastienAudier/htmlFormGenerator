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
			this.label = aString
		}
	}
}

NotEmptyCondition = function (aString) {
	
	that = new Condition();
	
	that.label = 'This field is required !';
	that.init(aString);
	that.closure = function(val) {
			if(val.constructor === Array) {
				return val.length > 0
			} else {
				return val != ''	
			}
	}
	
	return that
}

NumberCondition = function (aString) {
	
	that = new Condition();
	
	that.label = 'This field must be a number !';
	that.init(aString);
	that.closure = function(val) {return !isNaN(val)};
	
	return that
}

IntegerCondition = function (aString) {
	
	that = new Condition();
	
	that.label = 'This field must be an integer !';
	that.init(aString);
	that.closure = function(val) {return new Number(val) == parseInt(val)}
	
	return that
}

PositiveIntegerCondition = function (aString) {
	
	that = new Condition();
	
	that.label = 'This field must be a positive integer !';
	that.init(aString);
	that.closure = function(val) {p = parseInt(val); return (new Number(val) == p) && (Math.sign(p) >= 0)}

	return that
}

EmailCondition = function (aString) {

	that = new Condition();
	
	that.label = 'This field must be a valid email adress !';
	that.init(aString);
	that.closure = function(val) {return /\S+@\S+\.\S+/.test(val.toLowerCase())}
	
	return that
}

EqualityCondition = function (fields, aString) {
	
	that = new Condition();
	that.label = 'These fields must be equal:';
	that.fields = fields;
	that.init(aString);
	str = '';
	for(i in fields) {
		if(i > 0) {
			str += '(val.' + fields[0].attribute + ' == val.' + fields[i].attribute + ')';
			if(i < fields.length -1) {
				str += ' && '
			}
		}
	}
	eval('that.closure = function (val) {return ' + str + '}');

	return that
}

