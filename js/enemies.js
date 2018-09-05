"use strict";

var enemy = function () {
    var position = helper.getNextCornerXY();
    var x1 = position[0];
    var y1 = position[1];
    var x2 = x1;
    var y2 = y1;
    var id = idGenerator.generate();
    var type = "enemy";

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
console.log("Moved");
        // if x2, y2 of enemy === x2, y2 of player then game over. 

        // else if (collided with obstacle) { die(); }

        // else if (collided with fellow enemy ) { placeObstacles(1).at(x2, y2); }

        // Check if new position is empty? What to do if not?
        // or better to run collision check based on 
        // What if idGenerator got type as input and created a {id: type} object for lookup?

    };

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

    var plot = function () {      // TODO: Redundant? Integrate inte move()
        console.log("Plot enemy");
        worldmap.addIdAt(id, x1, y1);
        helper.plotObjectByPosAndType(x1, y1, type, id);
    };

    var die = function () {
        console.log("Killed enemy");
        // Remove id from World array
        worldmap.removeIdAt(id, x1, y1);
        // Remove HTML representation from board
        helper.removeHTMLbyId(id);

        // Add logic around points and check for level end?

        // Note that this does not actually destroy the variable. 
    };

    return {
        move: move,
        plot: plot,
        die: die
    };
};

var enemies = function () {

    var update = function () {
        // TODO: Initialize the correct number of simult. enemies for the level
// TODO: Check if there is room for another enemy? Or better to do it upon death instead? 
    };


    return {
        update: update
    };
};

// TODO: Remove testing code

var killer = enemy();
killer.plot();

