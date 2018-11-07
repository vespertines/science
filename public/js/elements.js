window.sr = ScrollReveal({
    delay: 0,
    distance: "60px",
    easing: "cubic-bezier(.19,1,.22,1)",
    rotate: {
        z: 0
    },
    scale: 1,
    duration: 2000,
    viewFactor: 0.4
});
sr.reveal(".img");
sr.reveal(".show");
sr.reveal(".reveal", 30);
sr.reveal(".award", 50);
sr.reveal(".client-logo", 50);

var body = document.body,
    timer;

window.addEventListener("scroll", function() {
    clearTimeout(timer);
    if (!body.classList.contains("disable-hover")) {
        body.classList.add("disable-hover")
    }

    timer = setTimeout(function() {
        body.classList.remove("disable-hover")
    }, 500);
}, false);

var sectionIndex = 0;

$(".left-container li").click(function() {
    $(".left-container li").removeClass("state");
    $(this).addClass("state");
    sectionIndex = $(this).index();
    $("html, body").animate({
        scrollTop: $("section").eq(sectionIndex).offset().top - 120
    }, 500);
    return false;
});

$(document).ready(function() {
    $("html").animate({
        scrollTop: 0
    }, 1);
    $("body").animate({
        scrollTop: 0
    }, 1);
});