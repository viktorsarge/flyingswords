"use strict"; 

var soundController = function () {
    var soundengine = (function () {
        var musicon = true;
        var music = new Audio("audio/bossfight-isak.wav");
        music.addEventListener('timeupdate', function(){
                var buffer = 1.50
                if(this.currentTime > this.duration - buffer){
                    this.currentTime = 0
                    this.play()
                }}, false);

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

/*
var audio_file = new Audio('whatever.mp3')
audio_file.addEventListener('timeupdate', function(){
                var buffer = .44
                if(this.currentTime > this.duration - buffer){
                    this.currentTime = 0
                    this.play()
                }}, false);
                
                */