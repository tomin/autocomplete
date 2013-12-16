////////////////////////////////////
//
// Ajax Plugin based on Head First Ajax
// http://www.headfirstlabs.com/books/hfajax/
// MIT-style license. Copyright 2013 tomin
//
////////////////////////////////////
(function(window, document, undefined) {

	/**
	 * default options
	 * FIXME: Consider putting options in Ajax object,
	 * Current issue is we need "this" as Ajax rather than req in callback fn.
	 * and we can't use call/apply because it make onreadystate not change
	 */
	var params = {
			url : "", 
			type: "get",
			data: "",
			dataType: "text",
			success: function(data){},
			error: function(msg){},
			crossDomain: false,
			jsonCallbackName: 'jsoncallback'
		};

	/** 
	 * Constructor
	 * 
	 * @param options user options, to overwrite default options
	 */			
	var Ajax = function(options){		
		if (options) {
			for (option in params) {				
				if (Object.prototype.hasOwnProperty.call(params, option) && options[option] !== undefined) {
					//TODO: consider encodeURIComponent for security concern
					params[option] = options[option];
				}				
			}
		}	
		
		if (params['crossDomain'] || isCrossDomain()) {
			this.loadScript();
			return;
		}

		//create native http request
		this.req = this.createRequest();		
		if (params['type'] === 'get') {
			this.sendAjaxGETRequest();
		} else {
			this.sendAjaxPOSTRequest();
		}
	};	

	/** 
	 * Create a XMLHttpRequest
	 *
	 * @return XMLHttpRequest	 
	 */		
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

	/** 
	 * Ajax callback fn 
	 *
	 * @return mixed	 
	 */	
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
					params['error'](req.status);
				}else{
					params['error'](message);
				}				
				return null;
			}
		}
	}

	/** 
	 * HTTP Get request
	 *
	 * @return void	 
	 */		
	Ajax.prototype.sendAjaxGETRequest = function() {
		this.req.onreadystatechange = this.callback;
		this.req.open("GET", params['url'], true);
		this.req.send(null);
	}

	/** 
	 * HTTP Post request
	 *
	 * @return void	 	 
	 */	
	Ajax.prototype.sendAjaxPOSTRequest = function() {
		this.req.onreadystatechange = this.callback;
		this.req.open("POST", params['url'], true);
		this.req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		this.req.send(params['data']);
	}
	
	/** 
	 * Dynimic load script
	 * Note: in this mode, we only look the url parameter, neglect other params
	 * 
	 * @return void
	 */		
	Ajax.prototype.loadScript = function() {
		var script = document.createElement('script');		
		//ensure multiple instances have unique callback
		var uniqueCallback = params['jsonCallbackName'] + new Date().getTime();			
		script.type = 'text/javascript';			
		if (params['url'].indexOf(params['jsonCallbackName']) !== -1) {//already set in url
			var re = new RegExp("(" + params['jsonCallbackName'] + ")=" + "[^&#]+");
			script.src = params['url'].replace(re, "$1=" + uniqueCallback);			
		} else {//url not set yet			
			var delimeter = (params['url'].indexOf("?") !== -1) ? '&' : '?';			
			script.src = params['url'] + delimeter + params['jsonCallbackName'] + "=" + uniqueCallback;		
		}

		//expose, required for server side script
		window[uniqueCallback] = function (json) {
			params['success'](json);
		}

		//graceful fallback
		window[params['jsonCallbackName']] = window[uniqueCallback];

		script.onload = script.onreadystatechange = function() {
			if (!this.readyState ||
				this.readyState === "loaded" || 
				this.readyState === "complete") {				
				this.onload = this.onreadystatechange = null;
				document.getElementsByTagName('head')[0].removeChild(this);
			}			
		};		
		
		document.getElementsByTagName('head')[0].appendChild(script);
	}	
	
	/** 
	 * Get data according to its dataType
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
				
				// Attempt to parse using the native JSON parser first
				if (window.JSON && window.JSON.parse) {
					return window.JSON.parse(req.responseText);
				}			
				return req.responseText;			
			case "jsonp":
				var data = req.responseText.replace(/^.+\((.+)\)/, "$1");

				// Attempt to parse using the native JSON parser first
				if (window.JSON && window.JSON.parse) {
					return window.JSON.parse(data);
				}			
				return data;
			default:
				return req.responseText;		
		}
	};
	
	/** 
	 * simple local test
	 */
	function isLocal(){
		return (document.location.protocol.match(/^https?/) === null);
	}

	/** 
	 * simple cross domain test
	 */
	function isCrossDomain(){
		var href = document.location.href,
			url = params['url'];
		
		// if local file, assume it is crossdomain
		if (href.indexOf("file:") !== -1) {
			return true;
		}
		
		//remove protocol if any
		var re = /https?\/\//,
			criteriaLength = 6;
		url = url.replace(re, "");
		href = href.replace(re, "");
		
		if (url.substr(0, criteriaLength) !== href.substr(0, criteriaLength)) {
			return true;
		}
		
		return false;
	}	
	
	// expose
	window.Ajax = Ajax;	
	
})(this, this.document);

			