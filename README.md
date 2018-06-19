# htmlFormGenerator

Form generator for htmlCanvas library

## Libraries


   ### Externals:

   [jquery-2.1.4.min.js](http://jquery.com/download/)
   
   [htmlCanvas.js](https://github.com/NicolasPetton/htmlCanvas) 
	
   ### Import htmlFormGenerator script:
   
   

    <script type="text/javascript" src="htmlFormGenerator.min.js"></script> 

   
   
   ### Import css file:
   
   
	<link rel="stylesheet" type="text/css" href="htmlFormGenerator.min.css"/>
	
	
## API


### Form
	
	
    form = new Form(object);
	
	
### Fields
	
	
	field = new Input('attribute', 'My label :');
	
	![alt tag](https://github.com/SebastienAudier/htmlFormGenerator/blob/master/src/img/input.png)

	
#### Field Types

API : Follow HTML tags. [See all fields](https://github.com/SebastienAudier/htmlFormGenerator/blob/master/src/js/fields.js)

 - Input
 - Textarea
 - Password
 - Select
 - Radio
 - Checkbox
 - Specific input types (date, password, color, etc...)  [See all html input types](https://www.w3schools.com/html/html_form_input_types.asp)
       example:  `new Input('attribute', 'My label :', 'type');`

	   
### Conditions

**Anonymous functions**
  
Use an anonymous function to check the value during the form validation process. The last arguments are displayed under the field if the evaluation is false.
	
    field.addCondition( function(val) { return val != 'hello' }, 'Hello word is reserved');

**Conditions API**

Use the implemented conditions. [See all conditions](https://github.com/SebastienAudier/htmlFormGenerator/blob/master/src/js/conditions.js)

##### Example:

	    field.addCondition(new NotEmptyCondition());
    
##### You can override error message:

	    field.addCondition(new EmailCondition('This format is not valid !'));

##### Css behavior: 

Try:   

 - `field.required();`

Or:    

 - `field.required( "MySpecificMessage" );`

More with specific css class:

 - `field.addClass( "MyCssClass" );`

### Form

##### Conditions:

As field, the form can have conditions. All conditions are checked and shown during the validation process. 

Try:   

 - `form.addCondition(function (val) {return val.email != val.password}, 'Email and password must be differents !');`

##### Utils:

You can add comments in your form. Soon, you will can to build any renderer. 

Try:   

 - `form.add(new Comment("This is a form comment !"));`

##### Validation:

You have to implement "saveAction" method. 

Try:   

 - `form.saveAction(function (val){console.log(val)});`

You can override label and cssClass:

 - `form.saveAction(function (val){console.log(val)}, "label", "cssClass");


##### Additionnal buttons:

Try:   

  `	button = new Button("Cancel");`
  
  `	button.cssClass("btn");`
  
  ` button.action(function (val){console.log("cancel")});`
  
  ` form.add(button);`