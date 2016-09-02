(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var shxxPage = {};
		//首页
		var shxxPage = {
			act:{
				$dom:$('#shxxPage'),
				params:{
					type : 'merchant',
				},
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						$('#main').show();
						shxxPage.data.merchant(me.params,me.merchantCb.bind(me));
					});
				},
				checkTouch:function(){
					var me = this;
				},
				merchantCb:function(data){
					var me = this;
					$('#shxxPage').html(template('shxxTMP',data));
					me.$dom.show();
					me.checkTouch();
					M.loadingHide();
				},
				out:function(){
					$('#getNowBtn').off();
					this.$indexPage.hide();
				}
			},
			data:{
				merchant:function(params,cb){
					post('cashier/merchant',params,cb);
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
			shxxPage.act.init();
		});
	}
}());
