(function(){
	var module = {
		sortChange : function(){
			//var sortSel = comm.getByClass('sort-selected','J-sort-wrap');
			var sortList = comm.getById('J-side-nav');
			var lis = sortList.getElementsByTagName('li');
			comm.addEvent(sortList,'mouseover',function(){
				comm.addClass(sortList,'sort-list-hover');
			});
			comm.addEvent(sortList,'mouseout',function(){
				comm.removeClass(this,'sort-list-hover');
			});
			for(var i=0,len=lis.length;i<len;i++){
			    (function(t){
			    	comm.addEvent(lis[t],'click',function(){
			    		var selTxt = this.innerHTML;
			    		var selVal = this.getAttribute('data-val');
			    		//sortSel.innerHTML = selTxt;
			    		//sortSel.setAttribute('data-val',selVal);
			    		comm.removeClass(sortList,'sort-list-hover');
			    	});
			    })(i);
			}
		},
      
		init : function(){
			/* 筛选项 S */
			this.sortChange();
			/* 筛选项 E */
			// /* 搜索功能 S */
			// this.searchCase();
			// /* 搜索功能 E */
		}
	}
	module.init();
})();
