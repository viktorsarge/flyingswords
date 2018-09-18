"use strict";

var entitiesController = (function () {
    var i;
    var limit;
    var enemiesArray = [];
    var entity;
    var nrOfEnemies = 0;
    console.log("entities triggered");

    var setupLevel = function (levelNr) {
        enemiesArray = [];
        nrOfEnemies = 0;
        console.log("setupLevel in entities has triggered");
        // TODO - convert to a for loop instead
        while (nrOfEnemies < defaults.levels[levelNr].simultEnemies) {
            entity = enemyModel();
            enemiesArray.push(entity);
            nrOfEnemies += 1;
            console.log("In while loop of setupLevel");
        }
    };

    var singleObstacle = function (x, y) {
        entity = obstacleModel(x, y);
        enemiesArray.push(entity);
        console.log("Single obstacle id:");
        console.log(entity.showId());
        return entity.showId();
    };

    var generateObstacles = function (levelNr) {
        var i;
        for (i = 0; i < defaults.levels[0].numberOfObstacles; i += 1) {
            entity = obstacleModel();
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

        // Add one new enemy per tick if there is room for it
        if (nrOfEnemies < defaults.levels[0].simultEnemies) {
            entity = enemyModel();
            enemiesArray.push(entity);
            entity.plot();
            nrOfEnemies += 1;
        }
    };

    var clear = function () {
        enemiesArray = [];
        nrOfEnemies = 0;
    };

    var oneLessEnemy = function () {
        nrOfEnemies -= 1;
    };

    return {
        update: update,
        clear: clear,
        generateObstacles: generateObstacles,
        singleObstacle: singleObstacle,
        oneLessEnemy: oneLessEnemy
    };
}());
