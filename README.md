


# htmlFormGenerator

Form generator for htmlCanvas library

## Load library


   ### External libraries:

   [jquery-2.1.4.min.js](http://jquery.com/download/)
   
   [htmlCanvas.js](https://github.com/NicolasPetton/htmlCanvas) 
	
   ### Load htmlFormGenerator script:
   
   

    <script type="text/javascript" src="htmlFormGenerator.min.js"></script> 

   
   
   ### Import css file:
   
   
	<link rel="stylesheet" type="text/css" href="htmlFormGenerator.min.css"/>
	
	
## API


### Form
	
	
    form = new Form(object);
	
	
### Fields
	
	
	field = new Input('attribute', 'My label :');

	
#### Field Types

API follow HTML tags. [See all fields](https://github.com/SebastienAudier/htmlFormGenerator/blob/master/fields.js)

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

Use the implemented conditions. [See all conditions](https://github.com/SebastienAudier/htmlFormGenerator/blob/master/conditions.js)

##### Example:

	    field.addCondition(new NotEmptyCondition());
    
##### You can override error message:

	    field.addCondition(new EmailCondition('This format is not valid !'));
