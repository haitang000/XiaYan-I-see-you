
// 容器
const container = document.querySelector('.container');
// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.getElementsByClassName("close")[0];
let activeThumbnail = null;

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

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
    // Use the same silky cubic-bezier, add opacity fade out
    lightboxImg.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s ease';
    lightboxImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    lightboxImg.style.opacity = '0';

    // Cleanup after animation
    setTimeout(() => {
        lightbox.style.display = "none";
        lightboxImg.style.transform = '';
        lightboxImg.style.opacity = ''; // Reset opacity
        lightboxImg.style.transition = ''; // Reset transition
        activeThumbnail = null;
    }, 500); // Match transition duration
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

// Close lightbox on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape" && lightbox.style.display !== "none") {
        closeLightbox();
    }
});

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

// [性能优化] 共享单一 IntersectionObserver 实例，替代每张图片各自创建一个
// 原来：每张图片 new IntersectionObserver() → 48+ 个实例，内存压力大
// 现在：所有图片共用一个 observer，回调内按 entry.target 分别处理
const sharedObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            target.src = target.dataset.src;
            observer.unobserve(target);
        }
    });
}, {
    rootMargin: '200px 0px', // 提前 200px 开始加载
    threshold: 0.01
});

// 加入图片元素
function createImgs() {
    fetch('image/photos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(images => {
            console.log(`[✅Done] Include ${images.length} photos.`);
            images.forEach(filename => {
                let src = 'image/' + filename;
                let img = document.createElement('img');
                img.width = img_width;

                // Skeleton initialization
                img.classList.add('skeleton');
                // Assign a random height for the skeleton to create a waterfall effect immediately
                // Height between 200 and 400
                const randomHeight = Math.floor(Math.random() * 200) + 200;
                img.style.height = randomHeight + 'px';

                // Add click event for lightbox with FLIP animation
                img.onclick = function () {
                    // Store reference to the clicked thumbnail
                    activeThumbnail = this;

                    // 1. Get initial state (First)
                    const rect = this.getBoundingClientRect();

                    // Set source - using current src which should be loaded
                    lightboxImg.src = this.dataset.src || this.src;

                    // Show lightbox using flex to check dimensions, but keep background transparent initially
                    lightbox.style.display = "flex";

                    const animateOpen = () => {
                        // 2. Get final state (Last)
                        const fullRect = lightboxImg.getBoundingClientRect();

                        // 3. Calculate Invert (difference)
                        const scale = rect.width / fullRect.width;
                        const tx = (rect.left + rect.width / 2) - (fullRect.left + fullRect.width / 2);
                        const ty = (rect.top + rect.height / 2) - (fullRect.top + fullRect.height / 2);

                        // 4. Play
                        lightboxImg.style.transition = 'none';
                        lightboxImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
                        lightboxImg.style.opacity = '0';

                        requestAnimationFrame(() => {
                            lightboxImg.getBoundingClientRect();
                            lightbox.classList.add('open');
                            lightboxImg.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s ease';
                            lightboxImg.style.transform = 'translate(0, 0) scale(1)';
                            lightboxImg.style.opacity = '1';
                        });
                    };

                    if (lightboxImg.complete) {
                        animateOpen();
                    } else {
                        lightboxImg.onload = animateOpen;
                    }
                }

                // Lazy Load Setup
                img.dataset.src = src;

                img.onload = function () {
                    // Remove skeleton effect
                    img.classList.remove('skeleton');
                    img.style.height = ''; // Allow natural height
                    // Use debounced setPositions
                    debouncedSetPositions();
                };

                // [性能优化] 使用共享的 sharedObserver，而非每张图片各自 new 一个
                sharedObserver.observe(img);
                // 将图片添加到容器中
                container.appendChild(img);
            });

            // Initial layout for skeletons
            setPositions();
        })
        .catch(error => {
            console.error('Error loading photos:', error);
            console.log('Fallback to hardcoded list due to error.');
        });
}

// 初始化
createImgs();

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

// [性能优化] 用手写循环替代 Math.min/max(...array) 展开运算符
// 原因：当 next_tops 数组很大时，spread 展开会超出调用栈限制，并且每次都重建参数列表
function arrayMin(arr) {
    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
    }
    return min;
}

function arrayMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

// 设置每张图片的位置
function setPositions() {
    // 获取列数和间隙
    let info = cal();
    // 该数组的长度为列数，每一项表示该列的下一个图片的纵坐标
    let next_tops = new Array(info.columns).fill(0);

    const imgs = Array.from(container.children);
    // Batch READ: Get all heights first to avoid layout thrashing in loop
    const heights = imgs.map(img => img.offsetHeight);

    // Batch WRITE: Apply styles
    imgs.forEach((img, i) => {
        // [性能优化] 用 arrayMin() 替换 Math.min(...next_tops)
        let min_top = arrayMin(next_tops);
        img.style.top = min_top + 'px';

        // 重新设置数组这一项的下一个top值
        let index = next_tops.indexOf(min_top); //得到使用的是第几列的top值

        // Use cached height
        next_tops[index] += heights[i] + info.space;

        // 计算横坐标
        let left = (index + 1) * info.space + index * img_width;
        img.style.left = left + 'px';
    });

    // [性能优化] 用 arrayMax() 替换 Math.max(...next_tops)
    let max = arrayMax(next_tops);
    // 设置容器的高度
    container.style.height = max + 'px';
}

// Debounced version of setPositions for resize and loads
const debouncedSetPositions = debounce(setPositions, 100);

// 窗口尺寸变动后，重新排列
window.onresize = function () {
    debouncedSetPositions();
    console.log('[✅Done] 窗口尺寸变动,照片已重新排列 (Debounced)');
}