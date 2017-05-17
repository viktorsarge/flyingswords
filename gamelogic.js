"use strict";

// -------------------------------------------------------- //
// Default values to be used in the program                 //
// -------------------------------------------------------- //

var defaults = (function() {
    var xLimit = 19;
    var yLimit = 9;
    var playerPos = [Math.floor(xLimit/2), Math.floor(yLimit/2)];
    return {
        xLimit: xLimit,
        yLimit: yLimit,
        playerPos: playerPos,
        numberOfObstacles: 10,
        numberOfEnemies: 4
    };
}());

// -------------------------------------------------------- //
// Some helper functions wrapped in an object               //
// -------------------------------------------------------- //

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
                //console.log(i, j);
            }
            snippet = snippet + "</tr>";
        }
        var container = document.getElementById("gamecontainer");
        //console.log(container);
        container.innerHTML = snippet;
        return;
    };

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

    var innerHTMLofPos = function (xy) {
        var currentPos = "x" + xy[0] + " y" + xy[1];
        console.log(xy, currentPos);
        var cell = document.getElementsByClassName(currentPos);
        return cell[0].innerHTML;
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
        innerHTMLofPos: innerHTMLofPos,
        createBoard: createBoard,
        addClassForCell: addClassForCell,
        clearCell: clearCell,
        removeClassForCell: removeClassForCell,
        clearAllCells: clearAllCells,
        randomIntFromInterval: randomIntFromInterval
    };
}

//  ------------------------------------------------------------------------------ //
//  The game object below                                                          //
//  ------------------------------------------------------------------------------ //

