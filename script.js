document.getElementById("uploadBtn").addEventListener("click", function() {
    let fileInput = document.getElementById("fileInput");
    let progressBar = document.getElementById("progressBar");
    let linkOutput = document.getElementById("linkOutput");

    if (fileInput.files.length === 0) {
        alert("Pilih file terlebih dahulu!");
        return;
    }

    // Simulasi progress bar
    let progress = 0;
    let interval = setInterval(() => {
        progress += 10;
        progressBar.value = progress;

        if (progress >= 100) {
            clearInterval(interval);
            let fileName = fileInput.files[0].name;
            linkOutput.innerHTML = `✅ File berhasil diupload! <br> 🔗 Link: <a href="#">https://joolink.com/${fileName}</a>`;
        }
    }, 500);
});
