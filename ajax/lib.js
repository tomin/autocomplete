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

// Wrap an HTMLElement around each element in an HTMLElement array.
HTMLElement.prototype.wrap = function(elms) {
    // Convert `elms` to an array, if necessary.
    if (!elms.length) elms = [elms];

    // Loops backwards to prevent having to clone the wrapper on the
    // first element (see `child` below).
    for (var i = elms.length - 1; i >= 0; i--) {
        var child = (i > 0) ? this.cloneNode(true) : this;
        var el    = elms[i];

        // Cache the current parent and sibling.
        var parent  = el.parentNode;
        var sibling = el.nextSibling;

        // Wrap the element (is automatically removed from its current
        // parent).
        child.appendChild(el);

        // If the element had a sibling, insert the wrapper before
        // the sibling to maintain the HTML structure; otherwise, just
        // append it to the parent.
        if (sibling) {
            parent.insertBefore(child, sibling);
        } else {
            parent.appendChild(child);
        }
    }
};