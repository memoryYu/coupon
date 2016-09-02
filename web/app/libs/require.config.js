//进行默认的配置操作
require.config({
	baseUrl: './',
	paths: {
		cache:['../libs/cache'],
		MHJ: ['../libs/MHJ'],
		ngapi: ['../libs/ngapi'],
		jquery: ['../libs/jquery.min'],
		zepto: ['../libs/zepto.min'],
		imgpreload: ['../libs/imgpreload'],
		auth: ['../libs/oauth'],
		css: ['../libs/css.min'], //css.min.js用于加载css文件,自动在页面上添加link标签，github:https://github.com/guybedford/require-css
		wx: ['http://res.wx.qq.com/open/js/jweixin-1.0.0'],
		wxshare: ['../libs/wxshare.js?v=201601301525'],
		loading: ['../libs/loading'],
		metaFix: ['../libs/metaFix'],
		barcode: ['../libs/jquery-barcode.min'],
		swiper: ['../libs/idangerous.swiper.min'],
		BreakingNews: ['../libs/BreakingNews'],
		qrcoden:['../libs/qrcode'],
		qrcode: ['../libs/jquery.qrcode'],
		araleqrcode: ['../libs/araleqrcode'],
		shake:['../libs/shake'],
	},
	shim: {
		barcode:{
			deps: ['jquery'],
			exports: 'barcode'
		},
		BreakingNews:{
			deps: ['jquery'],
			exports: 'BreakingNews'
		},
		qrcode:{
			deps: ['jquery','qrcoden'],
			exports: 'qrcode'
		}
	}
});
