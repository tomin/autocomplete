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
			data: "",
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
		var dataArr = this.options['data'];
		var obj = document.querySelectorAll(this.options['element']);
		
		each(obj, function(v, i) {
			//wrap input and create DOM for data display
			var wrapper= document.createElement("span");
			wrapper.className = "acwrap";
			wrapper.wrap(v);
			var ac= document.createElement("div");
			ac.className = "ac hidden";
			var results= document.createElement("ul");
			results.className = "results";			
			ac.appendChild(results);
			wrapper.appendChild(ac);
					
			addEvent(v, 'keyup', function(event){
				var event = event || window.event,
					keycode = event.charCode || event.keyCode,
					text = v.value,
					foundArr = dataArr.getHavingDataArray(text);
				
				if (text.trim().length == 0 || foundArr.length == 0) {
					ac.addClass('hidden')
					return;
				}
				var frag = document.createDocumentFragment();
				
				// data found, insert into DOM
				foundArr.forEach(function(entry) {				
					var li= document.createElement("li"),
						textNode = document.createTextNode(entry);
						
					addEvent(li, 'mousedown', function(event){
						v.value = entry;
					});
					
					li.appendChild(textNode);				
					frag.appendChild(li);		
				});
				results.innerHTML = "";//reset
				results.appendChild(frag);
				ac.removeClass('hidden');
			});		

			addEvent(v, 'blur', function(event){
				ac.addClass('hidden');
			});	
		});
		
	}

	function each(obj, fn) {
		if (obj.length) for (var i = 0, ol = obj.length, v = obj[0]; i < ol && fn(v, i) !== false; v = obj[++i]);
		else for (var p in obj) if (fn(obj[p], p) === false) break;
	};
	
	Array.prototype.getHavingDataArray = function(str) {
		var newarr = [],
			i = this.length;
		while (i--) {
			if (this[i].toLowerCase().indexOf(str.toLowerCase()) != -1) {
				newarr.push(this[i]);
			}
		}
		return newarr.sort();
	}

	var addEvent = (document.addEventListener) ? 
		function(elem, type, listener) { elem.addEventListener(type, listener, false); } : 
		function(elem, type, listener) { elem.attachEvent("on" + type, listener); };
	
	if(!String.prototype.trim){//avoid IE9 existing trim  
		String.prototype.trim = function(){  
			return this.replace(/^\s+|\s+$/g,'');  
		};  
	}	
	  	
	// expose
	window.Autocomplete = Autocomplete;	
	
})(this, this.document);