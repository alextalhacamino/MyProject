// ===============================
// MOBILE NAVIGATION MENU
// ===============================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("show");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.textContent = isOpen ? "✕" : "☰";
});


// Close the mobile menu after clicking a navigation link

document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("show");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});


// ===============================
// EXPANDABLE HISTORICAL ACCOUNTS
// ===============================

function toggleDetails(id, button) {
    const details = document.getElementById(id);

    const isHidden = details.hidden;

    details.hidden = !isHidden;

    button.textContent = isHidden ? "Read Less −" : "Read More +";
    button.setAttribute("aria-expanded", String(isHidden));
}


// ===============================
// SAVE STUDENT REFLECTION
// ===============================

function saveReflection() {
    const reflectionAnswer =
        document.getElementById("reflectionAnswer");

    const reflectionMessage =
        document.getElementById("reflectionMessage");

    const answer = reflectionAnswer.value.trim();

    if (answer.length === 0) {
        reflectionMessage.textContent =
            "Please write your reflection first.";

        return;
    }

    // Save the reflection in the current browser.
    // This does not send the answer to a server.

    try {
        localStorage.setItem("cryReflection", answer);

        reflectionMessage.textContent =
            "Your reflection has been saved in this browser.";

    } catch (error) {
        reflectionMessage.textContent =
            "Unable to save your reflection in this browser.";
    }
}


// ===============================
// LOAD PREVIOUS REFLECTION
// ===============================

window.addEventListener("DOMContentLoaded", function () {
    const reflectionAnswer =
        document.getElementById("reflectionAnswer");

    try {
        const savedReflection =
            localStorage.getItem("cryReflection");

        if (savedReflection) {
            reflectionAnswer.value = savedReflection;
        }

    } catch (error) {
        console.log("Local storage is unavailable.");
    }
});


// ===============================
// AUTOMATIC FOOTER YEAR
// ===============================

document.getElementById("year").textContent =
    new Date().getFullYear();


// ===============================
// POWERPOINT-STYLE SLIDES
// ===============================

const slides = Array.from(document.querySelectorAll("section[id]"));
const navigationLinks = document.querySelectorAll(".nav-links a");

// Group each slide's content so it can shrink proportionally to fit the screen.
slides.forEach(function (slide) {
    const content = document.createElement("div");
    content.className = "slide-content";

    while (slide.firstChild) {
        content.appendChild(slide.firstChild);
    }

    slide.appendChild(content);
});

const slideControls = document.createElement("div");
slideControls.className = "slide-controls";
slideControls.innerHTML = `
    <button type="button" class="slide-button" id="previousSlide" aria-label="Previous slide">Previous</button>
    <span class="slide-counter" id="slideCounter" aria-live="polite"></span>
    <button type="button" class="slide-button slide-button-next" id="nextSlide" aria-label="Next slide">Next</button>
    <button type="button" class="slide-button fullscreen-button" id="fullscreenToggle" aria-label="Toggle fullscreen" aria-pressed="false">Full</button>
    <div class="slide-progress" role="progressbar" aria-label="Presentation progress" aria-valuemin="1" aria-valuemax="${slides.length}" aria-valuenow="1"><span id="slideProgressFill"></span></div>
`;
document.body.appendChild(slideControls);

let activeSlide = 0;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function fitSlide(slide) {
    const content = slide.querySelector(".slide-content");
    if (!content || !slide.classList.contains("is-active")) return;

    content.style.transform = "scale(1)";

    const slideStyle = window.getComputedStyle(slide);
    const availableHeight = slide.clientHeight
        - parseFloat(slideStyle.paddingTop)
        - parseFloat(slideStyle.paddingBottom);
    const availableWidth = slide.clientWidth
        - parseFloat(slideStyle.paddingLeft)
        - parseFloat(slideStyle.paddingRight);
    const contentHeight = content.scrollHeight;
    const contentWidth = content.scrollWidth;

    if (!availableHeight || !availableWidth || !contentHeight || !contentWidth) return;

    const scale = Math.min(
        1,
        availableHeight / contentHeight,
        availableWidth / contentWidth
    );

    content.style.transform = scale < 0.995 ? `scale(${scale})` : "";
}

let fitFrame = 0;
function scheduleActiveSlideFit() {
    window.cancelAnimationFrame(fitFrame);
    fitFrame = window.requestAnimationFrame(function () {
        fitSlide(slides[activeSlide]);
    });
}

window.addEventListener("resize", scheduleActiveSlideFit);
if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleActiveSlideFit);
}

