var iconv = require('iconv-lite');
var conf=require('./config');

var INJECT_URL=conf.inject_js;
var injectCode =
	'<script src="' + INJECT_URL + '"></script>';

exports.injectHtml = function(html, charset) {
	console.log("injecting");
	//
	// 优先使用<meta>标签里的charset标记：
	//   <meta charset="utf-8" />
	//   <META HTTP-EQUIV="Content-Type" CONTENT='text/html; CHARSET=GBK'>
	//
	var str = html.toString();
	var val = str.match(/charset=['"]?([\w-]*)/i);

	if (val && val[1]) {
		charset = val[1];
	}

	//
	// 将html二进制数据转为utf-8字符，方便字符串操作
	//
	charset = charset ? charset.toLowerCase() : 'utf-8';

	if (charset != 'utf-8') {
		html = iconv.decode(html, charset);
	}
	else {
		html = str;
	}

	//
	// 尝试在 </title>, <body>, </html> 标签后注入
	//
	html = html.replace(/<\/title>|<body>|<body\s+[^>]*>|.$/i,
		'$&' + injectCode);

	//
	// 转回二进制数据
	//
	if (charset != 'utf-8') {
		html = iconv.encode(html, charset);
	}
	else {
		html = new Buffer(html);
	}
	return html;
}
