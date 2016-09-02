(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var tkPage = {};
		//首页
		var tkPage = {
			act:{
				$dom:$('#tkPage'),
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						$('#main').show();
						$('#no').text(localStorage.no);
						$('#total_fee').text(localStorage.total_fee);
						me.$dom.show();
						me.checkTouch();
						M.loadingHide();
					});
				},
				checkTouch:function(){
					var me = this;
					$('#cleartk').on('touchend',function(){
						$('#tkje').attr('value','');
						$('#tkje').val('');
					});
					$('#tk').on(config.touch,function(){
						var refund_fee = $('#tkje').val();
						var r = new RegExp("^\\d+(\\.\\d+)?$");
						if(!refund_fee){
							M.alert('请输入退款金额！');
						}else if(!r.test(refund_fee)){
							M.alert('请输入正确的退款金额！');
						}else{
							M.loading();
							var params = {
								out_trade_no : localStorage.no,
								typecode : localStorage.typecode,
								total_fee : localStorage.total_fee,
								refund_fee : refund_fee,
							}
							tkPage.data.refund(params,me.refundCb.bind(me));
						}
					});
				},
				refundCb:function(data){
					M.loadingHide();
					M.alert(data.error_msg);
				},
				out:function(){
					$('#getNowBtn').off();
					this.$indexPage.hide();
				}
			},
			data:{
				refund:function(params,cb){
					post('cashier/refund',params,cb);
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
				__uri('../images/xxx.png'),
		];
		
		M.loading();
		check(oAuth,function(){
			tkPage.act.init();
		});
	}
}());
