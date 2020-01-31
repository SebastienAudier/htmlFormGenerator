/*
 * Copyright 2018 Sebastien AUDIER <sebastien.audier@gmail.com>
 * This file is released under MIT.
 * See the LICENSE file for more infos.
 *
 * A simple Form generator for htmlCanvas library
 *
 */

Field = function () {
	this.form;
	this.attribute;
	this.label = '';
	this.fieldContainer;
	this.conditions;
	this.cssClass;
	this.validation;

	this.init = function(anAtribute, aLabel) {
		this.conditions = [];
		this.cssClass = 'field';
		this.attribute = anAtribute;
		this.label = aLabel;
		this.isRequired = false;
	}
	
	this.label = function(aString) {
		this.label = aString
	}
	
	this.required = function(aString) {
		this.addCondition(new NotEmptyCondition(aString));
		this.addClass('required')
	}
	
	this.addCondition = function (aCondition, aMessage) {
		condition = [];
		condition.push(aCondition);
		condition.push(aMessage);
		this.conditions.push(condition)
	}
	
	this.addClass = function(aString) {
		this.cssClass += ' ' + aString
	}

	this.checkCondition = function (object) {
		f = object[0];
		if(f instanceof Condition) {
			f = f.closure
		}
		f = f.toString();	
		f = f.slice(f.indexOf("{") + 1, f.lastIndexOf("}"));
		closure = new Function('val', f);	
		return closure(eval('this.form.proxy.' + this.attribute))
	}
	
	this.isValidated = function() {
		for(var i=0; i<this.conditions.length; i++) {
			condition = this.conditions[i];
			if(!this.checkCondition(condition)) {
				if(condition[0] instanceof Condition) {
					Error(condition[0].label).appendTo(this.fieldContainer)
				} else {
					Error(condition[1]).appendTo(this.fieldContainer)
				}
				return false
			}
		}
		return true
	}
	
	this.clean = function () {
		$(this.fieldContainer).find(".error").remove();
	}
	
	this.liveValidation = function () {
		this.validation = 'live'
	}
	
	this.delayedValidation = function () {
		this.validation = 'delayed'
	}
	
	this.isLive = function () {
		return this.validation == 'live'
	}
	
	this.isDelayed = function () {
		return this.validation == 'delayed'
	}
}

FieldList = function () {

	this.conditions = [];
	this.cssClass = 'field';

	this.setOptions = function (aCollection) {
		this.options = aCollection
	}
	
	this.setColumnNumber = function (aNumber) {
		this.columnNumber = aNumber
	}
	
	this.init = function (anAtribute, aLabel) {
		this.conditions = [];
		this.options = [];
		this.columnNumber = 1;
		this.attribute = anAtribute;
		this.label = aLabel
	}
}

FieldList.prototype = new Field();	

Input = function (anAtribute, aLabel, aType) {

	this.init(anAtribute, aLabel);
	
	this.renderOn = function (html) {
		this.fieldContainer = html.div().addClass(this.cssClass).asJQuery();
		InputRenderer(this, aType).appendTo(this.fieldContainer)
	}
}

Input.prototype = new Field();	

function InputRenderer(aField, aType) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		label = html.span(aField.label).addClass('label');
		input = html.input();
		if (typeof(aType) != "undefined") {
			input.setAttribute("type", aType)
		}
		input.change(
			function() {
				aField.form.proxy[aField.attribute] = jQuery(this).val();
			}
		);
		input.keyup(
			function(e) {
				if (e.keyCode == 13) {
					aField.form.save()
				} else {
					aField.form.proxy[aField.attribute] = jQuery(this).val();
					if(aField.isLive()) {
						aField.clean();
						aField.isValidated();
					}
				}
			}
		);
		input.setAttribute('value', aField.form.proxy[aField.attribute])
	}

	return that;
}

Password = function (anAtribute, aLabel) {

	this.init(anAtribute, aLabel);
	
	this.renderOn = function (html) {
		this.fieldContainer = html.div().addClass(this.cssClass).asJQuery();
		InputRenderer(this, 'password').appendTo(this.fieldContainer)
	}
}

Password.prototype = new Field();	


Textarea = function (anAtribute, aLabel) {

	this.init(anAtribute, aLabel);
	
	this.renderOn = function (html) {
		this.fieldContainer = html.div().addClass(this.cssClass).asJQuery();
		TextareaRenderer(this).appendTo(this.fieldContainer)
	}
}

Textarea.prototype = new Field();	

