"use strict";

var worldmap = (function () {

    var i = 0;
    var j = 0;
    var worldarray = [];
    var worldrow = [];

    // Create the basic world 3d array - [y][x][id, id, id]
    var makeEmptyWorld = function () {
        worldarray = [];
        worldrow = [];
        for (i = 0; i < defaults.yLimitMap + 1; i += 1) {
            for (j = 0; j < defaults.xLimitMap + 1; j += 1) {
                worldrow.push([]);
            }
            worldarray.push(worldrow);
            worldrow = [];
        }
    };

    // Adds the id of a game object at world array x, y pos.
    var addIdAt = function (id, x, y) {
        worldarray[y][x].push(id);
    };

    var removeIdAt = function (id, x, y) {
        var index = worldarray[y][x].indexOf(id);
        worldarray[y][x].splice(index, 1);
    };

    // Moves the id of a game object in the world array
    var moveIdFromTo = function (id, x1, y1, x2, y2) {
        var index;
        var xMax = defaults.xLimit;
        var yMax = defaults.yLimit;

        // Checking that the move is within world limits
        if (x2 >= 0 && x2 <= xMax && y2 >= 0 && y2 <= yMax) {
            index = worldarray[y1][x1].indexOf(id);
            // Add to left or right of new position
            if (x1 < x2) {
                // Remove id from old position if found

                if (index > -1) {
                    worldarray[y1][x1].splice(index);
                    helper.removeHTMLbyId(id);
                }
                // Add to the left at the new position
                worldarray[y2][x2].unshift(id);
            } else {
                // Remove from the old position if found

                if (index > -1) {
                    worldarray[y1][x1].splice(index);
                    helper.removeHTMLbyId(id);
                }
                // Add to the right at the new position
                worldarray[y2][x2].push(id);
            }
            return true;
        } else {
            return false;
        }
    };

    var isEmptyPos = function (x, y) {
        if (x < 0 || x > defaults.xLimit || y < 0 || y > defaults.yLimit) {
            return true;
        } else if (worldarray[y][x].length > 0) {
            return false;
        } else {
            return true;
        }
    };

    return {
        addIdAt: addIdAt,
        removeIdAt: removeIdAt,
        moveIdFromTo: moveIdFromTo,
        isEmptyPos: isEmptyPos,
        makeEmptyWorld: makeEmptyWorld
    };

}());