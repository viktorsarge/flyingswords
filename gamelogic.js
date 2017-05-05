"use strict";

//
// Some helper functions wrapped in an object
//

var defaults = (function() {
    var playerPos = [1, 1];
    return {
        playerPos: playerPos,
        enemyPos: [9,4],
        xLimit: 19,
        yLimit: 9,
        numberOfObstacles: 10,
        numberOfEnemies: 5
    };
}());

function documentModMachine() {

    var createBoard = function () {
        var i = 0;
        var j = 0;
        //console.log(defaults);
        var snippet = "<table id=\"gamegrid\" class=\"center\">";

        for (i = 0; i < defaults.yLimit +1 ; i += 1) {
            snippet = snippet + "<tr>";
            //console.log(i);
            for (j = 0; j < defaults.xLimit +1; j += 1) {
                snippet = snippet + "<td class=\"x" + j + " y" + i + "\"></td>";
                console.log(i, j);
            }
            snippet = snippet + "</tr>";
        }
        var container = document.getElementById("gamecontainer");
        //console.log(container);
        container.innerHTML = snippet;
        return;
    }

    var clearCell = function (element) {
        var currentPos = "x" + element[0] + " y" + element[1];
        var cell = document.getElementsByClassName(currentPos);
        cell[0].innerText = "";
    };

    var removeClassForCell = function (className, coordinates) {
        var currentPos = "x" + coordinates[0] + " y" + coordinates[1];
        var cell = document.getElementsByClassName(currentPos);
        cell[0].classList.remove(className);
    };

    var clearAllCells = function () {
        var allCells = document.getElementsByTagName("td");
        var i = 0;
        for (i = 0; i < allCells.length; i += 1) {
            allCells[i].innerText = "";
            allCells[i].classList.remove("enemy");
            allCells[i].classList.remove("obstacle");
            allCells[i].classList.remove("player");
            allCells[i].classList.remove("dead");
        }
    };

    var addClassForCell = function (className, coordinates) {
        var currentPos = "x" + coordinates[0] + " y" + coordinates[1];
        var cell = document.getElementsByClassName(currentPos);
        cell[0].classList.add(className);
    };

    var randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    return {
        createBoard: createBoard,
        addClassForCell: addClassForCell,
        clearCell: clearCell,
        removeClassForCell: removeClassForCell,
        clearAllCells: clearAllCells,
        randomIntFromInterval: randomIntFromInterval
    };
}

//
//  The game object belopw
//

