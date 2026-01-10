// Back to Top functionality
document.addEventListener('DOMContentLoaded', function () {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.title = 'Back to Top';
    backToTopBtn.style.display = 'none'; // Hidden by default
    document.body.appendChild(backToTopBtn);

    // CSS for the button is injected here or should be in CSS file. 
    // For cleanliness, let's inject a style block specifically for this or assume it's in CSS.
    // Let's add inline styles for simplicity and self-containment in this JS, 
    // but better to move to CSS.
    Object.assign(backToTopBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '999',
        border: 'none',
        outline: 'none',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        cursor: 'pointer',
        padding: '10px 15px',
        borderRadius: '50%',
        fontSize: '18px',
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: '0.7',
        backdropFilter: 'blur(5px)'
    });

    // Dark mode handled by transparency, but can check prefers-color-scheme if needed.

    backToTopBtn.onmouseover = function () {
        this.style.opacity = '1';
        this.style.transform = 'translateY(-3px)';
    };
    backToTopBtn.onmouseout = function () {
        this.style.opacity = '0.7';
        this.style.transform = 'translateY(0)';
    };

    window.onscroll = function () {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    };

    backToTopBtn.onclick = function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
});
