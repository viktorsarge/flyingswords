var idGenerator = function() {
    var i = 0;
    var generate = function() {
    	i += 1;
    	return i;
    };
    return {
    	generate: generate
    };
}();

var helpers = function () {
    var createBoard = function () {
    // Appends a HTML table to the container with id #gamecontainer
    // Takes yLimit and xLimit as input for the table dimensions
        var i = 0;
        var j = 0;
        var snippet = '<table id="gamegrid">';

        for (i = 0; i < defaults.yLimit + 1; i += 1) {
            snippet = snippet + "<tr>";

            for (j = 0; j < defaults.xLimit + 1; j += 1) {
                snippet = snippet + "<td id=\"x" + j + "y" + i + "\" class=\"x" + j + " y" + i + "\"></td>";
 
            }
            snippet = snippet + "</tr>";
        }
        var container = document.getElementById("gamecontainer");
        container.innerHTML = snippet;
        return;
    };

    var removeHTMLbyId = function(id) {
    	var element = document.getElementById(id);
    	element.parentNode.removeChild(element);
    };

    var plotObjectByPosAndType = function(x, y, type, id) {
    	var symbol = defaults.objectSymbols[type];
    	var element = document.createElement("div");
    	element.id = id;
    	element.setAttribute('class', defaults.objectClasses[type]);
    	var textnode = document.createTextNode(symbol);
    	element.appendChild(textnode);
    	var insertNode = document.getElementById("x" + x + "y" + y);
    	insertNode.appendChild(element);
    };

    var randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

	return {
		createBoard: createBoard,
		removeHTMLbyId: removeHTMLbyId,
		plotObjectByPosAndType: plotObjectByPosAndType,
		randomIntFromInterval: randomIntFromInterval
	};
}