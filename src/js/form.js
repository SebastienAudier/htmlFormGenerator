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

	this.add = function(anObject) {
		if(anObject instanceof Field) {
			anObject.form = this;
		}
		this.fields.push(anObject);
	}
	
	this.addCondition = function(f, message) {
		condition = [];
		condition.push(f);
		condition.push(message);
		this.conditions.push(condition);
	}
	
	this.checkCondition = function(object) {
		f = object[0].toString();	
		f = f.slice(f.indexOf("{") + 1, f.lastIndexOf("}"));
		closure = new Function('val', f);	
		return closure(eval('this.proxy'));
	}
	
	this.isValidated = function() {
		for(var i=0; i<this.conditions.length; i++) {
			condition = this.conditions[i];
			if(!this.checkCondition(condition)) {
				Error(condition[1]).appendTo($('.errors'));
				return false;
			}
		}
		return true;
	}
	
	this.onSave = function (f) {
		this.saveAction = f;
	}
	
	this.onCancel = function (f) {
		this.cancelAction = f;
	}
	
	this.renderOn = function(html) {
		FormRenderer(this).appendTo(html.div().addClass('form').asJQuery())
	}
	
	this.save = function() {
		$(".error").remove();
		var allFieldsAreValidated = true;
		for(var i=0; i< this.fields.length; i++) {
			object = this.fields[i];
			if(object instanceof Field && !object.isValidated()) {
				allFieldsAreValidated = false;
			}
		}
		if(allFieldsAreValidated) {
			if(this.isValidated()) {
				f = this.saveAction.toString().split('{');
				f = f[1].split('}')[0];
				closure = new Function('val', 'return ' + f + ';');
				return closure(eval(this.proxy));
			}
		} 
	}
}

function FormRenderer(aForm) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		for(var i=0; i< aForm.fields.length; i++) {
			if(aForm.fields[i] instanceof Field) {
				aForm.fields[i].renderOn(html);
			} else {
				aForm.fields[i].renderOn(html);
			}
		}
		errors = html.div().addClass('errors');
		buttons = html.div().addClass('buttons');
		html.button('Save').click(function () {save()}).addClass('save').asJQuery().appendTo(buttons.asJQuery());
	}
	
	function isValidated() {
		return aForm.isValidated();
	}
	
	function save() {
		aForm.save();
	}
	
	return that;
}
