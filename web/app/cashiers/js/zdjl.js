(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var zdjlPage = {};
		//首页
		var zdjlPage = {
			act:{
				$dom:$('#zdjlPage'),
				params:null,
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						$('#main').show();
						me.params = {
							crupage : 1,
							limit : 4
						};
						zdjlPage.data.billlog(me.params,me.billlogCb.bind(me));
					});
				},
				checkTouch:function(){
					var me = this;
					//查看账单详情
					$('.logList li').on(config.click,function(){
						localStorage.no = $(this).data('no');
						localStorage.typecode = $(this).data('typecode');
						localStorage.statuscode = $(this).data('statuscode');
						gotoUrl('xq.html');
					});
					//搜索
					$('#search').on(config.touch,function(){
						var no = $('#no').val();
						var reg = new RegExp("^[0-9]*$");
						if(!no){
							M.alert('请输入订单号');
						}else if(!reg.test(no)){
							M.alert('请输入正确的订单号');
						}else{
							M.loading();
							var params = {
								out_trade_no : no,
							}
							zdjlPage.data.serachorder(params,me.serachorderCb.bind(me));
						}
					});
					//加载更多
					$('#more').on(config.click,function(){
						M.loading();
						zdjlPage.data.billlog(me.params,me.billlog2Cb.bind(me));
					});	
				},
				//初次加载的回调
				billlogCb:function(data){
					var me = this;
					$('#zdjlPage').html(template('zdjlTMP',data));
					if(data.data.hasmore == 1){
						$('#more').show();
					}else{
						$('#more').hide();
					}
					me.$dom.show();
					me.checkTouch();
					M.loadingHide();
					me.params.crupage++;
				},
				//加载更多的回调
				billlog2Cb:function(data){
					var me = this;
					if(data.data.hasmore == 1){
						$('#more').show();
					}else{
						$('#more').hide();
					}
					M.loadingHide();
					if(data.data.orderList.length == 0){//返回的列表为空
						$('#more').hide();
						M.showToast('没有更多');
					}else{//返回的列表有值
						$('#allList').append(template('zdList',data));
						me.params.crupage++;
					}
				},
				serachorderCb:function(data){
					var me = this;
					$('#result').html(template('resultTMP',data));
					$('#result').show();
					$('#allList').hide();
					M.loadingHide();
				},
				out:function(){
					$('#getNowBtn').off();
					this.$indexPage.hide();
				}
			},
			data:{
				billlog:function(params,cb){
					post('cashier/billlog',params,cb);
				},
				serachorder:function(params,cb){
					post('cashier/serachorder',params,cb);
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
				__uri('../images/zfb2.png'),
		];
		
		M.loading();
		check(oAuth,function(){
			zdjlPage.act.init();
		});
	}
}());
