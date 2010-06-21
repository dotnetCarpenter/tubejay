// The video elementscur
var video1, video2 = 0;

// Volume
var faderval = 50;
var vid1relvol = 70;
var vid2relvol = 70;

// Currently displayed videos
var currentVid1 = '';
var currentVid2 = '';

function onYouTubePlayerReady(playerId) {
    video1 = document.getElementById("vidplayer1");
    video2 = document.getElementById('vidplayer2');

    video1.addEventListener("onStateChange", "vid1PlayerState");
    video2.addEventListener("onStateChange", "vid2PlayerState");

    setInterval(updatePlayerInfo, 500);
    updatePlayerInfo();

    setVolume();
}

function updatePlayerInfo() {
    var vid1per = Math.floor((video1.getCurrentTime() / video1.getDuration()) * 100)
    var vid2per = Math.floor((video2.getCurrentTime() / video2.getDuration()) * 100)

    $('#cur1scrub').attr('title',vid1per + '%').slider('option','value',vid1per);
    $('#cur2scrub').attr('title',vid2per + '%').slider('option','value',vid2per);
}

function vid1PlayerState(val) {
    if (val == 1) {
	// If the video has started and is not in the current, move it there
	if ($('#cur1vid').children().size() == 0) {
		$('#' + currentVid1).fadeOut(function() { $('#cur1vid').append(this); $(this).fadeIn(); });
	}
	
        $('#playpause1').html( 'Pause' );
    }

    if (val == 0) {
        // The video stopped, play the next in the playlist
        $('#' + currentVid1).fadeOut(function(){
            $(this).remove();
	    video1.clearVideo();
            var nextid = $('#pl1 div:last-child').attr('id');
            video1.loadVideoById(nextid, 0, 'small');
	    currentVid1 = nextid;
        });
    }
}

function vid2PlayerState(val) {
    if (val == 1) {
	// If the video has started and is not in the current, move it there
	if ($('#cur2vid').children().size() == 0) {
		$('#' + currentVid2).fadeOut(function() { $('#cur2vid').append(this); $(this).fadeIn(); });
	}
	$('#playpause2').html('Pause');
    }

    if (val == 0) {
        // The video stopped, play the next in the playlist
        $('#' + currentVid2).fadeOut(function(){
            $(this).remove();
	    video2.clearVideo();
            var nextid = $('#pl2 div:last-child').attr('id');
            video2.loadVideoById(nextid, 0, 'small');        
	    currentVid2 = nextid;
        });
    }
}

function setVolume() {
    var vid1val = 100 - faderval;
    var vid2val = faderval;

    video1.setVolume( (vid1relvol / 100) * vid1val );
    video2.setVolume( (vid2relvol / 100) * vid2val );    
}

