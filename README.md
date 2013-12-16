autocomplete
============

javascript autocomplete samples

ajax: A native js autocomplete plugin that could get external data

Demo link
===========
[goo.gl/Sw7dDq](goo.gl/Sw7dDq)


HOW TO USE
===========
```html
<link rel="stylesheet" href="css/template.css">
<script type="text/javascript" src="ajax.js"></script>
<script type="text/javascript" src="lib.js"></script>
<script type="text/javascript" src="autocomplete.js"></script>
<script>
new Ajax({
	"url": "./hotboard.json",
	"type": "get",
	"dataType": "json",
	"success": function(data) {
		new Autocomplete({
			"element": "input[type=text]",
			"data": data			
		});		
	}
});
</script>
```

Dependency
===========
autocomplete.js depends on lib.js

Both Ajax and Autocomplete could work standalone


Browser Tested
===========
Firefox 

Google Chrome

IE7-10 (IE7 is not guaranteed, lol)


CSS Customize
===========
Open template.css and modify the "acwrap" related CSS

Set the className to yours if needed

```html
new Autocomplete = {
	wrapClassName: "acwrap"
};
```

Ajax Options
===========
```html
url : "", 
type: "get",
data: "",
dataType: "text",
success: function(data){},
error: function(msg){},
crossDomain: false,
jsonCallbackName: 'jsoncallback'
```

Autocomplete Options
===========
```html
element : "input[list]", 		
data: [],
maxChoices: 7,
highlight: true,
caseSensitive: false,
wrapClassName: "acwrap"
```