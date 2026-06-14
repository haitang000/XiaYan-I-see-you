var $container = document.getElementById("container");

var isDown = false;   // 是否按下鼠标
var inertance = 1.2;  // 惯性系数，越大惯性越不明显，不能小于0
var fv = 0;           // 滑动的力度
var rafId = null;     // [性能优化] 用于跟踪 requestAnimationFrame ID，便于取消

$container.onmousedown = function (e) {
    // [性能优化] 取消仍在运行的惯性动画 rAF，避免多次按下时动画叠加
    if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    fv = 0;
    this._start = e.clientX; // 鼠标按下的位置
    isDown = true;            // 鼠标是否有按下，主要防止用户是从容器外开始滑动的
}

$container.onmousemove = function (e) {
    if (isDown) {
        var miss = e.clientX - this._start;
        moveMiss(miss);
        this._start = e.clientX;
        fv = miss;
    }
}

// 在 moveMiss 函数中增加边界检测
function moveMiss(miss) {
    const maxLeft = container.scrollWidth - container.clientWidth;
    let newLeft = miss + $container.offsetLeft;

    // 限制滚动范围
    newLeft = Math.max(-maxLeft, Math.min(0, newLeft));

    $container.style.left = newLeft + "px";
}

window.onmouseup = function (e) {
    if (isDown) {
        isDown = false;
        // [性能优化] 用 requestAnimationFrame 替换 setInterval(fn, 20ms)
        // 原来：setInterval 以固定 20ms 间隔触发，不与屏幕刷新率对齐，导致动画卡顿或冗余计算
        // 现在：rAF 在每个显示帧执行，天然与屏幕刷新率同步（60fps/120fps 自适应）
        var friction = ((fv >> 31) * 2 + 1) * inertance; // 根据力度套用公式计算惯性大小
        var num = Math.abs(friction);

        function inertiaStep() {
            fv -= friction;
            moveMiss(fv);
            if (Math.abs(fv) >= num) {
                rafId = requestAnimationFrame(inertiaStep);
            } else {
                rafId = null;
            }
        }

        rafId = requestAnimationFrame(inertiaStep);
    }
}