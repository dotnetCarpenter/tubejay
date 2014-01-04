/*jshint curly:false, latedef:nofunc, noarg:true, newcap:true, camelcase:true, unused:strict, browser:true, trailing:true, devel:true */
/* global YT:true */
/* exported  onYouTubeIframeAPIReady */

//setTimeout(stopVideo, 2000);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    var windowWidth = Math.round(window.innerWidth);
    player = new YT.Player('player', {
      height: windowWidth/640 * 390, // was 390
      width: windowWidth, // was 640
      videoId: 'M7lc1UVf-VE',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setTimeout(stopVideo, 6000);
      done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}