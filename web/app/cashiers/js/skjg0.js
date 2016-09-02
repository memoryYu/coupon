(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var skjgPage = {};
		var querytimes = 0;//订单查询次数
		var myInterval;
		var params;
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
							total_fee : localStorage.money,
							auth_code : localStorage.scancode
						};
						M.alert(localStorage.money);
						M.alert(localStorage.scancode);
//						me.params = {
//							total_fee : '0.01',
//							auth_code : '130134206593839443'
//						};
						skjgPage.data.micropay(me.params,me.micropayCb.bind(me));
						
					});
				},
				checkTouch:function(failtype){
					var me = this;
					$('#close').on(config.touch,function(){
						M.loading();
						if(failtype == 0){//收款失败，直接跳转到首页
							gotoUrl('sy.html');
						}else{//收款失败，撤销订单
							skjgPage.data.reverse(params,me.reverseCb.bind(me));
						}
					});
					$('#confirm').on(config.touch,function(){//确认收款，显示收款结果
						$('#pay-suc').hide();
						me.$dom.show();
					});	
				},
				micropayCb:function(data){//收款成功
					var me = this;
					$('#val').text(data.data.total_fee);
					$('.detailList').html(template('detailTMP',data));
					$('#pay-suc').show();
					me.checkTouch();
					$('#pay-loading').hide();
				},
				orderqueryCb : function(data){//收款成功
					var me = this;
					if(myInterval){//清除周期函数
                		clearInterval(myInterval);
                	}
					$('#val').text(data.data.total_fee);
					$('.detailList').html(template('detailTMP',data));
					$('#pay-suc').show();
					me.checkTouch();
					$('#pay-loading').hide();
				},
				reverseCb : function(data){//撤销订单成功
					M.loadingHide();
					M.alert('撤销成功');
					$('#pay-fail').hide();
					gotoUrl('sy.html');
				},
				out:function(){
					$('#getNowBtn').off();
					this.$indexPage.hide();
				}
			},
			data:{
				micropay:function(params,cb){
					post('cashier/micropay',params,cb);
				},
				orderquery:function(params,cb){
					post('cashier/orderquery',params,cb);
				},
				reverse:function(params,cb){
					post('cashier/reverse',params,cb);
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
                case 500100: //需要调用查询订单接口确认，以进行下一步操作    
                	querytimes++;//查询次数加1，当>5时就可以撤销订单了
                	params = {
                		out_trade_no : data.data.out_trade_no,
                	};
                	myInterval = setInterval(function(){
                		if(querytimes>=0&&querytimes<=5){
                			skjgPage.data.orderquery(params,skjgPage.act.orderqueryCb.bind(this));
                		}else{//不进行订单查询，直接撤销订单
                			if(!data.error_msg){
		                		$('#reason').text('需撤销订单');
		                	}else{
		                		$('#reason').text(data.error_msg);
		                	}
		                	$('#close').text('撤销订单');
		                	$('#pay-fail').show();
		                	skjgPage.act.checkTouch(1);
		                	$('#pay-loading').hide();
                			clearInterval(myInterval);
                		}
                	},2000);
                	break;
                case 500200: //二维码已过期，余额不足，需要重新下单
                	if(!data.error_msg){
                		$('#reason').text('二维码已过期或余额不足，请重新下单');
                	}else{
                		$('#reason').text(data.error_msg);
                	}
                	$('#close').text('关闭');
                	$('#pay-fail').show();
                	skjgPage.act.checkTouch(0);
                	$('#pay-loading').hide();
                	break;
                case 500500: //订单查询失败
                	if(myInterval){//清除周期函数
                		clearInterval(myInterval);
                	}
                	if(!data.error_msg){
                		$('#reason').text('网络连接超时');
                	}else{
                		$('#reason').text(data.error_msg);
                	}
                	$('#pay-loading').hide();
                	$('#pay-fail').show();
                	skjgPage.act.checkTouch(0);
                	break;
                case -1://订单撤销失败
                	M.alert('订单撤销失败,请重试');
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
