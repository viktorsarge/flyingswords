"use strict";

var resetObstacle = function () {
    this.classList.remove("dead");
};

var obstacleModel = function (x1 = false, y1 = false) {
    var inCorner = function (x, y) {
        if ((x === defaults.xLimit || x === 0) && (y === 0 || y === defaults.yLimit)) {
            return true;
        } else {
            return false;
        }
    };

    var generatePos = function () {
        x1 = helper.randomIntFromInterval(0, defaults.xLimit);
        y1 = helper.randomIntFromInterval(0, defaults.yLimit);
        if (!worldmap.isEmptyPos(x1, y1) || inCorner(x1, y1)) {
            generatePos();
        } else {
            return;
        }
    };

    if (x1 === false || y1 === false) {
        generatePos();
    }
    var x2 = x1;
    var y2 = y1;
    var type = "obstacle";
    var id = idGenerator.generate(type);
    var alive = true;
    var ref;

    helper.plotObjectByPosAndType(x2, y2, type, id);   // Initial plot
    worldmap.addIdAt(id, x2, y2);
    ref = document.getElementById(id);
    ref.addEventListener("webkitAnimationEnd", resetObstacle); // Chrome, Safari, opera
    ref.addEventListener("animationend", resetObstacle);  // Standard syntax

/*    var calculateDirection = function (playerPos, enemyPos) {
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
    };  */

    var die = function () {
        alive = false;
    };

    var update = function () {
        if (x2 !== x1 || y2 !== y1) {
            helper.removeHTMLbyId(id);
            console.log("Obstacle seems to have moved - deleting");
        }
        /*
        var playerpos = player.reportPosition();
        var directionX = calculateDirection(playerpos[0], x1);
        var directionY = calculateDirection(playerpos[1], y1);
        x2 = x1 + directionX;
        y2 = y1 + directionY;
        worldmap.moveIdFromTo(id, x1, y1, x2, y2);
        */
    };

    var collisionCheck = function () {
        var obstacleRef;
        /*
        var obstacleId;
        var obstacleRef;
        // Restart if hit the player
        if (x2 === player.reportPosition()[0] && y2 === player.reportPosition()[1]) {
            game.restart();
        } else if (worldmap.moreThanIdAtXY(id, x2, y2)) {
            if (!helper.typeAtXY("obstacle", x2, y2)) {
                obstacleId = placeObstacles(1, x2, y2);
                obstacleRef = document.getElementById(obstacleId);
                obstacleRef.classList.add("dead");
            }
            die();
        }
        */
        if (worldmap.moreThanIdAtXY(id, x2, y2)) {
            obstacleRef = document.getElementById(id);
            obstacleRef.classList.add("dead");
            die();
        }
    };

    var plot = function () {
        if (x2 !== x1 || y2 !== y1) {
            helper.plotObjectByPosAndType(x2, y2, type, id);
            console.log("Obstacle seems to have moved - painting at new pos");
        }
        x1 = x2;
        y1 = y2;
    };

    var aliveStatus = function () {
        return alive;
    };

    var remove = function () {
        worldmap.removeIdAt(id, x1, y1);
        helper.removeHTMLbyId(id);
         console.log("ReMOvDED ObstACLAE");
    };

    var showId = function () {
        return id;
    };

    return {
        update: update,
        collisionCheck: collisionCheck,
        plot: plot,
        die: die,
        alive: aliveStatus,
        remove: remove,
        showId: showId
    };
};