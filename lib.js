//IE7 support for querySelectorAll. http://www.codecouch.com/2012/05/adding-document-queryselectorall-support-to-ie-7/
(function(d,s){if(!document.querySelectorAll){d=document,s=d.createStyleSheet();d.querySelectorAll=function(r,c,i,j,a){a=d.all,c=[],r=r.replace(/\[for\b/gi,'[htmlFor').split(',');for(i=r.length;i--;){s.addRule(r[i],'k:v');for(j=a.length;j--;)a[j].currentStyle.k&&c.push(a[j]);s.removeRule(0)}return c}}})();

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
	return ((" " + elem.getAttribute("class") + " ").replace(/[\n\t\r]/g, " ").indexOf(" " + className + " ") > -1);
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
};	

function addEvent(elem, type, listener) { 
	return document.addEventListener? 
		   elem.addEventListener(type, listener, false): 
		   elem.attachEvent("on" + type, listener);
}
