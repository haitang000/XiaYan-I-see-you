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

window.onload = function() {
    randomIcon('error-icon', [
        'image/icon/Thinking.png',
        'image/icon/Cry.png',
        'image/icon/Cry2.png',
        'image/icon/Alone.png'
    ]);

    randomIcon('maintenance-icon', [
        'image/icon/Study.png',
        'image/icon/Thinking.png',
        'image/icon/PlayWithPhone.png'
    ]);
};

function randomIcon(elementId, iconArray) {
    const element = document.getElementById(elementId);
    if (element) {
        const randomIndex = Math.floor(Math.random() * iconArray.length);
        element.src = iconArray[randomIndex];
    }
}
