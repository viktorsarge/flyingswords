console.log("ASDF");
var placeObstacles = function (nr) {
	var i = 0;
	var x = 0;
	var y = 0;
	var id = 0;
	var type = "obstacle";
	while (i < nr) {
		console.log("Generated an obstacle");
		x = helper.randomIntFromInterval(0, defaults.xLimit);
	    y = helper.randomIntFromInterval(0, defaults.yLimit);
	    id = idGenerator.generate();
	    worldmap.addIdAt(id, x, y);
	    helper.plotObjectByPosAndType(x, y, type, id);
	    i += 1;
	}
};