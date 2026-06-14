// Back to Top functionality
document.addEventListener('DOMContentLoaded', function () {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    // Using a sleek SVG arrow
    backToTopBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    backToTopBtn.title = 'Back to Top';
    document.body.appendChild(backToTopBtn);

    // [性能优化] 对 scroll 事件进行节流（throttle），限制每 100ms 最多执行一次
    // 原来：每次滚动事件都触发 checkScroll，高频滚动时每秒可触发数十次 DOM 操作
    // 现在：节流后最多每 100ms 执行一次，大幅减少不必要的 classList 操作
    let scrollThrottleTimer = null;
    function throttledCheckScroll() {
        if (scrollThrottleTimer !== null) return;
        scrollThrottleTimer = setTimeout(() => {
            checkScroll();
            scrollThrottleTimer = null;
        }, 100);
    }

    // Initial check in case page is refreshed while scrolled
    checkScroll();

    window.addEventListener('scroll', throttledCheckScroll, { passive: true });

    function checkScroll() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
