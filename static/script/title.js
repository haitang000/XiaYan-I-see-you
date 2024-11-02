let Titleh1 = document.querySelector('#title-h1');
let Titlep = document.querySelector('#title-p');
Titleh1.style.transition = "opacity 1s ease-in-out"; // 添加淡入淡出效果
Titlep.style.transition = "opacity 1s ease-in-out"; // 添加淡入淡出效果
let time = new Date(); // 确保time变量是一个Date对象
let month = time.getMonth() + 1; // 月份从1开始
let day = time.getDate();

/*window.onload = function(){
    if (month == 12 && day == 5) {
        Titleh1.innerText = "🎉 今天是夏彦的生日 12.5 🎉"; //标题
        Titlep.innerText = "祝  ☀比冬日暖阳还要耀眼的你☀  快乐安康 万事顺遂" //描述
        setTimeout(function() {
            Titleh1.innerText = "🎉 生日快乐，夏侦探 🎉";
        }, 3000);
    }else{
        Titleh1.innerText = "「与你重逢，是最美好的事」";
            setTimeout(function() {
                Titleh1.innerText = "你好！欢迎来到夏彦照片墙";
            }, 3000);
    }
};*/

if (month == 12 && day == 5) {
    Titleh1.innerText = "🎉 今天是夏彦的生日 12.5 🎉";
    Titlep.innerText = "祝 ☀比冬日暖阳还要耀眼的你☀ 快乐安康 万事顺遂";
    
    // 先淡入显示
    setTimeout(function() {
        Titleh1.style.opacity = 1;
        Titlep.style.opacity = 1;
    }, 100); // 延迟100毫秒再淡入，避免页面加载的突兀感

    // 3秒后更新Titleh1文本，并再次触发淡入效果
    setTimeout(function() {
        Titleh1.style.opacity = 0; // 先淡出
        setTimeout(function() {
            Titleh1.innerText = "🎉 生日快乐，夏侦探 🎉";
            Titleh1.style.opacity = 1; // 再次淡入
        }, 1000); // 等待淡出完成
    }, 3000);

} else {
    // 如果不是12月5日，显示默认信息
    Titleh1.innerText = "「与你重逢，是最美好的事」";
    setTimeout(() => {
        Titleh1.style.opacity = 1; // 触发淡入效果
    });

    // 等待3秒后更改文本，并添加淡入淡出效果
    setTimeout(function() {
        Titleh1.style.opacity = 0; // 先淡出
        setTimeout(function() { // 等待淡出结束
            Titleh1.innerText = "你好！欢迎来到夏彦照片墙";
            Titleh1.style.opacity = 1; // 触发淡入效果
        }, 1000); // 等待2秒，确保淡出动画完成
    }, 3000); // 5秒后开始切换文本，包含初始的3秒等待时间
}