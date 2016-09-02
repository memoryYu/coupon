(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var sybzPage = {};
		//首页
		var sybzPage = {
			act:{
				$dom:$('#sybzPage'),
				init:function(){
					var me = this;
					
					M.imgpreload(imgs,function(){
						share(config.shareInfo);
						$('#main').show();
						me.$dom.show();
						me.checkTouch();
						M.loadingHide();
					});
				},
				checkTouch:function(){
					var me = this;
					$('.question img').on('touchend',function(){
						$(this).toggleClass('transform180');
						$(this).parent().next().toggleClass('show');
					});
					$('#loginbtn').on(config.touch,function(){
//						indexPage.data.login(me.params,me.loginCb.bind(this));
					});
				},
				loginCb:function(data){
					M.loadingHide();
					M.showToast(data.error_msg);
					localStorage.username = indexPage.act.params.username;
					localStorage.psd = indexPage.act.params.password;
					gotoUrl('sy.html');
				},
				out:function(){
					$('#getNowBtn').off();
					this.$indexPage.hide();
				}
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
		M.loading();
		check(oAuth,function(){
			sybzPage.act.init();
		});
	}
}());
