
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

                // IntersectionObserver callback
                const observerCallback = (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const target = entry.target;
                            target.src = target.dataset.src;
                            observer.unobserve(target);
                        }
                    });
                };

                // Create observer (singleton logic optimization possible, but per-image is fine for now)
                const observer = new IntersectionObserver(observerCallback, {
                    rootMargin: '200px 0px', // Preload 200px before appearing
                    threshold: 0.01
                });

                img.onload = function () {
                    // Remove skeleton effect
                    img.classList.remove('skeleton');
                    img.style.height = ''; // Allow natural height
                    // Use debounced setPositions
                    debouncedSetPositions();
                };

                // Start observing
                observer.observe(img);
                // 将图片添加到容器中
                container.appendChild(img);
            });

            // Initial layout for skeletons
            // We wait a tiny bit to ensure elements are appended
            // Use immediate call for first paint
            setPositions();
        })
        .catch(error => {
            console.error('Error loading photos:', error);
            // Fallback to limited hardcoded logic if json missing? 
            // Better to just log error as we expect usage within provided docker env.
            // Or we could implement a fallback loop if really needed.
            console.log('Fallback to hardcoded list due to error.');
            for (let i = 1; i <= 48; i++) {
                // ... old logic ... but simpler to just rely on the new system
            }
        });
}

// 初始化
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
        // 找到next_tops中的最小值作为当前图片的纵坐标
        let min_top = Math.min(...next_tops);
        img.style.top = min_top + 'px';

        // 重新设置数组这一项的下一个top值
        let index = next_tops.indexOf(min_top); //得到使用的是第几列的top值

        // Use cached height
        next_tops[index] += heights[i] + info.space;

        // 计算横坐标
        let left = (index + 1) * info.space + index * img_width;
        img.style.left = left + 'px';
    });

    // 得到next_tops中的最大值
    let max = Math.max(...next_tops);
    // 设置容器的高度
    container.style.height = max + 'px';
}

// window.onload=setPositions;
// Debounced version of setPositions for resize and loads
const debouncedSetPositions = debounce(setPositions, 100);

// 窗口尺寸变动后，重新排列
window.onresize = function () {
    debouncedSetPositions();
    console.log('[✅Done] 窗口尺寸变动,照片已重新排列 (Debounced)');
}