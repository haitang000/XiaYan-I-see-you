window.onload = randomErrorIcon;

function randomErrorIcon (){
    var ErrorIcon = new Array('image/icon/Thinking.png','image/icon/Cry.png','image/icon/Alone.png')
    var randomNum = Math.floor((Math.random() * ErrorIcon.length));
    document.getElementById("error-icon").src = ErrorIcon[randomNum];
}
