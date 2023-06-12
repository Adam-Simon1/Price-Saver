var map = L.map('map').setView([40, 0], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
    }).addTo(map);

OPTIONS = {
    position: 'topleft',
}

L.control.locate(OPTIONS).addTo(map);