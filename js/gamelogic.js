"use strict";

var helper = helpers();

// TODO - collisionrules should be it's own controller since it's specific for each game.
//        possibly it could be in defaults. 

// Game is self invoking, but does a restart at the bottom as a form of init.
var game = (function() {
    var pauseState = true;
    var level = 0;
    var clock = "";

    var restart = function () {
        worldmap.makeEmptyWorld();
        helper.createBoard();
        player.reset();
        enemies.clear();
        level = 0;
        score.reset();
        placeObstacles(defaults.levels[level]["numberOfObstacles"]);
    };

    var setupLevel = function () {
        // TODO: Might be better to have restart take a "level" parameter
    };

    var switchPauseState = function () {
        if (pauseState) {
            pauseState = false;
            clock = setInterval(enemies.update, defaults.levels[level].clockSpeed);
        } else {
            pauseState = true;
            clearInterval(clock);
        }
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

    var score = (function () {
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