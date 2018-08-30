	// 兼容的绑定事件
	function addEvent(element,event,listener){
		if(element.addEventListener){
			element.addEventListener(event,listener,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+event,listener);
		}else{
			element["on"+event]=listener;
		}
	}

	var rootNode = document.getElementById("root");
	var btns = document.getElementsByTagName("input");
	var preBtn = btns[0];
	var searchBtn = btns[2];
	var indexArr = [];
	var timer = null;

	// 加载
	addEvent(window,"load",function(){
		addEvent(preBtn,"click",function(){
			resect();
			preOrder(rootNode);
			changeColor();
		});

		addEvent(searchBtn,"click",function(){
			resect();
			preOrder(rootNode);
			search();
		})
	})


	// 前序搜索
	function preOrder(rootNode){
        indexArr.push(rootNode);
       for(var i=0;i<rootNode.childElementCount;i++){
            if(rootNode.children[i]!=null){
                preOrder(rootNode.children[i]);
            }
       }
	}
	//变色
	function changeColor(){
		var i = 0;
		indexArr[i].style.backgroundColor = "blue";	
		var step = function(){
			i++;
			indexArr[i-1].style.backgroundColor = "#fff";
			if(i<indexArr.length){		
				indexArr[i].style.backgroundColor = "blue";
			}else{
				clearInterval(timer);
			}

		}
		timer = setInterval(step,500)
	}

	// 查询
	function search(){
		var i = -1;
		var sign = 0;
		var arrText = rootNode.innerText.split(/[\n\s]*/g);//split()一个字符串分割成字符串数组
		var iptValue = document.getElementById("search").value;
		
		var step = function(){

			i++;
			if (i>0) {
				if(arrText[i-1]!=iptValue){
					indexArr[i-1].style.backgroundColor = "#fff";
				}
			}
			if(i<indexArr.length){
				if(arrText[i]==iptValue){
					indexArr[i].style.backgroundColor = "red";
					sign = 1;
				}else{
					indexArr[i].style.backgroundColor = "blue";

				} 	
			}else{
				clearInterval(timer);
				if(sign == 0){
					alert("没找到");
				}
			}	

		}
		timer = setInterval(step,500)
	}


	

	// 复位
	function resect(){
		indexArr = [];
		clearInterval(timer);
		var divs = document.getElementsByTagName("div");
		for(var i=0;i<divs.length;i++){
			divs[i].style.backgroundColor = "#fff";
		}
	}

	
	var divs =document.getElementsByTagName("div");
	var delBtn = document.getElementById("delBtn")
	var addInput =document.getElementById("addInput");
	var addBtn = document.getElementById("addBtn");
	var arrs =[];

	// 选择边框变色
	for(var i=0;i<divs.length;i++){
		
		divs[i].onclick = function(event){
		for(var i=0;i<divs.length;i++){
			divs[i].style.backgroundColor = "#fff";
		}
		event.target.style.backgroundColor = "green";
		arrs.push(event.target);
		
		event.stopPropagation();//该方法将停止事件的传播，阻止它被分派到其他 Document 节点。
		}
	}
	// 删除
	delBtn.onclick = function(){
		for(var i=0;i<arrs.length;i++){
			var node = arrs[i];
			var parent = arrs[i].parentNode;
			var n = Array.prototype.indexOf.call(parent.children,arrs[i]);
			parent.removeChild(arrs[i]);
		}
		arrs = [];
	}
	// 添加
	addBtn.onclick = function(){
		for(var i = arrs.length-1;i<arrs.length;i++){
			console.log(arrs.length);
			if(arrs.length>0){
				console.log(arrs[0]);
				var addValue = addInput.value;
				var node = document.createElement("div");
				console.log(node);
				node.innerText = addValue;
				node.className = "c4";
				arrs[i].appendChild(node);
			}
		}
		
		
	}

	