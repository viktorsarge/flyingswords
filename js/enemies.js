"use strict";

var enemy = function () {
    var position = helper.getNextCornerXY();
    var x1 = position[0];
    var y1 = position[1];
    var x2 = x1;
    var y2 = y1;
    var type = "enemy";
    var id = idGenerator.generate(type);

    console.log("Initial plot");
    worldmap.addIdAt(id, x1, y1);
    helper.plotObjectByPosAndType(x1, y1, type, id);

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

    var move = function () {
        var playerpos = player.reportPosition();
        var directionX = calculateDirection(playerpos[0], x1);
        var directionY = calculateDirection(playerpos[1], y1);
        x2 = x1 + directionX;
        y2 = y1 + directionY;
        worldmap.moveIdFromTo(id, x1, y1, x2, y2);
        helper.plotObjectByPosAndType(x2, y2, type, id);
        x1 = x2;
        y1 = y2;
        //console.log("Moved");
        if (x2 === player.reportPosition()[0] && y2 === player.reportPosition()[1]) {
            game.restart();
        }
        // if x2, y2 of enemy === x2, y2 of player then game over.

        // else if (collided with obstacle) { die(); }

        // else if (collided w fellow enemy ) { placeObstacles(1).at(x2, y2); }

        // Check if new position is empty? What to do if not?
        // or better to run collision check based on
        // Give idGenerator type as input and do {id: type} object for lookup?
    };


    var die = function () {
        // console.log("Enemy died");
        // Remove id from World array
        worldmap.removeIdAt(id, x1, y1);
        // Remove HTML representation from board
        helper.removeHTMLbyId(id);
        // Score a point
        game.score.add();

        // Note: die() does not actually destroy the function itself
        // TODO: Remove from enemiesArray in enemies()
    };

    return {
        move: move,
        die: die
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
        for (i = 0; i < enemiesArray.length; i += 1) {
            //console.log(enemiesArray[i]);
            enemiesArray[i].move();
            }
        while (enemiesArray.length < defaults.levels[2].simultEnemies) {
            // TODO: Initialize the correct nr of simult. enemies for the level
            entity = enemy();
            enemiesArray.push(entity);
            //console.log(enemiesArray);
        }

    };

    return {
        update: update
    };
}());
