"use strict";

var idGenerator = (function() {
    var i = 0;
    var entities = {};
    var generate = function(type) {
        i += 1;
        entities[i] = type;
        return i;
    };

    var getTypeOfId = function (id) {
        return entities[id];
    };

    return {
        generate: generate,
        getTypeOfId: getTypeOfId
    };
}());

var helpers = function () {
    var createBoard = function () {
    // Appends a HTML table to the container with id #gamecontainer
    // Takes yLimit and xLimit as input for the table dimensions
        var i = 0;
        var j = 0;
        var snippet = "<table id='gamegrid'>";

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
        element.setAttribute("class", defaults.objectClasses[type]);
        var textnode = document.createTextNode(symbol);
        element.appendChild(textnode);
        var insertNode = document.getElementById("x" + x + "y" + y);
        insertNode.appendChild(element);
    };

    var randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    var putBabyInACorner = (function () {
    // Returns coordinates of the next corner of the grid at every call
        var corner = 0;
        var coords = [];
        return function () {
            corner += 1;
            if (corner === 4) {
                corner = 0;
            }
            switch (corner) {
            case 0:
                coords = [0, 0];
                break;
            case 1:
                coords = [0, defaults.yLimit];
                break;
            case 2:
                coords = [defaults.xLimit, defaults.yLimit];
                break;
            case 3:
                coords = [defaults.xLimit, 0];
                break;
            }
            return coords;
        };
    }());


    return {
        createBoard: createBoard,
        removeHTMLbyId: removeHTMLbyId,
        plotObjectByPosAndType: plotObjectByPosAndType,
        randomIntFromInterval: randomIntFromInterval,
        getNextCornerXY: putBabyInACorner
    };
};