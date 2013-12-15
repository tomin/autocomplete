//IE7 Element hack: http://stackoverflow.com/questions/597268/element-prototype-in-ie7
if ( !window.Element )
{
	Element = function(){}

	var __createElement = document.createElement;
	document.createElement = function(tagName)
	{
		var element = __createElement(tagName);
		for(var key in Element.prototype)
			element[key] = Element.prototype[key];
		return element;
	}

	var __getElementById = document.getElementById
	document.getElementById = function(id)
	{
		var element = __getElementById(id);
		for(var key in Element.prototype)
			element[key] = Element.prototype[key];
		return element;
	}
}	  
	  
//Element Util: http://toddmotto.com/creating-jquery-style-functions-in-javascript-hasclass-addclass-removeclass-toggleclass/
Element.prototype.hasClass = function (className) {
	return new RegExp(' ' + className + ' ').test(' ' + this.className + ' ');
};

Element.prototype.addClass = function (className) {
	if (!this.hasClass(className)) {
		this.className += ' ' + className;
	}
};

Element.prototype.removeClass = function (className) {
	var newClass = ' ' + this.className.replace(/[\t\r\n]/g, ' ') + ' '
	if (this.hasClass(className)) {
		while (newClass.indexOf(' ' + className + ' ') >= 0) {
			newClass = newClass.replace(' ' + className + ' ', ' ');
		}
		this.className = newClass.replace(/^\s+|\s+$/g, ' ');
	}
};

Element.prototype.toggleClass = function (className) {
	var newClass = ' ' + this.className.replace(/[\t\r\n]/g, " ") + ' ';
	if (this.hasClass(className)) {
		while (newClass.indexOf(" " + className + " ") >= 0) {
			newClass = newClass.replace(" " + className + " ", " ");
		}
		this.className = newClass.replace(/^\s+|\s+$/g, ' ');
	} else {
		this.className += ' ' + className;
	}
};

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

//IE7 support for querySelectorAll. http://www.codecouch.com/2012/05/adding-document-queryselectorall-support-to-ie-7/
(function(d,s){if(!document.querySelectorAll){d=document,s=d.createStyleSheet();d.querySelectorAll=function(r,c,i,j,a){a=d.all,c=[],r=r.replace(/\[for\b/gi,'[htmlFor').split(',');for(i=r.length;i--;){s.addRule(r[i],'k:v');for(j=a.length;j--;)a[j].currentStyle.k&&c.push(a[j]);s.removeRule(0)}return c}}})();

function each(obj, fn) {
	if (obj.length) for (var i = 0, ol = obj.length, v = obj[0]; i < ol && fn(v, i) !== false; v = obj[++i]);
	else for (var p in obj) if (fn(obj[p], p) === false) break;
};	

var addEvent = (document.addEventListener) ? 
	function(elem, type, listener) { elem.addEventListener(type, listener, false); } : 
	function(elem, type, listener) { elem.attachEvent("on" + type, listener); };

if(!String.prototype.trim){//avoid IE9 existing trim  
	String.prototype.trim = function(){  
		return this.replace(/^\s+|\s+$/g,'');  
	};  
}