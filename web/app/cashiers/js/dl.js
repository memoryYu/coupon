(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var indexPage = {};
		//首页
		var indexPage = {
			act:{
				$dom:$('#indexPage'),
				params:{
					username: null,
					password: null
				},
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						$('#main').show();
						indexPage.data.checklogin(me.checkloginCb.bind(this));
					});
				},
				checkTouch:function(){
					var me = this;
					$('#loginbtn').on(config.touch,function(){
						var name = $('#username').val();
						var psd = $('#psd').val();
						if(!name){
							M.alert('用户名不能为空！');
						}else if(!psd){
							M.alert('密码不能为空！');
						}else{
							M.loading();
							me.params ={
								username: name,
								password: psd
							};
							indexPage.data.login(me.params,me.loginCb.bind(this));
						}
					});
				},
				checkloginCb : function(data){
					var me = this;
					//已登录过，直接跳转到首页
					gotoUrl('sy.html');
				},
				loginCb:function(data){
					M.loadingHide();
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
				},
				checklogin:function(cb){
					post('cashier/checklogin',null,cb);
				}
			}
		}
		
		function defaultError(data){
            var err = data.error - 0;
            switch(err){
                case 1002:
                	M.loadingHide();
                    oAuth.clear();
                    M.alert('你的身份信息已过期，点击确定刷新页面',function(){
                        window.location.reload();
                    });
                    break;
                case 1://需重新登录
                	indexPage.act.checkTouch();
					if(localStorage.username){
						$('#username').val(localStorage.username);
					}
					if(localStorage.psd){
						$('#psd').val(localStorage.psd);
					}
					$('#indexPage').show();
					M.loadingHide();
                	break;
                default:
               		M.loadingHide();
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
				__uri('../images/logo1.png'),
				__uri('../images/yhm.png'),
				__uri('../images/mima.png'),
		];
		
		M.loading();
		check(oAuth,function(){
			indexPage.act.init();
		});
	}
}());
