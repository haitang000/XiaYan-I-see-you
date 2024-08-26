var $container = document.getElementById("container");
     
    var isDown = false; //是否按下鼠标
    var inertance = 1.2; //惯性系数,越大,惯性越不明显,不能小于0
    var fv =  0; //滑动的力度
    var timer = null;
    $container.onmousedown = function(e){
        clearTimeout(timer);//清除定时器
        fv = 0;
        this._start = e.clientX; //鼠标按下的位置
        isDown = true;//鼠标是否有按下，主要防止用户是从容器外开始滑动的
    }
     
    $container.onmousemove = function(e){
        if(isDown){
            var miss = e.clientX - this._start;
            moveMiss(miss)
            this._start = e.clientX;
            fv = miss;
        }
    }
     
    function moveMiss(miss){
        $container.style.left = miss + $container.offsetLeft + "px";
    }
     
    window.onmouseup = function(e){
        if(isDown){
            isDown = false;
            var me = this;
            var friction = ((fv >> 31) * 2 + 1) * inertance;//根据力度套用公式计算出惯性大小,公式要记住
            var num = Math.abs(friction);
            timer = setInterval(function(){
                 fv -= friction;//力度按 惯性的大小递减
                 moveMiss(fv);
                 if(Math.abs(fv) < num){  //如果力度减小到小于1了,结束,或者边界弹回
                     clearInterval(timer);
                     return ;
                 }
            },20);
        }
    }