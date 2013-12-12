////////////////////////////////////
//
// Ajax Plugin based on Head First Ajax
// http://www.headfirstlabs.com/books/hfajax/
// MIT-style license. Copyright 2013 tomin
//
////////////////////////////////////
(function(window, document, undefined) {

	/*
	 * default options
	 * FIXME: Consider putting options in Ajax object,
	 * Current issue is we need "this" as Ajax rather than req in callback fn
	 */
	var params = {
			url : "", 
			type: "get",
			data: "",
			dataType: "text",
			success: function(data){},
			error: function(){msg}
		};	
	
	var Ajax = function(options){		
		if (options) {
			for (option in params) {				
				if (Object.prototype.hasOwnProperty.call(params, option) && options[option] !== undefined) {
					params[option] = options[option];
				}				
			}
		}	

		this.req = this.createRequest();
		if (params['type'] === 'get') {
			this.sendAjaxGETRequest();
		} else {
			this.sendAjaxPOSTRequest();
		}
	};	

	Ajax.prototype.createRequest = function() {
		var request = null;

		try {
			request = new XMLHttpRequest();	
		} catch (trymicrosoft) {
			try {
			    request = new ActiveXObject("Msxml2.XMLHTTP");	  	  
			} catch (othermicrosoft) {
				try {
					request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (failed) {
					request = null;
				}
			}
		}
		if (request == null) {
			alert("Error creating request object!");
		} else {
			return request;
		}
	}
	
	Ajax.prototype.callback = function() {			
		var req = this;

		if(req.readyState == 4){
			if(req.status == 200 || (isLocal() && req.responseText)){				
				var data = getData(req);
				params['success'](data);
				return data;
			}else{
				var message = req.getResponseHeader("Status");
				if ((message == null) || (message.length <= 0)) {
					params['error'](this.req.status);
				}else{
					params['error'](message);
				}				
				return null;
			}
		}
	}

	Ajax.prototype.sendAjaxGETRequest = function() {
		this.req.onreadystatechange = this.callback;
		this.req.open("GET", params['url'], true);
		this.req.send(null);
	}
	
	Ajax.prototype.sendAjaxPOSTRequest = function() {
		this.req.onreadystatechange = this.callback;
		this.req.open("POST", params['url'], true);
		this.req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		this.req.send(params['data']);
	}
	
	/* 
	 * get data according to its dataType
	 *
	 * @param req XMLHttpRequest
	 * @return mixed
	 */
	function getData(req) {
		switch (params['dataType']) {
			case "text":
				return req.responseText;
			case "xml":
				return req.responseXML;
			case "json":
			case "jsonp":
				// Attempt to parse using the native JSON parser first
				if (window.JSON && window.JSON.parse) {
					return window.JSON.parse(req.responseText);
				}			
				return req.responseText;
			default:
				return req.responseText;		
		}
	};
	
	/* 
	 * simple local test
	 */
	function isLocal(){
		return (document.location.protocol.match(/^https?/) === null);
	}
	
	// expose
	window.Ajax = Ajax;	
	
})(this, this.document);