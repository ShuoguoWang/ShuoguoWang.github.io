(function(){
	var module = {
		cPage : null,
		pageSize : 12,
		targetData : [],
		totalNum : null,
		totalPage : null,
		getTargetData : function(){
			var navItems = comm.getByClass('item','J-side-nav');
			var menuItems = comm.getByClass('item','J-sort-menu');
			var sortIndex = comm.getQueryString('sort');  //种类索引
			var sort;  //种类
			var tagId = comm.getQueryString('tagid');  //筛选类型索引
			var tag; //筛选类型
			//var search = comm.getQueryString('search');  //搜索关键词

			var data = [];
			var allData = eData.data;
			var allDataLen = allData.length;
			if(sortIndex){
				//comm.addClass(navItems[sortIndex],'current');
				var curUrl = location.href;
				//console.log(curUrl);
				if(/caselist\.html\?sort=\d/.test(curUrl)){
					for(var i=0,len=navItems.length;i<len;i++){
						var href = navItems[i].getElementsByTagName('a')[0].getAttribute('href');
						//console.log(href)
						var reg = new RegExp('caselist\\.html\\?sort=' + sortIndex,'i');
						if(href.match(reg)){
							//console.log(href.match(reg));
							//console.log(i);
							comm.addClass(navItems[i],'current');
						}
					}
					sort = eData.sorts[sortIndex];
				}
			}
			if(sortIndex&&tagId){
				comm.addClass(menuItems[tagId],'current');
				tag = eData.alltags[sortIndex][tagId];
			}
			for(var i=0;i<allDataLen;i++){
				if(sortIndex){
					var patt=new RegExp(sort);
					if(!patt.test(allData[i].sort)) continue;
				}
				if(sortIndex&&tagId&&tagId!=0){
					var patt=new RegExp(tag,'i');
					if(!patt.test(allData[i].keywords)&&!patt.test(allData[i].platform)) continue;
				}
				data[data.length] = allData[i];
			}
			this.targetData = data;

			var dataLen = this.targetData.length;
			this.totalNum = dataLen;
			this.totalPage = Math.ceil(dataLen/this.pageSize);

			if(this.totalPage == 0){
				comm.getById('J-turn-page').style.display = 'none';
				comm.getById('J-tip').style.display = 'block';
				return;
			}
			comm.getById('J-turn-page').style.display = 'block';
			comm.getById('J-tip').style.display = 'none';

			this.cPage = comm.getQueryString('page') ? comm.getQueryString('page') : 1;
			var cPage = this.cPage;
			this.goPage(cPage);
		},
		tagFilter : function(){
			var sort = comm.getQueryString('sort');
			var tagId = comm.getQueryString('tagid'); 
			var sortLen = eData.sorts.length;
			if(!sort || sort<0 || sort>sortLen-1 || !tagId) return;
			var sortMenu = comm.getById('J-sort-menu');
			html = '<li class="item">全部</li>';
			var allTags = eData.alltags[sort];
			for(var i=1,len=allTags.length;i<len;i++){
			   html += '<li class="item">' + allTags[i] + '</li>';
			}
			sortMenu.innerHTML = html;
			var menuItems = comm.getByClass('item','J-sort-menu');
			for(var i=0,len=menuItems.length;i<len;i++){
				(function(t){
					comm.addEvent(menuItems[t],'click',function(){
						var href = location.href;
						// if(comm.getQueryString('search')){
						// 	href = href.replace(/search=[^&]+/,'search=');
						// }
						if(comm.getQueryString('page')){
							href = href.replace(/page=[^&]+/,'page=1');
						}
						if(comm.getQueryString('tagid')){
							href = href.replace(/tagid=[^&]+/,'tagid='+t);
						}else{
							href += (href.indexOf('?') == -1)?('?tagid=' + t) :('&tagid=' + t);
						}
						location.href = href;
					});
				})(i);
			}
		},
		goPage : function(page){
			var caseList = comm.getById('J-case-list');
			//console.log(this.totalPage);
			var totalPage = this.totalPage;
			html = '';
			if(totalPage == 0){
				html = '没有数据';
			}else{
				var start = (page - 1) * this.pageSize;
				var end = (start + this.pageSize)<this.totalNum? (start+this.pageSize) : this.totalNum ;

				var targetData = this.targetData;
				for(var i = start;i < end; i++){
					var platform = targetData[i].platform.toUpperCase();
					if(platform.indexOf(',') != -1){
						var iconLabel = 'icon-label-2';
						platform = platform.replace(',','/');
					}else{
						var iconLabel = 'icon-label-1';
					}

					var timeStr = Date.parse( new Date());

					html += '<div class="item-case"><a href="' + targetData[i].demourl + '" target="_blank"><figure><img src="http://www1.pconline.com.cn/images/blank.gif" data-src="' + targetData[i].cover + '?' + timeStr + '" alt=""></figure><dl class="txts"><dt title="' + targetData[i].title  + '">' + '【' + targetData[i].sort + '】' + targetData[i].title + '</dt><dd>' + targetData[i].desc.intro + '</dd></dl></a></div>';
				}
			}
			
			caseList.innerHTML = html;
			this.onTurnPage(page);
			//console.log(start);
			//console.log(end);
		},
		prePage : function(){
			var turnPage = comm.getById('J-turn-page');
			comm.addEvent(turnPage,'click',function(e){
				var tar = comm.getTarget(e);
				if(!comm.hasClass(tar,'btn-prev')) return;
				module.cPage--;
				var cPage = module.cPage;
				//module.goPage(cPage);
				var href = location.href;
				if(comm.getQueryString('page')){
					href = href.replace(/page=[^&]+/,'page=' + cPage);
				}else{
					href = href + '&page=' + cPage;
				}
				location.href = href;
			});
		},
		nextPage : function(){
			var turnPage = comm.getById('J-turn-page');
			comm.addEvent(turnPage,'click',function(e){
				var tar = comm.getTarget(e);
				if(!comm.hasClass(tar,'btn-next')) return;
				module.cPage++;
				var cPage = module.cPage;
				//module.goPage(cPage);
				var href = location.href;
				if(comm.getQueryString('page')){
					href = href.replace(/page=[^&]+/,'page=' + cPage);
				}else{
					href = href + '&page=' + cPage;
				}
				location.href = href;
			});
		},
		turnPage : function(){
			var turnPage = comm.getById('J-turn-page');
			comm.addEvent(turnPage,'click',function(e){
				var tar = comm.getTarget(e);
				if(!comm.hasClass(tar,'item')) return;
				module.cPage = parseInt(tar.innerHTML);
				var cPage = module.cPage;
				//module.goPage(cPage);
				var href = location.href;
				if(comm.getQueryString('page')){
					href = href.replace(/page=[^&]+/,'page=' + cPage);
				}else{
					href = href + '&page=' + cPage;
				}
				location.href = href;
			});
		},
		onTurnPage : function(page){
			//console.log(page);
			// 按需加载
			this.lazySet();

			//翻页处理
			var turnPage = comm.getById('J-turn-page');
			var html = '';
			if(page != 1){
				html += '<li class="btn btn-prev">prev</li>';
			}
			if(module.totalPage<12){
				for(var i = 1,len = module.totalPage;i <= len;i++){
				    if(i == page){
				    	html += '<li class="item current">' + i + '</li>';
				    }else{
				    	html += '<li class="item">' + i + '</li>';
				    }
				}
			}else{
				if(page < 10){
					for(var i=1;i<=10;i++){
					    if(i == page){
					    	html += '<li class="item current">' + i + '</li>';
					    }else{
					    	html += '<li class="item">' + i + '</li>';
					    }
					}
					html += '<li class="ellipsis">...</li> <li class="item">' + module.totalPage + '</li>';
				}else{
					html += '<li class="item">1</li><li class="item">2</li><li class="item">3</li><li class="item">4</li><li class="item">5</li><li class="item">6</li><li class="item">7</li><li class="ellipsis">...</li>';
					if(page >= module.totalPage - 2){
						for(var i= module.totalPage-3 ; i <= module.totalPage ; i++){
						    if(i == page){
						    	html += '<li class="item current">' + i + '</li>';
						    }else{
						    	html += '<li class="item">' + i + '</li>';
						    }
						}
					}else{
						for(var i = page - 1,len = page + 1;i<=len;i++){
						    if(i == page){
						    	html += '<li class="item current">' + i + '</li>';
						    }else{
						    	html += '<li class="item">' + i + '</li>';
						    }
						}

						html += '<li class="ellipsis">...</li> <li class="item">' + module.totalPage + '</li>';
					}
				}
			}
			if(page != module.totalPage){
				html += '<li class="btn btn-next">next</li>';
			}
			turnPage.innerHTML = html;
		},
		lazySet : function(){
			var xx = Lazy.create({
			    lazyId:"J-case-list",
			    trueSrc:'data-src',
			    offset:100,
			    delay:100,
			    delay_tot:1000,
			    imgLoad:function(element,width,height){}
			});
			Lazy.init(xx);
		},
		init : function(){
			// /* 搜索框 S */
			// //聚焦高亮
			// comm.searchBoxLight();
			//下拉选择控制
			comm.sortSelCtrl();
			/* 搜索框 E */
			/* 标签筛选 S */
			this.tagFilter();
			/* 标签筛选 E */
			/* 初始化数据加载 S */
			this.getTargetData();
			/* 初始化数据加载 E */
			// /* 搜索 S */
			// this.searchCase();
			// /* 搜索 E */

			/* 翻页 S */
			//上一页
			this.prePage();
			//下一页
			this.nextPage();
			//跳转到对应页
			this.turnPage();
			/* 翻页 E */

		}
	}
	module.init();
})();
