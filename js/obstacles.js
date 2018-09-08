"use strict";

var placeObstacles = function (nr = 1) {
    var i = 0;
    var x;
    var y;
    var id;
    var type = "obstacle";

    var inCorner = function (x, y) {
        console.log("in notInCorner function");
        console.log(x, defaults.xLimit, y, defaults.yLimit);
        if ((x === defaults.xLimit || x === 0) && (y === 0 || y === defaults.yLimit)) {
            return true;
            console.log("Obstacle in corner - should generate new pos");
        } else {    
            return false;
        }
    };

    var generatePos = function () {
        x = helper.randomIntFromInterval(0, defaults.xLimit);
        y = helper.randomIntFromInterval(0, defaults.yLimit);
        if (!worldmap.isEmptyPos(x, y) || inCorner(x, y)) {
            generatePos();
        } else {
            return;
        }
    };
    while (i < nr) {
        generatePos();
        id = idGenerator.generate(type);
        worldmap.addIdAt(id, x, y);
        helper.plotObjectByPosAndType(x, y, type, id);
        i += 1;
    }
};