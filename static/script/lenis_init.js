// Initialize Lenis for smooth scrolling
// See: https://github.com/darkroomengineering/lenis

// Wait for Lenis to be loaded
const initLenis = () => {
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis not loaded yet, retrying...');
        requestAnimationFrame(initLenis);
        return;
    }

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Make lenis available globally
    window.lenis = lenis;

    // Connect Lenis to requestAnimationFrame
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    console.log('[✅Done] Lenis smooth scrolling initialized.');
};

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenis);
} else {
    initLenis();
}
