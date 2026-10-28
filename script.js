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
}


// ===============================
// BACK TO TOP BUTTON
// ===============================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
});

backToTop.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


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
// ACTIVE NAVIGATION LINK
// ===============================

const sections = document.querySelectorAll("section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", function () {
    let currentSection = "";

    sections.forEach(function (section) {
        const sectionTop = section.offsetTop - 120;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {
            currentSection = section.getAttribute("id");
        }
    });

    navigationLinks.forEach(function (link) {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
});