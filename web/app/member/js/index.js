(function(){
	require([config.configUrl],function(){
		var reqArr = ['http://qcdn.letwx.com/app/member/js/wxshare.js','barcode'];
		require(reqArr,requireCb);
	});
	
	function requireCb(wxshare,barcode){
		var req;//必填对象
		var other;//选填对象
		var req2;//个人信息页面的必填对象
		var other2;//个人信息页面的选填对象
		var addressId = [];//地址id
		var BTaddressId = [];//必填地址id
		var XTaddressId = [];//选填地址id
		var selectArea = [];//存放修改个人信息页面中的MobileSelectArea对象
		var BTselectArea = [];//存放必填地址的MobileSelectArea对象
		var XTselectArea = [];//存放选填地址的MobileSelectArea对象
		var info = {};
		var concatTimes = 0;
		var languagePack = {};//语言包 
		var currentLanguage = 'cn';//默认为中文
		var group = [];//要进行中/英切换的语言组
		var uid = getUrlParam().uid;
		var isShow = (uid==11 || uid ==56)?0:1;//是否展示“我的余额”和“会员充值”，0-不展示，1-展示
		
		function changeAlert(msg,cb){
			if(currentLanguage == 'cn'){//中文
				M.alert(msg);
			}else{//英文
				if(!languagePack[msg]){
					M.alert('Tip',msg);
					$('.M-pop').hide();
					$('.M-handler-ok').text('OK');
					$('.M-pop').show();
				}else{
					M.alert('Tip',languagePack[msg]);
					$('.M-pop').hide();
					$('.M-handler-ok').text('OK');
					$('.M-pop').show();
				}
			}
		}
		//首页
		var indexPage = {
			act:{
				erpid:null,
				$dom:$('#indexPage'),
				$indexPage:$('#indexPage'),
				$indexPageNoBind:$('#indexPageNoBind'),
				indexData : null,
				params: {
					language:'cn'
				},
				init:function(){
					$('#main').show();
					cardDetailPage.act.$dom.hide();
					activeCardPage.act.$dom.hide();
					indexPage.data.get(this.getCb.bind(this));
				},
				//拉取语言包的回调
				languageCb:function(data){
					var me = this;
					languagePack = data.language;
					//判断是绑定还是未绑定
					me.indexData.isbind ? me.isbind(me.indexData):me.nobind(me.indexData);
				},
				getCb:function(data){
					this.indexData = data;
					//记录分享信息
					if(data.cover.share_imgurl){
						config.shareInfo.imgUrl = data.cover.share_imgurl;
					}
					if(data.cover.share_title){
						config.shareInfo.title = data.cover.share_title;
					}
					if(data.cover.share_content){
						config.shareInfo.desc = data.cover.share_content;
					}
					//拉取语言包
					indexPage.data.language(this.languageCb.bind(this));
				},
				isbind:function(data){
					info = data.info;//存储info中的信息
					this.$indexPage.show();
					console.log(data.cover.logo);
					this.$indexPage.html(template('indexPageTMP',data));
					this.erpid = data.info.erpid;
					this.isbindCheckTouch();
					if(!isShow){
						$('#myYuE').parent().hide();
						$('#hycz').parent().hide();
					}
					M.loadingHide();
//					data.info.language = '';
					if(!data.info.language){//language若为空，提示用户语言选择
						$('#languagePage').show();
						this.checkLanguage();
					}else{
						currentLanguage = data.info.language;
						group = $('.language');
						console.log('切换开始！');
						this.changeLanguage(currentLanguage,group);
					}
				},
				isbindCheckTouch:function(){
					var me = this;
					//卡券详情
					$('#cardDetail').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						$('.jdt').show();
						cardDetailPage.act.group = $(this).data('group');//当前会员等级名称
						cardDetailPage.act.desc = $(this).data('groupdesc');//当前会员等级权益
						cardDetailPage.act.exp = $(this).data('exp');//当前会员经验值
						cardDetailPage.act.nextgroup = $(this).data('nextgroup');//下一个会员等级名称
						cardDetailPage.act.nextgroupdesc = $(this).data('nextgroupdesc');//下一个会员等级权益
						cardDetailPage.act.nextgroupexp = $(this).data('nextgroupexp');//下一个等级需要的经验值
						cardDetailPage.act.detail = $(this).data('detail');
						me.out();
						cardDetailPage.act.init();
					});
					//我的积分
					$('#myJifen').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						jifenPage.act.init();
					});
					//我的消费
					$('#myXiaofei').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						xiaofeiPage.act.init();
					});
					//我的余额
					$('#myYuE').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						$('#cash').text($(this).data('cash'));
						yuePage.act.init();
					});
					//会员充值
					$('#hycz').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						hyczPage.act.init();
					});
					//积分商城
					$('#jifenMall').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						jifenMallPage.act.init();
					});
					//我的券
					$('#myCoupon').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						mycouponPage.act.init();
					});
					//个人信息
					$('#myinfo').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						//调用regcfg接口获取个人信息的字段名
						indexPage.data.regcfg(me.regcfgCb2.bind(this));
					});
					//邀请好友
					$('#invite').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						invitePage.act.init();
					});
					//展示ID条形码
					$('#IDbox').on(config.touch,function(evt){
						evt.preventDefault();
						$('#barcode').find('div').barcode(me.erpid,'code128',{
							barWidth: 2,
							barHeight: 85,
							output: 'bmp'
						});
						$('#barcode').toggleClass('hide');
					});
				},
				regcfgCb2 : function(data){
					req2 = data.cfg.require;
					other2 = data.cfg.other;
					console.log(JSON.stringify(req2));
					console.log(JSON.stringify(other2));
					console.log(JSON.stringify(info));
//					必填项
					for(var i=0;i<req2.length;i++){
						var BTcloumn = req2[i].cloumn;
						if(info[BTcloumn]){//根据require数组里面的字段名，获取info对象里面的属性值，若该值存在则赋给req2
							console.log('info[BTcloumn]: '+info[BTcloumn]);
							req2[i].value = info[BTcloumn];
							console.log('req2[i].value: '+req2[i].value);
						}
					}
//					选填项
					for(var j=0;j<other2.length;j++){
						var XTcloumn = other2[j].cloumn;//
						if(info[XTcloumn]){//根据other数组里面的字段名，获取info对象里面的属性值，若该值存在则赋给other2
							console.log('info[XTcloumn]: '+info[XTcloumn]);
							other2[j].value = info[XTcloumn];
						}
					}
					indexPage.act.out();
					infoPage.act.init();
				},
				nobind:function(data){
					this.$indexPageNoBind.show();
					this.$indexPageNoBind.html(template('indexPageNoBindTMP',data));
					this.nobindCheckTouch();
					if(!isShow){
						$('#myYuE').parent().hide();
						$('#hycz').parent().hide();
					}
					M.loadingHide();
					//未绑定用户都需要弹出语言选择框
					$('#languagePage').show();
					this.checkLanguage();
				},
				checkLanguage : function(){ 
					var me = this;
					//默认为中文
//					me.params = {
//						language : 'cn'
//					};
					$('#chinese').on(config.touch,function(evt){
						evt.preventDefault();
						M.loading();
						indexPage.data.setlanguage(me.params,me.setlanguageCb.bind(this));
					});
					$('#english').on(config.touch,function(evt){
						evt.preventDefault();
						M.loading();
						me.params.language = 'en';
						indexPage.data.setlanguage(me.params,me.setlanguageCb.bind(this));
					});
				},
				setlanguageCb:function(data){
//					var me = this;
					M.loadingHide();
					//记录选择的语言
					console.log(indexPage.act.params.language);
					currentLanguage = indexPage.act.params.language;
					//要在页面元素都准备好之后再切换语言
					group = $('.language');
					indexPage.act.changeLanguage(currentLanguage,group);
					changeAlert(data.error_msg);
					$('#languagePage').hide();
					$('#chinese').off();
					$('#english').off();
				},
				changeLanguage:function(language,group){//language当前语言版本，group要切换的文字
					console.log(JSON.stringify(languagePack));
					switch(language){
						case 'cn'://中文
							console.log('默认为中文，无需切换操作！');
							//网页标题
							$('title').text('微会员');
							//图片切换
							$('.sharePic').attr('src',__uri('../images/fx_img.png'));
							$('.usedPic').attr('src',__uri('../images/yishiyong.png'));
							$('.expiredPic').attr('src',__uri('../images/yiguoqi.png'));
							$('.yiduiwan').css('background-image','url('+__uri('../images/yiduiwan.png')+')');
							//按钮样式调整
							$('.getNow').css('letter-spacing','10px');
							$('.getNow').css('padding-left','10px');
							//改变分享信息
							config.shareInfo.title = indexPage.act.indexData.cover.share_title;
							config.shareInfo.desc = indexPage.act.indexData.cover.share_content;
							share(config.shareInfo,function(){
								changeAlert('分享成功');
							});
							break;
						case 'en'://英文
							//网页标题
							if(!languagePack['法派1855微会员']){
								$('title').text('微会员');
							}else{
								$('title').text(languagePack['法派1855微会员']);
							}
							for(var i=0;i<group.length;i++){
								//此时group[i]为js对象
								if(group[i].tagName == 'INPUT'){//若为input标签
									if(group[i].getAttribute('placeholder') != 'undefined' && group[i].getAttribute('placeholder') != ''){
										//placeholder属性存在且不为空,placeholder设置为中文
										var placeholder = group[i].getAttribute('placeholder');
										console.log(placeholder);
										placeholder = languagePack[placeholder];//此时placeholder已经转为英文
										console.log(placeholder);
										if(placeholder){//如果英文版存在
											group[i].setAttribute('placeholder',placeholder);
										}
									}
									if(group[i].value != 'undefined' && group[i].value != ''){
										//value属性存在且不为空,value设置为中文,应该改变val()
										var value = group[i].value;
										console.log(value);
										value = languagePack[value];//此时value已经转为英文
										console.log(value);
										if(value){//如果英文版存在
											group[i].value = value;
										}
									}
								}else{//非input标签
									var txt = group[i].innerHTML;
									console.log(txt);
									txt = languagePack[txt];
									console.log(txt);
									if(txt){
										group[i].innerHTML = txt;
									}
								}
							}
							//图片切换
							$('.sharePic').attr('src',__uri('../images/fx_img_en.png'));
							$('.usedPic').attr('src',__uri('../images/ydh.png'));
							$('.expiredPic').attr('src',__uri('../images/ygq.png'));
							$('.yiduiwan').css('background-image','url('+__uri('../images/ydw.png')+')');
							//按钮样式调整
							$('.getNow').css('letter-spacing','normal');
							$('.getNow').css('padding-left','0');
							//改变分享信息
							if(!languagePack[indexPage.act.indexData.cover.share_title]){
								config.shareInfo.title = indexPage.act.indexData.cover.share_title;
							}else{
								config.shareInfo.title = languagePack[indexPage.act.indexData.cover.share_title];
							}
							if(!languagePack[indexPage.act.indexData.cover.share_content]){
								config.shareInfo.desc = indexPage.act.indexData.cover.share_content;
							}else{
								config.shareInfo.desc = languagePack[indexPage.act.indexData.cover.share_content];
							}
							share(config.shareInfo,function(){
								changeAlert('分享成功');
							});
							break;
					}
				},
				nobindCheckTouch:function(){
					var me = this;
					//卡券详情
					$('#cardDetail2').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						$('.jdt').hide();
						cardDetailPage.act.desc = $(this).data('desc');
						cardDetailPage.act.detail = $(this).data('detail');
						me.out();
						cardDetailPage.act.init();
					});
					//邀请好友
					$('#invite2').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						invitePage.act.init();
					});
					//立即领取
					$('#getNowBtn').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						indexPage.data.regcfg(me.regcfgCb.bind(this));
					});
				},
				regcfgCb : function(data){
					$('#newcard').html(template('newcardTMP',data));
					var requireInfo = data.cfg.require;
					var otherInfo = data.cfg.other;
					BTaddressId = [];//初始化数组
					for(var i=0;i<requireInfo.length;i++){
						if(requireInfo[i].type == 'address'){
							BTaddressId.push(requireInfo[i].cloumn);
						}
					}
					XTaddressId = [];//初始化数组
					for(var i=0;i<otherInfo.length;i++){
						if(otherInfo[i].type == 'address'){
							XTaddressId.push(otherInfo[i].cloumn);
						}
					}
//					必填信息
					req = data.cfg.require;
					other = data.cfg.other;
					activeCardPage.act.init();
					indexPage.act.out();
				},
				out:function(){
					$('#cardDetail').off();
					$('#cardDetail2').off();
					$('#invite').off();
					$('#invite2').off();
					$('#myJifen').off();
					$('#myXiaofei').off();
					$('#myYuE').off();
					$('#hycz').off();
					$('#jifenMall').off();
					$('#myCoupon').off();
					$('#myinfo').off();
					$('#IDbox').off();
					$('#getNowBtn').off();
					this.$indexPageNoBind.hide();
					this.$indexPage.hide();
				}
			},
			data:{
				language:function(cb){
					post('member/language',null,cb);
				},
				get:function(cb){
					post('member/get',null,cb);
				},
				regcfg:function(cb){
					post('member/regcfg',null,cb);
				},
				setlanguage:function(params,cb){
					post('member/setlanguage',params,cb);
				}
			}
		}
		//会员卡详情
		var cardDetailPage = {
			act:{
				group:null,
				desc:null,
				nextgroup:null,
				nextgroupdesc:null,
				nextgroupexp:null,
				detail:null,
				exp:null,
				$dom:$('#cardDetailPage'),
				init:function(){
					$('#currentScore').text(this.exp);
					$('#currentGrade').text(this.group);
					$('#nextScore').text(this.nextgroupexp);
					$('#nextGrade').text(this.nextgroup);
					$('#nextgroupdesc').html(this.nextgroupdesc);
					$('#coverdesc').html(this.desc);
					console.log(this.detail)
					$('#coverdetail').text(this.detail);
					var style = document.getElementById("widthChange")
					var width = parseInt((this.exp/this.nextgroupexp)*100);
    				style.innerHTML = '@-webkit-keyframes widthChange{from {width:0;}to{width:'+width+'%} }\n'
             			+ '@keyframes widthChange{from {width:0;}to{width:'+width+'%} }\n'
             			+'@-webkit-keyframes marginLeft{from {left:-25px;}to{left:'+(width-9)+'%;} }\n'
             			+ '@keyframes marginLeft{from {left:-25px;}to{left:'+(width-9)+'%;}';
             			
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					M.loadingHide();
					this.$dom.show();
					this.checkTouch();
				},
				checkTouch:function(){
					var me = this;
					$('#cardDetailBack').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						indexPage.act.init();
					});
					$('#nextGradeBtn').on(config.touch,function(evt){
						evt.preventDefault();
						$('#nextGradePage').show();
						$('body').css('overflow','hidden');
					});	
					$('#closegradeBtn').on(config.touch,function(evt){
						evt.preventDefault();
						$('#nextGradePage').hide();
						$('body').css('overflow','auto');
					});
				},
				out:function(){
					$('#cardDetailBack').off();
					this.$dom.hide();
				}
			}
		}
		
		//积分商城
		var jifenMallPage = {
			act:{
				params:{
					page:1,
					limit:20
				},
				$dom:$('#jifenMallPage'),
				init:function(){
					this.params.page = 1;
					jifenMallPage.data.scoremallgoods(this.params,this.scoremallgoodsCb.bind(this));
				},
				scoremallgoodsCb:function(data){
					//如果没有有商品，隐藏“加载更多”
					if(data.goods.length == 0){
						$('#loadmore3').hide();
					}else{
						this.params.page++;
					}
					$('#jifenList').html(template('jifenListTMP',data));
					
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					this.$dom.show();
					this.checkTouch();
					M.loadingHide();
				},
				scoremallgoodsCb2:function(data){
					//如果没有有商品，隐藏“加载更多”
					if(data.goods.length == 0){
						M.loadingHide();
						changeAlert('没有更多');
					}else{
						$('#jifenList').append(template('jifenListTMP',data));
						this.params.page++;
						
	             		group = $('.language');
						console.log('切换开始！');
						indexPage.act.changeLanguage(currentLanguage,group);	
						
						M.loadingHide();
					}
				},
				checkTouch:function(){
					var me = this;
					//查看商品详情
					$('#jifenList li').on(config.click,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						exchangeDetailPage.act.params.id = $(this).data('id');//商品ID
						exchangeDetailPage.act.name = $(this).data('name');//商品名称
						exchangeDetailPage.act.descrip = $(this).data('descrip');//商品介绍
						exchangeDetailPage.act.score = $(this).data('score');//需要积分
						exchangeDetailPage.act.num = $(this).data('num');//库存数量
						exchangeDetailPage.act.expiredate = $(this).data('expiredate');//有效期至
						exchangeDetailPage.act.limit = $(this).data('limit');//是否达到某种限制
						exchangeDetailPage.act.limitreason = $(this).data('limitreason');//限制文字
						exchangeDetailPage.act.init();
					});
					//加载更多商品
					$('#loadmore3').on(config.touch,function(evt){
						
						jifenMallPage.data.scoremallgoods(me.params,me.scoremallgoodsCb2.bind(this));
					});	
					//返回首页
					$('#jifenMallPageBack').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						indexPage.act.init();
					});
				},
				out:function(){
					console.log('hide');
					$('#loadmore3').off();
					$('#jifenList li').off();
					$('#jifenMallPageBack').off();
					this.$dom.hide();
				}
			},
			data:{
				scoremallgoods:function(params,cb){
					post('member/scoremallgoods',params,cb);
				},
			}
		}
		
		//兑换详情
		var exchangeDetailPage = {
			act:{
				params:{
					id:null
				},
				name:null,
				descrip:null,
				score:null,
				num:null,
				expiredate:null,
				limit:null,
				limitreason:null,
				$dom:$('#exchangeDetailPage'),
				init:function(){
					$('#exchangeBtn').removeClass('exchanged');
					$('#goodsName').text(this.name);
					$('#goodsDescrip').html(this.descrip);
					$('#goodsScore').text(this.score);
					$('#goodsExpiredate').text(this.expiredate);
					if(this.num == 0){//库存为0
						$('#exchangeBtn').addClass('exchanged');
					}
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					this.$dom.show();
					this.checkTouch();
					M.loadingHide();
				},
				checkTouch:function(){
					var me = this;
					$('#exchangeBtn').on(config.click,function(evt){
						evt.preventDefault();
						if(me.num != 0){//还有库存
							if(me.limit == 1){//有限制，不能兑换
								changeAlert(me.limitreason);
							}else{
								M.loading();
								console.log(JSON.stringify(me.params));
								exchangeDetailPage.data.scoremallexchange(me.params,me.scoremallexchangeCb.bind(this));
							}
						}
					});
					$('#exchangeDetailBack').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						jifenMallPage.act.init();
					});
				},
				scoremallexchangeCb:function(data){
					M.loadingHide();
					changeAlert(data.error_msg);
				},
				out:function(){
					$('#exchangeBtn').off();
					$('#exchangeDetailBack').off();
					this.$dom.hide();
				}
			},
			data:{
				scoremallexchange:function(params,cb){
					post('member/scoremallexchange',params,cb);
				},
			}
		}
		
