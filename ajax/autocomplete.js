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
		console.log(this.options);
		
	}	
	
	// expose
	window.Autocomplete = Autocomplete;	
	
})(this, this.document);