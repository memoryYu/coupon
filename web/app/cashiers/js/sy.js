(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare','swiper'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare,swiper){
		var homePage = {};
		//首页
		var homePage = {
			act:{
				$dom:$('#homePage'),
				myswiper:null,
				params:null,
				init:function(){
					var me = this;
					
					M.imgpreload(imgs,function(){
						$('#main').show();
						me.params = {
							crupage : '1',
							limit : '1'
						};
						homePage.data.billlog(me.params,me.billlogCb.bind(me));
//						me.$dom.show();
//						me.mySwiper = new Swiper('#total',{
//							loop: false,
//							autoplay: 3000,
//							mode : 'horizontal',
//							autoplayDisableOnInteraction : false,
//							pagination: '.pagination'
//						});  
//						me.checkTouch();
//						M.loadingHide();
					});
				},
				checkTouch:function(){
					var me = this;
					$('#loginbtn').on(config.touch,function(){
//						indexPage.data.login(me.params,me.loginCb.bind(this));
					});
				},
				billlogCb:function(data){
					var me = this;
					$('#today').text(data.data.today.money);
					$('#month').text(data.data.month.money);
					$('#todaynum').text(data.data.today.count);
					$('#monthnum').text(data.data.month.count);
					me.$dom.show();
					me.mySwiper = new Swiper('#total',{
						loop: false,
						autoplay: 3000,
						mode : 'horizontal',
						autoplayDisableOnInteraction : false,
						pagination: '.pagination'
					});  
					homePage.data.indexmenu(me.indexmenuCb.bind(me));
				},
				indexmenuCb:function(data){
					var me = this;
					for(var i=0;i<data.data.length;i++){
						if(data.data[i] == 0){
							$('#fuc'+i).hide();
						}
					}
					me.checkTouch();
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
				indexmenu:function(cb){
					post('cashier/indexmenu',null,cb);
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
				__uri('../images/ico1.png'),
				__uri('../images/ico2.png'),
				__uri('../images/ico3.png'),
				__uri('../images/ico4.png'),
				__uri('../images/ico5.png'),
				__uri('../images/ico6.png'),
				__uri('../images/jiaoy.png'),
				__uri('../images/jiaoyi.png'),
				__uri('../images/zd.png'),
				__uri('../images/zd1.png'),
				__uri('../images/dianp.png'),
				__uri('../images/dianpu.png'),
		];
		M.loading();
		check(oAuth,function(){
			homePage.act.init();
		});
	}
}());
