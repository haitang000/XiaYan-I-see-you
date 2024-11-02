/*window.onload = randomIcon;

function randomIcon (){
    //图片路径
    var ErrorIcon = new Array('image/icon/Thinking.png','image/icon/Cry.png','image/icon/Cry2.png','image/icon/Alone.png')
    var MaintenanceIcon = new Array('image/icon/Study.png','image/icon/Thinking.png','image/icon/PlayWithPhone.png')
    //随机数生成
    var randomNumError = Math.floor((Math.random() * ErrorIcon.length));
    var randomNumMaintenance = Math.floor((Math.random() * MaintenanceIcon.length));
    //替换图片
    document.getElementById("error-icon").src = ErrorIcon[randomNumError];
    document.getElementById("maintenance-icon").src = MaintenanceIcon[randomNumMaintenance];
}*/

// 当页面加载完成后执行
window.onload = function() {
    // 随机选择一个图标，并将其赋值给id为error-icon的元素
    randomIcon('error-icon', [
        'image/icon/Thinking.png',
        'image/icon/Cry.png',
        'image/icon/Cry2.png',
        'image/icon/Alone.png'
    ]);

    // 随机选择一个图标，并将其赋值给id为maintenance-icon的元素
    randomIcon('maintenance-icon', [
        'image/icon/Study.png',
        'image/icon/Thinking.png',
        'image/icon/PlayWithPhone.png'
    ]);

    randomIcon('source-icon', [
        'image/icon/Study.png',
        'image/icon/Thinking.png',
        'image/icon/PlayWithPhone.png'
    ]);
};

// 随机选择一个图标
function randomIcon(elementId, iconArray) {
    // 获取id为elementId的元素
    const element = document.getElementById(elementId);
    // 如果元素存在
    if (element) {
        // 随机生成一个索引
        const randomIndex = Math.floor(Math.random() * iconArray.length);
        // 将随机索引对应的图标赋值给元素的src属性
        element.src = iconArray[randomIndex];
    }
}