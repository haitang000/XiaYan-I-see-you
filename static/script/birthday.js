function activateBirthdayMode() {
    console.log("Activating Birthday Mode for XiaYan! 🎂");

    const titleH1 = document.getElementById('title-h1');
    const titleP = document.getElementById('title-p');

    if (titleH1) {
        titleH1.innerText = "✨ 夏彦，生日快乐！ ✨";
        titleH1.style.color = "#E6A23C";
        titleH1.style.textShadow = "0 2px 4px rgba(230, 162, 60, 0.2)";
        titleH1.style.fontFamily = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    }

    if (titleP) {
        titleP.innerText = "愿时光温柔，伴你岁岁年年 🎂";
    }

    if (typeof confetti === 'function') {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        let skew = 1;

        const colors = ['#FF7F50', '#FFD700', '#ffffff', '#F4A460'];

        (function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));

            skew = Math.max(0.8, skew - 0.001);

            confetti({
                particleCount: 1,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    y: (Math.random() * skew) - 0.2
                },
                colors: colors,
                shapes: ['circle'],
                gravity: 0.6,
                scalar: 1.0,
                drift: Math.random() - 0.5,
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        }());

        const clickHandler = (e) => {
            confetti({
                particleCount: 10,
                spread: 360,
                origin: { y: e.clientY / window.innerHeight, x: e.clientX / window.innerWidth },
                colors: colors,
                zIndex: 10
            });
        };
        document.addEventListener('click', clickHandler);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    // 月份为 生日月份-1，如“12月5日”则为:
    //     if (today.getMonth() === 11 && today.getDate() === 5) {
    if (today.getMonth() === 11 && today.getDate() === 5) {
        activateBirthdayMode();
    }
});

// Dev helper
window.dev = window.dev || {};
Object.defineProperty(window.dev, 'birthday', {
    get: function () {
        activateBirthdayMode();
        return "🎉 Happy Birthday!! 🎉";
    }
});
