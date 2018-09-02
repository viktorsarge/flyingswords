"use strict";

// Self running function to create player
// The player moves on input and is independant from game clock
var player = (function () {
    // Run on init
    // var life = 1;
    var position = defaults.playerPos;
    var x1 = position[0];
    var y1 = position[1];
    var x2 = x1;
    var y2 = y1;
    var id = idGenerator.generate();
    var type = "player";
    worldmap.addIdAt(id, x1, y1);
    helper.plotObjectByPosAndType(x1, y1, type, id);

    var move = function (direction) {
        if (!game.isPaused()) {
            switch (direction) {
            case "up":
                y2 = y1 - 1;
                if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                    helper.plotObjectByPosAndType(x2, y2, type, id);
                    y1 = y2;
                } else {
                    y2 = y1;
                }
                break;

            case "down":
                y2 = y1 + 1;
                if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                    helper.plotObjectByPosAndType(x2, y2, type, id);
                    y1 = y2;            
                } else {
                    y2 = y1;
                }
                break;

            case "right":
                x2 = x1 + 1;
                if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                    helper.plotObjectByPosAndType(x2, y2, type, id);
                    x1 = x2;
                } else {
                    x2 = x1;
                }
                break;

            case "left":
                x2 = x1 - 1;
                if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                    helper.plotObjectByPosAndType(x2, y2, type, id);
                    x1 = x2;  
                } else {
                    x2 = x1;
                }
                break;
            }
        }
    };
    return {
        move: move
    };
}());