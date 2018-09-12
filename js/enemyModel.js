"use strict";

var enemy = function () {
    var position = helper.getNextCornerXY();
    var x1 = position[0];
    var y1 = position[1];
    var x2 = x1;
    var y2 = y1;
    var type = "enemy";
    var id = idGenerator.generate(type);
    var alive = true;

    var calculateDirection = function (playerPos, enemyPos) {
        var direction = 0;
        if (playerPos > enemyPos) {
            direction = 1;
            return direction;
        } else if (playerPos < enemyPos) {
            direction = -1;
            return direction;
        } else {
            return direction;
        }
    };

    var die = function () {
        //worldmap.removeIdAt(id, x1, y1);
        game.score.add();
        alive = false;
    };

    var move = function () {
        helper.removeHTMLbyId(id);
        var playerpos = player.reportPosition();
        var directionX = calculateDirection(playerpos[0], x1);
        var directionY = calculateDirection(playerpos[1], y1);
        x2 = x1 + directionX;
        y2 = y1 + directionY;
        worldmap.moveIdFromTo(id, x1, y1, x2, y2);
    };

    var collisionCheck = function () {
        // Restart if hit the player
        if (x2 === player.reportPosition()[0] && y2 === player.reportPosition()[1]) {
            game.restart();
        } else if (worldmap.moreThanIdAtXY(id, x2, y2)) {
            die();
            //worldmap.killEveryoneAt(x2, y2);
            if (!helper.typeAtXY("obstacle", x2, y2)) {
                placeObstacles(1, x2, y2);
            }
        }
    };

    var plot = function () {
        helper.plotObjectByPosAndType(x2, y2, type, id);
        x1 = x2;
        y1 = y2;
    };

    var aliveStatus = function () {
        return alive;
    };

    var remove = function () {
        worldmap.removeIdAt(id, x1, y1);
    };

    return {
        move: move,
        collisionCheck: collisionCheck,
        plot: plot,
        die: die,
        alive: aliveStatus,
        remove: remove
    };
};
