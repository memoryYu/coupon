(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare','qrcode'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare,qrcode){
		var mdskPage = {};
		//首页
		var mdskPage = {
			act:{
				$dom:$('#mdskPage'),
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						$('#main').show();
						mdskPage.data.merchantcode(me.merchantcodeCb.bind(me));
					});
				},
				merchantcodeCb:function(data){//获取二维码地址
					var me = this;
					$('.qrcode img').attr('src',data.data.url);
					me.$dom.show();
					M.loadingHide();
				},
				out:function(){
					$('#getNowBtn').off();
					this.$indexPage.hide();
				}
			},
			data:{
				merchantcode:function(cb){
					post('cashier/merchantcode',null,cb);
				},
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
			__uri('../images/buzhou.png'),
			__uri('../images/huabian.png'),
		];
		
		M.loading();
		check(oAuth,function(){
			mdskPage.act.init();
		});
	}
}());
