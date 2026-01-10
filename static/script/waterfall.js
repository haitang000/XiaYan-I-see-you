
// 容器
const container = document.querySelector('.container');
// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementsByClassName("close")[0];
let activeThumbnail = null;

// Close lightbox function
function closeLightbox() {
    if (!activeThumbnail) {
        lightbox.classList.remove('open');
        setTimeout(() => {
            lightbox.style.display = "none";
            lightboxImg.style.transform = ''; // Reset transform
        }, 300);
        return;
    }

    // 1. First: Current state of lightbox image
    const startRect = lightboxImg.getBoundingClientRect();

    // 2. Last: State of the thumbnail
    // Note: The thumbnail might have moved due to resize, so we should re-measure
    const endRect = activeThumbnail.getBoundingClientRect();

    // 3. Invert
    // Calculate scale difference (Thumbnail / Full)
    const scale = endRect.width / startRect.width;

    // Calculate position difference (center to center)
    const tx = (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2);
    const ty = (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2);

    // 4. Play
    lightbox.classList.remove('open'); // Start fading out background

    // Apply transform to match thumbnail
    // Use the same cubic-bezier for consistency
    lightboxImg.style.transition = 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)';
    lightboxImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;

    // Cleanup after animation
    setTimeout(() => {
        lightbox.style.display = "none";
        lightboxImg.style.transform = '';
        lightboxImg.style.transition = ''; // Reset transition
        activeThumbnail = null;
    }, 300); // Match transition duration
}

// Close lightbox when clicking close button
if (closeBtn) {
    closeBtn.onclick = closeLightbox;
}

// Close lightbox when clicking outside the image
if (lightbox) {
    lightbox.onclick = function (e) {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    }
}
let img_width = 200; //每张图片的固定宽度

if (
    navigator.userAgent.match(/Mobi/i) ||
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/iPhone/i)
) {
    console.log('[✅Done] 检测到当前使用设备为移动端设备');
    img_width = 160; //移动端适配
} else {
    console.log('[✅Done] 检测到当前使用设备为PC端设备');
    img_width = 200; //pc端适配
}


// 加入图片元素
function createImgs() {
    for (let i = 1; i <= 48; i++) {
        let src = 'image/' + i + '.jpg';
        let img = document.createElement('img');
        img.src = src;
        img.width = img_width;

        // Add click event for lightbox with FLIP animation
        img.onclick = function () {
            // Store reference to the clicked thumbnail
            activeThumbnail = this;

            // 1. Get initial state (First)
            const rect = this.getBoundingClientRect();

            // Set source
            lightboxImg.src = this.src;

            // Show lightbox using flex to check dimensions, but keep background transparent initially
            lightbox.style.display = "flex";

            // Force redraw to ensure image is rendered so we can get its dimensions
            // We need to wait for the image to load if it's not cached, but since src is same it should be fast
            // To be safe, we perform calculations after a brief delay or immediately if loaded

            const animateOpen = () => {
                // 2. Get final state (Last)
                const fullRect = lightboxImg.getBoundingClientRect();

                // 3. Calculate Invert (difference)
                // Calculate scale difference
                const scale = rect.width / fullRect.width;

                // Calculate position difference (center to center)
                // Note: rect.left is edge, we want center. 
                const tx = (rect.left + rect.width / 2) - (fullRect.left + fullRect.width / 2);
                const ty = (rect.top + rect.height / 2) - (fullRect.top + fullRect.height / 2);

                // 4. Play
                // Apply the transform to put the large image exactly where the thumbnail is
                lightboxImg.style.transition = 'none';
                lightboxImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;

                // Wait for the next frame
                requestAnimationFrame(() => {
                    // Force reflow
                    lightboxImg.getBoundingClientRect();

                    // Add transition and remove transform (return to center)
                    lightbox.classList.add('open'); // Fade in background
                    lightboxImg.style.transition = 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)';
                    lightboxImg.style.transform = 'translate(0, 0) scale(1)';
                });
            };

            if (lightboxImg.complete) {
                animateOpen();
            } else {
                lightboxImg.onload = animateOpen;
            }
        }
        // 每一张图片加载完就设置位置
        img.onload = setPositions;
        // 将图片添加到容器中
        container.appendChild(img);
    }
}

// 多加入一下图片
createImgs();
createImgs();
//createImgs();
//createImgs();

// 计算一共有多少列，以及每一列之间的间隙
function cal() {
    // 容器宽度
    let container_width = container.clientWidth;
    // 计算列的数量
    let columns = Math.floor(container_width / img_width);
    // 计算间隙
    let space_number = columns + 1; //间隙的数量
    let left_space = container_width - columns * img_width; //计算剩余的空间
    let space = left_space / space_number; //每个间隙的空间
    return {
        space: space,
        columns: columns
    };
}

// 设置每张图片的位置
function setPositions() {
    // 获取列数和间隙
    let info = cal();
    // 该数组的长度为列数，每一项表示该列的下一个图片的纵坐标
    let next_tops = new Array(info.columns);
    // 将数组的每一项填充为0
    next_tops.fill(0);
    for (let i = 0; i < container.children.length; i++) {
        let img = container.children[i];
        // 找到next_tops中的最小值作为当前图片的纵坐标
        let min_top = Math.min.apply(null, next_tops);
        img.style.top = min_top + 'px';
        // 重新设置数组这一项的下一个top值
        let index = next_tops.indexOf(min_top); //得到使用的是第几列的top值
        next_tops[index] += img.height + info.space;
        // 计算横坐标
        let left = (index + 1) * info.space + index * img_width;
        img.style.left = left + 'px';
    }
    // 得到next_tops中的最大值
    let max = Math.max.apply(null, next_tops);
    // 设置容器的高度
    container.style.height = max + 'px';
}

// window.onload=setPositions;
// 定时器
let timer = null;
// 窗口尺寸变动后，重新排列
window.onresize = function () {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(setPositions, 100);
    console.log('[✅Done] 窗口尺寸变动,照片已重新排列');
}