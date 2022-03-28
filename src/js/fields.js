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
	this.conditions = [];
	this.cssClass = 'field';
	this.isRequired = false;
	this.validation;

	this.init = function(anAtribute, aLabel) {
		this.attribute = anAtribute;
		this.label = translate(aLabel);
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
		this.clean();
		for(var i=0; i<this.conditions.length; i++) {
			condition = this.conditions[i];
			if(!this.checkCondition(condition)) {
				if(condition[0] instanceof Condition) {
					Error(condition[0]).appendTo(this.fieldContainer)
				} else {
					Error(condition[1]).appendTo(this.fieldContainer)
				}
				StateComponent('unvalidated', this.fieldContainer).appendTo(this.fieldContainer);
				return false
			}
		}
		StateComponent('validated', this.fieldContainer).appendTo(this.fieldContainer);
		return true
	}
	
	this.clean = function () {
		$(this.fieldContainer).find(".error").remove();
		this.fieldContainer.removeClass("unvalidated");
		this.fieldContainer.removeClass("validated");
		$(this.fieldContainer).find(".icon").remove();
	}
	
	this.liveValidation = function () {
		this.validation = 'live'
	}
	
	this.delayedValidation = function () {
		this.validation = 'delayed'
	}
	
	this.isLive = function () {
		return this.validation == 'live' || this.form.isLive()
	}
	
	this.isDelayed = function () {
		return this.validation == 'delayed' || this.form.isDelayed()
	}
}


function StateComponent(aString, aFieldContainer) {
	
	var that = htmlCanvas.widget();

	that.renderOn = function(html) {
		aFieldContainer.addClass(aString);
		html.div().addClass('icon ' + aString);
	}
	
	return that
}

FieldList = function (anAttribute, aLabel) {

	var that = new Field();
	that.init(anAttribute, aLabel);
	that.options = [];
	that.columnNumber = 1;

	that.setOptions = function (aCollection) {
		that.options = aCollection
	}
	
	that.setWidget = function (aWidget) {
		that.widget = aWidget
	}

	that.setColumnNumber = function (aNumber) {
		that.columnNumber = aNumber
	}

	return that
}

Input = function (anAtribute, aLabel, aType) {

	var that = new Field();
	that.init(anAtribute, aLabel);
	
	that.renderOn = function (html) {
		that.fieldContainer = html.div().addClass(that.cssClass).asJQuery();
		InputRenderer(that, aType).appendTo(that.fieldContainer);
	}

	return that
}

function InputRenderer(aField, aType) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		label = html.span(aField.label).addClass('label');
		input = html.input().addClass("form-control");
		if (typeof(aType) != "undefined") {
			input.setAttribute("type", aType)
		}
		input.keyup(
			function(e) {
				aField.form.proxy[aField.attribute] = $(this).val();
				if (e.keyCode == 13) {
					aField.form.save()
				} else {
					aField.form.proxy[aField.attribute] = $(this).val();
					if(aField.isLive()) {
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

	var that = new Field();
	that.init(anAtribute, aLabel);
	
	that.renderOn = function (html) {
		that.fieldContainer = html.div().addClass(that.cssClass).asJQuery();
		InputRenderer(that, 'password').appendTo(that.fieldContainer)
	}
	
	return that
}

Textarea = function (anAtribute, aLabel) {

	var that = new Field();
	that.init(anAtribute, aLabel);
	
	that.renderOn = function (html) {
		that.fieldContainer = html.div().addClass(that.cssClass).asJQuery();
		TextareaRenderer(that).appendTo(that.fieldContainer)
	}
	
	return that
}

function TextareaRenderer(aField) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		label = html.span(aField.label).addClass('label');
		textarea = html.textarea().keyup(
			function(e) {
				aField.form.proxy[aField.attribute] = $(this).val()
				if(aField.isLive()) {
					aField.isValidated();
				}
			}
		);
		textarea.asJQuery().val(aField.form.proxy[aField.attribute])
	}

	return that;
}

Checkbox = function (anAtribute, aLabel) {

	var that = new FieldList(); 
	that.init(anAtribute, aLabel);
	
	that.renderOn = function (html) {
		that.fieldContainer = html.div().addClass(that.cssClass).asJQuery();
		CheckboxRenderer(that).appendTo(that.fieldContainer)
	}

	return that
}

function CheckboxRenderer(aField) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		label = html.span(aField.label).addClass('label');
		div = html.div().addClass("checkbox-container");
		for(var i=0; i<aField.options.length; i++) {
			checkbox = html.input().setAttribute('type', 'checkbox').setAttribute("data-submit", aField.options[i]);
			checkbox.asJQuery().appendTo(div.asJQuery());
			checkbox.click(function () {check($(this), aField)});	
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

	function check(element, aField) {
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
		if(aField.isLive()) {
			aField.isValidated();
		}
	}
	
	return that;
}

Radio = function (anAtribute, aLabel) {

	var that = new FieldList()
	that.init(anAtribute, aLabel);
	
	that.renderOn = function (html) {
		that.fieldContainer = html.div().addClass(that.cssClass).asJQuery();
		RadioRenderer(that).appendTo(that.fieldContainer)
	}

	return that
}

function RadioRenderer(aField) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		label = html.span(aField.label).addClass('label');
		div = html.div().addClass("radio-container");
		for(var i=0; i<aField.options.length; i++) {
			option = html.div().addClass("option").asJQuery();
			option.appendTo(div.asJQuery());
			radio = html.input().setAttribute('type', 'radio').setAttribute("data-submit", aField.options[i]);
			radio.setAttribute("name", aField.attribute);
			radio.asJQuery().appendTo(option);
			radio.click(function (event) {check($(this), aField); event.stopPropagation()});	
			if(aField.form.proxy[aField.attribute] == aField.options[i]) {
				radio.setAttribute("checked", "checked");
				option.addClass("selected")
			}

			if(aField.widget) {
				aField.widget.option = aField.options[i];
				aField.widget.index = i;
				aField.widget.container = option; 
				aField.widget.appendTo(option)
			} else {
				html.span(translate(aField.options[i])).addClass('option').asJQuery().appendTo(option)
			}
			if(aField.columnNumber == 1) {
				html.br().asJQuery().appendTo(div.asJQuery())
			} else {
				if(i > 0 && ((i + 1) % aField.columnNumber == 0)) {
					html.br().asJQuery().appendTo(div.asJQuery())
				}
			}
		}
	}

	function check(element, aField) {
		aField.form.proxy[aField.attribute] = element.attr("data-submit");
		if(aField.isLive()) {
			aField.isValidated()
		}
		$(".option.selected").removeClass("selected");
		element.parent().addClass("selected")
	}
	
	return that
}

Select = function (anAtribute, aLabel) {

	var that = new FieldList();
	that.init(anAtribute, aLabel);
	
	that.renderOn = function (html) {
		that.fieldContainer = html.div().addClass(that.cssClass).asJQuery();
		SelectRenderer(that).appendTo(that.fieldContainer)
	}

	return that
}

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
		select.asJQuery().change(function () {selectOption($(this), aField)})
	}
	
	function selectOption(element, aField) {
		aField.form.proxy[aField.attribute] = element.val();
		if(aField.isLive()) {
			aField.isValidated();
		}
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
