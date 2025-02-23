console.log('Lets Write Javascript');
let currentSong = new Audio;
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Declare the global variable
let fetched_url = "";

async function getSongs(folder) {
    currFolder = folder; // Update the current folder
    let response;
    let primaryUrl = `http://127.0.0.1:3000/${folder}/`;
    let fallbackUrl = `http://127.0.0.1:3000/spotify%20clone/${folder}/`;

    // Attempt to fetch from the primary URL
    let fetchResponse = await fetch(primaryUrl);

    if (fetchResponse.ok) {
        // If the fetch from the primary URL is successful, get the response text
        response = await fetchResponse.text();
    } else {
        // If the primary URL fetch fails, log the error and try the fallback URL
        console.log("Primary URL failed. Trying fallback...");

        // Attempt to fetch from the fallback URL
        fetchResponse = await fetch(fallbackUrl);

        if (fetchResponse.ok) {
            // If the fetch from the fallback URL is successful, get the response text
            response = await fetchResponse.text();
        } else {
            // If both fetches fail, log the error and return an empty array
            console.log("Can't fetch from both primary and fallback URLs.");
            return []; // Return an empty array if both fetches fail
        }
    }

    // Parse the response and extract song links
    let div = document.createElement("div");
    div.innerHTML = response;
    let links = div.getElementsByTagName("a");
    let songs = [];

    // Extract .mp3 links
    for (let link of links) {
        if (link.href.endsWith(".mp3")) {
            songs.push(link.href.split(`/${folder}/`)[1]);
        }
    }

    // Get the song list container
    let songUL = document.querySelector(".songList ul");

    // Clear the <ul> to ensure it's empty before adding new songs
    songUL.innerHTML = ""; // Clear the list

    // Loop through the songs and add each as a <li> to the <ul>
    for (const song of songs) {
        songUL.innerHTML += `<li>
                            <img src="music.svg" class="invert" alt="">
                            <div class="info">
                                <div>${song.replaceAll(/%20/g, " ").replace(/_/g, " ")}</div>
                                <div class="singer">Chalak Billa</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="play.svg" alt="">
                            </div>
                        </li>`;
    }

    // Attach an event listener to each song
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });
} 





const playMusic = async (track) => {
    try {
        // Normalize the track name to handle spaces and special characters for URLs
        const formattedTrack = track.replace(/ /g, '%20').replace(/,/g, '%20');

        // Construct the URL using the specified folder
        let audioURL = `http://127.0.0.1:3000/spotify%20clone/${currFolder}/${formattedTrack}`;

        // Attempt to check if the URL is reachable or valid
        const response = await fetch(audioURL, { method: 'HEAD' });
        if (!response.ok) {
            throw new Error(`Track not found in folder ${currFolder}`);
        }

        // If the track is found, use the constructed URL
        console.log(`Playing: ${audioURL}`);
        currentSong.src = audioURL;

        // Play the track
        await currentSong.play();
        play.src = "pause.svg";
        document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(/%20/g, " ").replace(/_/g, " ");
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    } catch (error) {
        console.error('Error in playMusic function:', error);

        try {
            // Fallback to the default 'songs' directory if the first URL fails
            const fallbackURL = `http://127.0.0.1:3000/${currFolder}/${formattedTrack}`;
            console.log(`Attempting to play from fallback: ${fallbackURL}`);

            const response = await fetch(fallbackURL, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error(`Track not found in fallback folder ${currFolder}`);
            }

            currentSong.src = fallbackURL;
            await currentSong.play();
            play.src = "pause.svg";
            document.querySelector(".songinfo").innerHTML = decodeURI(track).replace(/%20/g, " ").replace(/_/g, " ");
            document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
        } catch (error) {
            console.error('Error in fallback URL:', error);
        }
    }

    

};




// async function getSongs (folder) {
//     currFolder = Fol
//     let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a")
//     let songs = [ ]
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split('/${folder}/')[1])
//         }
//     }
//     return songs
// }

// const playMusic = (track, pause=false) => {
//     currentSong.src = `/${folder}/` + track
//     if(!pause) {
//                                         I
//         currentSong.play()
//         play.src = "pause.svg"
//     }
//     document.querySelector(".songinfo").innerHTML = decodeURI(track)
//     document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
// }



// const playMusic = (track) => {
//     try {
//         // Normalize the track name to handle spaces and special characters for URLs
//         const formattedTrack = track.replace(/ /g, '%20').replace(/,/g, '%20');

//         // Construct the URL using the specified folder
//         let audioURL = `http://127.0.0.1:3000/spotify%20clone/songs/${currFolder}/${formattedTrack}`;

//         // Check if the URL is reachable or valid
//         fetch(audioURL, { method: 'HEAD' })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`Track not found in folder ${currFolderfolder}`);
//                 }
//                 return audioURL;
//             })
//             .catch(() => {
//                 // Fallback to the default 'songs' directory
//                 audioURL = `http://127.0.0.1:3000/songs/${currFolderfolder}/${formattedTrack}`;
//                 return audioURL;
//             })
//             .then(url => {
//                 console.log(`Playing: ${url}`); // Log the audio URL for debugging
//                 currentSong.src = url;

//                 currentSong.play();
//                 play.src = "pause.svg";
//                 document.querySelector(".songinfo").innerHTML = decodeURI(track);
//                 document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
//             })
//             .catch(error => {
//                 console.error(`Error fetching or playing track:`, error);
//             });
//     } catch (error) {
//         console.error('Error in playMusic function:', error);
//     }
// };



async function displayAlbums() {
    let a = await fetch(fetched_url);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    Array.from(anchors).forEach(async e => {
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            // Get the metadata of the folder
            let a = await fetch(`${fetched_url}/info.json`);
            let response = await a.json();
            console.log(response);
        }
    });
    
}



async function main() {


    //get the list of all the songs
    await getSongs("songs/ncs");
    console.log(songs);

    // Select the <ul> element inside .songList
    


    // Add event listener to the play button  (play is an id)
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "playsong.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });


    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const seekbar = e.currentTarget.getBoundingClientRect(); // Get the dimensions of the seekbar
        const clickPosition = (e.clientX - seekbar.left) / seekbar.width; // Calculate the position of the click relative to the seekbar

        // Move the circle to the clicked position
        document.querySelector(".circle").style.left = (clickPosition * 100) + "%";

        // Update the audio playback time immediately
        if (currentSong && currentSong.duration) {
            currentSong.currentTime = clickPosition * currentSong.duration;
        }
    });

    // Event Listener for Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });


    // Event Listener For Next and previous

    previous.addEventListener("click", () => {
        console.log("Previous clicked");
        console.log(currentSong);
        let index = songs.indexOf(currentSong.src.split("/").pop());

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    });

    next.addEventListener("click", () => {
        console.log("Next clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length - 1) {
            playMusic(songs[index + 1])
        }
    });

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting Volume to :", e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e)
        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })




}

main(); 
// 2:43