//		积分明细
		var jifenPage = {
			act:{
				params:{
					page:1,
					type:-1,//-1:所有日志,0:加积分日志,1:扣积分日志
					limit:20
				},
				allPageNum:1,//所有日志当前页码
				addPageNum:1,//加积分日志当前页码
				subPageNum:1,//减积分日志当前页码
				type:-1,//-1:所有日志,0:加积分日志,1:扣积分日志
				$dom:$('#jifenPage'),
				init:function(){
					this.params = {
						page:1,
						type:-1,//-1:所有日志,0:加积分日志,1:扣积分日志
						limit:20
					}
					this.allPageNum = 1;
					this.addPageNum = 1;
					this.subPageNum = 1;
					this.type = -1;
					jifenPage.data.scorelog(this.params,this.scorelogCb.bind(this));
				},
				scorelogCb:function(data){//首次进入积分详情页展示所有积分
					var me = this;
					$('#myjfList').html(template('myjfListTMP',data));
					if(!data.logs){//没有积分记录
						$('#loadmore').hide();
					}else{
						$('#loadmore').show();
					}
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					this.$dom.show();
					this.checkTouch();
					M.loadingHide();
				},
				scorelogCb2:function(data){//日志类型切换展示积分
					var me = this;
					$('#myjfList').html(template('myjfListTMP',data));
					if(!data.logs){//没有积分记录
						$('#loadmore').hide();
					}else{
						$('#loadmore').show();
					}
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					M.loadingHide();
				},
				scorelogCb3:function(data){//加载更多，再拉取数据展示
					var me = this;
					$('#myjfList').append(template('myjfListTMP',data));
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					M.loadingHide();
					if(!data.logs){//没有积分记录
						changeAlert('没有更多');
					}	
				},
				checkTouch:function(){
					var me = this;
					//日志类型切换
					$('.checkOut input[name="jifen"]').on('change',function(evt){
						M.loading();
						console.log('121');
						me.type = $(this).val();
						me.params.page = 1;//切换时只展示页码1的内容
						if(me.type == -1){ //所有日志
							me.params.type = -1;
						}else if(me.type == 0){ //加积分日志
							me.params.type = 0;
						}else{//减积分日志
							me.params.type = 1;
						}
						jifenPage.data.scorelog(me.params,me.scorelogCb2.bind(this));
					});
					//加载更多
					$('#loadmore').on(config.touch,function(){
						M.loading();
						if(me.type == -1){ //所有日志
							me.allPageNum++;
							me.params.page = me.allPageNum;
						}else if(me.type == 0){ //加积分日志
							me.addPageNum++;
							me.params.page = me.addPageNum;
						}else{//减积分日志
							me.subPageNum++;
							me.params.page = me.subPageNum;
						}
						jifenPage.data.scorelog(me.params,me.scorelogCb3.bind(this));
					});
					//积分明细返回
					$('#jifenBack').on(config.touch,function(){
						M.loading();
						me.out();
						indexPage.act.init();
					});
				},
				out:function(){
					$('.checkOut input[name="jifen"]').off();
					$('#loadmore').off();
					$('#jifenBack').off();
					this.$dom.hide();
				}
			},
			data:{
				scorelog:function(params,cb){
					post('member/scorelog',params,cb);
				},
			}
		}

