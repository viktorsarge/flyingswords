"use strict";

var placeObstacles = function (nr = 1, placeAtX = false, placeAtY = false, extraClass = false) {
    var i = 0;
    var x;
    var y;
    var id;
    var type = "obstacle";
    var ref;

    var inCorner = function (x, y) {
        if ((x === defaults.xLimit || x === 0) && (y === 0 || y === defaults.yLimit)) {
            return true;
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
        if (placeAtX === false && placeAtY === false) {
            generatePos();
        } else {
            x = placeAtX;
            y = placeAtY;
        }
        id = idGenerator.generate(type);
        worldmap.addIdAt(id, x, y);
        helper.plotObjectByPosAndType(x, y, type, id);
        ref = document.getElementById(id);
        ref.addEventListener("webkitAnimationEnd", resetObstacle); // Chrome, Safari, opera
        ref.addEventListener("animationend", resetObstacle);  // Standard syntax
        i += 1;
    }
    if (nr === 1) {
        return id;
    }
};

var resetObstacle = function () {
    this.classList.remove("dead");
}; 
// TODO: Perhaps have obstacles animate only when player is near?