function animateSlide(slide, direction) {
    if (reduceMotion.matches || typeof slide.animate !== "function") return;

    slide.animate(
        [
            { opacity: 0, transform: `translateX(${direction * 34}px) scale(0.99)` },
            { opacity: 1, transform: "translateX(0) scale(1)" }
        ],
        { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );

    const animatedItems = slide.querySelectorAll(
        ".hero-content, .section-heading, .intro-grid, .profile-card, .memoir-card, .account-card, .table-container, .reason-card, .timeline-item, .conclusion-card, .reflection-card, .references-card"
    );

    animatedItems.forEach(function (item, index) {
        item.animate(
            [
                { opacity: 0, transform: "translateY(12px)" },
                { opacity: 1, transform: "translateY(0)" }
            ],
            {
                duration: 300,
                delay: Math.min(index * 55, 220),
                easing: "cubic-bezier(0.22, 1, 0.36, 1)"
            }
        );
    });
}

function showSlide(index) {
    const previousSlide = activeSlide;
    const nextSlideIndex = Math.max(0, Math.min(index, slides.length - 1));
    const hasChanged = nextSlideIndex !== previousSlide;
    activeSlide = nextSlideIndex;

    slides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === activeSlide;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
        slide.inert = !isActive;
    });

    scheduleActiveSlideFit();

    navigationLinks.forEach(function (link) {
        const isActive = link.getAttribute("href") === "#" + slides[activeSlide].id;
        link.classList.toggle("active", isActive);
    });

    document.getElementById("slideCounter").textContent =
        `${activeSlide + 1} / ${slides.length}`;
    const progress = document.querySelector(".slide-progress");
    progress.setAttribute("aria-valuenow", String(activeSlide + 1));
    const progressFill = document.getElementById("slideProgressFill");
    const oldProgressWidth = parseFloat(progressFill.style.width) || 0;
    const newProgressWidth = ((activeSlide + 1) / slides.length) * 100;
    progressFill.style.width = `${newProgressWidth}%`;
    if (hasChanged && !reduceMotion.matches && typeof progressFill.animate === "function") {
        progressFill.animate(
            [{ width: `${oldProgressWidth}%` }, { width: `${newProgressWidth}%` }],
            { duration: 360, easing: "ease-out" }
        );
    }

    if (hasChanged) {
        animateSlide(slides[activeSlide], activeSlide > previousSlide ? 1 : -1);
    }
    document.getElementById("previousSlide").disabled = activeSlide === 0;
    document.getElementById("nextSlide").disabled = activeSlide === slides.length - 1;
    history.replaceState(null, "", "#" + slides[activeSlide].id);
}

document.getElementById("previousSlide").addEventListener("click", function () {
    showSlide(activeSlide - 1);
});

document.getElementById("nextSlide").addEventListener("click", function () {
    showSlide(activeSlide + 1);
});

const fullscreenToggle = document.getElementById("fullscreenToggle");

function updateFullscreenButton() {
    const isFullscreen = Boolean(document.fullscreenElement);
    fullscreenToggle.textContent = isFullscreen ? "Exit" : "Full";
    fullscreenToggle.setAttribute("aria-pressed", String(isFullscreen));
}

fullscreenToggle.addEventListener("click", async function () {
    try {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }
    } catch (error) {
        fullscreenToggle.textContent = "Fullscreen unavailable";
        window.setTimeout(updateFullscreenButton, 1800);
    }
});

document.addEventListener("fullscreenchange", updateFullscreenButton);

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
        const targetIndex = slides.findIndex(function (slide) {
            return "#" + slide.id === link.getAttribute("href");
        });

        if (targetIndex !== -1) {
            event.preventDefault();
            showSlide(targetIndex);
        }
    });
});

document.addEventListener("keydown", function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const target = event.target;
    const isTyping = target.matches("input, textarea, select, [contenteditable='true']");
    if (isTyping) return;

    if (event.key === "Home") {
        showSlide(0);
    } else if (event.key === "End") {
        showSlide(slides.length - 1);
    } else if (
        event.key === "ArrowRight" || event.key === "PageDown" ||
        (event.code === "Space" && !target.matches("button"))
    ) {
        event.preventDefault();
        showSlide(activeSlide + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        showSlide(activeSlide - 1);
    }
});

let touchStart = null;

document.addEventListener("touchstart", function (event) {
    if (event.touches.length === 1) {
        touchStart = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }
}, { passive: true });

document.addEventListener("touchend", function (event) {
    if (!touchStart || event.changedTouches.length !== 1) return;

    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.y;

    if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        showSlide(activeSlide + (deltaX < 0 ? 1 : -1));
    }

    touchStart = null;
}, { passive: true });

const requestedSlide = slides.findIndex(function (slide) {
    return "#" + slide.id === window.location.hash;
});
showSlide(requestedSlide >= 0 ? requestedSlide : 0);
if (requestedSlide < 0) animateSlide(slides[0], 1);
