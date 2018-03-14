

# htmlFormGenerator

Form generator for htmlCanvas library

## Load library


   ### External libraries:

   [jquery-2.1.4.min.js](http://jquery.com/download/)
   
   [htmlCanvas.js](https://github.com/NicolasPetton/htmlCanvas) 
	
   ### Load htmlFormGenerator script:
   
   

    <script type="text/javascript" src="htmlFormGenerator.min.js"></script> 

   
   
   ### Import css file:
   
   
	<link rel="stylesheet" type="text/css" href="form.css"/>
	
	
## API


#### Form
	
	
    form = new Form(object);
	
	
#### Fields
	
	
	field = new Input('attribute', 'My label :');

	
##### Field Types

API input fields follow HTML tags.

 - Input
 - Textarea
 - Password
 - Select
 - Radio
 - Checkbox
 - specific input types (date, password, color, etc...)  [See all html input types](https://www.w3schools.com/html/html_form_input_types.asp)
       example:  `new Input('attribute', 'My label :', 'type');`

	   
#### Conditions