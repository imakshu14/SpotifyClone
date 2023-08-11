document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click", () => {
        const query = document.getElementById("query").value;
        searchAlbums(query);
    });
});

function searchAlbums(query) {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            const resultsContainer = document.getElementById("results");
            resultsContainer.innerHTML = ""; // Clear previous results

            const response = JSON.parse(this.responseText);
            const albums = response.albums.items;

            albums.forEach(album => {
                const albumContainer = createAlbumCard(album.data);
                resultsContainer.appendChild(albumContainer);
            });
        }
    });

    xhr.open('GET', `https://spotify23.p.rapidapi.com/search/?q=${encodeURIComponent(query)}&type=multi&offset=0&limit=100&numberOfTopResults=10`);
    xhr.setRequestHeader('X-RapidAPI-Key', 'b2f5bc78cbmsh449285586b543e1p1f88e3jsn0ba8e00d544e');
    xhr.setRequestHeader('X-RapidAPI-Host', 'spotify23.p.rapidapi.com');
    xhr.send();
}

function createAlbumCard(album) {
    const albumContainer = document.createElement("div");
    albumContainer.classList.add("album");

    const coverImg = document.createElement("img");
    coverImg.src = album.coverArt.sources[0].url;
    coverImg.alt = album.name;
    albumContainer.appendChild(coverImg);

    const albumInfo = document.createElement("div");
    albumInfo.classList.add("album-info");

    const albumName = document.createElement("h2");
    albumName.textContent = album.name;
    albumInfo.appendChild(albumName);

    const artistNames = album.artists.items.map(artist => artist.profile.name).join(", ");
    const artistsPara = document.createElement("p");
    artistsPara.textContent = `Artist(s): ${artistNames}`;
    albumInfo.appendChild(artistsPara);

    const releaseYear = document.createElement("p");
    releaseYear.textContent = `Release Year: ${album.date.year}`;
    albumInfo.appendChild(releaseYear);

    let artisturi = album.uri;
    let artistID = artisturi.split(":")[2];
    let artistsongurl = `https://open.spotify.com/album/${artistID}`;
    console.log(artistsongurl);

    const albumLink = document.createElement("a");
    albumLink.href = artistsongurl;
    albumLink.target = "_blank";
    albumLink.textContent = "View on Spotify";
    albumLink.classList.add("album-link");
    albumInfo.appendChild(albumLink);

    albumContainer.appendChild(albumInfo);

    return albumContainer;
}
