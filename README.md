autocomplete
============

javascript autocomplete samples

ajax: A native js autocomplete plugin that could get external data

HOW TO USE
===========
```html
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


Other samples
===========
html5-datalist-simple: A native js version porting from jQuery datalist [https://github.com/miketaylr/jquery.datalist.js](https://github.com/miketaylr/jquery.datalist.js)

html5-datalist-complex: A minor modified version from [https://github.com/mmurph211/Autocomplete](https://github.com/mmurph211/Autocomplete)

flickrinstant: My previous work in 2010, flickr search integrated with google autocomplete  
