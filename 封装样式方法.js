
//byId(id)通过id找元素
//id 必传并且是页面当中有的id，是一个字符串类型的参数
//return 返回一个object 元素
function byId( id ) {
	return document.getElementById(id);
};

function byEle(ele){
	return document.getElementsByTagName(ele);
};


//获取任意元素的任意样式  这两个参数必须传
//ele：元素对象
//attr：字符串元素样式属性
function getStyle( ele,attr ) {

    return window.getComputedStyle ? getComputedStyle( ele,null )[attr] : ele.currentStyle[attr];

}



//补零操作
function toZerto(num) {	

		return num >= 10 ? ''+num : '0'+num;
};


//得到元素到浏览器的位置
function getPosition( ele ) {
	var position = {
		top:0,
		left:0
	};

	while( ele ){
		position.top += ele.offsetTop;
		position.left += ele.offsetLeft;
		ele = ele.offsetParent;
	};

	return position;
}


//获取滚动条滚动的距离
function scrollTop() {
	return document.body.scrollTop || document.documentElement.scrollTop;
}


// 事件的绑定（兼听）和取消
function bind(ele,type,fn) { //type 事件名称
	
	if( ele.addEventListener ){
		ele.addEventListener(type,fn,false); 
	}else{
		ele.attachEvent( 'on'+type,fn );
	}

}
function unbind(ele,type,fn) {
	if( ele.removeEventListener ){
		ele.removeEventListener(type,fn,false); 
	}else{
		ele.detachEvent( 'on'+type,fn );
	}
}


//阻止默认行为
function preventDefault(ev) {
	if( ev.preventDefault ){
		ev.preventDefault();
	}else{
		ev.returnValue = false;
	}
	// console.log(ev);
}


//阻止冒泡
function cancelBubble(ev) {
	if( ev.stopPropagation ){
		ev.stopPropagation();
	}else{
		ev.cancelBubble = true;
	}
}


//滚轮事件 回调思想
// 元素绑定   element
// 要做的事情 function        向上要做的事情|向下要做事情
//  bindScroll(oDiv,function(){
//  	oDiv.style.height = oDiv.offsetHeight - 10 + 'px';
//  },function () {
//  	oDiv.style.height = oDiv.offsetHeight + 10 + 'px';
//  });
// 回调函数
// 		形式：通过传参的形式把实际的函数传入函数内部，具体的实参函数在 一个函数内部执行
// 		什么时候才执行：当某一个条件满足的时候才去执行。
function bindScroll(ele,fnUp,fnDown) {
	ele.onmousewheel = _scrollFn;
	if( ele.addEventListener ){
		ele.addEventListener( 'DOMMouseScroll',_scrollFn,false)
	}
	function _scrollFn(ev) {
		var ev = ev || window.event;
		preventDefault(ev);//清除默认样式
		var b = true;//假设是往上滚动的

		if( ev.wheelDelta ){
			b = ev.wheelDelta > 0 ? true : false;  //判断滚动方向；
		}else{
			b = ev.detail < 0 ? true : false ;
		};

		if( b ){
			fnUp(); //向上滚动的方法
		}else{
			fnDown();  //向下滚动的方法
		};
	};
};


// 匀速运动
// btn1.onclick = function () {
//         move(div,'left',500);
//     };
//     btn2.onclick = function () {
//         move(div,'left',0);
//     };
function move(obj,attr,target) {
    clearInterval(timer);
    timer = setInterval(function () {
        var cur = parseInt(getStyle(obj, attr));
        var speed = target>cur ? 5 : -5; // 目标位置如果大于当前位置 speed为正 +

        var newCur = cur + speed;

        //新的当前位置>=目的位置 并且速度为正+;   新的当前位置<=目的位置 并且速度为负-
        if( (newCur >= target && speed>0) || (newCur <= target && speed<0) ){
            newCur = target;
            clearInterval(timer);
        };
        obj.style[attr] = newCur + 'px';
    }, 30)
};

 //缓冲运动 任意属性操作
// div.onmouseenter=function() {
//           move(this, 'opacity', 100);
//       }
function oMove(obj,attr,target,fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        if (attr == 'opacity') {

            var cur = parseFloat(getStyle(obj, attr)) * 100;
        } else {
            var cur = parseInt(getStyle(obj, attr));
        }

        var speed = (target - cur) / 10;

        speed = target > cur ? Math.ceil(speed) : Math.floor(speed);
        console.log(speed, cur);

        var newCur = cur + speed;

        if (target == cur) {
            clearInterval(obj.timer);
            // if(fn){fn()};     //判断函数是否存在；
            fn && fn();//判断函数是否存在；全真为真，第一个为假则不会继续往下执行；
        }
        ;
        // fn();
        if (attr == 'opacity') {
            obj.style[attr] = newCur / 100;
            obj.style.filter = 'alpha(opacity=' + newCur + ')';
        } else {
            obj.style[attr] = newCur + 'px';
        }

    }, 30);
};

