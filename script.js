let player;
let loopStart = 0;
let loopEnd = 0;
let loopInterval;

// Load YouTube IFrame Player API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: '', // Initialize without a video
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    document.getElementById('load-video').addEventListener('click', loadVideo);
    document.getElementById('set-start-time').addEventListener('click', setStartTime);
    document.getElementById('set-end-time').addEventListener('click', setEndTime);
    document.getElementById('set-loop').addEventListener('click', setLoop);
    document.getElementById('reset-loop').addEventListener('click', resetLoop); // Reset button event listener
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && loopEnd > 0) {
        clearInterval(loopInterval);
        loopInterval = setInterval(checkLoop, 100);
    } else {
        clearInterval(loopInterval);
    }
}

function loadVideo() {
    const url = document.getElementById('youtube-url').value;
    const videoId = getYouTubeVideoId(url);
    player.loadVideoById(videoId);
}

function getYouTubeVideoId(url) {
    let videoId = '';

    // Check if the URL is a shortened youtu.be link
    if (url.includes('youtu.be')) {
        const urlParts = url.split('/');
        videoId = urlParts[urlParts.length - 1].split('?')[0];
    } else if (url.includes('youtube.com')) { // Handling full youtube.com links
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
    }

    return videoId;
}

function setStartTime() {
    loopStart = player.getCurrentTime();
    document.getElementById('start-time-display').textContent = formatTime(loopStart);
}

function setEndTime() {
    loopEnd = player.getCurrentTime();
    document.getElementById('end-time-display').textContent = formatTime(loopEnd);
}

function setLoop() {
    if (loopStart < loopEnd) {
        player.seekTo(loopStart);
        player.playVideo();
    } else {
        alert('Start time must be less than end time.');
    }
}

function resetLoop() {
    loopStart = 0;
    loopEnd = 0;
    clearInterval(loopInterval);
    player.stopVideo();
    document.getElementById('start-time-display').textContent = '00:00';
    document.getElementById('end-time-display').textContent = '00:00';
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function checkLoop() {
    if (player.getCurrentTime() >= loopEnd) {
        player.seekTo(loopStart);
    }
}
