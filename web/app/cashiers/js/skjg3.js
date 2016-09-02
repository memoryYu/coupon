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
							card_no : null,
							type : 'cash',
						};
						skjgPage.data.consume(me.params,me.consumeCb.bind(me));
					});
				},
				checkTouch:function(failtype){
					var me = this;
					$('#close').on(config.touch,function(){//会员现金充值失败，直接跳转到首页
						gotoUrl('sy.html');
					});
					$('#confirm').on(config.touch,function(){//确认收款，显示收款结果
						$('#pay-suc').hide();
						me.$dom.show();
					});	
				},
				consumeCb:function(data){//会员现金充值成功
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
				consume:function(params,cb){
					post('cashier/consume',params,cb);
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
