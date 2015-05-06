[![Build Status](https://travis-ci.org/tomin/autocomplete.svg?branch=master)](https://travis-ci.org/tomin/autocomplete)

autocomplete
============
native javascript ajax and autocomplete plugin


Demo link
===========
[http://goo.gl/r1BXjb](http://goo.gl/r1BXjb)


HOW TO USE
===========
```html
<link rel="stylesheet" href="css/template.css">
<script type="text/javascript" src="ajax.js"></script>
<script type="text/javascript" src="autocomplete.js"></script>
<script>
new Ajax({
	"url": "hotboard.json",
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

Feature
===========
Both Ajax and Autocomplete could work standalone

Lightweight (but reinventing the wheel, lol)

Easy to customize with options

Flexiable to extend


Browser Tested
===========
Firefox 

Google Chrome

IE7-10 


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
dataType: "text", //json, jsonp, xml
success: function(data){},
error: function(msg){},
crossDomain: false,
urlAppendCallback: true,
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

Change log
===========
Apr. 14, 2014  Add absolute path detection, add min files 


FYI
===========
For HTML5 datalist autocomplete polyfill, see [https://github.com/tomin/datalist](https://github.com/tomin/datalist)