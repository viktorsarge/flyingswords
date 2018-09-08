"use strict";

// Self running function to create player
// The player moves on input and is independant from game clock
var player = (function () {
    // Run on init
    // var life = 1;
    var position = defaults.playerPos();
    var x1 = position[0];
    var y1 = position[1];
    var x2 = x1;
    var y2 = y1;
    var type = "player";
    var id = idGenerator.generate(type);

    //worldmap.addIdAt(id, x1, y1);
    //helper.plotObjectByPosAndType(x1, y1, type, id);

    var move = function (direction) {
        if (!game.isPaused()) {
            switch (direction) {
            case "up":
                y2 = y1 - 1;
                if (worldmap.isEmptyPos(x2, y2)) {
                    if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                        helper.plotObjectByPosAndType(x2, y2, type, id);
                        y1 = y2;
                    } else {
                        y2 = y1;
                    }
                } else {
                    console.log("KILL!");
                    game.restart();
                }

                break;

            case "down":
                y2 = y1 + 1;
                if (worldmap.isEmptyPos(x2, y2)) {
                    if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                        helper.plotObjectByPosAndType(x2, y2, type, id);
                        y1 = y2;
                    } else {
                        y2 = y1;
                    }
                } else {
                    console.log("KILL!");
                    game.restart();
                }
                break;

            case "right":
                x2 = x1 + 1;
                if (worldmap.isEmptyPos(x2, y2)) {
                    if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                        helper.plotObjectByPosAndType(x2, y2, type, id);
                        x1 = x2;
                    } else {
                        x2 = x1;
                    }
                } else {
                    console.log("KILL!");
                    game.restart();
                }
                break;

            case "left":
                x2 = x1 - 1;
                if (worldmap.isEmptyPos(x2, y2)) {
                    if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                        helper.plotObjectByPosAndType(x2, y2, type, id);
                        x1 = x2;
                    } else {
                        x2 = x1;
                    }
                } else {
                    console.log("KILL!");
                    game.restart();
                }
                break;
            }
        }
    };

    var reset = function () {
        position = defaults.playerPos();
        x1 = position[0];
        y1 = position[1];
        x2 = x1;
        y2 = y1;
        worldmap.addIdAt(id, x1, y1);
        helper.plotObjectByPosAndType(x2, y2, type, id);
    };

    var reportPosition = function () {
        return [x2, y2];
    };

    return {
        move: move,
        reset: reset,
        reportPosition: reportPosition
    };
}());