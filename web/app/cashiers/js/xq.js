(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var xqPage = {};
		//首页
		var xqPage = {
			act:{
				$dom:$('#xqPage'),
				params:null,
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						$('#main').show();
						me.params = {
							out_trade_no : localStorage.no,
							typecode : localStorage.typecode,
							statuscode : localStorage.statuscode
						};
						xqPage.data.detailbill(me.params,me.detailbillCb.bind(me));
						
					});
				},
				checkTouch:function(){
					var me = this;
					$('.tuik').on(config.touch,function(){
						localStorage.no = $(this).data('no');
						localStorage.typecode = $(this).data('typecode');
						localStorage.total_fee = $(this).data('total_fee');
						gotoUrl('tk.html');
					});
				},
				detailbillCb:function(data){
					var me = this;
					$('#xqPage').html(template('xqTMP',data));
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
				detailbill:function(params,cb){
					post('cashier/detailbill',params,cb);
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
				__uri('../images/gou.png'),
		];
		
		M.loading();
		check(oAuth,function(){
			xqPage.act.init();
		});
	}
}());
