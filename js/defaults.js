"use strict";

// -------------------------------------------------------- //
// Default values to be used in the game                    //
// -------------------------------------------------------- //

var defaults = (function () {
    var xLimit = 14;
    var yLimit = 8;
    var playerPos = [Math.floor(xLimit / 2), Math.floor(yLimit / 2)];
    var texts = {
        pause: "Paused - P to unpause",
        instructions: "( Use arrow keys to play )"
    };
    var levels = [
        {
            killsRequired: 4,
            clockSpeed: 1200,
            numberOfObstacles: 15,
            simultEnemies: 1
        },
        {
            killsRequired: 5,
            clockSpeed: 1200,
            numberOfObstacles: 14,
            simultEnemies: 2
        },
        {
            killsRequired: 6,
            clockSpeed: 1100,
            numberOfObstacles: 13,
            simultEnemies: 3
        },
        {
            killsRequired: 7,
            clockSpeed: 1050,
            numberOfObstacles: 12,
            simultEnemies: 4
        },
        {
            killsRequired: 8,
            clockSpeed: 1000,
            numberOfObstacles: 11,
            simultEnemies: 4
        },
        {
            killsRequired: 9,
            clockSpeed: 950,
            numberOfObstacles: 10,
            simultEnemies: 4
        },
        {
            killsRequired: 10,
            clockSpeed: 900,
            numberOfObstacles: 9,
            simultEnemies: 4
        },
        {
            killsRequired: 11,
            clockSpeed: 850,
            numberOfObstacles: 8,
            simultEnemies: 4
        },
        {
            killsRequired: 12,
            clockSpeed: 800,
            numberOfObstacles: 7,
            simultEnemies: 4
        }
    ];
    return {
        xLimit: xLimit,
        yLimit: yLimit,
        playerPos: playerPos,
        levels: levels,
        texts: texts
    };
}());
