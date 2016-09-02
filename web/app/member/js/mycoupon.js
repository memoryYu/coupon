(function(){
	require([config.configUrl],function(){
		require(['auth'],function(oAuth){
			check(oAuth,function(){
				var reqArr = ['MHJ','loading','ngapi','jquery','wxshare','barcode'];
				require(reqArr,requireCb);
			});
		})
		
	});
	
	function requireCb(MHJ,M,ngapi,$,wxshare){
		
		M.loading(2,2);
	
		//我的卡券
		var mycouponPage = {
			act:{
				$dom:$('#mycouponPage'),
				init:function(){
					M.loading(2,2);
					this.$dom.show();
					mycouponPage.data.getCoupon(this.getCouponCb.bind(this));
				},
				getCouponCb:function(data){
					for(var i=0;i<data.canuse.length;i++){
						data.canuse[i].name = data.brand.name;
						data.canuse[i].logo = data.brand.logo;
					}
					for(var i=0;i<data.used.length;i++){
						data.used[i].name = data.brand.name;
						data.used[i].logo = data.brand.logo;
					}
					for(var i=0;i<data.expired.length;i++){
						data.expired[i].name = data.brand.name;
						data.expired[i].logo = data.brand.logo;
					}
					$('#canUse').html(MHJ.tmpl($('#quanList').text(),data.canuse));
					$('#isUsed').html(MHJ.tmpl($('#quanList').text(),data.used));
					$('#isOver').html(MHJ.tmpl($('#quanList').text(),data.expired));
					this.checkTouch();
					M.loadingHide();
				},
				checkTouch:function(){
					var me = this;
					//可使用
					$('#canUseBtn').on(config.touch,function(evt){
						evt.preventDefault();
						$('.mycou-box1').removeClass('active');
						$(this).addClass('active');
						$('.couponItemNav').hide();
						$('#canUse').show();
					});
					//已使用
					$('#isUsedBtn').on(config.touch,function(evt){
						evt.preventDefault();
						$('.mycou-box1').removeClass('active');
						$(this).addClass('active');
						$('.couponItemNav').hide();
						$('#isUsed').show();
					});
					//已过期
					$('#isOverBtn').on(config.touch,function(evt){
						evt.preventDefault();
						$('.mycou-box1').removeClass('active');
						$(this).addClass('active');
						$('.couponItemNav').hide();
						$('#isOver').show();
					});
					//返回
					// $('#mycouponPageBack').on(config.touch,function(){
					// 	me.out();
					// });
					//查看券详情
					$('#canUse .counp').on(config.touch,function(evt){
						evt.preventDefault();
						var data = {};
						data.code = $(this).data('code');
						data.name = $(this).data('name');
						data.qname = $(this).data('qname');
						data.desc = $(this).data('desc');
						data.startdate = $(this).data('startdate');
						data.enddate = $(this).data('enddate');
						data.logo = $(this).data('logo');
						$('#couponinfo').html(MHJ.tmpl($('#couponinfoTMP').text(),data));
						$('#qrcode').barcode(data.code+'','code128',{
							barWidth: 2,
                            barHeight: 80,
                            output: 'bmp',
                            showHRI:true
						});
						me.$dom.hide();
						$('#couponinfo').show();
					});

					$('#couponinfo').on(config.touch,'#detailback',function(evt){
						evt.preventDefault();
						me.$dom.show();
						$('#couponinfo').hide();
					});
				},
				out:function(){
					$('#canUseBtn').off();
					$('#isUsedBtn').off();
					$('#isOverBtn').off();
					$('#mycouponPageBack').off();
					$('#canUse .counp').off();
					$('#detailback').off();
					this.$dom.hide();
				}

			},
			data:{
				getCoupon:function(cb){
					post('member/coupon',null,cb)
				}
			}
		}
		
		function defaultError(data){
			var err = data.error - 0;
			switch(err){
				case 1002:
					oAuth.clear();
					alert('你的身份信息已过期，点击确定刷新页面');
					window.location.reload();
					break;
				default:
					alert(data.error_msg);
			}
		}
		
		function post(action,param,cb){
			ngapi(action,param,config.gameid,function(data){
				console.log(action+':'+JSON.stringify(data));
//				alert(action+':'+JSON.stringify(data));
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
      
		
		
		mycouponPage.act.init();

		
	}
	

}());