function flyingswords(helper, defaults) {
    // Keycode names for controls
    var Key = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32
    };

    var checkCollision = function (coordinates) {
        var currentPos = "x" + coordinates[0] + " y" + coordinates[1];
        var cell = document.getElementsByClassName(currentPos);
        console.log("This cell is checked for collision: " + cell[0].innerHTML);
        if (!cell[0].innerText) {
            return 0;
        } else {
            return 1;
        }
    };

    var player = (function () {

        var position = defaults.playerPos;
        var alive = true;

        var movePlayer = function (xDir, yDir) {
            helper.clearCell(player.position);
            helper.removeClassForCell("player", player.position);
            player.position[0] = player.position[0] + xDir;
            player.position[1] = player.position[1] + yDir;
            console.log("The player position after move: " + player.position, position);
            updateStage();
            //console.log(position);
        };

        var plot = function () {
            console.log("Plot sees player at: " + player.position);
            // Plot player if new positions is empty
            var currentPos = "x" + player.position[0] + " y" + player.position[1];
            //console.log(currentPos);
            var cell = [];
            cell = document.getElementsByClassName(currentPos);
            //console.log(currentPos);
            //console.log(cell);
            if (!cell[0].innerText) {
                cell[0].innerText = "O";
                helper.addClassForCell("player", player.position);
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
            }
        };

        var respawn = function () {
            player.position = [1, 1];
        };

        return {
            position: position,
            alive: alive,
            movePlayer: movePlayer,
            plot: plot,
            respawn: respawn
        };
    }());

    var updateStage = function () {
        if (checkCollision(player.position)) {
            player.plot();
            console.log("Would have collided");
        } else {
            player.plot();
            var i = 0;
            var stop = enemies.length;
            for (i = 0; i < stop; i += 1) {
                enemies[i].move();
                enemies[i].plot();
            }
        }
    };

    var generateCoordinates = function genCoordinates(spec) {
        var xLimit = defaults.xLimit;
        var yLimit = defaults.yLimit;
        var x = helper.randomIntFromInterval(0, xLimit);
        var y = helper.randomIntFromInterval(0, yLimit);
        var coordinates = [x, y];
        if (spec.skipCollisionCheck == true) {
            return coordinates
        } else {
            while (checkCollision(coordinates)) {
                coordinates = genCoordinates();
            }
            return coordinates;
        }
    };

    var placeObstacles = function () {
        var i = 0;
        var coordinates = [];
        var pos = "";
        var cell = [];
        var stopIndex = defaults.numberOfObstacles;
        for (i = 0; i < stopIndex; i += 1) {
            coordinates = generateCoordinates({skipCollisionCheck: true});
            pos = "x" + coordinates[0] + " y" + coordinates[1];
            cell = document.getElementsByClassName(pos);
            cell[0].innerText = "X";
            helper.addClassForCell("obstacle", coordinates);
        }
    };

    /**
    * old IE: attachEvent
    * Firefox, Chrome, or modern browsers: addEventListener
    */
    var addEventListener = function (evt, element, fn) {
        if (window.addEventListener) {
            element.addEventListener(evt, fn, false);
        } else {
            element.attachEvent("on" + evt, fn);
        }
    };
    var init = function () {
        helper.createBoard();
        
        player.plot();
        addEventListener("keydown", document, handleKeyboardEvent);
        var i = 0;
        var stop = enemies.length;
        for (i = 0; i < stop; i += 1) {
            enemies[i].plot();
        }
        placeObstacles(); 
    };

    var gameOver = function () {
        helper.clearAllCells();
        //helper.removeClassForCell("player", player.position);
        // (The cell at enemy position is not cleared since it is not empty)
        player.alive = true;
        player.respawn();
        //console.log("GameOver sees player at: " + player.position);
        var i = 0;
        var stop = enemies.length;
        for (i = 0; i < stop; i += 1) {
            enemies[i].alive = true;
            enemies[i].respawn();
        }
        player.plot();
        for (i = 0; i < stop; i += 1) {
            enemies[i].plot();
        }
        placeObstacles();

    };

    var enemies = [];
    var i = 0;
    var stopindex = defaults.numberOfEnemies;
    for (i = 0; i < stopindex; i += 1 ) {
        enemies.push(
            (function () {
                var alive = true;
                var enemyPosition = generateCoordinates({skipCollisionCheck: true});

                var move = function () {
                    if (alive) {
                    console.log("Enemy position before move: " + enemyPosition);
                    helper.clearCell(enemyPosition);
                    helper.removeClassForCell("enemy", enemyPosition);
                    var directionX = calculateDirection(player.position[0], enemyPosition[0]);
                    var directionY = calculateDirection(player.position[1], enemyPosition[1]);
                    enemyPosition[0] = enemyPosition[0] + directionX;
                    enemyPosition[1] = enemyPosition[1] + directionY;
                    console.log("Enemy position after move function: " + enemyPosition);
                    }
                };

                var calculateDirection = function (player, enemy) {
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

                var respawn = function () {
                    enemyPosition = generateCoordinates({skipCollisionCheck: false});
                    alive = true;
                };

                var plot = function () {
                    if (alive) {
                        // Plot enemy if new positions is empty
                        var currentPos = "x" + enemyPosition[0] + " y" + enemyPosition[1];
                        var cell = document.getElementsByClassName(currentPos);
                        if (!cell[0].innerText) {
                            cell[0].innerText = "I";
                            helper.addClassForCell("enemy", enemyPosition);
                        } else if (cell[0].innerText === "X"){
                            cell[0].innerText += "I";
                            alive = false;
                            cell[0].classList.remove("player");
                            cell[0].classList.remove("obstacle");
                            cell[0].classList.remove("enemy");
                            cell[0].classList.add("dead");
                            //player.alive = false;
                        } else if (cell[0].innerText === "O") {
                            cell[0].innerText += "I";
                            alive = false;
                            player.alive = false;
                            cell[0].classList.remove("player");
                            cell[0].classList.remove("obstacle");
                            cell[0].classList.remove("enemy");
                            cell[0].classList.add("dead");
                            //player.alive = false;
                            setTimeout(function () {
                                gameOver();
                            }, 1000);
                        } else {
                            cell[0].innerText += "I";
                            alive = false;
                            cell[0].classList.remove("player");
                            cell[0].classList.remove("obstacle");
                            cell[0].classList.remove("enemy");
                            cell[0].classList.add("dead");

                        }
                    }
                };

                return {
                    alive: alive,
                    enemyPosition: enemyPosition,
                    calculateDirection: calculateDirection,
                    respawn: respawn,
                    move: move,
                    plot: plot
                };
            }())
        
        
        );
    }
    
    /*
    var enemy = (function () {
        var enemyPosition = generateCoordinates({skipCollisionCheck: true});

        var move = function () {
            console.log("Enemy position before move: " + enemyPosition);
            helper.clearCell(enemyPosition);
            helper.removeClassForCell("enemy", enemyPosition);
            var directionX = calculateDirection(player.position[0], enemyPosition[0]);
            var directionY = calculateDirection(player.position[1], enemyPosition[1]);
            enemyPosition[0] = enemyPosition[0] + directionX;
            enemyPosition[1] = enemyPosition[1] + directionY;
            console.log("Enemy position after move function: " + enemyPosition);
        };

        var calculateDirection = function (player, enemy) {
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

        var respawn = function () {
            enemyPosition = [9, 4];
        };

        var plot = function () {
            // Plot enemy if new positions is empty
            var currentPos = "x" + enemyPosition[0] + " y" + enemyPosition[1];
            var cell = document.getElementsByClassName(currentPos);
            if (!cell[0].innerText) {
                cell[0].innerText = "I";
                helper.addClassForCell("enemy", enemyPosition);
            } else {
                cell[0].innerText += "I";
                cell[0].classList.remove("player");
                cell[0].classList.remove("obstacle");
                cell[0].classList.remove("enemy");
                cell[0].classList.add("dead");
                player.alive = false;
                setTimeout(function () {
                    gameOver();
                }, 1000);
            }
        };

        return {
            enemyPosition: enemyPosition,
            calculateDirection: calculateDirection,
            respawn: respawn,
            move: move,
            plot: plot
        };
    }());
    */

    var handleKeyboardEvent = function (evt) {
        if (!evt) {
            evt = window.event;
        } // for old IE compatible
        var keycode = evt.keyCode || evt.which; // also for cross-browser compatible

        if (player.alive) {
            console.log("Input handler sees player at: " + player.position);
            switch (keycode) {
            case Key.LEFT:
                if (player.position[0] > 0) {
                    player.movePlayer(-1, 0);
                }
                break;
            case Key.UP:
                if (player.position[1] > 0) {
                    player.movePlayer(0, -1);
                }
                break;
            case Key.RIGHT:
                if (player.position[0] < defaults.xLimit) {
                    player.movePlayer(1, 0);
                }
                break;
            case Key.DOWN:
                if (player.position[1] < defaults.yLimit) {
                    player.movePlayer(0, 1);
                }
                break;
            case Key.SPACE:
                player.movePlayer(0, 0);
                break;
            }
        }
    };


    return {
        init: init
    };
}

var helper = documentModMachine();
var game = flyingswords(helper, defaults);
game.init();
