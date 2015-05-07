////////////////////////////////////
//
// Autocomplete Plugin
// MIT-style license. Copyright 2013 tomin
//
////////////////////////////////////
//IE7 support for querySelectorAll. http://www.codecouch.com/2012/05/adding-document-queryselectorall-support-to-ie-7/
(function(d,s){if(!document.querySelectorAll){d=document,s=d.createStyleSheet();d.querySelectorAll=function(r,c,i,j,a){a=d.all,c=[],r=r.replace(/\[for\b/gi,'[htmlFor').split(',');for(i=r.length;i--;){s.addRule(r[i],'k:v');for(j=a.length;j--;)a[j].currentStyle.k&&c.push(a[j]);s.removeRule(0)}return c}}})();

(function(window, document, undefined) {
	"use strict";
	
	
	/** 
	 * Constructor
	 * 
	 * @param options user options, to overwrite default options
	 */	
	var Autocomplete = function(options){

		/**
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
		this.selectedIndex = -1;
		this.arrowflag = true;
		this.lastKeyword;
	
		if (options) {
			for (var option in this.options) {				
				if (Object.prototype.hasOwnProperty.call(this.options, option) && options[option] !== undefined) {
					this.options[option] = options[option];
				}				
			}
		}
		this.init();
	};	
	
	/** 
	 * Init, setup necessary DOM
	 */		
	Autocomplete.prototype.init = function() {
		var current = this,
			inputs = document.querySelectorAll(this.options['element']);

        if (inputs.length === 0) {
            return;
        }

		each(inputs, function(input, i) {
			//wrap input and create DOM for data display
			var wrapper= document.createElement("span");
			wrapper.className = current.options['wrapClassName'];
			wrap(wrapper, input);
			
			var results= document.createElement("ul");
			results.className = "results hidden";
			results.style.width = input.width;
			wrapper.appendChild(results);
			
			current.register.call(current, input, results);
		});
	}
	
	/** 
	 * Manipulate logic when keycode is arrow key
	 * 
	 * @param keycode int keycode	 
	 * @param li      DOM the single autocomplete result container
	 * @param input   DOM the input DOM that has autocomplete
	 */
	Autocomplete.prototype.arrowpress = function(keycode, li, input) {
		var current = this,
			lilength = li.length,
			selectVal;			

		//reset anyhow
		for (var i=0; i<lilength; i++) {
			removeClass(li[i], "selected");
		}

		if (lilength > current.selectedIndex && lilength > 0) {// && current.options['maxChoices'] >= current.selectedIndex) {
			if (keycode == 40) {//down
				current.selectedIndex++;
				
				if (lilength == current.selectedIndex) {
					current.selectedIndex = 0;
				} 
			} else if (keycode == 38) {//up
				current.selectedIndex--;
				if (current.selectedIndex == -1) {
					current.selectedIndex = lilength-1;
				}						
			}

			if (keycode == 40 || keycode == 38) {//common behavior
				selectVal = li[current.selectedIndex].getAttribute("rel");
				addClass(li[current.selectedIndex], "selected");				
				input.value = selectVal;
				current.arrowflag = false;	
				current.lastKeyword = selectVal;
			}
		}
		
		if (current.lastKeyword != selectVal) {
			current.selectedIndex = -1;//reset
			current.arrowflag = true;
		}			
	}
	
	/** 
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
				foundArr = current.getHavingDataArray(current.options['data'], text),
				foundLength = foundArr.length;
			
			// ignore if the following keys are pressed: [shift] [ctrl] [alt] [capslock]
			if (keycode > 8 && keycode < 32) {
				return;
			}
			
			current.arrowpress(keycode, results.getElementsByTagName("li"), input);
			if (!current.arrowflag) {
				return;
			}
			
			if (text.trim().length == 0 || foundLength == 0) {
				addClass(results, 'hidden')
				return;
			}
			var frag = document.createDocumentFragment();
			
			// data found, insert into DOM			
			for (var i=0, length=foundArr.length; i<length; i++) {				
				var li= document.createElement("li"),						
					textNode = document.createTextNode(foundArr[i]);
				
				li.setAttribute("rel", foundArr[i]);
				li.appendChild(textNode);				
				frag.appendChild(li);

				current.highlight(text, li, foundArr);
				
				if (i+1 == current.options['maxChoices']) break;
			};
			results.innerHTML = "";//reset
			results.appendChild(frag);			
			removeClass(results, 'hidden');
		});
		
		addEvent(input, 'blur', function(event){
			this.flag = true;
			addClass(results, 'hidden');
		});
				
		//delegate li event to results
		addEvent(results, 'mousedown', function(event){
			var target = getEventTarget(event);
			input.value = target.getAttribute("rel");				
		});	
	}
	
	/** 
	 * highlight exact match
	 * 
	 * @param text 	   string target replace string
	 * @param li 	   DOM    target DOM to be replaced
	 * @param foundArr array  found array containing the keyword
	 */
	Autocomplete.prototype.highlight = function(text, li, foundArr) {		
		if (this.options['highlight'] === false) {
			return false;
		}

		if (this.options['caseSensitive']) {
			var re = new RegExp(text);
			for (var i=0, length=foundArr.length; i<length; i++) {
				var newVal = foundArr[i].replace(re, "<span class='found'>" + text + "</span>");				
				li.innerHTML = li.innerHTML.replace(foundArr[i], newVal);
			}	
			
		} else {
			var re = new RegExp(text, "i");
	
			for (var i=0, length=foundArr.length; i<length; i++) {
				var matched = foundArr[i].match(re);
				var newVal = foundArr[i].replace(re, "<span class='found'>" + matched[0] + "</span>");				
				li.innerHTML = li.innerHTML.replace(foundArr[i], newVal);
			}
		}
	};	
	
	/** 
	 * Get a filtered array from an origin array,
	 * which contains specific value in its value
	 * 
	 * @param array    array  origin array to be filtered
	 * @param inputStr string 	   DOM    target DOM to be replaced
	 * @param foundArr array  found array containing the keyword
	 */	
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
		
	if(!String.prototype.trim){//avoid IE9 existing trim  
		String.prototype.trim = function(){  
			return this.replace(/^\s+|\s+$/g,'');  
		};  
	}

	/** 
	 *  Element Util base on: 
	 *  http://toddmotto.com/creating-jquery-style-functions-in-javascript-hasclass-addclass-removeclass-toggleclass/
	 *  http://jsperf.com/pure-js-hasclass-vs-jquery-hasclass/35
	 */
	function hasClass(elem, className) {
		return ((" " + elem.className + " ").replace(/[\n\t\r]/g, " ").indexOf(" " + className + " ") > -1);
	}

	function addClass(elem, className) {
		if (!hasClass(elem, className)) {
			elem.className += ' ' + className;
		}
	}

	function removeClass(elem, className) {
		var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
		if (hasClass(elem, className)) {
			while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
				newClass = newClass.replace(' ' + className + ' ', ' ');
			}
			elem.className = newClass.trim();
		}
	}

	function wrap(wrapper, wrappee) {
		var parent = wrappee.parentNode,
			sibling = wrappee.nextSibling;
		
		wrapper.appendChild(wrappee);
		
		if (sibling) {
			parent.insertBefore(wrapper, sibling);
		} else {
			parent.appendChild(wrapper);
		}
	}

	function getEventTarget(e) {
		e = e || window.event;
		return e.target || e.srcElement;
	} 

	function each(obj, fn) {
		if (obj.length) for (var i = 0, ol = obj.length, v = obj[0]; i < ol && fn(v, i) !== false; v = obj[++i]);
		else for (var p in obj) if (fn(obj[p], p) === false) break;
	}

	function addEvent(elem, type, listener) { 
		return document.addEventListener? 
			   elem.addEventListener(type, listener, false): 
			   elem.attachEvent("on" + type, listener);
	}
				  
	// expose
	window.Autocomplete = Autocomplete;	
	
})(this, this.document);
