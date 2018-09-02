var worldmap = function() {

		// Create the basic world 3d array - [y][x][id, id, id]
    	var i = 0;
    	var j = 0;
    	var worldarray = [];
    	var worldrow = [];

    	for (i = 0; i < defaults.yLimitMap + 1; i += 1) {

    		for (j = 0; j < defaults.xLimitMap + 1; j += 1) {
    			worldrow.push([]);
    		}
    		worldarray.push(worldrow);
    		worldrow = [];
    	} 
    	console.log(worldarray);

    // Adds the id of a game object at world array x, y pos. 	
	var addIdAt = function(id, x, y) {
		worldarray[y][x].push(id);
		console.log(worldarray);
	};

	// Moves the id of a game object from one place in the world array to another
	var moveIdFromTo = function(id, x1, y1, x2, y2) {
		
		// Checking that the move is within world limits
		if (x2 >= 0 && x2 <= defaults.xLimit && y2 >= 0 && y2 <= defaults.yLimit) {
			// Add to left or right of new position
			if (x1 < x2) {
				// Remove id from old position if found
				var index = worldarray[y1][x1].indexOf(id);
				if (index > -1) {
					worldarray[y1][x1].splice(index)
					helper.removeHTMLbyId(id);
				}
				// Add to the left at the new position
				worldarray[y2][x2].unshift(id);
			} else {
				// Remove from the old position if found
				var index = worldarray[y1][x1].indexOf(id);
				if (index > -1) {
					worldarray[y1][x1].splice(index)
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
		if (worldarray[y][x].length > 0) {
			return false;
		} else {
			return true;
		}
	};

	return {
		addIdAt: addIdAt,
		moveIdFromTo: moveIdFromTo,
		isEmptyPos: isEmptyPos
	};

}();