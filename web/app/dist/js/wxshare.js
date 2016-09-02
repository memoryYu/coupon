(function(global,factory){
	if(typeof define === 'function' && define.amd){
		define(['wx','M'],function(wx,M){
			return factory(wx,M,global);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		module.exports = factory(require('wx'), require('M'),global);
	}else{
		global.wxshare = factory(wx,M,global);
	}
}(typeof window !== 'undefined' ? window : this,function(wx,M,window){
	/**
	 * 用于微信分享
	 */
	var wxshare = window.wxshare = {
		times: 0,
		wxconfig: null,
		/**
		 * 以api的形式请求服务器有关微信JSSDK的相关信息，
		 * @param {Object} share	用于分享的信息 ：{title:'title',desc:'desc',link:'link',imgUrl:'imgUrl'},分享到朋友圈分享的是desc
		 * @param {Object} letwxid  等同于gameid或者gid
		 * @param {Object} apiopenid
		 * @param {Object} apitoken
		 * @param {Object} succCb     分享成功的回调
		 * @param {Object} cancelCb   取消分享的回调
		 * @param {errorCb} errorCb	     出现错误的回调
		 */
		initWx : function(share, letwxid, apiopenid, apitoken, succCb, cancelCb, errorCb,readyCb){
			var me = this;
			if(me.times == 0){
				me.jscfg(share, letwxid, apiopenid, apitoken, succCb, cancelCb, errorCb,readyCb);
			}else{
				me.initWxCfg(share, letwxid, apiopenid, apitoken,  me.wxconfig, succCb, cancelCb, errorCb,readyCb);
			}
		},
		jscfg : function(share, letwxid, apiopenid, apitoken, succCb, cancelCb, errorCb,readyCb){
			var me = this;
			M.ajax('jscfg', {
			    url: window.location.href
			}, letwxid, function(data) {
			    console.log('jscfg:' + JSON.stringify(data));
			    var error = parseInt(data.error);
			    if (error == 0) {
			        me.times++;
			        me.wxconfig = data.cfg;
			        me.initWxCfg(share, letwxid, apiopenid, apitoken, me.wxconfig, succCb, cancelCb, errorCb, readyCb);
			    } else {
			        alert(data.error_msg);
			    }
			}, apiopenid, apitoken, 'nf');
		},
		initWxCfg : function(share, letwxid, apiopenid, apitoken, wxconfig, succCb, cancelCb, errorCb, readyCb){
			var me = this;
			wx.config({
				appId: wxconfig.appId,
				timestamp: wxconfig.timestamp,
				nonceStr: wxconfig.nonceStr,
				signature: wxconfig.signature,
				jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'] //微信的所有权限
			});
			wx.ready(function() {
				readyCb && readyCb(wx);
				wx.onMenuShareAppMessage({ //朋友
					title: share.title,
					desc: share.desc,
					link: share.link,
					imgUrl: share.imgUrl,
					success: function() {
						succCb && succCb();
						me.statics('sharefriend',letwxid, apiopenid, apitoken);
					},
					cancel: function() {
						cancelCb && cancelCb();
					}
				});
				wx.onMenuShareTimeline({ //朋友圈
					title: share.desc,
					link: share.link,
					imgUrl: share.imgUrl,
					success: function() {
						succCb && succCb();
						me.statics('sharetimeline',letwxid, apiopenid, apitoken);
					},
					cancel: function() {
						cancelCb && cancelCb();
					}
				});
				wx.onMenuShareQQ({ //QQ
					title: share.title,
					desc: share.desc,
					link: share.link,
					imgUrl: share.imgUrl,
					success: function() {
						succCb && succCb();
						me.statics('QQ',letwxid, apiopenid, apitoken);
					},
					cancel: function() {
						cancelCb && cancelCb();
					}
				});
				wx.onMenuShareWeibo({ //QQ
					title: share.title,
					desc: share.desc,
					link: share.link,
					imgUrl: share.imgUrl,
					success: function() {
						succCb && succCb();
						me.statics('tencentWeibo',letwxid, apiopenid, apitoken);
					},
					cancel: function() {
						cancelCb && cancelCb();
					}
				});
			});
			wx.error(function(res) {
				console.error('jscfg error:'+JSON.stringify(res));
				errorCb && errorCb(JSON.stringify(res));
				var loc = window.location;
				history.replaceState('', '', loc.origin + loc.pathname + loc.search + '&wxfromerror');
			});
		},
		statics : function(to, letwxid ,apiopenid, apitoken){
			var me = this;
			switch(PLATFORM){
				case 'fumao':
				case 'lppz':
					M.ajax('statics',{
						channel:letwxid,
						evtkey:me.getPageName() + '--'+to
					},letwxid,null,apiopenid, apitoken,'nf');
					break;
				case 'q':
					var channel = 'active_'+letwxid+'_'+M.getUrlParam().gp;
					if(M.getUrlParam().gp == undefined){
						channel = 'hd_wxfollow_' + letwxid + '_' + M.getUrlParam().gid;
					}
					M.ajax('statics', {
		    			channel: channel,
		    			evtkey: me.getPageName() + '--' + to,
						gp: M.getUrlParam().gp,
						gid: M.getUrlParam().gid
					}, letwxid, null, apiopenid, apitoken,'nf');
					break;
			}
			
			
		},
		getPageName : function(){
			var url = window.location.href,
				length = url.length,
				index = url.lastIndexOf('/'),
				subName = url.substr(index+1),
				indexP = subName.indexOf('.')!=-1 ? subName.indexOf('.') : subName.indexOf('?'),
				name = subName.substr(0,indexP);
			return name;
		}
	}

	return wxshare;
}));
