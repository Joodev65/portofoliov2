document.addEventListener("DOMContentLoaded", loadAnimeList);

function addAnime() {
    let name = document.getElementById("anime-name").value;
    let status = document.getElementById("anime-status").value;

    if (name.trim() === "") {
        alert("Masukkan nama anime!");
        return;
    }

    let anime = { name, status };
    let animeList = JSON.parse(localStorage.getItem("animeList")) || [];
    animeList.push(anime);
    localStorage.setItem("animeList", JSON.stringify(animeList));

    document.getElementById("anime-name").value = "";
    loadAnimeList();
}

function loadAnimeList() {
    let animeContainer = document.getElementById("anime-container");
    animeContainer.innerHTML = "";

    let animeList = JSON.parse(localStorage.getItem("animeList")) || [];
    
    animeList.forEach((anime, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${anime.name} - <b>${anime.status}</b> 
        <button onclick="deleteAnime(${index})">Hapus</button>`;
        animeContainer.appendChild(li);
    });
}

function deleteAnime(index) {
    let animeList = JSON.parse(localStorage.getItem("animeList")) || [];
    animeList.splice(index, 1);
    localStorage.setItem("animeList", JSON.stringify(animeList));
    loadAnimeList();
}