function flyingswords(helper, defaults) {
    // Keycode names for controls
    var Key = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32
    };
    
    var score = 0;
    
    var putBabyInACorner = (function () {
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
    })();

    var checkCollision = function (coordinates) {
        var currentPos = "x" + coordinates[0] + " y" + coordinates[1];
        var cell = document.getElementsByClassName(currentPos);
        console.log("position in checkcoll: " + currentPos + "Colliding inner text length: " + cell[0].innerText.length);
        if (cell[0].innerText.length > 1) {
            console.log("REturning true for collision");
            return 1;
        } else {
            return 0;
        }
    };
    
    var isObstacle = function (coordinates) {
        var currentPos = "x" + coordinates[0] + " y" + coordinates[1];
        var cell = document.getElementsByClassName(currentPos);
        if (cell[0].innerHTML.indexOf("X") > -1) {
            return 1;
        } else {
            return 0;
        }
    };
    
    var isPlayer = function (coordinates) {
        var currentPos = "x" + coordinates[0] + " y" + coordinates[1];
        var cell = document.getElementsByClassName(currentPos);
        if (cell[0].innerHTML.indexOf("O") > -1) {
            return 1;
        } else {
            return 0;
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
            plot();
            //updateStage();
        };

        var plot = function () {
            // Plot player if new positions is empty
            var currentPos = "x" + player.position[0] + " y" + player.position[1];
            var cell = [];
            cell = document.getElementsByClassName(currentPos);
            cell[0].innerText += "O";
            cell[0].classList.add("player");
            if (checkCollision(player.position)) {
            gameOver();}
        };

        var respawn = function () {
            player.position = [Math.floor(defaults.xLimit/2), Math.floor(defaults.yLimit/2)];
        };

        return {
            position: position,
            alive: alive,
            movePlayer: movePlayer,
            plot: plot,
            respawn: respawn
        };
    }());
    
    function enemyPlotDelay(i) {
        setTimeout(function() {
            enemies[i].move();
            enemies[i].plot();
        }, 100 * i);
        console.log("Delays");
    }

    var updateStage = function () {
        var cell = [];
        var position = "";
        /*player.plot();
        if (checkCollision(player.position)) {
            gameOver();
        } else {*/
            var i = 0;
            var stop = enemies.length;
            for (i = 0; i < stop; i += 1) {
                enemies[i].move();
                enemies[i].plot();
                console.log("Enemy position: " + enemies[i].enemyPosition());
            }
            for (i = 0; i < stop; i += 1) {
                if (checkCollision(enemies[i].enemyPosition())) {
                    enemies[i].kill();
                    if (isObstacle(enemies[i].enemyPosition())) {
                        position = "x" + enemies[i].enemyPosition()[0] + " y" + enemies[i].enemyPosition()[1];
                        cell = document.getElementsByClassName(position);
                        cell[0].classList.remove("obstacle");
                        cell[0].classList.add("dead");
                        cell[0].classList.remove("enemy");
                    } else if (isPlayer(enemies[i].enemyPosition())) {
                        gameOver();
                    } else {
                        position = "x" + enemies[i].enemyPosition()[0] + " y" + enemies[i].enemyPosition()[1];
                        cell = document.getElementsByClassName(position);
                        cell[0].classList.add("dead");
                        cell[0].classList.remove("enemy");
                    }
                    console.log("Killed enemy");
                }
            }
        //}
    };

    var generateCoordinates = function genCoordinates(spec) {
        var xLimit = defaults.xLimit;
        var yLimit = defaults.yLimit;
        var x = helper.randomIntFromInterval(0, xLimit);
        var y = helper.randomIntFromInterval(0, yLimit);
        var coordinates = [x, y];
        if (spec.skipCollisionCheck === true) {
            return coordinates;
        } else {
            while (checkCollision(coordinates)) {
                coordinates = genCoordinates({skipCollisionCheck: false});
            }
            return coordinates;
        }
    };
    
    var updateScore = function () {
        document.getElementById("score").innerText = score;
    };

    var placeObstacles = function () {
        var i = 0;
        var coordinates = [];
        var pos = "";
        var cell = [];
        var stopIndex = defaults.numberOfObstacles;
        for (i = 0; i < stopIndex; i += 1) {
            coordinates = generateCoordinates({skipCollisionCheck: false});
            pos = "x" + coordinates[0] + " y" + coordinates[1];
            cell = document.getElementsByClassName(pos);
            cell[0].innerHTML = "X";
            helper.addClassForCell("obstacle", coordinates);
            
            // Code for Chrome, Safari and Opera
            cell[0].addEventListener("webkitAnimationEnd", resetObstacle);
            // Standard syntax
            cell[0].addEventListener("animationend", resetObstacle);
        }
    };
    
    var resetObstacle = function () {
        this.innerHTML = "X";
        this.classList.remove("enemy");
        this.classList.remove("dead");
        this.classList.add("obstacle");
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
            enemies[i].respawn();
            enemies[i].plot();
        }
        placeObstacles(); 
    };

    var gameOver = function () {
        helper.clearAllCells();
        player.alive = true;
        player.respawn();
        var i = 0;
        var stop = enemies.length;
        for (i = 0; i < stop; i += 1) {
            enemies[i].respawn();
            enemies[i].reposition();
        }
        player.plot();
        for (i = 0; i < stop; i += 1) {
            enemies[i].plot();
        }
        placeObstacles();
    };

    var createEnemy = function () {
        var alive = false;
        var enemyPosition = [];
        var move = function () {
            if (alive) {
                helper.clearCell(enemyPosition);
                helper.removeClassForCell("enemy", enemyPosition);
                var directionX = calculateDirection(player.position[0], enemyPosition[0]);
                var directionY = calculateDirection(player.position[1], enemyPosition[1]);
                enemyPosition[0] = enemyPosition[0] + directionX;
                enemyPosition[1] = enemyPosition[1] + directionY;
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
            enemyPosition = putBabyInACorner();
            alive = true;
        };
        
        var reposition = function () {
            enemyPosition = putBabyInACorner();
            console.log("Reposition" + enemyPosition);
        };

        var plot = function () {
            if (alive) {
                console.log(enemyPosition);
                var currentPos = "x" + enemyPosition[0] + " y" + enemyPosition[1];
                var cell = document.getElementsByClassName(currentPos);
                cell[0].innerHTML += "I";
                cell[0].classList.add("enemy");
            } else {
                respawn();
                plot();
            }
        };
        
        var reportPosition = function () {
            return enemyPosition;
        };
        
        var kill = function () {
            alive = false;
            //score += 1;
            //updateScore();
        };

        return {
            kill: kill,
            alive: alive,
            reposition: reposition,
            enemyPosition: reportPosition,
            calculateDirection: calculateDirection,
            respawn: respawn,
            move: move,
            plot: plot
        };
    }

    var enemies = [];
    var i = 0;
    var stopindex = defaults.numberOfEnemies;
    for (i = 0; i < stopindex; i += 1 ) {
        enemies.push(createEnemy());
    }
    for (i=0; i < stopindex; i += 1) {
        enemies[i].reposition(); 
    }

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
        init: init,
        update: updateStage
    };
}

var helper = documentModMachine();
var game = flyingswords(helper, defaults);
game.init();
setInterval(game.update, 1000);
