"use strict";

var helper = helpers();

var gameobjects = function() {

};

var game = (function() {
    var pauseState = true;
    var level = 0;
    var clock = "";

    var restart = function () {
        worldmap.makeEmptyWorld();
        helper.createBoard();
        player.reset();
        level = 0;
        placeObstacles(defaults.levels[level]["numberOfObstacles"]);
    };

    var setupLevel = function () {

    };

    var switchPauseState = function () {
        if (pauseState) {
            pauseState = false;
            clock = setInterval(killer.move, defaults.levels[level].clockSpeed);
        } else {
            pauseState = true;
            clearInterval(clock);
        }
    };

    var init = function() {
        return true;
    };

    var start = function() {
        pauseState = false;
        return true;
    };

    var pause = function() {
        pauseState = true;
        return true;
    };

    var isPaused = function() {
        return pauseState;
    };

    var update = function() {

    };

    var score = (function () {
    // Scorekeeping. Can add one or reset score.
        var points = 0;
        var cell = document.getElementById("score");
        cell.innerHTML = points;
        var add = function () {
            points += 1;
            cell.innerHTML = points;
        };
        var reset = function () {
            points = 0;
            cell.innerHTML = points;
        };
        return {
            add: add,
            reset: reset
        };
    }());

    return {
        init: init,
        start: start,
        pause: pause,
        isPaused: isPaused,
        switchPauseState: switchPauseState,
        restart: restart,
        setupLevel: setupLevel,
        score: score
    };
}());

game.restart();