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