//		消费明细
		var xiaofeiPage = {
			act:{
				params:{
					page:1,
					limit:20
				},
				$dom:$('#xiaofeiPage'),
				init:function(){
					this.params.page = 1;
					this.params.limit = 20;
					xiaofeiPage.data.myorders(this.params,this.myordersCb.bind(this));
				},
				myordersCb:function(data){
					var me = this;
//					var data2 = {
//						orders:[
//							{
//								datetime:'2016-05-20 15:30',
//								money:'1.00'
//							},
//							{
//								datetime:'2016-05-20 15:30',
//								money:'1.00'
//							},
//							{
//								datetime:'2016-05-20 15:30',
//								money:'1.00'
//							},
//						],
//					};
					$('#myxfList').html(template('myxfListTMP',data));
					if(!data.logs){//没有积分记录
						$('#loadmore2').hide();
					}else{
						$('#loadmore2').show();
					}
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					this.$dom.show();
					this.checkTouch();
					M.loadingHide();
				},
				myordersCb2:function(data){
					var me = this;
					$('#myxfList').append(template('myxfListTMP',data));
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					M.loadingHide();
					if(!data.orders){//没有积分记录
						changeAlert('没有更多');
					}
				},
				checkTouch:function(){
					var me = this;
					//加载更多
					$('#loadmore2').on(config.touch,function(){
						M.loading();
						me.params.page++;
						xiaofeiPage.data.myorders(this.params,this.myordersCb2.bind(this));
					});
					//积分明细返回
					$('#xiaofeiBack').on(config.touch,function(){
						M.loading();
						me.out();
						indexPage.act.init();
					});
				},
				out:function(){
					$('#loadmore2').off();
					$('#xiaofeiBack').off();
					this.$dom.hide();
				}
			},
			data:{
				myorders:function(params,cb){
					post('member/myorders',params,cb);
				},
			}
		}

