// 容器
const container=document.querySelector('.container');
let img_width=220; //每张图片的固定宽度

// 加入图片元素
function createImgs(){
    for(let i=1;i<=27;i++){
        // 生成图片的src路径（图片名为：1~15.jpg）
        let src='static/'+i+'.jpg';
        let img=document.createElement('img');
        img.src=src;
        img.width=img_width;
        // 每一张图片加载完就设置位置
        img.onload=setPositions;
        // 将图片添加到容器中
        container.appendChild(img);
        console.log('[✅Done] 成功生成瀑布流');
    }
}

// 多加入一下图片
createImgs();
createImgs();
//createImgs();
//createImgs();

// 计算一共有多少列，以及每一列之间的间隙
function cal(){
    // 容器宽度
    let container_width=container.clientWidth;
    // 计算列的数量
    let columns=Math.floor(container_width/img_width);
    // 计算间隙
    let space_number=columns+1; //间隙的数量
    let left_space=container_width-columns*img_width; //计算剩余的空间
    let space=left_space/space_number; //每个间隙的空间
    return {
        space: space,
        columns: columns
    };
}

// 设置每张图片的位置
function setPositions(){
    // 获取列数和间隙
    let info=cal();
    // 该数组的长度为列数，每一项表示该列的下一个图片的纵坐标
    let next_tops=new Array(info.columns);
    // 将数组的每一项填充为0
    next_tops.fill(0);
    for(let i=0;i<container.children.length;i++){
        let img=container.children[i];
        // 找到next_tops中的最小值作为当前图片的纵坐标
        let min_top=Math.min.apply(null,next_tops);
        img.style.top=min_top+'px';
        // 重新设置数组这一项的下一个top值
        let index=next_tops.indexOf(min_top); //得到使用的是第几列的top值
        next_tops[index]+=img.height+info.space;
        // 计算横坐标
        let left=(index+1)*info.space+index*img_width;
        img.style.left=left+'px';
    }
    // 得到next_tops中的最大值
    let max=Math.max.apply(null,next_tops);
    // 设置容器的高度
    container.style.height=max+'px';
}

// window.onload=setPositions;
// 定时器
let timer=null;
// 窗口尺寸变动后，重新排列
window.onresize=function(){
    if(timer){
        clearTimeout(timer);
    }
    timer=setTimeout(setPositions,100);
    console.log('[✅Done] 窗口尺寸变动,照片已重新排列');
}