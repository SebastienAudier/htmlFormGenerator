/*
 * Copyright 2018 Sebastien AUDIER <sebastien.audier@gmail.com>
 * This file is released under MIT.
 * See the LICENSE file for more infos.
 *
 * A simple Form generator for htmlCanvas library
 *
 */


Form = function (anObject) {
	
	this.object = anObject;
	this.proxy = jQuery.extend({}, this.object);
	this.fields = [];
	this.conditions = [];
	this.saveAction;
	this.saveLabel = 'Save';
	this.saveCssClass = '';
	this.buttons = [];
	this.validation;
	this.cssClass = '';
	
	this.add = function(anObject) {
		if(anObject instanceof Button) {
			this.buttons.push(anObject)
		} else {
			if(anObject instanceof Field) {
				anObject.form = this
			}
			this.fields.push(anObject)
		}
	}
	
	this.br = function () {
		this.add(new BreakLine())
	}
  	
	this.addCondition = function(aCondition, message) {
		condition = [];
		condition.push(aCondition);
		condition.push(message);
		this.conditions.push(condition)
	}

	this.checkCondition = function(object) {
		f = object[0];
		if(f instanceof Condition) {
			f = f.closure
		}
		f = f.toString();	
		f = f.slice(f.indexOf("{") + 1, f.lastIndexOf("}"));
		closure = new Function('val', f);	
	
		return closure(eval('this.proxy'))
	}
	
	this.isValidated = function() {
		for(var i=0; i<this.conditions.length; i++) {
			condition = this.conditions[i];
			if(!this.checkCondition(condition)) {
				if(condition[0] instanceof Condition) {
					Error(condition[0]).appendTo($('.errors'))
				} else {
					Error(condition[1]).appendTo($('.errors'))
				}
				return false
			}
		}
		return true
	}
	
	this.onCancel = function (f) {
		this.cancelAction = f
	}
	
	this.renderOn = function(html) {
		FormRenderer(this).appendTo(html.div().addClass('form ' + this.cssClass).asJQuery())
	}
	
	this.saveAction = function(aFunction, aLabel, aCssClass) {
		this.saveAction = aFunction;
		if (typeof(aLabel) != "undefined") {
			this.saveLabel = aLabel
		}
		if (typeof(aCssClass) != "undefined") {
			this.saveCssClass = aCssClass
		}
	}
	
	this.save = function() {
		$(".errors").html('');
		var allFieldsAreValidated = true;
		for(var i=0; i< this.fields.length; i++) {
			object = this.fields[i];
			if(object instanceof Field && !object.isValidated()) {
				allFieldsAreValidated = false
			}
		}
		if(allFieldsAreValidated) {
			if(this.isValidated()) {
				var f = this.saveAction.toString().split('{');
				f = f[1].split('}')[0];
				closure = new Function('val', 'return ' + f + '');
				return closure(eval(this.proxy))
			}
		} 
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

function FormRenderer(aForm) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		for(var i=0; i < aForm.fields.length; i++) {
			aForm.fields[i].renderOn(html);
		}
		errors = html.div().addClass('errors');
		buttons = html.div().addClass('buttons');
		saveButton = html.button(translate(aForm.saveLabel)).click(function () {save()}).addClass(aForm.saveCssClass).asJQuery();
		if(aForm.saveCssClass.includes('ok')) {
			html.span().addClass("glyphicon glyphicon-ok").asJQuery().prependTo(saveButton)
		}
		saveButton.appendTo(buttons.asJQuery());
		for(var i=0; i < aForm.buttons.length; i++) {
			btn = aForm.buttons[i];
			html.button(translate(btn.label)).addClass(btn.cssClass).click(btn.action).asJQuery().appendTo(buttons.asJQuery());
		} 
	}
	
	function isValidated() {
		return aForm.isValidated();
	}
	
	function save() {
		aForm.save();
	}
	
	return that;
}
