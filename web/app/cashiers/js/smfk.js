(function(){
	require([config.configUrl],function(){
		var reqArr = ['http://qcdn.letwx.com/app/cashiers/js/wxshare.js'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare){
		var smfkPage = {};
		var isready = 0;//wx的config是否准备好，0-未准备好，1-已准备好
		//首页
		var smfkPage = {
			act:{
				$dom:$('#smfkPage'),
				init:function(){
					var me = this;
					M.imgpreload(imgs,function(){
						share(config.shareInfo,null,function(){//wx的config已完成，可以直接调微信扫码的接口了
							isready = 1;
						});
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
					//输入数字和小数点
					$('.number').on('touchend',function(){
						var now = $('#show').text();
						var next = $(this).text();
						if(now == 0 && now.indexOf('.')=='-1'){
							if($(this).parent().hasClass('dot')){//在0之后输入小数点
								$('#show').text(now+next);
							}else{
								$('#show').text(next);
							}
						}else{
							if(add){//加法被激活
								now = '';
								add = false;
							}
							$('#show').text(now+next);
						}
						addnum1 = $('#show').text();
					});
					//删除
					$('.del div').on('touchend',function(){
						var now = $('#show').text().toString();
						if(now.length != 1){
							$('#show').text(now.substring(0,now.length-1));
						}else{//只剩下一位
							$('#show').text('0');
						}
						addnum1 = $('#show').text();
					});	
					//清空
					$('.clearall div').on('touchend',function(){
						$('#show').text('');
						add = false;
						addnum1 = '0';
						addnum2 = '0';
					});	
					//相加
					$('.add').on('touchend',function(){
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
						$('#show').text(addsum);
						addnum1 = '0';
						addnum2 = $('#show').text();
					});	
					//扫码收款
					$('.pay').on('touchend',function(){
						var reg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$");
						if(reg.test($('#show').text())){//只有输入正确的金额数才会跳转
							localStorage.money = Number($('#show').text()).toFixed(2);//保留小数点后两位
							var myInterval = window.setInterval(function(){
								if(isready == 1){//扫码接口已准备好
									wxshare.scanQRCode(function(res){//扫码成功
										me.$dom.hide();
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
										M.alert(localStorage.scancode);
										//跳转到收款结果页面
										gotoUrl('skjg'+getUrlParam().paytype+'.html');
									});
									clearInterval(myInterval);
								}
							},100);
						}else{
							M.showToast('请输入正确的金额！');
						}
					});	
				},
			},
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
				__uri('../images/sm.png'),
		];
		
		M.loading();
		check(oAuth,function(){
			smfkPage.act.init();
		});
	}
}());