function TextareaRenderer(aField) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		label = html.span(aField.label).addClass('label');
		textarea = html.textarea().change(
			function(e) {
				aField.form.proxy[aField.attribute] = jQuery(this).val()
			}
		);
		textarea.asJQuery().val(aField.form.proxy[aField.attribute])
	}

	return that;
}

Checkbox = function (anAtribute, aLabel) {

	this.init(anAtribute, aLabel);
	
	this.renderOn = function (html) {
		this.fieldContainer = html.div().addClass(this.cssClass).asJQuery();
		CheckboxRenderer(this).appendTo(this.fieldContainer)
	}
}

Checkbox.prototype = new FieldList();	

function CheckboxRenderer(aField) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		label = html.span(aField.label).addClass('label');
		div = html.div().addClass("checkbox-container");
		for(var i=0; i<aField.options.length; i++) {
			checkbox = html.input().setAttribute('type', 'checkbox').setAttribute("data-submit", aField.options[i]);
			checkbox.asJQuery().appendTo(div.asJQuery());
			checkbox.click(function () {check($(this))});	
			if(aField.form.proxy[aField.attribute].indexOf(aField.options[i]) != -1) {
				checkbox.setAttribute("checked", "checked")
			}
			html.span(aField.options[i]).addClass('option').asJQuery().appendTo(div.asJQuery());
			if(aField.columnNumber == 1) {
				html.br().asJQuery().appendTo(div.asJQuery())
			} else {
				if(i > 0 && ((i + 1) % aField.columnNumber == 0)) {
					html.br().asJQuery().appendTo(div.asJQuery())
				}
			}
		}
	}

	function check(element) {
		array = aField.form.proxy[aField.attribute];
		value = element.attr("data-submit");
		index = array.indexOf(value);
		if(element.is(':checked')) {
			if(index == -1) {
				array.push(value)
			}
		} else {
			if(index != -1) {
				array.splice(index, 1)
			}
		}
	}
	
	return that;
}

Radio = function (anAtribute, aLabel) {

	this.init(anAtribute, aLabel);
	
	this.renderOn = function (html) {
		this.fieldContainer = html.div().addClass(this.cssClass).asJQuery();
		RadioRenderer(this).appendTo(this.fieldContainer)
	}
}

Radio.prototype = new FieldList();	

function RadioRenderer(aField) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		label = html.span(aField.label).addClass('label');
		div = html.div().addClass("radio-container");
		for(var i=0; i<aField.options.length; i++) {
			radio = html.input().setAttribute('type', 'radio').setAttribute("data-submit", aField.options[i]);
			radio.setAttribute("name", aField.attribute);
			radio.asJQuery().appendTo(div.asJQuery());
			radio.click(function () {check($(this))});	
			if(aField.form.proxy[aField.attribute] == aField.options[i]) {
				radio.setAttribute("checked", "checked")
			}
			html.span(aField.options[i]).addClass('option').asJQuery().appendTo(div.asJQuery());
			if(aField.columnNumber == 1) {
				html.br().asJQuery().appendTo(div.asJQuery())
			} else {
				if(i > 0 && ((i + 1) % aField.columnNumber == 0)) {
					html.br().asJQuery().appendTo(div.asJQuery())
				}
			}
		}
	}

	function check(element) {
		aField.form.proxy[aField.attribute] = element.attr("data-submit")
	}
	
	return that
}

Select = function (anAtribute, aLabel) {

	this.init(anAtribute, aLabel);
	
	this.renderOn = function (html) {
		this.fieldContainer = html.div().addClass(this.cssClass).asJQuery();
		SelectRenderer(this).appendTo(this.fieldContainer)
	}
}

Select.prototype = new FieldList();	

function SelectRenderer(aField) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		label = html.span(aField.label).addClass('label');
		select = html.select();
		for(var i=0; i<aField.options.length; i++) {
			option = html.option(aField.options[i]).setAttribute("value", aField.options[i]);
			if(aField.form.proxy[aField.attribute] == aField.options[i]) {
				option.setAttribute("selected", true)
			}
			option.asJQuery().appendTo(select.asJQuery());
		}
		select.asJQuery().change(function () {selectOption($(this))})
	}
	
	function selectOption(element) {
		aField.form.proxy[aField.attribute] = element.val()
	}
	
	return that;
}

Button = function (aLabel) {
	this.cssClass = '';
	this.label = aLabel;
	this.action;

	this.cssClass = function (val) {
		this.cssClass = val
	}
	
	this.action = function (f) {
		this.action = f
	}
}
