var FormatLocalTime = function() {
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var elements = document.querySelectorAll('.time');
	for (var i = 0; i < elements.length; i++) {
		var d = new Date(elements[i].dataset.timestamp*1000);
		var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
		var f = monthNames[d.getMonth()] + ' ' + 
			d.getDate() + ', ' + d.getFullYear() + ' - ' +
			(h > 9 ? h : '0'+h) + ':' +
			(m > 9 ? m : '0'+m) + ':' +
			(s > 9 ? s : '0'+s);
		elements[i].textContent = f;
	}
};

var SH = function(element) {
	SH.p = [];
	var code = element.innerHTML;
	for (var i = 0; i < SH.REGEXP.length; i+=2) {
		code = code.replace(SH.REGEXP[i], SH.REGEXP[i+1]);
	}
	element.innerHTML = code;
};
SH.span = function(c, r) { return '<span class="'+c+'">' + (r || '$1') + '</span>'; };
SH.push = function(m) { return '<r' + SH.p.push(m) + '>'; };
SH.pushBlock = function(m, comment, regexp, string){
	var s = '';
	if (comment) { s = SH.span('comments', m); }
	else if (regexp) { s = SH.span('regexp', m); }
	else if (string) { s = SH.span('strings', m); }
	return SH.push(s);
};
SH.pop = function( m, i ) { return SH.p[i-1].replace(SH.REGEXP[12], SH.REGEXP[13]); };
SH.REGEXP = [
	/\\.|\$\w+/g, SH.push,
	/([\[({=:+,](\s|(\/\*[\s|\S]*?\*\/|\/\/.*))*)\/(?![\/\*])/g, '$1<h>/',
	/(\/\*[\s|\S]*?\*\/|&lt;!--[\s|\S]*?--&gt;|\/\/.*|#.*)|(<h>\/.+?\/\w*)|(".*?"|'.*?')/g, SH.pushBlock,
	/((&\w+;|[-\/+*=?:.,;()\[\]{}|%^!])+)/g, SH.span('punct'),
	/\b(input|div|form|script|break|case|catch|continue|default|delete|do|else|false|finally|for|function|if|in|instanceof|string|number|boolean|new|null|return|switch|this|throw|true|try|typeof|var|void|while|with)\b/gi, SH.span('keywords'),
	/\b(0x[\da-f]+|\d+)\b/g, SH.span('numbers'),
	/<r(\d+)>/g, SH.pop,
	/<h>/g, ''
];
SH.Highlight = function() {
	var elements = document.querySelectorAll('.sh');
	for (var i = 0; i < elements.length; i++) {
		new SH(elements[i]);
	}
};
if (document.readyState === 'complete' || document.readyState === 'interactive') {
	SH.Highlight();
	FormatLocalTime();
}
else {
	document.addEventListener('readystatechange', function(){
		if (document.readyState === "interactive") {
			SH.Highlight();
			FormatLocalTime();
		}
	});
}