//		余额明细
		var yuePage = {
			act:{
				params:{
					page:1,
					type:-1,//-1:所有,0:余额充值,1:余额消费
					limit:20
				},
				allPageNum:1,//所有消费当前页码
				addPageNum:1,//余额充值当前页码
				subPageNum:1,//余额消费当前页码
				type:-1,//-1:所有,0:余额充值,1:余额消费
				$dom:$('#yuePage'),
				init:function(){
					this.params = {
						page:1,
						type:-1,//-1:所有,0:余额充值,1:余额消费
						limit:20
					}
					this.allPageNum = 1;
					this.addPageNum = 1;
					this.subPageNum = 1;
					this.type = -1;
					yuePage.data.myconsume(this.params,this.myconsumeCb.bind(this));
				},
				myconsumeCb:function(data){
					var me = this;
//					var data2 = {
//						order :[
//							{
//								payscene:"301",
//								total_fee:"+100.00",
//								mem_type:"会员卡充值",
//								pay_time:'2016-05-20 15:30'
//							},
//							{
//						      payscene: "302",
//						      total_fee: "-10.00",
//						      mem_type: "会员卡消费",
//						      pay_time:'2016-05-20 15:30'
//						    }
//						],
//					};
					$('#myyeList').html(template('myyeListTMP',data));
					if(!data.order || data.order.length == 0){//没有消费记录
						$('#loadmore3').hide();
					}else{
						$('#loadmore3').show();
					}
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					this.$dom.show();
					this.checkTouch();
					M.loadingHide();
				},
				myconsumeCb2:function(data){//日志类型切换展示积分
					var me = this;
					$('#myyeList').html(template('myyeListTMP',data));
					if(!data.order || data.order.length == 0){//没有积分记录
						$('#loadmore3').hide();
					}else{
						$('#loadmore3').show();
					}
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					M.loadingHide();
				},
				myconsumeCb3:function(data){//加载更多，再拉取数据展示
					var me = this;
					$('#myyeList').append(template('myyeListTMP',data));
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					M.loadingHide();
					if(!data.order || data.order.length == 0){//没有积分记录
						changeAlert('没有更多');
					}	
				},
				checkTouch:function(){
					var me = this;
					//日志类型切换
					$('.checkOut input[name="yue"]').on('change',function(evt){
						M.loading();
						me.type = $(this).val();
						me.params.page = 1;//切换时只展示页码1的内容
						if(me.type == -1){ //所有日志
							me.params.type = -1;
						}else if(me.type == 0){ //加积分日志
							me.params.type = 0;
						}else{//减积分日志
							me.params.type = 1;
						}
						yuePage.data.myconsume(me.params,me.myconsumeCb2.bind(this));
					});
					//加载更多
					$('#loadmore3').on(config.touch,function(){
						M.loading();
						if(me.type == -1){ //所有日志
							me.allPageNum++;
							me.params.page = me.allPageNum;
						}else if(me.type == 0){ //加积分日志
							me.addPageNum++;
							me.params.page = me.addPageNum;
						}else{//减积分日志
							me.subPageNum++;
							me.params.page = me.subPageNum;
						}
						yuePage.data.myconsume(me.params,me.myconsumeCb3.bind(this));
					});
					//我的余额返回
					$('#yueBack').on(config.touch,function(){
						M.loading();
						me.out();
						indexPage.act.init();
					});
				},
				out:function(){
					$('.checkOut input[name="yue"]').off();
					$('#loadmore3').off();
					$('#yueBack').off();
					this.$dom.hide();
				}
			},
			data:{
				myconsume:function(params,cb){
					post('member/myconsume',params,cb);
				},
			}
		}

