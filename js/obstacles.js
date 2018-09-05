"use strict";

var placeObstacles = function (nr = 1) {
    var i = 0;
    var x = 0;
    var y = 0;
    var id = 0;
    var type = "obstacle";

    var generatePos = function () {
        x = helper.randomIntFromInterval(0, defaults.xLimit);
        y = helper.randomIntFromInterval(0, defaults.yLimit);
        if (!worldmap.isEmptyPos(x, y)) {
            generatePos();
        } else {
            return;
        }
    };
    while (i < nr) {
        generatePos();
        id = idGenerator.generate();
        worldmap.addIdAt(id, x, y);
        helper.plotObjectByPosAndType(x, y, type, id);
        i += 1;
    }
};