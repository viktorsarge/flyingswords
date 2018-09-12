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
        for (i = enemiesArray.length - 1; i >= 0; i -= 1) {
            enemiesArray[i].move();
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

        // Add enemies if there are room for them
        while (enemiesArray.length < defaults.levels[2].simultEnemies) {
            // TODO: Initialize the correct nr of simult. enemies for the level
            entity = enemy();
            enemiesArray.push(entity);
            entity.plot();
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
