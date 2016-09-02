(function(){
	require([config.configUrl],function(){
		var reqArr = ['wxshare'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var xjskPage = {};
		//首页
		var xjskPage = {
			act:{
				$dom:$('#xjskPage'),
				init:function(){
					var me = this;
					
					M.imgpreload(imgs,function(){
						share(config.shareInfo);
						$('#main').show();
						me.$dom.show();
						me.checkTouch();
						M.loadingHide();
					});
				},
				checkTouch:function(){
					var me = this;
					var add = false;
					var addnum1 = '0';//加数
					var addnum2 = '0';//被加数
					var length1;//加数小数点的位数
					var length2;//被加数小数点的位数
					var length;//和的小数点位数
					var $elem;//选取显示的元素
					//输入数字和小数点
					$('.number').on('touchend',function(){
						if($elem){
							var now = $elem.attr('value');
							var next = $(this).text();
							if(now == 0 && now.indexOf('.')=='-1'){
								if($(this).parent().hasClass('dot')){//在0之后输入小数点
									$elem.attr('value',now+next);
								}else{
									$elem.attr('value',next);
								}	
							}else{
								if(add){//加法被激活
									now = '';
									add = false;
								}
								$elem.attr('value',now+next);
							}
							addnum1 = $elem.attr('value');
						}
					});
					//删除
					$('.del div').on('touchend',function(){
						if($elem){
							var now = $elem.attr('value').toString();
							if(now.length != 1){
								$elem.attr('value',now.substring(0,now.length-1));
							}else{//只剩下一位
								$elem.attr('value','0');
							}
							addnum1 = $elem.attr('value');
						}
					});	
					//清空
					$('.clearall div').on('touchend',function(){
						if($elem){
							$elem.attr('value','0');
							add = false;
							addnum1 = '0';
							addnum2 = '0';
						}
					});	
					//相加
					$('.add').on('touchend',function(){
						if($elem){
							add = true;
							console.log(addnum1);
							console.log(addnum2);
							if(addnum1.indexOf('.')>-1){
								length1 = addnum1.split(".")[1].length;
							}else{
								length1 = 0;
							}
							if(addnum2.indexOf('.')>-1){
								length2 = addnum2.split(".")[1].length;
							}else{
								length2 = 0;
							}
							if(length1>=length2){
								length = length1;
							}else{
								length = length2;
							}
							var addsum = Number((parseFloat(addnum1)+parseFloat(addnum2)).toFixed(length));
							$elem.attr('value',addsum);
							addnum1 = '0';
							addnum2 = $elem.attr('value');
						}	
					});	
					//确认
					$('.confirm').on('touchend',function(){
						var reg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$");
						var sjsq = $('#sjsq').attr('value');
						var ysje = $('#ysje').attr('value');
						if(!sjsq || sjsq==0){
							M.alert('请输入实际收取金额！');
						}else if(!ysje || ysje==0){
							M.alert('请输入应收金额！');
						}else if(!reg.test(sjsq)){
							M.alert('请输入正确的实际收取金额！');
						}else if(!reg.test(ysje)){
							M.alert('请输入正确的应收金额！');
						}else{
							localStorage.money = Number(parseFloat(ysje).toFixed(2));
							console.log(localStorage.money);
							gotoUrl('skjg3.html');
						}
					});	
					//关闭提示
					$('#closetip').on('touchend',function(){
						$('.tip').hide();
					});
					//实际收取获得焦点
					$('#sjsq').on('touchend',function(){
//						console.log('sjsq is onfocus!');
						$('.screen input').removeClass('active');
						$(this).addClass('active');
						$elem = $(this);
						add = false;
						addnum1 = '0';
						addnum2 = '0';
					});
					//应收金额获得焦点
					$('#ysje').on('touchend',function(){
//						console.log('ysje is onfocus!');
						$('.screen input').removeClass('active');
						$(this).addClass('active');
						$elem = $(this);
						add = false;
						addnum1 = '0';
						addnum2 = '0';
					});
					
					$('#loginbtn').on(config.touch,function(){
//						indexPage.data.login(me.params,me.loginCb.bind(this));
					});
				},
				loginCb:function(data){
					M.loadingHide();
					M.showToast(data.error_msg);
					localStorage.username = indexPage.act.params.username;
					localStorage.psd = indexPage.act.params.password;
					gotoUrl('sy.html');
				},
				out:function(){
					$('#getNowBtn').off();
					this.$indexPage.hide();
				}
			},
			data:{
				login:function(params,cb){
					post('cashier/login',params,cb);
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
				__uri('../images/xx.png'),
				__uri('../images/queren.png'),
		];
		M.loading();
		check(oAuth,function(){
			xjskPage.act.init();
		});
	}
}());
