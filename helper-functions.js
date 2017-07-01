"use strict";

// ------------------------------------------------------------------------------ //
// Some helper functions for mostly document manipulation wrapped in an object    //
// -------------------------------------------------------------------------------//

function documentModMachine() {

    var createBoard = function () {
    // Appends a HTML table to the container with id #gamecontainer
    // Takes yLimit and xLimit as input for the table dimensions
        var i = 0;
        var j = 0;
        var snippet = "<table id=\"gamegrid\" class=\"center\">";
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

    var clearCell = function (xy) {
    // Clears innerText of a cell. Takes array with x / y as input.
        var currentPos = "x" + xy[0] + "y" + xy[1];
        var cell = document.getElementById(currentPos);
        cell.innerText = "";
    };

    var isEmpty = function (coordinates) {
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        if (cell.innerText.length > 0) {
            return 0;
        } else {
            return 1;
        }
    };

    var removeClassForCell = function (className, coordinates) {
    // Removes a specified class name from a cell.
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        cell.classList.remove(className);
    };

    var innerHTMLofPos = function (xy) {
        var currentPos = "x" + xy[0] + "y" + xy[1];
        var cell = document.getElementById(currentPos);
        return cell.innerHTML;
    };

    var clearAllCells = function () {
        var allCells = document.getElementsByTagName("td");
        var i = 0;
        for (i = 0; i < allCells.length; i += 1) {
            allCells[i].innerText = "";
            allCells[i].classList.remove("shield");
            allCells[i].classList.remove("enemy");
            allCells[i].classList.remove("obstacle");
            allCells[i].classList.remove("player");
            allCells[i].classList.remove("dead");
            allCells[i].classList.add("noanimation");
            allCells[i].style.backgroundColor = "";
            allCells[i].style.color = "";
        }
    };

    var addClassForCell = function (className, coordinates) {
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        cell.classList.add(className);
    };

    var randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    var displayText = function (input) {
        var i = 0;
        input = input.split("");
        var stop = input.length;
        var cell = document.getElementsByClassName("y" + Math.floor(defaults.yLimit / 2 - 1));
        var indentation = Math.floor((defaults.xLimit - input.length) / 2) + 1;
        for (i = 0; i < stop; i += 1) {
            cell[i + indentation].innerHTML = input[i];
            cell[i + indentation].style.color = "white";
            cell[i + indentation].style.backgroundColor = "#F1A94E";
        }
        return;
    };

    var getCellsWithContent = function () {
        var cells = document.getElementsByTagName("td");
        var i = 0;
        var stopindex = cells.length;
        var cellsWithContent = [];
        for (i = 0; i < stopindex; i += 1) {
            if (cells[i].innerHTML.length > 0) {
                cellsWithContent.push(cells[i]);
            }
        }
        return cellsWithContent;
    };

    return {
        innerHTMLofPos: innerHTMLofPos,
        createBoard: createBoard,
        addClassForCell: addClassForCell,
        clearCell: clearCell,
        isEmpty: isEmpty,
        removeClassForCell: removeClassForCell,
        clearAllCells: clearAllCells,
        randomIntFromInterval: randomIntFromInterval,
        displayText: displayText,
        getCellsWithContent: getCellsWithContent
    };
}