var config = (function() {
	var arr = window.location.hostname.split('.')[0];
	var isDebug = (arr == '192') || (arr == '127') || (arr == 'localhost') || (arr == '');
	var baseUrl = isDebug ? '' :'http://q.letwx.com/app/member/';
	var htmlUrl = isDebug ? '' :'http://q.letwx.com/app/member/';
	var cdnUrl = isDebug ? '' :'http://qcdn.letwx.com/app/member/';
	cdnUrl = baseUrl; //*****************
	gameid = getUrlParam().uid != undefined?getUrlParam().uid:11,
	gp = getUrlParam().gp != undefined?getUrlParam().gp:null;
	return {
		gameid: gameid,
		uid:gameid,
		gp:gp,
		touch: 'touchend',
		click: 'click',
		isDebug: isDebug,
		htmlUrl: isDebug ? '' : htmlUrl,
		baseUrl: isDebug ? '' : baseUrl,
		baseCDNUrl: isDebug ? '' : cdnUrl,
		configUrl: (isDebug ? '' : baseUrl) + '../libs/require.config.js',
		scope:'snsapi_userinfo',
		shareInfo : {
			title:'嘿，快来加入法派会员！',
			desc:'免费加入法派会员，即可享受会员优惠折扣，每天都有惊喜等你！',
			link: htmlUrl+'index.html?uid='+gameid,
			imgUrl: cdnUrl + 'images/faapi.jpg'
		}
	}
}());

//用于检测联通2G/3G环境下的广告条
//只重复一次，避免刷不出来式，始终停留
window.onload = function(){
	var checkLT = setTimeout(function(){
		if(document.getElementById('divShow')){
			window.location.reload();
			return;
		}
	},300);
}
function check(oAuth,cb){
	var gameid = config.gameid;
	oAuth.cfg(gameid,config.isDebug,config.scope);
	oAuth.checkToken(function(apiopenid, apitoken) {
		config.apiopenid = apiopenid;
		config.apitoken = apitoken;
		cb && cb(gameid, apiopenid, apitoken);
	}, function() {
		//alert('checktoken错误！');			
	});
}
function gotoUrl(url){
	setTimeout(function(){
		window.location.href = url;
	},200);
}
function __uri(str){
	return (config.baseCDNUrl + '../member/js/' + str);
}
function getUrlParam(){
	var str = window.location.search,
		arrTmp = [],
		obj = {};
	if(str.indexOf('?')>-1){
		str = str.substr(1);
		arrTmp = str.split('&');
		for(var i=0;i<arrTmp.length;i++){
			var tempArr = arrTmp[i].split('=');
			obj[tempArr[0]] = decodeURIComponent(tempArr[1]);
		}
	}
	return obj;
}	