console.log('Lets Write Javascript');
let currentSong = new Audio();
let songs = [];  // Initialize an empty array to store songs
let currFolder = "";

// Convert seconds to MM:SS format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// GitHub raw content base URL
const GITHUB_BASE_URL = "https://raw.githubusercontent.com/chalakbilla/spotifyclone/main/songs";

// Function to fetch song list manually
async function getSongs(folder) {
    currFolder = folder;  
    let songListUrl = `${GITHUB_BASE_URL}/${folder}/songs.json`;  // JSON file containing song names

    try {
        let response = await fetch(songListUrl);
        if (!response.ok) throw new Error("Failed to fetch song list");

        let data = await response.json();
        songs = data.songs;  // Assign fetched songs

        let songUL = document.querySelector(".songList ul");
        songUL.innerHTML = "";  // Clear previous list

        for (const song of songs) {
            songUL.innerHTML += `<li>
                                    <img src="img/music.svg" class="invert" alt="">
                                    <div class="info">
                                        <div>${song.replaceAll("%20", " ")}</div>
                                        <div class="singer">Chalak Billa</div>
                                    </div>
                                    <div class="playnow">
                                        <span>Play Now</span>
                                        <img src="img/play.svg" alt="">
                                    </div>
                                </li>`;
        }

        // Attach event listeners to play songs
        Array.from(songUL.getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML);
            });
        });
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Function to play a song
const playMusic = async (track) => {
    try {
        let formattedTrack = track.replace(/ /g, '%20');
        let audioURL = `${GITHUB_BASE_URL}/${currFolder}/${formattedTrack}`;
        console.log(`Playing: ${audioURL}`);

        currentSong.src = audioURL;
        await currentSong.play();
        document.querySelector(".songinfo").innerHTML = track.replace("%20", " ");
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
        play.src = "img/pause.svg";
    } catch (error) {
        console.error("Error playing track:", error);
    }
};

// Function to fetch and display albums
async function displayAlbums() {
    let albumListUrl = `${GITHUB_BASE_URL}/albums.json`;  // JSON file with album details
    try {
        let response = await fetch(albumListUrl);
        if (!response.ok) throw new Error("Failed to fetch albums");

        let albums = await response.json();
        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = "";

        albums.forEach(album => {
            cardContainer.innerHTML += `
                <div data-folder="${album.folder}" class="card">
                    <div class="play">
                        <img src="play.svg" alt="">
                    </div>
                    <img src="${GITHUB_BASE_URL}/${album.folder}/cover.jpg" alt="Album Cover">
                    <h2>${album.title}</h2>
                    <p>${album.description}</p>
                </div>`;
        });

        // Attach event listeners to load songs when clicking an album
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                await getSongs(item.currentTarget.dataset.folder);
            });
        });
    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}

// Main function
async function main() {
    await displayAlbums();  // Load album details
    await getSongs("ncs");  // Load default song folder

    // Play/Pause event listener
    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/playsong.svg";
        }
    });

    // Seekbar event
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const seekbar = e.currentTarget.getBoundingClientRect();
        const clickPosition = (e.clientX - seekbar.left) / seekbar.width;
        document.querySelector(".circle").style.left = (clickPosition * 100) + "%";
        currentSong.currentTime = clickPosition * currentSong.duration;
    });

    // Volume Control
    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    // Next and Previous Song Controls
    document.getElementById("previous").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").pop());
        if (index > 0) playMusic(songs[index - 1]);
    });

    document.getElementById("next").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").pop());
        if (index < songs.length - 1) playMusic(songs[index + 1]);
    });
}

main();
