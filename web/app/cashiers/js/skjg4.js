(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var skjgPage = {};
		//首页
		var skjgPage = {
			act:{
				$dom:$('#skjgPage'),
				params : null,
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						var paytype = localStorage.paytype;
						me.params = {
							money : localStorage.money,
							card_no : localStorage.scancode,
						};
						skjgPage.data.cash(me.params,me.cashCb.bind(me));
					});
				},
				checkTouch:function(failtype){
					var me = this;
					$('#close').on(config.touch,function(){//会员现金收款失败，直接跳转到首页
						gotoUrl('sy.html');
					});
					$('#confirm').on(config.touch,function(){//确认收款，显示收款结果
						$('#pay-suc').hide();
						me.$dom.show();
					});	
				},
				cashCb:function(data){//会员现金收款成功
					var me = this;
					$('#val').text(data.data.total_fee);
					$('.detailList').html(template('detailTMP',data));
					$('#pay-suc').show();
					me.checkTouch();
					$('#pay-loading').hide();
				},
				out:function(){
					$('#getNowBtn').off();
					this.$indexPage.hide();
				}
			},
			data:{
				cash:function(params,cb){
					post('cashier/membercash',params,cb);
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
                default://会员消费失败
					if(!data.error_msg){
                		$('#reason').text('会员消费失败');
                	}else{
                		$('#reason').text(data.error_msg);
                	}
                	$('#close').text('关闭');
                	$('#pay-fail').show();
                	skjgPage.act.checkTouch();
                	$('#pay-loading').hide();
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
			__uri('../images/gou.png'),
			__uri('../images/chengg.png'),
			__uri('../images/shibai.png'),
		];
		
		$('#main').show();
		check(oAuth,function(){
			skjgPage.act.init();
		});
	}
}());
