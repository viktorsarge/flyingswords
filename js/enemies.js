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

    // console.log("Initial plot");
    // worldmap.addIdAt(id, x1, y1);
    // helper.plotObjectByPosAndType(x1, y1, type, id);

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
        // console.log("Enemy died");
        // Remove id from World array
        worldmap.removeIdAt(id, x1, y1);
        // Remove HTML representation from board
        // Score a point
        game.score.add();
        alive = false;
        console.log("Alive status:" + alive);

        // Note: die() does not actually destroy the function itself
        // TODO: Remove from enemiesArray in enemies()
    };

    var move = function () {
        helper.removeHTMLbyId(id);
        var playerpos = player.reportPosition();
        var directionX = calculateDirection(playerpos[0], x1);
        var directionY = calculateDirection(playerpos[1], y1);
        x2 = x1 + directionX;
        y2 = y1 + directionY;

    };

    var collisionCheck = function () {
        // Restart if hit the player
        if (x2 === player.reportPosition()[0] && y2 === player.reportPosition()[1]) {
            game.restart();
        } else if (worldmap.isEmptyPos(x2, y2) === false) {
            console.log(x2, y2);
            die();
            console.log("Death...");
            // Check type of the enemies found at the new position.
            // Die in all cases, but handle gracefully when other entities are around
        } else {
            worldmap.moveIdFromTo(id, x1, y1, x2, y2);
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

    return {
        move: move,
        collisionCheck: collisionCheck,
        plot: plot,
        die: die,
        alive: aliveStatus
    };
};

var enemies = (function () {
    var i;
    var limit;
    var enemiesArray = [];
    var entity;

    var setupLevel = function (levelNr) {
        enemiesArray = [];
        while (enemiesArray.length < defaults.levels[2].simultEnemies) {
            entity = enemy();
            enemiesArray.push(entity);
        }
    };

    var update = function () {
        //console.log("Updating enemies");
        //console.log(enemiesArray);

        for (i = enemiesArray.length - 1; i >= 0; i -= 1) {
            //console.log(enemiesArray[i]);
            enemiesArray[i].move();
            enemiesArray[i].collisionCheck();
            if (enemiesArray[i].alive()) {
                enemiesArray[i].plot();
            } else {
                enemiesArray.splice(i, 1);
                console.log("Deleted enemy from enemiesArray");
            }
        }

        // Add enemies if there are room for them
        while (enemiesArray.length < defaults.levels[2].simultEnemies) {
            // TODO: Initialize the correct nr of simult. enemies for the level
            entity = enemy();
            enemiesArray.push(entity);
            entity.plot();
            //console.log(enemiesArray);
        }
    };

    var clear = function () {
        enemiesArray = [];
    };

    return {
        update: update,
        clear: clear
    };
}());
