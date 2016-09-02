(function(){
	require([config.configUrl],function(){
		var reqArr = ['http://qcdn.letwx.com/app/cashiers/js/wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var smPage = {};
		//首页
		var smPage = {
			act:{
				$dom:$('#smPage'),
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						M.loadingHide();
						share(config.shareInfo);//触发扫一扫
						me.checkTouch();
					});	
				},
				checkTouch:function(){
					var me = this;
					var myinterval = window.setInterval(function(){
						if(localStorage.scancode){//判断是否扫描到码
							M.alert(localStorage.scancode);
							clearInterval(myinterval);
						}
					},100);
//					wxshare.scanQRCode(function(res){//成功回调
//						var result = res.resultStr;
//						M.alert(result);
//					});
				},
				loginCb:function(data){
					
				},
			},
			data:{
				login:function(params,cb){
					post('cashier/login',params,cb);
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
		];
//		check(oAuth,function(){
			M.loading();
			localStorage.removeItem("scancode");
			smPage.act.init();
//		});
	}
}());
