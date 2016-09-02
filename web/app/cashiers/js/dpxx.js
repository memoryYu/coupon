(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var dpxxPage = {};
		//首页
		var dpxxPage = {
			act:{
				$dom:$('#dpxxPage'),
				params:{
					type : 'shop',
				},
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						$('#main').show();
						dpxxPage.data.merchant(me.params,me.merchantCb.bind(me));
						
					});
				},
				checkTouch:function(){
					var me = this;
					$('#logout').on(config.touch,function(){
						M.loading();
						dpxxPage.data.loginout(me.loginoutCb.bind(me));
					});
				},
				merchantCb:function(data){
					var me = this;
					$('#dpxxPage').html(template('dpxxTMP',data));
					me.$dom.show();
					me.checkTouch();
					M.loadingHide();
				},
				loginoutCb:function(data){
					var me = this;
					M.loadingHide();
					M.alert('退出成功',function(){
						gotoUrl('dl.html');
					});
				},	
				out:function(){
					$('#getNowBtn').off();
					this.$indexPage.hide();
				}
			},
			data:{
				merchant:function(params,cb){
					post('cashier/merchant',params,cb);
				},
				loginout:function(cb){
					post('cashier/loginout',null,cb);
				}
			}
		}
		
		function defaultError(data){
			M.loadingHide();
            var err = data.error - 0;
            switch(err){
                case 1002:
                    oAuth.clear();
                    M.alert('你的身份信息已过期，点击确定刷新页面',function(){
                        window.location.reload();
                    });
                    break;
                default:
					M.showToast(data.error_msg);
            }
		}
		
		function post(action,param,cb){
			M.ajax(action,param,config.gameid,function(data){
				console.log('action:'+action+'  data:'+JSON.stringify(data));
//				M.alert('action:'+action+'  data:'+JSON.stringify(data));
				var err = data.error - 0;
				switch(err){
					case 0:
						cb && cb(data);
						break;
					default:
						defaultError(data);
				}
			},config.apiopenid,config.apitoken);
		}
		
		function share(shareInfo,succCb){
			wxshare.initWx(shareInfo,config.gameid,config.apiopenid,config.apitoken,succCb,null,null,null);
		}
		
		var imgs = [
				__uri('../images/jiantou.png'),
				__uri('../images/logo.png'),
				__uri('../images/jiantou1.png'),
				__uri('../images/zfb.png'),
				__uri('../images/zfb2.png'),
				__uri('../images/weixin.png'),
				__uri('../images/weixin1.png'),
				__uri('../images/baidu.png'),
				__uri('../images/bd.png'),
				__uri('../images/jiaoy.png'),
				__uri('../images/jiaoyi.png'),
				__uri('../images/zd.png'),
				__uri('../images/zd1.png'),
				__uri('../images/dianp.png'),
				__uri('../images/dianpu.png'),
		];
		M.loading();
		check(oAuth,function(){
			dpxxPage.act.init();
		});
	}
}());
