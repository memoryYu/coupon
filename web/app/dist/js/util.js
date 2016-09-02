(function(global,factory){
	var jq = 'zepto'; //用于判断需要加载zepto或者jquery
	if(typeof(useJQ)!=='undefined') jq = 'jquery'; //useJQ为自定义全局变量，如果需要页面强制引用jquery设置在requirejs之前设置此变量为true
	else if(typeof(useZepto)!=='undefined') jq = 'zepto'; //useZepto为自定义全局变量，如果需要页面强制引用zepto设置在requirejs之前设置此变量为true

	if(typeof define === 'function' && define.amd){
		define([jq],function($){
			return factory($,global);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		module.exports = factory(require(jq),global);
	}else{
		global.M = factory($,global);
	}
}(typeof window !== 'undefined' ? window : this,function($, window, undefined){
	var APIBASE = (function(){
		var url = '';
		if(typeof PLATFORM === 'undefined') return 'http://ng.letwx.com/api/jsapi';
		switch(PLATFORM){
			case 'ng':
				url = 'http://ng.letwx.com/api/jsapi';
				break;
			case 'fumao':
				url = 'http://fumao.letwx.com/api/jsapi';
				break;
			case 'lppz':
				url = 'http://lppz.letwx.com/api/jsapi';
				break;
			case 'q':
				url = 'http://q.letwx.com/api/jsapi';
				break;
		}
		return url;
	}());

	(function( window ) {
		var Tap = {};

		var utils = {};

		utils.attachEvent = function(element, eventName, callback) {
			if ('addEventListener' in window) {
				return element.addEventListener(eventName, callback, false);
			}
		};

		utils.fireFakeEvent = function(e, eventName) {
			if (document.createEvent) {
				return e.target.dispatchEvent(utils.createEvent(eventName));
			}
		};

		utils.createEvent = function(name) {
			if (document.createEvent) {
				var evnt = window.document.createEvent('HTMLEvents');

				evnt.initEvent(name, true, true);
				evnt.eventName = name;

				return evnt;
			}
		};

		utils.getRealEvent = function(e) {
			if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length) {
				return e.originalEvent.touches[0];
			} else if (e.touches && e.touches.length) {
				return e.touches[0];
			}

			return e;
		};

		var eventMatrix = [{
			// Touchable devices
			test: ('propertyIsEnumerable' in window || 'hasOwnProperty' in document) && (window.propertyIsEnumerable('ontouchstart') || document.hasOwnProperty('ontouchstart') || window.hasOwnProperty('ontouchstart')),
			events: {
				start: 'touchstart',
				move: 'touchmove',
				end: 'touchend'
			}
		}, {
			// IE10
			test: window.navigator.msPointerEnabled,
			events: {
				start: 'MSPointerDown',
				move: 'MSPointerMove',
				end: 'MSPointerUp'
			}
		}, {
			// Modern device agnostic web
			test: window.navigator.pointerEnabled,
			events: {
				start: 'pointerdown',
				move: 'pointermove',
				end: 'pointerup'
			}
		}];

		Tap.options = {
			eventName: 'tap',
			fingerMaxOffset: 11
		};

		var attachDeviceEvent, init, handlers, deviceEvents,
			coords = {};

		attachDeviceEvent = function(eventName) {
			return utils.attachEvent(document.documentElement, deviceEvents[eventName], handlers[eventName]);
		};

		handlers = {
			start: function(e) {
				e = utils.getRealEvent(e);

				coords.start = [e.pageX, e.pageY];
				coords.offset = [0, 0];
			},

			move: function(e) {
				if (!coords.start && !coords.move) {
					return false;
				}

				e = utils.getRealEvent(e);

				coords.move = [e.pageX, e.pageY];
				coords.offset = [
					Math.abs(coords.move[0] - coords.start[0]),
					Math.abs(coords.move[1] - coords.start[1])
				];
			},

			end: function(e) {
				e = utils.getRealEvent(e);

				if (coords.offset[0] < Tap.options.fingerMaxOffset && coords.offset[1] < Tap.options.fingerMaxOffset && !utils.fireFakeEvent(e, Tap.options.eventName)) {
					// Windows Phone 8.0 trigger `click` after `pointerup` firing
					// #16 https://github.com/pukhalski/tap/issues/16
					if (window.navigator.msPointerEnabled || window.navigator.pointerEnabled) {
						var preventDefault = function(clickEvent) {
							clickEvent.preventDefault();
							e.target.removeEventListener('click', preventDefault);
						};

						e.target.addEventListener('click', preventDefault, false);
					}

					e.preventDefault();
				}

				coords = {};
			},

			click: function(e) {
				if (!utils.fireFakeEvent(e, Tap.options.eventName)) {
					return e.preventDefault();
				}
			}
		};

		init = function() {
			var i = 0;

			for (; i < eventMatrix.length; i++) {
				if (eventMatrix[i].test) {
					deviceEvents = eventMatrix[i].events;

					attachDeviceEvent('start');
					attachDeviceEvent('move');
					attachDeviceEvent('end');

					break;
				}
			}

			return utils.attachEvent(document.documentElement, 'click', handlers.click);
		};

		utils.attachEvent(window, 'load', init);

		init();
		window.Tap = Tap;
		

	})( window );

	var _M = function(){
		var me = this;
		this.version = this.v = '0.0.1'; //系统版本
		this.touch = this.tap = ('ontouchstart' in window) ? 'tap' : 'click'; //tap事件
		this.loadingID = 'M-loading'; //一个页面就一个loading
		this.zIndex = 9999; //组件的默认z-index值，这个值得设置具有全局递增性，如果在一个组件中设置了该值，那么zIndex会在全局采用传入的值且每次调用时都会递增
		this.aniMationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
		this.popIdPre = 'm-popup-';
		this.popIdNum = 0; //弹出框的id序号，id会递增，保证每次初始化后的id不一样
		this.TIMEOUT = 8000;
		/**
		 * 产生随机整数 例如：生成0-9之间的数（包括0，包括9） random(0,9)
		 * @param  {[int]} min [最小值]
		 * @param  {[int]} max [最大值]
		 * @return {[int]}     [返回随机数]
		 */
		this.random = function(min,max){
			return Math.floor(Math.random() * (max - min +1) + min)
		};
		/**
		 * 判断是否是字符串
		 * @param  {[any]}  str [需要判断的变量]
		 * @return {Boolean}     [返回传入的参数是否是字符串]
		 */
		this.isString = function(str){
			return Object.prototype.toString.call(str) === '[object String]'
		};
		/**
		 * 修改页面title
		 * @param  {[str]} str [title文字]
		 */
		this.title = function(str){
			document.title = str;
		}
	}
	/**
	 * loading组件 初始化并显示，一个页面只有一个loading
	 * @param  {[int]} zIndex [z-index值]
	 */
	_M.prototype.loading = function(zIndex){
		this.zIndex = zIndex ? zIndex : this.zIndex; //设置z-index的值
		//loading的html结构
		var str = '<section id="'+M.loadingID+'" class="M-loading-pop wh-100" style="z-index:'+this.zIndex+'" >' +
            '<div class="mpop">' +
           	'<div class="box box-center box-v wh-100">' +
            '<div class="ball-clip-rotate-multiple">' +
            '<div></div>' +
            '<div></div>' +
            '</div>' +
            '<div class="m-t-15 c-fff loading-font">正在加载数据...</div>' +
            '</div>' +
            '</div>' +
            '</section>';
        var $dom = $('#'+ M.loadingID); //获取loading元素，有可能为空
        $dom[0] ? $dom.show().css('z-index',this.zIndex) : $('body').append(str); //判断dom是否存在，存在就显示并设置z-index，不存在就添加html到页面中
        this.zIndex++;
        //loading出现时touch无效
        $('#'+ M.loadingID).on('touchstart',function(e){
        	 e.preventDefault();
        });
	}
	/**
	 * 隐藏loading
	 */
	_M.prototype.loadingHide = function(){
		$('#'+ M.loadingID).hide();
	}
	/**
	 * alert组件，
	 * 可以只传入一个参数（此时content=title），
	 * 也可以传入2个参数(此时content=titile,cb=content)，
	 * 一个页面可以有多个alert
	 * @param  {[str]}   title   [标题，可为空，默认为'提示']
	 * @param  {[str]}   content [展示的内容]
	 * @param  {Function} cb      [点击按钮的回调]
	 * @return {[type]}           [alert的实例]
	 */
	_M.prototype.alert = function(title,content,cb,zIndex){
		this.zIndex = zIndex ? zIndex : this.zIndex; //设置z-index的值
		if(arguments.length==1){ //只有一个参数
			content = title;
			title = '提示';
		}else if(arguments.length==2){ //只传了2个参数
			if(typeof content === 'function'){
				cb = content;
				content = title;
				title = '提示'
			}else return;
		}else return;
		var alertHandlerPre = 'M-handler-ok', //alert中按钮的class的前缀
			idNum = M.popIdNum++, me = this;
		//Alert组件
		var Alert = function(title,content){
			this.id = M.popIdPre + idNum; //id递增
			var alertHtml='<div id="'+ this.id +'" class="M-pop wh-100"  style="z-index:'+me.zIndex+'">'+
                '<div class="M-popup center">'+
                '<div class="M-title">'+title+'</div>'+
                '<div class="M-content">'+content+'</div>'+
                '<div class="M-handler box"><span class="'+ alertHandlerPre +' box-f1">确定</span></div>'+
                '</div>'+
            '</div>';
            this.alertDom = $(alertHtml).appendTo('body'); //将alert添加到页面中，并保存dom元素
			me.zIndex++;
		}
		//显示alert
		Alert.prototype.show = function(){
			var Mpopup = this.alertDom.find('.M-popup').show(); //M-popup默认为display:none
			//计算margin-top,保证alert在屏幕中间，添加动画并在动画结束后移除动画解除事件绑定
			Mpopup.css('margin-top',-(Mpopup.height()/2+20)).addClass('ani zoomIn').one(M.aniMationEnd,
				function(){
                	Mpopup.removeClass('ani zoomIn');
                	Mpopup.unbind(M.aniMationEnd);
            	}
            );
            return this; //链式调用
		}
		// 绑定按钮事件
		Alert.prototype.on = function(cb){
            var me = this;
            this.alertDom.find('.'+ alertHandlerPre ).on(M.touch,function(e){
            	e.preventDefault();
                if(cb) cb && cb(me); //执行回调
                me.hide();
            });
            // 点屏幕其他地方关闭alert
            // this.alertDom.on(M.touch,function(e){
            // 	   e.preventDefault();
            //     var target = $(e.target);
            //     if(target.closest('.M-popup').length==0){
            //         me.hide();
            //     }    
            // });
            return this;
        };
        // alert隐藏
        Alert.prototype.hide = function(){
            var me = this;
            //移除动画并删除dom
            this.alertDom.find('.M-popup').addClass('ani zoomOut').one(M.aniMationEnd,function(){
                me.alertDom.remove();
            });
            return this;
        };
		return new Alert(title,content).on(cb).show();
	}
	/**
	 * confirm组件
	 * @param  {[string]} title    [标题，默认：'提示'，可不传]
	 * @param  {[string]} content  [需要展示的内容]
	 * @param  {[Function]} okCb     [点击确定按钮的回调]
	 * @param  {[Function]} cancelCb [点击取消按钮的回调]
	 * @return {[type]}          [confirm的回调]
	 */
	_M.prototype.confirm = function(title,content,okCb,cancelCb,zIndex){
		this.zIndex = zIndex ? zIndex : this.zIndex; //设置z-index的值
		if(typeof content === 'function' || (arguments.length == 1 && this.isString(title))){ //没有传入title
            cancelCb = okCb;
            okCb = content;
            content = title;
            title = '提示';
        }
		var me = this;

        var Confirm = function(title,content){
            this.id = M.popIdPre + M.popIdNum++; //id递增
            var confirmHtml='<div id="'+ this.id +'" class="M-pop wh-100" style="z-index:'+me.zIndex+'">'+
                '<div class="M-popup center">'+
                '<div class="M-title">'+title+'</div>'+
                '<div class="M-content">'+content+'</div>'+
                '<div class="M-handler box">'+
                '<span class="M-handler-ok box-f1">确定</span>'+
                '<span class="M-handler-cancel box-f1">取消</span>'+
                '</div>'+
                '</div>'+
                '</div>';
            this.confirmDom = $(confirmHtml).appendTo('body');
			me.zIndex++;
        };
        // 显示confirm
        Confirm.prototype.show = function(){
            var Mpopup = this.confirmDom.find('.M-popup').show();
            Mpopup.css('margin-top',-(Mpopup.height()/2+20)).addClass('ani zoomIn').one(M.aniMationEnd,function(){
                Mpopup.removeClass('ani zoomIn');
                Mpopup.unbind(M.aniMationEnd);
            });
            return this;
        };
        // 绑定事件
        Confirm.prototype.on = function(okCb,cancelCb){
            var me = this;
            // 确定按钮
            this.confirmDom.find('.M-handler-ok').on(M.touch,function(e){
            	e.preventDefault();
                if(okCb) okCb && okCb(me);
                me.hide();
            });
            // 取消按钮
            this.confirmDom.find('.M-handler-cancel').on(M.touch,function(e){
                e.preventDefault();
                if(cancelCb) cancelCb && cancelCb(me);
                me.hide();
            });
            // this.confirmDom.on(M.touch,function(e){
            //     var target = $(e.target);
            //     if(target.closest('.M-popup').length==0){
            //         me.hide();
            //     }
            //     e.preventDefault();
            // });
            return this;
        };
        // 隐藏confirm
        Confirm.prototype.hide = function(){
            var me = this;
            this.confirmDom.find('.M-popup').addClass('ani zoomOut').one(M.aniMationEnd,function(){
                me.confirmDom.remove();
            });
            return this;
        };

        return new Confirm(title,content).on(okCb,cancelCb).show();
	}
	/**
	 * 类似于Android的toast的功能，具有自动消失的功能
	 * @param text 需要展示的内容
     * @param duration toast持续时间 ,默认为2s
     * @param isControl 布尔值，默认为false，如果为true，则需要手动调用hide方法将其关闭
	 */
	_M.prototype.showToast = function(text,duration,isControl,zIndex){
		this.zIndex = zIndex ? zIndex : this.zIndex; //设置z-index的值
		var me = this;
		if(arguments.length==0) return; //一个参数都没有
		/**
         * 生成toast实例的对象
         * @param options toast对应的参数
         * option:{
         * 		text:'需要展示的文字',
         * 		durantion:'持续的时间'，默认2000ms，单位毫秒,
         * 		isControl:'是否手动隐藏'
         * }
         * @constructor
         */
        var Toast = function(options){
            this.id = M.popIdPre + M.popIdNum++;
            this.options = options;
            if(!options.duration){
                this.options.duration = 2000;
            }
            var toastHtml = '<div id="'+this.id+'" class="M-toast" style="'+me.zIndex+'"><span>'+this.options.text+'</span></div>';
            this.toastDom = $(toastHtml).appendTo('body');
			me.zIndex++;
        };
        Toast.prototype.show = function(){
            var me = this;
            this.toastDom.addClass('ani zoomIn').show().one(M.aniMationEnd,function(){
                me.toastDom.removeClass('ani zoomIn');
                me.toastDom.unbind(M.aniMationEnd);
                if(me.options.isControl) return me; //手动控制隐藏此处不处理
                setTimeout(function(){
                    me.hide();
                },me.options.duration);
            });
            return this;
        };
        Toast.prototype.hide = function(){
            var me = this;
            this.toastDom.addClass('ani zoomOut').one(M.aniMationEnd,function(){
                me.toastDom.remove();
            });
            return this;
        };
		return new Toast({
            text:text,
            duration:duration,
            isControl:isControl
        }).show();
	}
	/**
	 * 图片预加载
	 * @param imgs 数组，需要预加载的图片数组
	 * @param onComplete 图片加载完成后的回调，带两个参数count：成功加载图片数量 imgs：原图片数组
	 * @param onReady  每张图片加载完成后都会执行的回调
	 */
	_M.prototype.imgpreload = function(imgs,onComplete,onReady){
		var imgReady = (function () {
            var list = [], intervalId = null,
            // 用来执行队列
                tick = function () {
                    var i = 0;
                    for (; i < list.length; i++) {
                        list[i].end ? list.splice(i--, 1) : list[i]();
                    }
                    !list.length && stop();
                },
            // 停止所有定时器队列
                stop = function () {
                    clearInterval(intervalId);
                    intervalId = null;
                };
            return function (url, ready, load, error) {
                var onready, width, height, newWidth, newHeight,
                    img = new Image();
                img.src = url;
                // 如果图片被缓存，则直接返回缓存数据
                if (img.complete) {
                    ready.call(img);
                    load && load.call(img);
                    return;
                }
                width = img.width;
                height = img.height;
                // 加载错误后的事件
                img.onerror = function () {
                    error && error.call(img);
                    onready.end = true;
                    img = img.onload = img.onerror = null;
                };
                // 图片尺寸就绪
                onready = function () {
                    newWidth = img.width;
                    newHeight = img.height;
                    if (newWidth !== width || newHeight !== height ||
                            // 如果图片已经在其他地方加载可使用面积检测
                        newWidth * newHeight > 1024
                    ) {
                        ready && ready.call(img);
                        onready.end = true;
                    }
                };
                onready();
                // 完全加载完毕的事件
                img.onload = function () {
                    // onload在定时器时间差范围内可能比onready快
                    // 这里进行检查并保证onready优先执行
                    !onready.end && onready();

                    load && load.call(img);

                    // IE gif动画会循环执行onload，置空onload即可
                    img = img.onload = img.onerror = null;
                };
                // 加入队列中定期执行
                if (!onready.end) {
                    list.push(onready);
                    // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                    if (intervalId === null) intervalId = setInterval(tick, 40);
                }
            };
        })();

		var onComplete = onComplete || function(count, imgs) {};
		var onReady = onReady || function(i, img) {};

		var loaded = 0;
		var error = 0;
		for (var i = 0; i < imgs.length; i++) {
		    (function(n) {
		        var n = n;
		        imgReady(imgs[n], function() {
		            ++loaded;
		            onReady && onReady(n, imgs[n]);
		            if (loaded + error >= imgs.length) {
		                onComplete && onComplete(loaded, imgs);
		            }
		        }, null, function() {
		            ++error;
		            if (error + loaded >= imgs.length) {
		                onComplete && onComplete(loaded, imgs);
		            }
		        });
		    })(i);
		}
	}
	_M.prototype.tmpl = (function(cache) {
		var r = /(?:^|%>)([\s|\S]*?)(<%(?!\=)|$)/g,
			z = /(\"|\\)/g,
			m = /<%=([\s\S]*?)%>/g;
		return function(s, data) {
			if (!(s in cache)) {
				cache[s] = s.replace(r, function(a, b) {
					return ';s.push("' + b.replace(z, "\\$1").replace(m, function(e, f) {
						return '",' + f.replace(/\\"/g, '"') + ',"';
					}) + '");';
				}).replace(/\r|\n/g, "");
			}
			var $fn = Function('data', "var s=[];" + cache[s] + " return s.join('');");
			return data ? $fn(data) : $fn;
		};
	})({});
	/**
	 * ajax 请求
	 * @param {[type]}   type      [请求类型：GET / POST]
	 * @param {[type]}   action    [请求的action]
	 * @param {[type]}   params    [请求的参数]
	 * @param {[type]}   appid     [appid]
	 * @param {Function} callback  [请求成功的回调]
	 * @param {[type]}   apiopenid [apiopenid]
	 * @param {[type]}   apitoken  [apitoken]
	 * @param {[type]}   debug     [是否需要验证身份]
	 */
	_M.prototype.AJAX = function(type,action,params,appid,callback,apiopenid,apitoken,debug){
		var postdata = {},me = this;
		postdata.action = action;
		postdata.params = (this.isString(params) ? params:(JSON.stringify(params) || ""));
		//默认状态下按照ng的设置
		postdata.letwxid = appid;
		postdata.apiopenid = apiopenid || "testopenid";
		postdata.apitoken = apitoken || "testopenid";
		if(typeof PLATFORM !== 'undefined'){
			switch(PLATFORM){
				case 'fumao':
				case 'lppz':
					postdata.gameid = appid;
					postdata.apiopenid = apiopenid || "testopenid";
					postdata.apitoken = apitoken || "testopenid";
					break;
				case 'q':
					postdata.uid = appid;
					postdata.wxapiopenid = apiopenid || "testopenid";
					postdata.wxapitoken = apitoken || "testopenid";
					break;
			}
		}
		debug && (postdata.debug = debug);
		var dataType = 'json';
		if(APIBASE.indexOf(window.location.host) < 0) //接口地址和当前地址不在一个域，则以跨域的方式调用
			dataType = 'jsonp';
			console.log(APIBASE);
		$.ajax({
			url:APIBASE,
			type:type,
			data:postdata,
			dataType:dataType,
			timeout:me.TIMEOUT,
			success:function(data){
				callback && callback(data);
			},
			error:function(){
				me.showToast('请求出错，请检查网络！');
			}
		});
	}
	// post请求
	_M.prototype.ajax = function(action,params,appid,callback,apiopenid,apitoken,debug){
		this.AJAX('POST',action,params,appid,callback,apiopenid,apitoken,debug);
	}
	// get请求
	_M.prototype.get = function(action,params,appid,callback,apiopenid,apitoken,debug){
		this.AJAX('GET',action,params,appid,callback,apiopenid,apitoken,debug);
	}
	/**
	 * 针对于平台的具体实现的请求方式（此方式中会判断config是否存在）
	 * @param  {[type]}   action   [请求的action]
	 * @param  {[type]}   params   [请求的参数]
	 * @param  {Function} callback [请求的回调]
	 * @param  {[type]}   debug    [是否需要验证身份]
	 * @return {[type]}            [description]
	 */
	_M.prototype.postApp = function(action,params,callback,debug){
		var me = this;
		if(typeof config === undefined){
			this.showToast('没有定义config');
			return;
		}else{
			if(PLATFORM == 'q'){
				if(params==null){
					params = {};
				}
				params['gp'] = config.gp;
			}
			this.ajax(action,params,config.gameid,function(data){
				console.log('action:'+action+'  data:'+JSON.stringify(data));
                var err = data.error - 0;
                switch(err){
                    case 0:
                        callback && callback(data);
                        break;
                    default:
                        var err = data.error - 0;
						switch(err){
							case 1002:
								me.loadingHide();
								oAuth.clear();
								me.alert('你的身份信息已过期，点击确定刷新页面',function(){
									window.location.reload();
								});
								break;
							default:
								me.loadingHide();
								me.showToast(data.error_msg);
						}
                }
			},config.apiopenid,config.apitoken,debug)
		}
		
	}
	/**
	 * 获取当前url中的参数
	 * @return {[type]} [包含url参数的对象，使用方法M.getUrlParam().xxx] 
	 */
	_M.prototype.getUrlParam = function(){
		var str = window.location.search,
			arrTmp = [],
			obj = {};
		if(str.indexOf('?')>-1){
			str = str.substr(1);
			arrTmp = str.split('&');
			for(var i=0;i<arrTmp.length;i++){
				var tempArr = arrTmp[i].split('=');
				obj[tempArr[0]] = decodeURIComponent(tempArr[1]);
			}
		}
		return obj;
	}
	/**
	 * 设置cookie
	 * @param {[type]} name        [cookie名字]
	 * @param {[type]} value       [cookie值]
	 * @param {[type]} expire_days [cookie时长]
	 */
	_M.prototype.setCookie = function(name, value, hours) {
	    var exdate = new Date();
	    exdate.setTime(exdate.getTime() + parseFloat(hours) * 3600 * 1000);
	    document.cookie = name + '=' + escape(value) + ((hours == null) ? '' : ';expires=' + exdate.toGMTString());
	};
	/**
	 * 获取cookie
	 * @param  {[type]} name [cookie名字]
	 * @return {[type]}      [description]
	 */
	_M.prototype.getCookie = function(name) {
	    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
	    if (arr = document.cookie.match(reg))
	        return (arr[2]);
	    else
	        return null;
	};
	/**
	 * 删除cookie
	 * @param  {[type]} name [cookie名字]
	 * @return {[type]}      [description]
	 */
	_M.prototype.delCookie = function(name) {
	    var exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    var cval = this.getCookie(name);
	    if (cval != null)
	        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
	};
	var M = window.M = new _M();
	return M;
}));

