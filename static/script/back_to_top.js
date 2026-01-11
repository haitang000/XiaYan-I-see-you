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

    // Initial check in case page is refreshed while scrolled
    checkScroll();

    window.addEventListener('scroll', checkScroll);

    function checkScroll() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    backToTopBtn.addEventListener('click', function () {
        if (window.lenis) {
            window.lenis.scrollTo(0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});
