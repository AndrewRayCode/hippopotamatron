// cookies.js
// You can use this code for your projects!
// Derived from the Bill Dortch code at http://www.hidaho.com/cookies/cookie.txt

var today = new Date();
// Expires in 3 months
var expiry = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

function getCookieVal(offset) {
	var endstr = document.cookie.indexOf (';', offset);
	if (endstr == -1) { endstr = document.cookie.length; }
	return unescape(document.cookie.substring(offset, endstr));
}

function getCookie(name) {
	var arg = name + '=';
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen) {
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg) {
			return getCookieVal (j);
			}
		i = document.cookie.indexOf(' ', i) + 1;
		if (i == 0) break; 
	}
	return '';
}

function deleteCookie(name,path,domain) {
	if (getCookie(name)) {
		document.cookie = name + '=' +
		((path) ? '; path=' + path : '') +
		((domain) ? '; domain=' + domain : '') +
		'; expires=Thu, 01-Jan-70 00:00:01 GMT';
		}
}

function setCookie(name,value,expires,path,domain,secure) {
  document.cookie = name + '=' + escape (value) +
    '; expires=' +(expires ?  + expires.toGMTString() : expiry) +
    (path ? '; path=' + path : '') +
    (domain ? '; domain=' + domain : '') +
    (secure ? '; secure' : '');
}