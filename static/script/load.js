document.addEventListener("DOMContentLoaded", function () {
    // 创建并插入进度条
    const progressBarContainer = document.createElement("div");
    const progressBar = document.createElement("div");

    progressBarContainer.style.position = "fixed";
    progressBarContainer.style.top = "0";
    progressBarContainer.style.left = "0";
    progressBarContainer.style.width = "100%";
    progressBarContainer.style.height = "5px";
    progressBarContainer.style.backgroundColor = "#ccc";
    progressBarContainer.style.zIndex = "9999";

    progressBar.style.width = "0";
    progressBar.style.height = "100%";
    progressBar.style.backgroundColor = "#0099DD";

    progressBarContainer.appendChild(progressBar);
    document.body.appendChild(progressBarContainer);

    // 获取所有图片
    const images = document.images;
    const totalImages = images.length;
    let imagesLoaded = 0;

    function updateProgressBar() {
        imagesLoaded++;
        const percentage = (imagesLoaded / totalImages) * 100;
        progressBar.style.width = percentage + "%";

        // 所有图片加载完毕，移除进度条
        if (imagesLoaded === totalImages) {
            setTimeout(() => {
                progressBarContainer.style.transition = "opacity 0.5s";
                progressBarContainer.style.opacity = "0";
                setTimeout(() => {
                    progressBarContainer.remove();
                }, 500);
            }, 500);
        }
    }

    // 监听每张图片的加载事件
    for (let i = 0; i < totalImages; i++) {
        if (images[i].complete) {
            // 如果图片已经加载完毕，直接更新进度条
            updateProgressBar();
        } else {
            images[i].addEventListener("load", updateProgressBar);
            images[i].addEventListener("error", updateProgressBar); // 如果加载失败，也算作完成
        }
    }
});
