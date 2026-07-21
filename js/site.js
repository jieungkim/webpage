/* Site interactions: theme toggle, mobile nav, scroll reveal, back-to-top.
   Vanilla JS, no dependencies. Theme is also set inline in <head> to avoid FOUC. */
(function () {
    "use strict";

    /* ---- Theme ---- */
    var root = document.documentElement;
    var KEY = "jk-theme";

    function apply(theme) {
        root.setAttribute("data-theme", theme);
        try { localStorage.setItem(KEY, theme); } catch (e) {}
    }

    window.addEventListener("DOMContentLoaded", function () {
        var toggle = document.querySelector(".theme-toggle");
        if (toggle) {
            toggle.addEventListener("click", function () {
                var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
                apply(next);
            });
        }

        /* ---- Mobile nav ---- */
        var burger = document.querySelector(".nav__burger");
        var links = document.querySelector(".nav__links");
        if (burger && links) {
            burger.addEventListener("click", function () {
                links.classList.toggle("open");
            });
            links.addEventListener("click", function (e) {
                if (e.target.tagName === "A") links.classList.remove("open");
            });
        }

        /* ---- Active nav link ---- */
        var here = location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".nav__links a").forEach(function (a) {
            var href = a.getAttribute("href");
            if (href === here) a.classList.add("is-active");
        });

        /* ---- Scroll reveal ---- */
        var reveals = document.querySelectorAll(".reveal");
        if ("IntersectionObserver" in window && reveals.length) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (en) {
                    if (en.isIntersecting) {
                        en.target.classList.add("in");
                        io.unobserve(en.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
            reveals.forEach(function (el) { io.observe(el); });
        } else {
            reveals.forEach(function (el) { el.classList.add("in"); });
        }

        /* ---- Profile media rotator ---- */
        var media = document.getElementById("profile-media");
        if (media) {
            // representative (shown first) listed first; rest rotate randomly
            var files = [
                "img/profile3.mov",
                "img/profile1.jpg", "img/profile2.jpg", "img/profile4.JPG",
                "img/profile5.mov", "img/profile6.jpg", "img/profile7.jpg",
                "img/profile8.JPG", "img/profile9.JPG", "img/profile10.JPG",
                "img/profile11.JPG"
            ];
            var idx = -1;             // currently shown item (-1 = nothing rendered yet)
            var timer = null;
            var INTERVAL = 6000;      // auto-rotate every 6s
            var prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

            function isVideo(src) { return /\.mov$/i.test(src); }

            function build(src) {
                var el;
                if (isVideo(src)) {
                    el = document.createElement("video");
                    el.src = src;
                    el.autoplay = true;
                    el.loop = true;
                    el.muted = true;
                    el.playsInline = true;
                    el.setAttribute("aria-label", "Jieung Kim");
                } else {
                    el = document.createElement("img");
                    el.src = src;
                    el.width = 210;
                    el.height = 210;
                    el.alt = "Jieung Kim";
                }
                return el;
            }

            function show(next) {
                if (next === idx && media.firstChild) return;
                idx = (next + files.length) % files.length;
                media.classList.add("is-fading");
                setTimeout(function () {
                    var el = build(files[idx]);
                    media.innerHTML = "";
                    media.appendChild(el);
                    // force reflow so the fade-in transition applies
                    void media.offsetWidth;
                    media.classList.remove("is-fading");
                }, 300);
            }

            function randomOther() {
                if (files.length < 2) return idx;
                var n;
                do { n = Math.floor(Math.random() * files.length); } while (n === idx);
                return n;
            }

            function start() {
                if (prefersReduced || timer) return;
                timer = setInterval(function () { show(randomOther()); }, INTERVAL);
            }
            function stop() { if (timer) { clearInterval(timer); timer = null; } }
            function restart() { stop(); start(); }

            // manual controls reset the auto-rotate clock
            var prev = document.getElementById("profile-prev");
            var next = document.getElementById("profile-next");
            if (prev) prev.addEventListener("click", function () { show(idx - 1); restart(); });
            if (next) next.addEventListener("click", function () { show(idx + 1); restart(); });

            // pause auto-rotation while hovering/focusing
            var rotator = document.getElementById("profile-rotator");
            if (rotator) {
                rotator.addEventListener("mouseenter", stop);
                rotator.addEventListener("mouseleave", start);
                rotator.addEventListener("focusin", stop);
                rotator.addEventListener("focusout", start);
            }

            // always start with the representative media (files[0]), then random-rotate
            show(0);
            start();
        }

        /* ---- Back to top ---- */
        var toTop = document.querySelector(".to-top");
        if (toTop) {
            var onScroll = function () {
                if (window.scrollY > 480) toTop.classList.add("show");
                else toTop.classList.remove("show");
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
            toTop.addEventListener("click", function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    });
})();
