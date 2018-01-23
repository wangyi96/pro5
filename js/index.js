(function () {
    let styleNode = document.createElement('style');
    let width = document.documentElement.clientWidth /16;
    styleNode.innerHTML = "html{font-size: "+width+"px !important}";
    document.head.appendChild(styleNode)
})();


(function () {
    document.addEventListener("touchstart",function (ev) {
        ev = ev||event;
        ev.preventDefault();
    })
})();


init();
function init() {
    window.onload = function (ev) {
        let wrap = document.querySelector('#wrap');
        let lis = document.querySelectorAll('#wrap .nav>li');
        let h = document.documentElement.clientHeight;
        let w = document.documentElement.clientWidth;
        let len = lis.length;
        let point = {
            now:0,
            prev:0,
            next:0,
            dir:"",
            display:"none",
            isStart:false,
            isMove:false
        };

        let start = {};

        wrap.addEventListener('touchstart',function (ev) {
            if(point.isMove){
                return;
            }

            console.log('start')
            point.isStart = true
            point.prev = point.now -1;
            point.next = point.now +1;

            if(point.prev<0){
                point.prev = len - 1;
            }else if(point.next>len-1){
                point.next = 0;
            }

            for(let i=0;i<len;i++){
                lis[i].style.zIndex = 2;
                lis[i].style.transition = "0s";
                lis[i].style.display = "none";
                lis[i].style.transformOrigin = "0 0" ;
            }

            ev = ev|| event;
            let touchC = ev.changedTouches[0];
            start.y = touchC.clientY;

            ryan.css(lis[point.prev],"translateY",-h);
            ryan.css(lis[point.next],"translateY",h);

            lis[point.now].style.display = "block";


            lis[point.now].style.zIndex = 3 ;
            lis[point.prev].style.zIndex = 4 ;
            lis[point.next].style.zIndex = 4 ;

            point.dir = '';
        })

        wrap.addEventListener('touchmove',function (ev) {
            if(point.ismoved || !point.isStart){
                return ;
            }

            console.log('move')
            lis[point.prev].style.display = "block";
            lis[point.next].style.display = "block";

            ev = ev || event;
            let touchC = ev.changedTouches[0];

            let nowY = touchC.clientY;
            let disY = nowY - start.y;

            if(disY<0){
                point.dir="up";
                ryan.css(lis[point.next],"translateY",h+disY);
                ryan.css(lis[point.prev],"translateY",-h)
                lis[point.now].style.transformOrigin = w + "px 0";
            }else{
                point.dir="down";
                ryan.css(lis[point.prev],"translateY",-h+disY);
                ryan.css(lis[point.next],"translateY",h);
                lis[point.now].style.transformOrigin = w + "px " + h + "px";
            }

            let scale = 1 - Math.abs(disY)/(Math.abs(disY)+h)/7;
            ryan.css(lis[point.now],"scale",scale);

        })

        wrap.addEventListener('touchend',function (ev) {
            if(point.dir==="" || point.ismoved ||!point.isStart){
                return;
            }
            ev = ev || event;
            point.isStart = false;
            point.isMove = true

            if(point.dir==="down"){
                lis[point.prev].style.transition = ".3s transform";
                lis[point.now].style.transition = ".3s transform";
                ryan.css(lis[point.now],"scale",0.9);
                lis[point.prev].addEventListener("transitionend",endFn)
                ryan.css(lis[point.prev],"translateY",0);
            }else if(point.dir === "up"){
                lis[point.next].style.transition = ".3s transform";
                lis[point.now].style.transition = ".3s transform";
                ryan.css(lis[point.now],"scale",0.9);
                lis[point.next].addEventListener("transitionend",endFn)
                ryan.css(lis[point.next],"translateY",0);
            }

            function endFn() {
                this.removeEventListener("transitionend",endFn)
                lis[point.now].style.display = "none";
                ryan.css(lis[point.now],"scale",1);
                setTimeout(function () {
                    if(point.dir === "up"){
                        point.now++;
                        if(point.now>len-1){
                            point.now = 0
                        }
                    }else if(point.dir === "down"){
                        point.now--;
                        if(point.now<0){
                            point.now = len - 1
                        }
                    }

                    point.isMove = false
                },10)
            }

        })

    }
}





