"use strict"; 

var soundController = function () {
    var soundengine = (function () {
        var musicon = false;
        var music = new Audio("audio/gamemusic.wav");
        music.addEventListener("ended", function () {
            this.currentTime = 0;
            this.play();
        }, false);

        var togglePlayback = function () {
            if (musicon) {
                music.pause();
                musicon = false;
            } else {
                music.play();
                musicon = true;
            }
        };
        return {
            togglePlayback: togglePlayback,
            musicon: musicon,
            music: music
        };
    }());

    var snd = new Audio("audio/flyingswords-krasch.wav");

    return {
        soundengine: soundengine,
        snd: snd
    };

}();