//		会员充值
		var hyczPage = {
			act:{
				$dom:$('#hyczPage'),
				init:function(){
					hyczPage.data.recharge(this.rechargeCb.bind(this));
				},
				rechargeCb:function(data){
//					var data2 = {
//						data:[
//							{
//								id :'1',
//								combo_name :'充值100元赠10元',
//								total_fee : '100'
//							},
//							{
//								id :'2',
//								combo_name :'充值200元赠20元',
//								total_fee : '200'
//							},
//							{
//								id :'3',
//								combo_name :'充值300元赠30元',
//								total_fee : '300'
//							},
//						],
//					}
					$('#hyczPage').html(template('hyczTMP',data));
					$('#recharge li:first-child').addClass('active');
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					this.$dom.show();
					this.checkTouch();
					M.loadingHide();
				},
				checkTouch:function(){
					var me = this;
					//选择充值金额
					$('#recharge li').on(config.touch,function(){
						M.loading();
						$('#recharge li').removeClass('active');
						$(this).addClass('active');
						$('#rechargeTip').text($(this).data('name'));
						
						group = $('.language');
						indexPage.act.changeLanguage(currentLanguage,group);
						
						M.loadingHide();
					});	
					//会员充值返回
					$('#hyczBack').on(config.touch,function(){
						M.loading();
						me.out();
						indexPage.act.init();
					});
					//确定
					$('#qd').on(config.touch,function(){
						M.loading();
						var params = {
							money : $('#recharge li.active').data('money'),
							shopid : 0,
							type : 2	
						}
						hyczPage.data.getjsapiparams(params,me.getjsapiparamsCb.bind(me));
					});
				},
				getjsapiparamsCb : function(data){
					var me = this;
					wxshare.chooseWXPay(data.params,function(res){//支付成功的回调
						M.loadingHide();
						changeAlert('充值成功');
					});
				},
				out:function(){
					$('#recharge li').off();
					$('#hyczBack').off();
					$('#qd').off();
					this.$dom.hide();
				}
			},
			data:{
				recharge:function(cb){
					post('member/recharge',null,cb);
				},
				getjsapiparams:function(params,cb){
					post('wxpay/getjsapiparams',params,cb);
				},
			}
		}

		//激活会员卡
		var activeCardPage = {
			act:{
				$dom:$('#activeCardPage'),
				mobiscroll:null,
				cardType:0, //0表示领取新卡，1表示绑定实体卡
				check : null,
				invite : null,
				init:function(){
					M.loading();
					var me = this;
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
//					require([__uri('../js/mobiscroll.custom-2.16.1.min')],function(){
//			}
						M.loadingHide();
						me.$dom.show();
						me.checkTouch();
//					});
					
				},
				checkTouch:function(){
					var me = this;
//					必填的地区选择
					BTselectArea = [];
					for(var i=0;i<BTaddressId.length;i++){
						BTselectArea[i] = new MobileSelectArea();
						var id = '#'+BTaddressId[i];
						var hidden = $(id+'Hidden');
						BTselectArea[i].init({trigger:id,value:hidden.val(),data:'data.json',eventName:'click'});
					}
//					选填的地区选择
					XTselectArea = [];
					for(var i=0;i<XTaddressId.length;i++){
						XTselectArea[i] = new MobileSelectArea();
						var id = '#'+XTaddressId[i];
						var hidden = $(id+'Hidden');
						XTselectArea[i].init({trigger:id,value:hidden.val(),data:'data.json',eventName:'click'});
					}
					//返回
					$('#activeCardBack').on(config.touch,function(evt){
						evt.preventDefault();
						me.out();
						indexPage.act.init();
					});
					//获取短信验证码
					$('.rightCheckBtn').on(config.touch,function(evt){
						evt.preventDefault();
						var englishVer = languagePack['获取验证码'];
						if($(this).text() == '获取验证码' || $(this).text() == englishVer){
							var id = $(this).data('id');
							var tel = $('#'+id).val();
							me.check = $('#'+id+'Check');
							if(!tel){//tel为空
								changeAlert('请输入手机号');
							}else{
								M.loading();
								activeCardPage.data.smsmessage(tel,me.smsmessageCb.bind(this));
							}
						}
					});	
					//选择实体卡还是新卡
//					$('.checkOut input[name="card"]').on('change',function(evt){
//						console.log('121');
//						var val = $(this).val();
//						if(val==0){ //领取新卡
//							me.cardType = 0;
//							$('.chooseinfo').hide();
//							$('#newcard').show();
//						}else{ //绑定实体卡
//							me.cardType = 1;
//							$('.chooseinfo').hide();
//							$('#stcard').show();
//						}
//					});
					//生日
//					$('#chooseDate').mobiscroll().date({
//	                    theme:  $.mobiscroll.defaults.theme, 
//	                    mode: 'scroller',
//	                    display: 'bottom',
//	                    lang: 'zh'
//	                });
	                //确定按钮
	                $('#activeCradConfirm').on(config.touch,function(evt){
	                	me.cardType = 0;//领取新卡
	                	evt.preventDefault();
	                	me.cardType==0 ? me.newCard() : me.bindCard();
	                });
				},
				newCard:function(){
					var params={
						invite : this.invite
					};
//					必填信息
					if(req){
						for(var i=0;i<req.length;i++){
							var type = req[i].type;//input的类型
							var cloumn = req[i].cloumn;//input的字段名，即id名称
							var title = req[i].title;//input的字段描述，即标签名
							switch(type){
								case 'textarea': 
									if(!$('#'+cloumn).text()){
										changeAlert('请输入'+title);
										return;
									}else{
										params[cloumn] = $('#'+cloumn).text();
									}
									break;
								case 'tel': 
									if(cloumn == 'mobile'){//有验证码
										console.log($('#'+cloumn+'Code').val());
										if(!$('#'+cloumn).val()){
											changeAlert('请输入'+title);
											return;
										}else if(!(new RegExp("^0?(13|15|18|14|17)[0-9]{9}$").test($('#'+cloumn).val()))){
											changeAlert('请输入正确的手机号');
											return;
										}else if(!$('#'+cloumn+'Code').val()){
											changeAlert('请输入手机验证码');
											return;
										}else{
											params[cloumn] = $('#'+cloumn).val();
											params.verifycode = $('#'+cloumn+'Code').val();
										}
									}else{//没有验证码
										if(!$('#'+cloumn).val()){
											changeAlert('请输入'+title);
											return;
										}else if(!(new RegExp("^0?(13|15|18|14|17)[0-9]{9}$").test($('#'+cloumn).val()))){
											changeAlert('请输入正确的手机号');
											return;
										}else{
											params[cloumn] = $('#'+cloumn).val();
										}
									}
									break;
								case 'radio': 
									if(!$('input[name='+cloumn+']:checked').val()){
										changeAlert('请输入'+title);
										return;
									}else{
										params[cloumn] = $('input[name='+cloumn+']:checked').val();
									}
									break;
								case 'checkbox': 
									var checkboxValue = [];
									$('input[name='+cloumn+']:checked').each(function(){
										checkboxValue.push($(this).val());
									});
									if(!checkboxValue){
										changeAlert('请输入'+title);
										return;
									}else{
										params[cloumn] = checkboxValue;
									}
									break;
								case 'address': 
									if(!$('#'+cloumn).val()){
										changeAlert('请选择省市区');
										return;
									}else if(!$('#'+cloumn+'Detail').val()){
										changeAlert('请输入详细地址信息');
										return;
									}else if($('#'+cloumn+'Detail').val().indexOf("|") > 0){//详细地址中不允许含有特殊字符"&",因为"&"要作为分隔符
										changeAlert('详细地址信息中不允许含有特殊字符');
										return;
									}else{
										params[cloumn] = $('#'+cloumn).val() + '|' + $('#'+cloumn+'Detail').val();
									}
									break;
								case 'img': 
									break;
								default :
									if(!$('#'+cloumn).val()){
										changeAlert('请输入'+title);
										return;
									}else{
										params[cloumn] = $('#'+cloumn).val();
									}
							}
						}
					}
//					选填信息
					if(other){
						for(var i=0;i<other.length;i++){
							var type = other[i].type;//input的类型
							var cloumn = other[i].cloumn;//input的字段名，即id名称
							var title = other[i].title;//input的字段描述，即标签名
							switch(type){
								case 'textarea': 
									params[cloumn] = $('#'+cloumn).text();
									break;
								case 'tel': 	
									if(cloumn == 'mobile'){//有验证码
										params[cloumn] = $('#'+cloumn).val();
										params.verifycode = $('#'+cloumn+'Code').val();
									}else{//没有验证码
										params[cloumn] = $('#'+cloumn).val();
									}
									break;
								case 'radio': 
									params[cloumn] = $('input[name='+cloumn+']:checked').val();
									break;
								case 'checkbox': 
									var checkboxValue = [];
									$('input[name='+cloumn+']:checked').each(function(){
										checkboxValue.push($(this).val());
									});
									params[cloumn] = checkboxValue;
									break;
								case 'address': 
									if($('#'+cloumn+'Detail').val().indexOf("|") > 0){
										changeAlert('详细地址信息中不允许含有特殊字符');
										return;
									}else{
										params[cloumn] = $('#'+cloumn).val() + '|' +$('#'+cloumn+'Detail').val();
									}
									break;
								case 'img': 
									break;
								default:
									params[cloumn] = $('#'+cloumn).val();
							}
						}
					}
					M.loading();
					console.log(JSON.stringify(params));
					activeCardPage.data.register(params,activeCardPage.act.registerCb.bind(this));

				},
				registerCb:function(){
					M.loadingHide();
					changeAlert('成功激活会员卡');
					M.loading();
					this.out();
					indexPage.act.init();
				},
				smsmessageCb:function(){
					var me = this;
					M.loadingHide();
					changeAlert('验证码发送成功');
					activeCardPage.act.countSec(60);
				},
				countSec : function(sec){//验证码倒计时
					var me = this;
					var myInterval = setInterval(function(){
						if(sec > 0){
							sec--;
							me.check.text(sec+'s');
						}else{
							clearInterval(myInterval);
							if(currentLanguage == 'cn'){
								me.check.text('获取验证码');
							}else{
								var englishVer = languagePack['获取验证码'];
								me.check.text(englishVer);
							}
						}
					},1000);
				},
				bindCard:function(){
					var memberid = $('#cardNum').val();
					var mobile = $('#cardTel').val();
					if(!memberid){
						changeAlert('请输入您的姓名');
						return;
					}else if(!(new RegExp("^0?(13|15|18|14|17)[0-9]{9}$").test(mobile))){
						changeAlert('请输入正确的手机号码');
						return;
					}
					activeCardPage.data.bind(memberid,mobile,this.bindCb.bind(this));
				},
				bindCb:function(){
					M.loadingHide();
					this.out();
					indexPage.act.init();
				},
				out:function(){
					$('#activeCardBack').off();
					$('.rightCheckBtn').off();
					$('#activeCradConfirm').off();
					this.$dom.hide();
				}
			},
			data:{
				register:function(params,cb){
					post('member/register',params,cb);
				},
				bind:function(memberid,mobile,cb){
					post('member/bind',{
						memberid:memberid,
						mobile:mobile
					},cb);
				},
				smsmessage:function(tel,cb){
					post('member/smsmessage',{
						mobile : tel
					},cb);
				}
			}
		}
		//我的卡券
		var mycouponPage = {
			act:{
				$dom:$('#mycouponPage'),
				init:function(){
					this.$dom.show();
					mycouponPage.data.getCoupon(this.getCouponCb.bind(this));
				},
				getCouponCb:function(data){
					$('#canUse').html(template('quanList1',data));
					$('#isUsed').html(template('quanList2',data));
					$('#isOver').html(template('quanList3',data));
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					this.checkTouch();
					M.loadingHide();
				},
				checkTouch:function(){
					var me = this;
					//查看券详情
					$('#canUse .counp').on(config.click,function(){
						var isnet = $(this).data('isnet');
						var isget = $(this).data('isget');
						var geturl = $(this).data('geturl');
						var useurl = $(this).data('useurl');
						if(isnet == 0){//线下券，直接跳转到券详情页
							M.loading();
							couponinfoPage.act.logo = $(this).data('logo');
							couponinfoPage.act.name = $(this).data('name');
							couponinfoPage.act.qname = $(this).data('qname');
							couponinfoPage.act.limitmoney = $(this).data('limitmoney');
							couponinfoPage.act.starttime = $(this).data('starttime');
							couponinfoPage.act.endtime = $(this).data('endtime');
							couponinfoPage.act.showtype = $(this).data('showtype');
							couponinfoPage.act.code = $(this).data('code');
							qdetailPage.act.descrip = $(this).data('descrip');
							publicnumPage.act.wxname = $(this).data('wxname');
							publicnumPage.act.wxqrcodeurl = $(this).data('wxqrcodeurl');
							me.out();
							couponinfoPage.act.init();
						}else{//线上券，跳转到线上券的领取或者使用页面
							if(isget == 0){//跳转到线上领取页面
								gotoUrl(geturl);
							}else{//跳转到线上使用页面
								gotoUrl(useurl);
							}
						}
					});
					//可使用
					$('#canUseBtn').on(config.touch,function(){
						$('.mycou-box1').removeClass('active');
						$(this).addClass('active');
						$('.couponItemNav').hide();
						$('#canUse').show();
					});
					//已使用
					$('#isUsedBtn').on(config.touch,function(){
						$('.mycou-box1').removeClass('active');
						$(this).addClass('active');
						$('.couponItemNav').hide();
						$('#isUsed').show();
					});
					//已过期
					$('#isOverBtn').on(config.touch,function(){
						$('.mycou-box1').removeClass('active');
						$(this).addClass('active');
						$('.couponItemNav').hide();
						$('#isOver').show();
					});
					//返回
					$('#mycouponPageBack').on(config.touch,function(){
						M.loading();
						me.out();
						indexPage.act.init();
					});
				},
				out:function(){
					$('#canUseBtn').off();
					$('#isUsedBtn').off();
					$('#isOverBtn').off();
					$('#mycouponPageBack').off();
					$('#canUse .counp').off();
					this.$dom.hide();
				}

			},
			data:{
				getCoupon:function(cb){
					post('member/mycoupon',null,cb)
				}
			}
		}
		//券详情页面
		var couponinfoPage = {
			act:{
				logo:null,
				name:null,
				qname:null,
				limitmoney:null,
				starttime:null,
				endtime:null,
				showtype:null,
				code:null,
				$dom:$('#couponinfoPage'),
				init:function(){
					var me = this;
//					$("#qinfoimg").html("<div class='m-auto'></div>");
					$('#qinfologo').attr('src',me.logo);
					$('#qinfoname').html(me.name);
					$('#qinfoqname').html(me.qname);
					if(me.limitmoney == 0){
						$('#qinfolimitmoney').html('使用条件不限');
					}else{
						$('#qinfolimitmoney').html('满'+me.limitmoney+'元可使用');
					}
					$('#qinfostarttime').html(me.starttime);
					$('#qinfoendtime').html(me.endtime);
					$('#qinfocode').html(me.code);
					var showtype = parseInt(me.showtype);
					console.log('showtype: '+showtype);
//					showtype = 3;
					switch(showtype){
						case 1://条形码
							me.code = me.code.toString();
							//barcode函数的第一参数类型必须为字符串
							$('#qinfoimg').find('div').barcode(me.code,'code128',{
								barWidth: 2,
								barHeight: 85,
								output: 'bmp'
							});
							break;
						case 2://二维码	
							require(['qrcode'],function(qrcode){
								$('#qinfoimg').find('div').qrcode({width: 140,height: 140,text: me.code});
							});	
							break;
						default://券号展示
							$('#qinfoimg').hide();
					}
	
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
										
					me.$dom.show();
					M.loadingHide();
					$('#couponinfoBack').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						mycouponPage.act.init();
					});
					$('#qDetail').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						qdetailPage.act.init();
					});
					$('#publicNum').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						publicnumPage.act.init();
					});
				},
				out:function(){
					$('#couponinfoBack').off();
					$('#qDetail').off();
					$('#publicNum').off();
					this.$dom.hide()
				}
			},
			data:{

			}
		}
		//优惠券详情文字说明页面
		var qdetailPage = {
			act:{
				$dom:$('#qdetailPage'),
				init:function(){
					var me = this;
					$('#qinfodescrip').html(this.descrip);
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					this.$dom.show();
					M.loadingHide();
					$('#qdetailBack').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						couponinfoPage.act.init();
					});
				},
				out:function(){
					$('#qdetailBack').off();
					this.$dom.hide()
				}
			},
			data:{

			}
		}
		//查看公众号页面
		var publicnumPage = {
			act:{
				wxname:null,
				wxqrcodeurl:null,
				$dom:$('#publicnumPage'),
				init:function(){
					var me = this;
					$('#qinfowxname').html(me.wxname);
					//公众号二维码
					console.log(me.wxqrcodeurl);
					$('#qinfowxqrcodeurl').css('height','140px');
					$('#qinfowxqrcodeurl').css('width','140px');
					$('#qinfowxqrcodeurl').html('<img src="'+me.wxqrcodeurl+'" class="wh-100" />');
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					me.$dom.show();
					M.loadingHide();
					$('#publicnumBack').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						couponinfoPage.act.init();
					});
				},
				out:function(){
					$('#publicnumBack').off();
					this.$dom.hide()
				}
			},
			data:{

			}
		}
		//邀请好友页面
		var invitePage = {
			act:{
				$dom:$('#invitePage'),
				init:function(){
					var me = this;
					invitePage.data.invitepage(me.invitepageCb.bind(this));
				},
				invitepageCb:function(data){
					var me = this;
					$('#invitenum').text(data.invitenum);
					$('#invitescore').text(data.invitescore);
					$('#score').text(data.score);
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					me.$dom.show();
					M.loadingHide();
					$('#inviteBack').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						indexPage.act.init();
					});
					$('#inviteBtn').on(config.touch,function(evt){
						evt.preventDefault();
						$('#sharePage').show();
					});
					$('#sharePage').on(config.touch,function(evt){
						evt.preventDefault();
						$(this).hide();
					});
				},
				out:function(){
					$('#inviteBack').off();
					$('#inviteBtn').off();
					$('#sharePage').off();
					this.$dom.hide()
				}
			},
			data:{
				invitepage:function(cb){
					post('member/invitepage',null,cb)
				}
			}
		}
		//个人信息页面
		var infoPage = {
			act:{
				$dom:$('#infoPage'),
				init:function(){
					var me = this;
					this.$dom.show();
					if(concatTimes == 0){
						req2 = req2.concat(other2);//将必填和选填的两个数组合并,仅第一次进入会员信息页面的时候将数组合并
						concatTimes++;
					}
					//去掉req2中的value为空的对象
					console.log(JSON.stringify(req2))
					for(var k=0;k<req2.length;k++){
						if(!req2[k].value){
							req2.splice(k,1);
							k=k-1;
						}
					}
					var data = {
							require : req2,
					};
					console.log(JSON.stringify(data.require));
					$('#changeList').html(template('changeListTMP',data));
					//个人信息中显示当前语言版本
					if(currentLanguage == 'cn'){//中文
						$('#lvTit').text('语言');
						$('#lvVal').text('中文');
					}else{//英文
						$('#lvTit').text('Language');
						$('#lvVal').text('English');
					}
					for(var i=0;i<data.require.length;i++){
						if(data.require[i].type == 'address'){//当字段类型为地址时,对地址进行拼接,去掉‘|’和空格
            				var str = data.require[i].value.split('|');
            				var str0=[],str1="";
            				str0 = str[0].split(' ');
            				for(var j=0;j<str0.length;j++){
            					str1 = str1.concat(str0[j]);
            				}
            				str1 = str1.concat(str[1]);
            				if($('#address'+data.require[i].cloumn)){
            					$('#address'+data.require[i].cloumn).text(str1);
            				}
						}
					}
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					M.loadingHide();
					//返回
					$('#infoPageBack').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						indexPage.act.init();
					});
					//更改
					$('#changeList li').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						changeInfoPage.act.init();
					});
				},
				out:function(){
					$('#infoPageBack').off();
					$('#changeList li').off();
					this.$dom.hide()
				}
			},
			data:{

			}
		}
		
		//修改个人信息页面
		var changeInfoPage = {
			act:{
				$dom:$('#changeInfoPage'),
				init:function(){
					var me = this;
					var data = {
							cfg:{
								require : req2,
							}
					};
					$('#changeInfoList').html(template('changeInfoListTMP',data));
					//地区选择初始化
					me.$dom.show();
					addressId = [];//初始化数组
					var requireInfo = data.cfg.require;
					for(var i=0;i<requireInfo.length;i++){
						if(requireInfo[i].type == 'address'){
							addressId.push(requireInfo[i].cloumn);
						}
					}
					selectArea = [];//初始化数组
					console.log('addressId: '+addressId);
					for(var i=0;i<addressId.length;i++){
						selectArea[i] = new MobileSelectArea();
						var id = '#'+addressId[i];
						var hidden = $(id+'Hidden');
						selectArea[i].init({trigger:id,value:hidden.val(),data:'data.json',eventName:'click'});
					}
					//初始化语言选择
					if(currentLanguage == 'cn'){//中文
						$('#languageVersion').text('语言');
						$('#labelCN').text('中文');
						$('#labelEN').text('英文');
						$('#CN').attr('checked','checked');
						$('#EN').removeAttr('checked');
					}else{//英文
						$('#languageVersion').text('Language');
						$('#labelCN').text('Chinese');
						$('#labelEN').text('English');
						$('#CN').removeAttr('checked');
						$('#EN').attr('checked','checked');
					}
						
             		group = $('.language');
					console.log('切换开始！');
					indexPage.act.changeLanguage(currentLanguage,group);	
					
					M.loadingHide();
					//返回上一页
					$('#changeInfoPageBack').on(config.touch,function(evt){
						M.loading();
						evt.preventDefault();
						me.out();
						infoPage.act.init();
					});
					//修改信息确定按钮
					$('#changeConfirm').on(config.touch,function(evt){
						evt.preventDefault();
						me.getparams();
					});
				},
				getparams : function(){
					var params={};
					if(req2){
						for(var i=0;i<req2.length;i++){
							var type = req2[i].type;//input的类型
							var cloumn = req2[i].cloumn;//input的字段名，即id名称
							var title = req2[i].title;//input的字段描述，即标签名
							switch(type){
								case 'textarea': 
									if(!$('#'+cloumn).text()){
										changeAlert('请输入'+title);
										return;
									}else{
										params[cloumn] = $('#'+cloumn).text();
									}
									break;
								case 'tel': 
									if(cloumn == 'mobile'){//有验证码
										console.log($('#'+cloumn+'Code').val());
										if(!$('#'+cloumn).val()){
											changeAlert('请输入'+title);
											return;
										}else if(!(new RegExp("^0?(13|15|18|14|17)[0-9]{9}$").test($('#'+cloumn).val()))){
											changeAlert('请输入正确的手机号');
											return;
//										}else if(!$('#'+cloumn+'Code').val()){
//											M.alert('请输入手机验证码！');
//											return;
										}else{
											params[cloumn] = $('#'+cloumn).val();
//											params.verifycode = $('#'+cloumn+'Code').val();
										}
									}else{//没有验证码
										if(!$('#'+cloumn).val()){
											changeAlert('请输入'+title);
											return;
										}else if(!(new RegExp("^0?(13|15|18|14|17)[0-9]{9}$").test($('#'+cloumn).val()))){
											changeAlert('请输入正确的手机号');
											return;
										}else{
											params[cloumn] = $('#'+cloumn).val();
										}
									}
									break;
								case 'radio': 
									if(!$('input[name='+cloumn+']:checked').val()){
										changeAlert('请输入'+title);
										return;
									}else{
										params[cloumn] = $('input[name='+cloumn+']:checked').val();
									}
									break;
								case 'checkbox': 
									var checkboxValue = [];
									$('input[name='+cloumn+']:checked').each(function(){
										checkboxValue.push($(this).val());
									});
									if(!checkboxValue){
										changeAlert('请输入'+title);
										return;
									}else{
										params[cloumn] = checkboxValue;
									}
									break;
								case 'address': 
									if(!$('#'+cloumn).val()){
										changeAlert('请选择省市区');
										return;
									}else if(!$('#'+cloumn+'Detail').val()){
										changeAlert('请输入详细地址信息');
										return;
									}else if($('#'+cloumn+'Detail').val().indexOf("|") > 0){//详细地址中不允许含有特殊字符"&",因为"&"要作为分隔符
										changeAlert('详细地址信息中不允许含有特殊字符');
										return;
									}else{
										params[cloumn] = $('#'+cloumn).val() + '|' + $('#'+cloumn+'Detail').val();
									}
									break;
								case 'img': 
									break;
								default :
									if(!$('#'+cloumn).val()){
										changeAlert('请输入'+title);
										return;
									}else{
										params[cloumn] = $('#'+cloumn).val();
									}
							}
						}
					}
					M.loading();
					params.language = $('input[name=languageVersion]:checked').attr('value');
					console.log(JSON.stringify(params));
					changeInfoPage.data.update(params,this.updateCb.bind(this));

				},	
				updateCb:function(){
					M.loadingHide();
					changeAlert('会员信息更新成功');
//					M.loading();
//					this.out();
//					indexPage.act.init();
					window.location.reload();
				},	
				out:function(){
					$('#changeInfoPageBack').off();
					$('#changeConfirm').off();
					this.$dom.hide()
				}
			},
			data:{
				update:function(params,cb){
					post('member/update',params,cb)
				}
			}
		}
		
		function defaultError(data){
			M.loadingHide();
            var err = data.error - 0;
            switch(err){
                case 1002:
                    M.loadingHide();
                    oAuth.clear();
//                  M.alert('你的身份信息已过期，点击确定刷新页面',function(){
//                      window.location.reload();
//                  });
                    if(currentLanguage == 'cn'){
						M.alert('你的身份信息已过期，点击确定刷新页面',function(){
	                        window.location.reload();
	                    });
					}else{
						if(!languagePack['你的身份信息已过期，点击确定刷新页面']){
							M.alert('你的身份信息已过期，点击确定刷新页面',function(){
		                        window.location.reload();
		                    });
						}else{
							M.alert(languagePack['你的身份信息已过期，点击确定刷新页面']);
						}
					}
                    break;
                default:
                    //M.alert(JSON.stringify(data));
                    if(currentLanguage == 'cn'){
						M.showToast(data.error_msg);
					}else{
						if(!languagePack[data.error_msg]){
							M.showToast(data.error_msg);
						}else{
							M.showToast(languagePack[data.error_msg]);
						}
					}
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
			wxshare.initWx(shareInfo,config.gameid,config.apiopenid,config.apitoken,succCb,null,null,null,function(wx){
				wx.hideOptionMenu();
			});
		}
		
		var router = null;

		check(oAuth,function(){
			M.loading();
			$('.loading-font').addClass('language');
//			Q.reg([
//				['home',function(){
//					indexPage.act.init();
//				}],
//				['carddetail',function(){
//					cardDetailPage.act.init();
//				}],
//				['myjifen',function(){
//					jifenPage.act.init();
//				}],
//				['myxiaofei',function(){
//					xiaofeiPage.act.init();
//				}],
//				['activecard',function(){
//					activeCardPage.act.init();
//				}],
//				['couponlist',function(){
//					mycouponPage.act.init();
//				}],
//				['infopage',function(){
//					infoPage.act.init();
//				}],
//				['jifenMall',function(){
//					jifenMallPage.act.init();
//				}],
//				['exchangeDetail',function(){
//					exchangeDetailPage.act.init();
//				}],
//				['couponinfo',function(){
//					couponinfoPage.act.init();
//				}],
//				['qdetail',function(){
//					qdetailPage.act.init();
//				}],
//				['publicnum',function(){
//					publicnumPage.act.init();
//				}],
//				['changeInfo',function(){
//					changeInfoPage.act.init();
//				}],
//			]);
//			Q.init({
//				index:'home'
//			});
			var imgs = [
				__uri('../images/card.jpg'),
				__uri('../images/defaultPic.png'),
				__uri('../images/faapi.jpg'),
				__uri('../images/face.jpg'),
				__uri('../images/fx_img.png'),
				__uri('../images/fx_img_en.png'),
				__uri('../images/gm.png'),
				__uri('../images/ico_back.png'),
				__uri('../images/ico_close.png'),
				__uri('../images/ico_down.png'),
				__uri('../images/ico_go.png'),
				__uri('../images/ico_pa.png'),
				__uri('../images/kong.png'),
				__uri('../images/quan_bg.png'),
				__uri('../images/quan1.png'),
				__uri('../images/quan2.png'),
				__uri('../images/quanbg.png'),
				__uri('../images/ydw.png'),
				__uri('../images/ygq.png'),
				__uri('../images/ydh.png'),
				__uri('../images/yiduiwan.png'),
				__uri('../images/yiguoqi.png'),
				__uri('../images/yishiyong.png'),
			];
			M.imgpreload(imgs,function(){
				//会员卡分享，邀请好友
				config.shareInfo.link = config.htmlUrl + 'index.html?uid='+config.uid+'&invite='+config.apiopenid;
				share(config.shareInfo,function(){
					changeAlert('分享成功');
				});
				//设置invite的值
				if(!getUrlParam().invite){
					activeCardPage.act.invite = ''; 
				}else{
					if(getUrlParam().invite == config.apiopenid){//从自己的分享链接点进来
						activeCardPage.act.invite = '';
					}else{
						activeCardPage.act.invite = getUrlParam().invite; 
					}
				}
				console.log('activeCardPage.act.invite: '+activeCardPage.act.invite);
				indexPage.act.init();
			});
		});
		
		
		
	}
	

}());
