/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'rg-icon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-menu' : '&#xe001;',
			'icon-instagram' : '&#xe003;',
			'icon-facebook' : '&#xe004;',
			'icon-google-plus' : '&#xe005;',
			'icon-mail' : '&#xe006;',
			'icon-twitter' : '&#xe002;',
			'icon-twitter-2' : '&#xe007;',
			'icon-facebook-2' : '&#xe008;',
			'icon-tumblr' : '&#xe009;',
			'icon-tumblr-2' : '&#xe00a;',
			'icon-reddit' : '&#xe00b;',
			'icon-pinterest' : '&#xe00c;',
			'icon-pinterest-2' : '&#xe00d;',
			'icon-minus' : '&#xe012;',
			'icon-plus' : '&#xe013;',
			'icon-checkbox-checked' : '&#xe014;',
			'icon-checkbox-unchecked' : '&#xe015;',
			'icon-search' : '&#xe016;',
			'icon-filter' : '&#xe017;',
			'icon-arrow-up' : '&#xe010;',
			'icon-arrow-right' : '&#xe00e;',
			'icon-arrow-down' : '&#xe011;',
			'icon-arrow-left' : '&#xe00f;',
			'icon-upload' : '&#xe01c;',
			'icon-arrow-left-2' : '&#xe01d;',
			'icon-untitled' : '&#xe01e;',
			'icon-arrow-up-2' : '&#xe01f;',
			'icon-arrow-down-2' : '&#xe020;',
			'icon-spinner' : '&#xe018;',
			'icon-zoom-in' : '&#xe019;',
			'icon-zoom-out' : '&#xe01a;',
			'icon-dot' : '&#xe01b;',
			'icon-minus-2' : '&#xe021;',
			'icon-bag' : '&#xe000;',
			'icon-cross' : '&#xe022;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};