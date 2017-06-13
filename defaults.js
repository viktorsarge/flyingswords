"use strict";

// -------------------------------------------------------- //
// Default values to be used in the game                    //
// -------------------------------------------------------- //

var defaults = (function () {
    var xLimit = 14;
    var yLimit = 8;
    var playerPos = [Math.floor(xLimit / 2), Math.floor(yLimit / 2)];
    var levels = [
        {
            killsRequired: 10
        },
        {
            killsRequired: 10
        },
        {
            killsRequired: 10
        },
        {
            killsRequired: 10
        },
        {
            killsRequired: 10
        },
        {
            killsRequired: 10
        },
        {
            killsRequired: 10
        },
        {
            killsRequired: 10
        },
        {
            killsRequired: 10
        }
    ];
    return {
        xLimit: xLimit,
        yLimit: yLimit,
        playerPos: playerPos,
        numberOfObstacles: 10,
        numberOfEnemies: 4,
        levels: levels
    };
}());
