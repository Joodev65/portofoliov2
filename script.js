// Countdown Verifikasi
let timeLeft = 20;
let countdown = document.getElementById("countdown");

let timer = setInterval(() => {
    timeLeft--;
    countdown.innerText = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        document.getElementById("verification").style.display = "none";
        document.getElementById("content").classList.remove("hidden");
    }
}, 1000);

// Fungsi Menambahkan Postingan
function addPost() {
    let username = document.getElementById("username").value;
    let content = document.getElementById("post-content").value;

    if (username.trim() === "" || content.trim() === "") return;

    let postList = document.getElementById("post-list");
    let newPost = document.createElement("div");
    newPost.classList.add("post");
    newPost.innerHTML = `<strong>${username}:</strong> <p>${content}</p>`;

    postList.prepend(newPost);
    document.getElementById("username").value = "";
    document.getElementById("post-content").value = "";
}
