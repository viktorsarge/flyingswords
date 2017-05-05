"use strict";


/**
 * old IE: attachEvent
 * Firefox, Chrome, or modern browsers: addEventListener
 */

function _addEventListener(evt, element, fn) {
    if (window.addEventListener) {
        element.addEventListener(evt, fn, false);
    } else {
        element.attachEvent("on" + evt, fn);
    }
}

function clearAllCells() {
    var allCells = document.getElementsByTagName("td");
    var i = 0;
    for (i = 0; i < allCells.length; i += 1) {
        allCells[i].innerText = "";
        allCells[i].classList.remove("enemy");
        allCells[i].classList.remove("obstacle");
        allCells[i].classList.remove("player");
        allCells[i].classList.remove("dead");
    }
}

function addClassForCell(className, coordinates) {
    var currentPos = "x" + coordinates[0] + " y" + coordinates[1];
    var cell = document.getElementsByClassName(currentPos);
    cell[0].classList.add(className);
}

function checkCollision(coordinates) {
    var currentPos = "x" + coordinates[0] + " y" + coordinates[1];
    var cell = document.getElementsByClassName(currentPos);
    if (!cell[0].innerText) {
        return 0;
    } else {
        return 1;
    }
}

function removeClassForCell(className, coordinates) {
    var currentPos = "x" + coordinates[0] + " y" + coordinates[1];
    var cell = document.getElementsByClassName(currentPos);
    cell[0].classList.remove(className);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateCoordinates() {
    var xLimit = 9;
    var yLimit = 4;
    var x = randomIntFromInterval(0, xLimit);
    var y = randomIntFromInterval(0, yLimit);
    var coordinates = [x, y];
    console.log(coordinates);
    while (checkCollision(coordinates)) {
        coordinates = generateCoordinates();
    }
    return coordinates;
}

function placeObstacles() {
    var numberOfObstacles = 3;
    var i = 0;
    var coordinates = [];
    var pos = "";
    var cell = [];
    for (i = 0; i < numberOfObstacles; i += 1) {
        coordinates = generateCoordinates();
        pos = "x" + coordinates[0] + " y" + coordinates[1];
        cell = document.getElementsByClassName(pos);
        cell[0].innerText = "X";
        addClassForCell("obstacle", coordinates);
    }
}

function gameOver() {
    clearAllCells(position);
    removeClassForCell("player", position);
    // (The cell at enemy position is not cleared since it is not empty)
    respawnPlayer();
    respawnEnemy();
    plotPlayer();
    plotEnemies();
    placeObstacles();
    alive = true;
}

function plotEnemies() {
    // Plot enemy if new positions is empty
    var currentPos = "x" + enemyPosition[0] + " y" + enemyPosition[1];
    var cell = document.getElementsByClassName(currentPos);
    if (!cell[0].innerText) {
        cell[0].innerText = "I";
        addClassForCell("enemy", enemyPosition);
    } else {
        cell[0].innerText += "I";
        cell[0].classList.remove("player");
        cell[0].classList.remove("obstacle");
        cell[0].classList.remove("enemy");
        cell[0].classList.add("dead");
        alive = false;
        setTimeout(function () {
            gameOver();
        }, 1000);
    }
}

function clearCell(element) {
    var currentPos = "x" + element[0] + " y" + element[1];
    var cell = document.getElementsByClassName(currentPos);
    cell[0].innerText = "";
}

var Key = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32
};

function handleKeyboardEvent(evt) {
    if (!evt) {
        evt = window.event;
    } // for old IE compatible
    var keycode = evt.keyCode || evt.which; // also for cross-browser compatible

    if (alive) {
        switch (keycode) {
        case Key.LEFT:
            if (position[0] > 0) {
                movePlayer(-1, 0);
            }
            break;
        case Key.UP:
            if (position[1] > 0) {
                movePlayer(0, -1);
            }
            break;
        case Key.RIGHT:
            if (position[0] < 9) {
                movePlayer(1, 0);
            }
            break;
        case Key.DOWN:
            if (position[1] < 4) {
                movePlayer(0, 1);
            }
            break;
        case Key.SPACE:
            movePlayer(0, 0);
            break;
        }
    }
}

_addEventListener("keydown", document, handleKeyboardEvent);

function enemy() {

    enemyPosition = [9, 4];

    var moveEnemy = function moveEnemies() {
        clearCell(enemyPosition);
        removeClassForCell("enemy", enemyPosition);
        var directionX = calculateDirection(position[0], enemyPosition[0]);
        var directionY = calculateDirection(position[1], enemyPosition[1]);
        enemyPosition[0] = enemyPosition[0] + directionX;
        enemyPosition[1] = enemyPosition[1] + directionY;
    };
    
    var calculateDirection = function calculateDirection(player, enemy) {
        var direction = 0;
        if (player > enemy) {
            direction = 1;
            return direction;
        } else if (player < enemy) {
            direction = -1;
            return direction;
        } else {
            return direction;
        }
    };
    
    var respawn = function respawnEnemy() {
        enemyPosition = [9, 4];
    };
    
    return {
        enemyPosition: enemyPosition,
        moveEnemy: moveEnemies,
        calculateDirection: calculateDirection,
        respawn: respawn
    };
}

function player() {

    var position = [1, 1];
    var alive = true;

    var movePlayer = function movePlayer(x, y) {
        clearCell(position);
        removeClassForCell("player", position);
        position[0] = position[0] + x;
        position[1] = position[1] + y;
        updateStage();
    };

    var plot = function plotPlayer() {
        // Plot player if new positions is empty
        var currentPos = "x" + position[0] + " y" + position[1];
        console.log(currentPos);
        var cell = [];
        cell = document.getElementsByClassName("x1 y1");
        console.log(currentPos);
        console.log(cell);
        if (!cell[0].innerText) {
            cell[0].innerText = "O";
            addClassForCell("player", position);
        } else {
            cell[0].innerText += "O";
            cell[0].classList.remove("player");
            cell[0].classList.remove("obstacle");
            cell[0].classList.remove("enemy");
            cell[0].classList.add("dead");
            alive = false;
            setTimeout(function () {
                gameOver();
            }, 1000);
        };
    };
    
    var respawn = function respawnPlayer() {
        position = [1, 1];
    };
    
    return {
        position: position,
        alive: alive,
        movePlayer: movePlayer,
        plot: plot,
        respawn: respawn
    };
} 

function flyingswords(player) {
    var player = player;
    var init = function init() {
        player.plot();
        console.log(player);
        return player;
        //var enemy = plotEnemies();
        //placeObstacles();
    };

    var updateStage = function updateStage() {
        if (checkCollision(position)) {
            plotPlayer();
        } else {
            plotPlayer();
            moveEnemies();
            plotEnemies();
        }
    };
        
    return {
        player: player,
        init: init,
        updateStage: updateStage
    };
    // `return` is necessary here, because `this` refers to the 
    // outer scope `this`, not the new object
}

/*
var player = player();
var game = flyingswords(player);
game.init();
console.log(game);
*/

function testObject() {
    var text = "Kalle";
    var logFunction = function (){
        var a = document.getElementsByClassName("x1 y1");
        console.log(a)
        //a[0].innerText="0";
    }
    return {
        text: text,
        log: logFunction
    }
}

var obj = testObject();
console.log(obj.text);
obj.log();