var debug;

var Person = function() {
	this.year = '2017';
	this.description = 'Description...';
	this.email = 'test@test.com';
	this.color = '#0088bb';
	this.password = 'password';
	this.choices = ['choice 1', 'choice 4'];
	this.firstChoice = 'choice 4';
	this.lastChoice = 'choice 1';
	
	this.defaultChoices = ['choice 1', 'choice 2', 'choice 3', 'choice 4'];
}

function PersonRenderer(aPerson) {
	
	var that = htmlCanvas.widget();
	
	that.renderOn = function(html) {
		
		html.h1('Form generator for HtmlCanvas');
		
		form = new Form(aPerson);
		
		field = new Input('year', 'Year :');
			field.required();
			field.addCondition(new NumberCondition());
			field.addCondition(function(val) {return new Number(val) > 1900}, 'You can not put a value under 1900 !');
			field.addCondition(function(val) {return new Number(val) < 2018}, 'You can not put a value over 2018 !');
		form.add(field);
				
		field = new Textarea('description', 'Description :');
			field.addClass('hello world');
			field.addCondition(new NotEmptyCondition());
		form.add(field);
		
		field = new Input('email', 'Email :');
			field.addCondition(new NotEmptyCondition());
			field.addCondition(new EmailCondition());
		form.add(field);
		
		field = new Password('password', 'Password :');
			field.addCondition(new NotEmptyCondition());
		form.add(field);
		
		field = new Input('color', 'Color :', 'color');
			field.addCondition(new NotEmptyCondition());
		form.add(field);
		
		field = new Checkbox('choices', "Your choice :");	
			field.setOptions(aPerson.defaultChoices);
			field.addCondition(new NotEmptyCondition("You have to check something..."));
		form.add(field);
	
		field = new Radio('firstChoice', "First choice :");
			field.setColumnNumber(4);	
			field.setOptions(aPerson.defaultChoices);
		form.add(field);
		
		field = new Select('lastChoice', "Last choice :");
			field.setOptions(aPerson.defaultChoices);	
		form.add(field);
		
		
		form.add(new Comment("This is a form comment !"));

		form.onSave(function (val) {console.log(val)});
	
		form.renderOn(html);			
		
	}
	
	return that;
}

/* Add a view to the page  */

jQuery(document).ready(function() {
	person = new Person();
	PersonRenderer(person).appendTo('body');
})