//缓冲运动框架  多属性操作
// div.onmouseenter=function(){
//        sMove(this,{width:'500',opacity:'90'})};
function sMove( obj,json,endFn) {
	clearInterval( obj.timer );//undefined

	obj.timer = setInterval(function () {
	
		var isEnd = true;//假设都到达目标位置则为true
	//sMove( div1,{ height:500,width:500 } )	
		for( var attr in json ){

			var target = json[attr];
			if( attr == 'opacity' ){
				var cur = parseFloat( getStyle( obj,attr ) ) * 100;
			}else{
				var cur = parseInt( getStyle( obj,attr ) );//
			}
			
			//var speed = Math.ceil( (0 - cur)/10 );
			var speed = (target - cur)/10;//-9/10  -0.9

			speed = target > cur ? Math.ceil( speed ) : Math.floor( speed );
			var newCur = cur + speed;//491.9px
			
			if( cur != target ){
				isEnd = false;
			}
			
			if( attr == 'opacity' ){
				obj.style[attr] = newCur/100;
				obj.style.filter = 'alpha(opacity='+ newCur +')';
			}else{
				obj.style[attr] = newCur + 'px';
			}

		};

		if( isEnd ){
			clearInterval( obj.timer );
			endFn && endFn();
		};


	},30)
};

//创建元素
// var options = {
//         tagName:'h2',
//         content:'我是内容',
//         peroptes:{id:'hh2', age:'18', sex:'男'}
//     };
//      var s= createElement(options);
//          body.appendChild(s);
function createElement( option ) {
    var ele = null;
    var tagName = option.tagName || 'div';
    var content = option.content || '';
    var peroptes = option.peroptes || {};
    ele = document.createElement( tagName );
    var textNode = document.createTextNode( content );
    ele.appendChild( textNode );

    var i=0;
    for(var key in peroptes){
        // i++;
        // console.log(i)
        var attrName = key;
        var value = peroptes[key];
        ele.setAttribute( attrName,value )
    }

    return ele;
}

// ajax封装；
// request.onclick = function () {
//     // var result = ajax();
//     ajax( './a.txt',function (result) {
//         request.innerHTML = result;
//     } )}
// function ajax(url,successFn,failFn) {
// /*var successFn = function (result) 形参 {  console.log( result ) } */
// /*function successFn (result) 形参 {  console.log( result ) } */
//     if( window.XMLHttpRequest ){      //请求对象
//         var ajax = new XMLHttpRequest();
//     }else{
//         var ajax = new ActiveXObject('Microsoft.XMLHTTP');
//     }
//     ajax.open('get',url,true);//2、链接具体文件路径
//
//     ajax.send();//3、发送请求。具体的去了
//
//     ajax.onreadystatechange = function () { //4、接受服务器返回的数据
//         //console.log( ajax.readyState );
//         if( ajax.readyState == 4 ){
//             // console.log( ajax.status );
//             if( ajax.status == 200 ){
//                 successFn( ajax.responseText );//实参
//             }else{
//                 failFn && failFn();
//             }
//         };
//     };
//
// };


// ajax封装--操作不同类型数据
// sAjax({      //json字符串
//         url: './json.txt', dataType: 'JSON',
//         sFn: function (result) {
//             console.log(result);
//             var len = result.length;
//
//             for (var i = 0; i < len; i++) {
//                 div.innerHTML += '<p>' + result[i].name + '</p>';
//             }
//         }
//     });
function ajax(settings){   //参数：路径，成功回调函数（必传），失败回调函数（可不传）

    var url = settings.url;
    var dataType = settings.dataType || 'text';
    var sFn = settings.sFn;
    var dFn = settings.dFn;


    dataType = dataType.toLowerCase();  //转为小写;
    if(window.XMLHttpRequest){ //ajax请求对象

        var ajax = new XMLHttpRequest;   //
    }else{
        var ajax = new ActiveXObject("Microsoft.XMLHttpXObject");  //ie6
    };
    ajax.open('get',url,true);     //连接具体文件路径
    ajax.send();      //发送请求
    ajax.onreadystatechange=function(){      //接收服务器返回数据

        if(ajax.readyState == 4){   //过程中的状态

            if(ajax.status == 200){  //服务器状态

                if(dataType == 'text'){
                    sFn(ajax.responseText);//请求文件的内容 （字符串形式）
                }
                if(dataType == 'xml'){
                    sFn(ajax.responseXML);//请求文件的内容 （XML形式）
                };
                if (dataType == 'json'){
                    sFn(JSON.parse(ajax.responseText));//请求文件的内容 （字符串形式）
                };

            }else{
                dFn&&dFn();
            }
        }
    }
};