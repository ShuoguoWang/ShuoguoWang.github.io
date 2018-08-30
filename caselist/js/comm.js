var comm = {
	// urls : {
	// 	//root : 'http://zzsvn.pcauto.com.cn/svn/other/effectlib/'
	// 	root : 'http://www1.pconline.com.cn/test/effectlib/'
	// },
	getById : function(id){
		return document.getElementById(id);
	},
	getByClass : function(className,parent){
		var oParent = parent?document.getElementById(parent):document;
		if(oParent.getElementsByClassName){
			var arr = oParent.getElementsByClassName(className);
			if(arr.length == 1){
				return arr[0];
			}
			return arr;
		}else{
			var arr = [];
			var childs = oParent.getElementsByTagName('*');
			for(var i = 0,len = childs.length; i< len; i++){
				var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
				if(childs[i].className.match(reg)){
					arr.push(childs[i]);
				}
			}
			if(arr.length == 1){
				return arr[0];
			}
			return arr;
		}
	},
	hasClass : function(obj, cls) {
		if(obj.classList){
			return obj.classList.contains(cls);
		}else{
			return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		}
	},
	addClass : function(obj, cls) {
		if (this.hasClass(obj, cls)) return;
		if(obj.classList){
			obj.classList.add(cls);
		}else{
			obj.className += " " + cls;
		}
	},
	removeClass : function(obj,cls){
		if (!this.hasClass(obj, cls))  return;
		if(obj.classList){
			obj.classList.remove(cls);
		}else{
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			obj.className = obj.className.replace(reg, '');
		}
	},
	toggleClass : function(obj,cls){
		if (obj.classList) {
			obj.classList.toggle(cls);
		} else {
			var classes = obj.className.split(' ');
			var existingIndex = classes.indexOf(cls);

			if (existingIndex >= 0){
				classes.splice(existingIndex, 1);
			}
			else{
				classes.push(cls);
			}
			obj.className = classes.join(' ');
		}
	},
	getClientH : function(){
		var clientH = document.documentElement.clientHeight;
		return clientH;
	},
	getScrollHeight : function(){
		return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
	},
	heredoc : function(fn){
		return fn.toString().split('\n').slice(1,-1).join('\n') + '\n';
	},
	replaceSrc : function(obj, attr) {
		if(obj&&obj.getElementsByTagName('img')){
			var imgs =obj.getElementsByTagName('img');
			for(var i=0,len=imgs.length;i< len;i++){
				if(imgs[i].getAttribute(attr)){
					imgs[i].setAttribute('src',imgs[i].getAttribute(attr));
					imgs[i].removeAttribute(attr);
				}
			}
		}
	},
	addEvent: function(obj, type, handle) {
		obj.addEventListener ? obj.addEventListener(type, handle) : obj.attachEvent('on' + type, handle);
	},
	getEvent : function(e){
		return e || window.event;
	},
	getTarget : function(e){
		return e.target || window.event.srcElement;
	},
	stopPropagation : function(e) {
		if(e.stopPropagation){
			e.stopPropagation();
		}else {
			e.cancelBubble = true;
		}
	},
	popShow : function(popId,maskId,fn){
		var mId = maskId||'J-mask';
		if(!document.getElementById(mId)) return;
		if(!document.getElementById(popId)) return;
		var mask = document.getElementById(mId);
		var popup = document.getElementById(popId);
		var sHeight=document.documentElement.scrollHeight||document.body.scrollHeight;
		mask.style.height = sHeight+'px';
		mask.style.display = 'block';
		popup.style.display = 'block';
		fn&&fn();
	},
	popHide : function(popId,maskId,fn){
		var mId = maskId||'J-mask';
		if(!document.getElementById(mId)) return;
		if(!document.getElementById(popId)) return;
		var mask = document.getElementById(mId);
		var popup = document.getElementById(popId);
		popup.style.display = 'none';
		mask.style.display = 'none';
		fn&&fn();
	},
	popShowTo : function(popId,top,maskId,fn){
		var mId = maskId||'J-mask';
		if(!document.getElementById(mId)) return;
		if(!document.getElementById(popId)) return;
		var mask = document.getElementById(mId);
		var popup = document.getElementById(popId);
		var sHeight=document.documentElement.scrollHeight||document.body.scrollHeight;
		mask.style.height = sHeight+'px';
		mask.style.display = 'block';
		popup.style.display = 'block';
		window.scrollTo(0,top);
		fn&&fn();
	},
	isEmptyObject : function(obj){
		for(var key in obj){
			return false ;
		}
		return true;
	},
	getData : function(json){
		if(json && this.istest && this.josn.testData){
			json.success && json.success(json.testData);
			return false;
		}
		json.cbkey = json.cbkey||'callback';
		var timestamp = Date.parse(new Date());
		json.cbvalue = json.cbvalue||('abc'+timestamp);
		if(!json.url){
			return false;
		}
		var bm = json.bm || 'utf-8',
				url = json.url;
		window[json.cbvalue] = function(data){
			json.success && json.success(data);
		};
		var scr = document.createElement('script');
		scr.charset=bm;
		scr.onload = scr.onreadystatechange = function(){
			var st = scr.readyState;
			if(st && st!=='loaded' && st!=='complete') return;
			scr.onload = scr.onreadystatechange = null;
		};
		var paras = '';
		if(!this.isEmptyObject(json.data)){
			for(var i in json.data){
				paras += i + '=' + json.data[i] +  '&';	
			}
			paras += '&';
		}
		scr.src = url+'?'+paras+json.cbkey+'='+json.cbvalue;
		document.getElementsByTagName('head')[0].appendChild(scr);
	},
	cors : function(json){//post提交，pc的要用这货
		if(json && this.istest && json.testData){
			json.success && json.success(json.testData);
			return false;
		}
		postCORS({
			url: json.url,
			data: json.data||{},
			callback: function(data) {
				if(typeof data=='string'){
					data=eval("("+data+")");
				};
				json.success && json.success(data);
			},
			init : function(data,xhr){
				if (xhr) xhr.withCredentials = true;
			}
		});
	},
	trim : function(str){ //删除左右两端的空格
　　  return str.replace(/(^\s*)|(\s*$)/g, "");
　  },
	ltrim : function(str){ //删除左边的空格
		return str.replace(/(^\s*)/g,"");
	},
	rtrim : function(str){ //删除右边的空格
		return str.replace(/(\s*$)/g,"");
	},
	getQueryString : function(name) {
	    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return unescape(r[2]);
	    }
	    return null;
	},

	sortSelCtrl : function(){
		var sortList = comm.getById('J-side-nav');
		var sortItems = sortList.getElementsByTagName('li');
		/* 下拉控制 S */
		var Timer;
		comm.addEvent(sortList,'mouseover',function(){
			if(Timer) clearTimeout(Timer);
			comm.addClass(sortList,'sort-list-hover');
		});
		comm.addEvent(sortList,'mouseleave',function(){
			if(Timer) clearTimeout(Timer);
			Timer = setTimeout(function(){
				comm.removeClass(sortList,'sort-list-hover');
			},300);
		});
		/* 下拉控制 E */
		/* 切换控制 S */
		//comm.addClass(sortItems[0],'current');
		for(var i=0,len=sortItems.length;i<len;i++){
		   (function(t){
		   		comm.addEvent(sortItems[t],'click',function(){
		   			for(var j=0,leng=sortItems.length;j<leng;j++){
		   			    comm.removeClass(sortItems[j],'current');
		   			}
		   			
		   			comm.addClass(this,'current');
		   			
		   		});
		   })(i);
		}
		/* 切换控制 E */
	}
};
