"use strict";

var entities = (function () {
    var i;
    var limit;
    var enemiesArray = [];
    var entity;
    var nrOfEnemies = 0;
    console.log("entities triggered");

    var setupLevel = function (levelNr) {
        enemiesArray = [];
        console.log("setupLevel in entities has triggered");
        // TODO - convert to a for loop instead
        while (nrOfEnemies < defaults.levels[levelNr].simultEnemies) {
            entity = enemy();
            enemiesArray.push(entity);
            nrOfEnemies += 1;
            console.log("In while loop of setupLevel");
        }
        //generateObstacles(levelNr);
    };

    var singleObstacle = function (x, y) {
        entity = obstacle(x, y);
        enemiesArray.push(entity);
        console.log("Single obstacle id:");
        console.log(entity.showId());
        return entity.showId();
    };

    var generateObstacles = function (levelNr) {
        var i;
        for (i = 0; i < defaults.levels[0].numberOfObstacles; i += 1) {
            entity = obstacle();
            enemiesArray.push(entity);
            entity.plot();
        }
    };

    var update = function () {
        for (i = enemiesArray.length - 1; i >= 0; i -= 1) {
            enemiesArray[i].update();
        }
        for (i = enemiesArray.length - 1; i >= 0; i -= 1) {
            enemiesArray[i].collisionCheck();
        }
        for (i = enemiesArray.length - 1; i >= 0; i -= 1) {
            if (enemiesArray[i].alive()) {
                enemiesArray[i].plot();
            } else {
                enemiesArray[i].remove();
                enemiesArray.splice(i, 1);
            }
        }

        // TODO - adapt to use nrOfEnemies instead. 
        // Add enemies if there are room for them
        while (nrOfEnemies < defaults.levels[0].simultEnemies) {
            // TODO: Initialize the correct nr of simult. enemies for the level
            entity = enemy();
            enemiesArray.push(entity);
            entity.plot();
            console.log("in while loop to add enemies");
            nrOfEnemies += 1;
        }
    };

    var clear = function () {
        enemiesArray = [];
    };

    return {
        update: update,
        clear: clear,
        generateObstacles: generateObstacles,
        singleObstacle: singleObstacle
    };
}());
