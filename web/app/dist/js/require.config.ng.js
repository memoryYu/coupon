require.config({
	baseUrl: "http://" + window.location.host,
	paths: {
		M: ["http://qcdn.letwx.com/app/dist/js/util.js?v=201602241616"],
		jquery: ["http://qcdn.letwx.com/app/dist/js/jquery.min"],
		zepto: ["http://qcdn.letwx.com/app/dist/js/zepto.min"],
		auth: ['http://qcdn.letwx.com/app/dist/js/oauth'],
		css: ['http://qcdn.letwx.com/app/dist/js/css.min'], //css.min.js用于加载css文件,自动在页面上添加link标签，github:https://github.com/guybedford/require-css
		wx: ['http://res.wx.qq.com/open/js/jweixin-1.0.0'],
		wxshare: ['http://qcdn.letwx.com/app/dist/js/wxshare'],
		shake:['http://qcdn.letwx.com/app/dist/js/shake'],
		barcode:['http://qcdn.letwx.com/app/dist/js/jquery-barcode.min']
	},
	shim: {
		barcode:{
			deps: ['jquery'],
			exports: 'barcode'
		},
	}
});

