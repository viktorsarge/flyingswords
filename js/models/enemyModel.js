"use strict";

var enemyModel = function () {
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
        game.score.add();
        alive = false;
        entitiesController.oneLessEnemy();  // TODO: Let the controller handle this logic instead
    };

    var update = function () {
        var cellRef;
        helper.removeHTMLbyId(id);
        var playerpos = player.reportPosition();
        var directionX = calculateDirection(playerpos[0], x1);
        var directionY = calculateDirection(playerpos[1], y1);
        x2 = x1 + directionX;
        y2 = y1 + directionY;
        worldmap.moveIdFromTo(id, x1, y1, x2, y2);
        cellRef = document.getElementById("x" + x1 + "y" + y1);
        cellRef.addEventListener("webkitAnimationEnd", removeEnemyTrailClass); // Chrome, Safari, opera
        cellRef.addEventListener("animationend", removeEnemyTrailClass);  // Standard syntax
        helper.addFadingBackground(x1, y1, type);
    };

    var collisionCheck = function () {
        var obstacleId;
        var obstacleRef;
        // Restart if hit the player
        if (x2 === player.reportPosition()[0] && y2 === player.reportPosition()[1]) {
            game.restart();
        } else if (worldmap.moreThanIdAtXY(id, x2, y2)) {
            if (!helper.typeAtXY("obstacle", x2, y2)) {
                obstacleId = entitiesController.singleObstacle(x2, y2);
                obstacleRef = document.getElementById(obstacleId);
                obstacleRef.classList.add("dead");
            }
            die();
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
        worldmap.removeIdAt(id, x2, y2);
    };

    return {
        update: update,
        collisionCheck: collisionCheck,
        plot: plot,
        die: die,
        alive: aliveStatus,
        remove: remove
    };
};
