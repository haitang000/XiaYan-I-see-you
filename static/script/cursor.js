let mainCursor;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

// [性能优化] 删除原来的 getStyle()：该函数仅用于遍历 DOM 收集 pointer 元素
// 收集结果存入 this.pt 但从未被读取，属于无用代码，同时避免了首次加载时
// 遍历所有 DOM 元素并触发大量 getComputedStyle 调用的昂贵操作。

const cursorInit = () => {
    mainCursor = new Cursor();
    return mainCursor;
};

class Cursor {
    constructor() {
        this.pos = {
            curr: null,
            prev: null,
        };
        this.create();
        this.init();
        this.render();
        // [性能优化] 初始化时调用一次 checkthemmode，而不是每帧都调用
        this.checkthemmode();
        // 监听系统主题变化事件，响应式更新光标颜色
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            this.checkthemmode();
        });
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("xs-hidden");
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        // [性能优化] 删除原来遍历所有 DOM 元素收集 pointer 元素的逻辑
        // 原代码：for (let i = 0; i < el.length; i++) { getComputedStyle(el[i])... }
        // this.pt 数组收集后从未被使用，纯属无用开销

        // Create style element only once
        if (!this.scr) {
            this.scr = document.createElement("style");
            document.body.appendChild(this.scr);
        }

        // Cache current cursor fill color
        this.cursorFill = null;
    }

    refresh() {
        this.cursor.classList.remove("active");
        this.pos = {
            curr: null,
            prev: null,
        };

        this.create();
        this.init();
        this.render();
    }

    init() {
        this.cursorFill = null;
        document.onmousemove = (e) => {
            this.pos.curr == null && this.move(e.clientX - 8, e.clientY - 8);
            this.pos.curr = {
                x: e.clientX - 8,
                y: e.clientY - 8,
            };
            this.cursor.classList.remove("hidden");
        };
        document.onmouseenter = () => this.cursor.classList.remove("hidden");
        document.onmouseleave = () => this.cursor.classList.add("hidden");
        document.onmousedown = () => this.cursor.classList.add("active");
        document.onmouseup = () => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.35);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.35);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        // [性能优化] 删除每帧调用的 this.checkthemmode()
        // 原来：每帧都读取 localStorage + window.matchMedia → 不必要的帧内开销
        // 现在：仅在构造时调用一次 + 监听 matchMedia change 事件响应主题切换
        requestAnimationFrame(() => this.render());
    }

    checkthemmode() {
        const preference = localStorage.getItem('vitepress-theme-appearance') || 'auto';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDarkMode = !preference || preference === 'auto' ? prefersDark : preference === 'dark';
        const cursorFill = isDarkMode ? 'white' : 'black';

        // Only update cursor fill color if it has changed
        if (this.cursorFill !== cursorFill) {
            this.cursorFill = cursorFill;
            this.cursor.classList.toggle('dark', isDarkMode);
            this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='10px' height='10px'><circle cx='4' cy='4' r='4' fill='${cursorFill}' /></svg>") 4 4, auto !important}`;
        }
    }
}

/* 手机版不再显示自定义指针图标 */
function checkDesktop() {
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    const isTablet = /iPad/i.test(navigator.userAgent)
    const isDesktop = !isMobile && !isTablet;
    return isDesktop;
}

let isDesktop = checkDesktop()

if (isDesktop) {
    cursorInit() // 初始化
}