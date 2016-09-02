(function(){
	require([config.configUrl],function(){
		var reqArr = ['http://qcdn.letwx.com/app/cashiers/js/wxshare.js'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var kqhxPage = {};
		var isready = 0;//wx的config是否准备好，0-未准备好，1-已准备好
		//首页
		var kqhxPage = {
			act:{
				$dom:$('#kqhxPage'),
				params : {
					code : null,
//					code : '608446927648',
				},
				mid : null,
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						share(config.shareInfo,null,function(){//wx的config已完成，可以直接调微信扫码的接口了
							isready = 1;
						});
						$('#main').show();
						M.loadingHide();
						me.scan();
//						kqhxPage.data.search(me.params,me.searchCb.bind(me));
					});
				},
				//扫券码
				scan:function(){
					var me = this;
					var myInterval = window.setInterval(function(){
						if(isready == 1){//扫码接口已准备好
							wxshare.scanQRCode(function(res){//扫码成功
								var scancode = res.resultStr;
								scancode = scancode.toString();
								var arr;
								//扫码结果中可能会带上前缀编码类型，要清除掉
								if(scancode.indexOf(',')>-1){
									var arr = scancode.split(',');
									localStorage.scancode = arr[1];
								}else if(scancode.indexOf('，')>-1){
									var arr = scancode.split('，');
									localStorage.scancode = arr[1];
								}else{
									localStorage.scancode = res.resultStr;
								}
								//扫码成功之后，请求卡券检索接口
								M.loading();
								me.params.code = localStorage.scancode;
								kqhxPage.data.search(me.params,me.searchCb.bind(me));
							});
							clearInterval(myInterval);
						}
					},100);
				},
				checkTouch : function(){
					var me = this;
					$('#qrhx').on(config.touch,function(){
						M.loading();
						var params = {
							code : me.params.code,
							mid : me.mid
						};
						kqhxPage.data.usecoupon(params,me.usecouponCb.bind(me));
					});	
				},
				searchCb : function(data){
					var me = this;
					$('#kqhxPage').html(template('kqhxTMP',data));
					$('#detail').html(template('detailTMP',data));
					me.mid = data.coupon.mid;
					me.$dom.show();
					me.checkTouch();
					M.loadingHide();
				},
				usecouponCb : function(data){
					var me = this;
					me.$dom.hide();
					$('#skjgPage').show();
					M.loadingHide();
				},
			},
			data:{
				search:function(params,cb){
					post('cashier/search',params,cb);
				},
				usecoupon:function(params,cb){
					post('cashier/usecoupon',params,cb);
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
		
		function share(shareInfo,succCb,readyCb){
			wxshare.initWx(shareInfo,config.gameid,config.apiopenid,config.apitoken,succCb,null,null,readyCb);
		}
		
		var imgs = [
				__uri('../images/jiantou.png'),
		];
		
		M.loading();
		check(oAuth,function(){
			kqhxPage.act.init();
		});
	}
}());
