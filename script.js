function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

function playAudio() {
    let audio = document.getElementById("bg-audio");
    audio.play();
}
