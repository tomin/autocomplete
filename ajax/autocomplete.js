////////////////////////////////////
//
// Autocomplete Plugin
// MIT-style license. Copyright 2013 tomin
//
////////////////////////////////////
(function(window, document, undefined) {
	
	
	var Autocomplete = function(options){

		/*
		 * default options
		 */	
		this.options = {
			element : "input[list]", 		
			data: [],
			maxChoices: 7,
			highlight: true,
			caseSensitive: false,
			wrapClassName: "acwrap"
		};	
	
		if (options) {
			for (option in this.options) {				
				if (Object.prototype.hasOwnProperty.call(this.options, option) && options[option] !== undefined) {
					this.options[option] = options[option];
				}				
			}
		}
		this.init();		
	};	
	
	Autocomplete.prototype.init = function() {
		var current = this;
		var dataArr = current.options['data'];
		var inputs = document.querySelectorAll(this.options['element']);

		each(inputs, function(input, i) {
			//wrap input and create DOM for data display
			var wrapper= document.createElement("span");
			wrapper.className = current.options['wrapClassName'];
			wrap(wrapper, input);
			
			var results= document.createElement("ul");
			results.className = "results hidden";
			wrapper.appendChild(results);
			
			current.register.call(current, input, results);
		});	
	}
	
	/* 
	 * Register/Bind events
	 * 
	 * @param input   DOM the input DOM that has autocomplete	  	 
	 * @param results DOM the DOM for autocomplete results
	 */
	Autocomplete.prototype.register = function(input, results) {
		var current = this;

		addEvent(input, 'keyup', function(event){
			var event = event || window.event,
				keycode = event.charCode || event.keyCode,
				text = input.value,
				foundArr = current.getHavingDataArray(current.options['data'], text);
			
			// ignore if the following keys are pressed: [shift] [ctrl] [alt] [capslock]
			if (keycode > 8 && keycode < 32) {
				return;
			}
			
			if (text.trim().length == 0 || foundArr.length == 0) {
				results.addClass('hidden')
				return;
			}
			var frag = document.createDocumentFragment();
			
			// data found, insert into DOM			
			for (var i=0, length=foundArr.length; i<length; i++) {				
				var li= document.createElement("li"),						
					textNode = document.createTextNode(foundArr[i]);
		
				addEvent(li, 'mousedown', function(event){
					input.value = foundArr[i];
					//input.value = x;
				});
				
				li.appendChild(textNode);				
				frag.appendChild(li);
				if (i+1 == current.options['maxChoices']) break;
			};
			results.innerHTML = "";//reset
			results.appendChild(frag);
			results.removeClass('hidden');
			
			current.highlight(text, results, foundArr);
		});
		
		addEvent(input, 'blur', function(event){
			results.addClass('hidden');
		});
	}	
	
	/* 
	 * highlight exact match
	 * 
	 * @param text 	   string target replace string
	 * @param results  DOM    target DOM to be replaced
	 * @param foundArr array  found array containing the keyword
	 */
	Autocomplete.prototype.highlight = function(text, results, foundArr) {		
		if (this.options['highlight'] === false) {
			return false;
		}

		if (this.options['caseSensitive']) {
			var re = new RegExp(text);
			for (var i=0, length=foundArr.length; i<length; i++) {
				var newVal = foundArr[i].replace(re, "<span class='found'>" + text + "</span>");				
				results.innerHTML = results.innerHTML.replace(foundArr[i], newVal);
			}	
			
		} else {
			var re = new RegExp(text, "i");
	
			for (var i=0, length=foundArr.length; i<length; i++) {
				var matched = foundArr[i].match(re);
				var newVal = foundArr[i].replace(re, "<span class='found'>" + matched[0] + "</span>");				
				results.innerHTML = results.innerHTML.replace(foundArr[i], newVal);
			}
		}
	};	
	
	Autocomplete.prototype.getHavingDataArray = function(array, inputStr) {
		var newarr = [],
			i = array.length;

		while (i--) {
			var sourceStr = array[i];
			if (this.options['caseSensitive'] === false) {
				sourceStr = array[i].toLowerCase();
				inputStr = inputStr.toLowerCase();
			}			
			
			if (sourceStr.indexOf(inputStr) != -1) {
				newarr.push(array[i]);
			}
		}
		return newarr.sort();
	}
			  	
	// expose
	window.Autocomplete = Autocomplete;	
	
})(this, this.document);