window.onload = function() {
    // allowScriptAccess must be set to allow the Javascript from one 
    // domain to access the swf on the youtube domain
    var params = { allowScriptAccess: "always", bgcolor: "#cccccc", wmode: 'transparent' };
    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer","video1", "100%", "100%", "8", null, null, params, { id:'vidplayer1'});
    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer","video2", "100%", "100%", "8", null, null, params, { id:'vidplayer2'});

    //video1.loadVideoByUrl('http://www.youtube.com/v/Kln9IBvHNxE');
    //video2.loadVideoByUrl('http://www.youtube.com/v/lY9yOfKAE78');

    $('#playpause1').bind('click', function() {
        if (this.innerHTML == 'Play') {
            video1.playVideo();
        } else {
            video1.pauseVideo();
        }
        $(this).html( ($(this).html() == 'Play') ? 'Pause' : 'Play' );
    });

    $('#playpause2').bind('click', function() {
        if (this.innerHTML == 'Play') {
            video2.playVideo();
        } else {
            video2.pauseVideo();
        }
        $(this).html( ($(this).html() == 'Play') ? 'Pause' : 'Play' );
    });

    $('#crossfader').slider({
        value : 50,
        slide : function(ev, ui) {
            faderval = ui.value;
            setVolume();
        }
    });

    $('#volfade1').slider({
        value : 70, 
        slide : function(ev, ui) {
            vid1relvol = ui.value;
            setVolume();
        }
    });

    $('#volfade2').slider({
        value : 70, 
        slide : function(ev, ui) {
            vid2relvol = ui.value;
            setVolume();
        }
    });

    $('.scrubber').slider({
	value : 0, 
	change : function(ev, ui) {
	    var id = $(this).attr('id');
	    var value = ui.value;
	    if (id == 'cur1scrub') {
		var secs = (video1.getDuration() / 100) * value;
		video1.seekTo(secs, true);
	    } else {
		var secs = (video2.getDuration() / 100) * value;
		video2.seekTo(secs, true);
	    }
	}
    });

    $('.playlist').sortable({
        receive: function(event, ui) { 
            var id = $(ui.item).attr("id");
            if (this.id == 'pl1') {
                if ($(this).children().size() == 1 && $('#cur1vid').children().size() == 0) {
                    currentVid1 = id;
                    video1.cueVideoById(id, 0, 'small');
                }
            }
            else if (this.id == 'pl2') {
                if ($(this).children().size() == 1 && $('#cur2vid').children().size() == 0) {
                    currentVid2 = id;
                    video2.cueVideoById(id, 0, 'small');
                }
            }
        }
    });

    $('#searchbutton').bind('click', function() {
        searcher.execute( $('#searchtext').val() );
    });
};


// Searching the search man
searcher = new google.search.VideoSearch();
searcher.setResultSetSize(google.search.Search.LARGE_RESULTSET);

searcher.setSearchCompleteCallback(null, function() {
    $('#results').empty();            

    if (searcher.results.length == 0) {
        $('#results').html('No videos found');
    }

    for(var i = 0; i<searcher.results.length; i++) {
        var result = searcher.results[i];
        if(result.videoType != "YouTube") {
            continue;
        }

        var thumb_url = result.tbUrl;
        var video_id = result.tbUrl.split('/')[4];
        var mins = Math.floor(result.duration/60);
        var secs = result.duration - (mins * 60);
        secs = (secs < 10) ? '0' + secs : secs;

        $('#results').append(
            '<div class="dragresult" id="' + video_id + '" title="' + result.title + '"><div class="playnow" title="Play now">&gt;</div><img width="50" height="40" src="' + thumb_url + '" /><b>' + result.title + '</b><br />(' + mins + ':' + secs +')</div>'
        );
    }

    $('.playnow').live('click', function(ev, ui) {
	var vidid = $(this).parent().attr('id');
	var parid = $(this).parent().parent().attr('id');

	if (parid == 'pl1') {
		$('#' + currentVid1).fadeOut(function(){
		    $(this).remove();
		    video1.clearVideo();
		    video1.loadVideoById(vidid, 0, 'small');        
		    currentVid1 = vidid;
		});
	} else {
		$('#' + currentVid2).fadeOut(function(){
		    $(this).remove();
		    video2.clearVideo();
		    video2.loadVideoById(vidid, 0, 'small');        
		    currentVid2 = vidid;
		});
	}
    });

    $('.dragresult').draggable({
        connectToSortable : '.playlist', 
        helper : 'clone',
        appendTo : 'body',
        stop : function(ev, ui) {
        }
    });

    if (searcher.cursor) {
        $('#pages').empty().append('<div class="pages"><strong>Pages:</strong></div>');
        var pages = searcher.cursor.pages;
        for(var i=0; i<pages.length; i++) {
            if(i == searcher.cursor.currentPageIndex) {
                $('#pages .pages').append(
                    '<span class="page">' + pages[i].label + '</a>'
                );
            } else {
                $('#pages .pages').append(
                    '<a class="page" pagenum="' + i + '">' + pages[i].label + '</a>'
                );
            }
        }
        
        $('#pages a.page').click(function() {
            searcher.gotoPage(parseInt($(this).attr('pagenum')));
        });
    }
});
