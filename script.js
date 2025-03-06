const video = document.getElementById('camera');
const captureBtn = document.getElementById('capture');
const photoList = document.getElementById('photo-list');
const frameBtns = document.querySelectorAll('.frame-btn');
const shapeBtns = document.querySelectorAll('.shape-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const saveBtn = document.getElementById('save');

let photos = [];
let selectedFrame = 'pink';
let selectedShape = 'square';
let selectedFilter = 'none';

// Aktifkan kamera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        alert("Kamera tidak bisa diakses!");
    });

// Ambil Foto
captureBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let img = new Image();
    img.src = canvas.toDataURL('image/png');
    img.style.border = `5px solid ${selectedFrame}`;
    img.style.borderRadius = selectedShape === 'circle' ? '50%' : '0';
    img.classList.add(selectedFilter);

    photoList.appendChild(img);
    photos.push(img);
});

// Pilih Bingkai
frameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedFrame = btn.dataset.color;
    });
});

// Pilih Bentuk
shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedShape = btn.dataset.shape;
    });
});

// Pilih Filter
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        selectedFilter = btn.dataset.filter;
    });
});

// Simpan Foto
saveBtn.addEventListener('click', () => {
    const combinedCanvas = document.createElement('canvas');
    const ctx = combinedCanvas.getContext('2d');
    
    const width = 300;
    const height = 300 * photos.length;
    combinedCanvas.width = width;
    combinedCanvas.height = height;

    photos.forEach((photo, index) => {
        const img = new Image();
        img.src = photo.src;
        ctx.drawImage(img, 0, index * 300, width, 300);
    });

    const link = document.createElement('a');
    link.download = 'JosePhotobooth.png';
    link.href = combinedCanvas.toDataURL();
    link.click();
});
