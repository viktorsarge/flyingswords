"use strict";

//  ------------------------------------------------------------------------------ //
//  The game object below                                                          //
//  ------------------------------------------------------------------------------ //

function flyingswords(helper, defaults) {
    var currentLevel = 0;
    var kills = 0;
    var enemies = [];

    var checkCollision = function (coordinates) {
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        if (cell.innerText.length > 1) {
            return 1;
        } else {
            return 0;
        }
    };

    var pauseController = (function () {
        var paused = true;
        var clock = "";
        var pause = function () {
            paused = true;
            clearInterval(clock);
            return paused;
        };
        var unpause = function () {
            clock = setInterval(updateStage, defaults.levels[currentLevel].clockSpeed);
            paused = false;
            return paused;
        };
        var isPaused = function () {
            return paused;
        };
        return {
            pause: pause,
            unpause: unpause,
            isPaused: isPaused
        };
    }());

    var player = (function () {

        var position = defaults.playerPos;
        var alive = true;

        var plot = function () {
            // Plot player at given postion (updated by .move) and kill if collided
            var currentPos = "x" + position[0] + "y" + position[1];
            var cell = [];
            cell = document.getElementById(currentPos);
            cell.innerText += "O";
            cell.classList.add("player");
            if (checkCollision(position)) {
                alive = false;
                pauseController.pause();
                cell.classList.add("dead");
                // Code for Chrome, Safari and Opera
                cell.addEventListener("webkitAnimationEnd", gameOver);
                // Standard syntax
                cell.addEventListener("animationend", gameOver);
            }
        };

        var movePlayer = function (xDir, yDir) {
            helper.clearCell(position);
            helper.removeClassForCell("player", position);
            position[0] = position[0] + xDir;
            position[1] = position[1] + yDir;
            plot();
        };

        var respawn = function () {
            position = [Math.floor(defaults.xLimit / 2), Math.floor(defaults.yLimit / 2)];
        };
        
        var reportPosition = function () {
            return position;
        };

        return {
            reportPosition: reportPosition,
            alive: alive,
            movePlayer: movePlayer,
            plot: plot,
            respawn: respawn
        };
    }());

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
/*
    var boss = function () {
        var alive = true; 
        var position = [];  // Todo: Handle four spaces

        var move = function () {}; // Todo: Regular move wrapped in a loop? 

        var plot = function () {}; // Todo: Regular plot wrapped in a loop?

        var fire = function () {}; // Todo: When to trigger? 
    };
*/
    var basicEnemy = function () {
        var alive = true;
        var enemyPosition = putBabyInACorner();

        var reportAliveStatus = function () {
            return alive;
        };

        var move = function () {
            if (alive) {
                console.log(player.reportPosition() + "Player position in enemy move");
                var playerpos = player.reportPosition();
                helper.clearCell(enemyPosition);
                helper.removeClassForCell("enemy", enemyPosition);
                var directionX = calculateDirection(playerpos[0], enemyPosition[0]);
                var directionY = calculateDirection(playerpos[1], enemyPosition[1]);
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

        var collisioncheck = function () {
            var currentPos = "x" + enemyPosition[0] + "y" + enemyPosition[1];
            var cell = document.getElementById(currentPos);
            if (isPlayer(enemyPosition)) {
                pauseController.pause();
                cell.classList.remove("player");
                cell.classList.remove("enemy");
                cell.classList.add("dead");
                // Code for Chrome, Safari and Opera
                cell.addEventListener("webkitAnimationEnd", gameOver);
                // Standard syntax
                cell.addEventListener("animationend", gameOver);
            } else if (isObstacle(enemyPosition)) {
                kill();
                cell.classList.remove("obstacle");
                cell.classList.add("dead");
                cell.classList.remove("enemy");
            } else if (isEnemy(enemyPosition) && cell.innerHTML.length > 1) {
                kill();
                cell.innerHTML = "X";
                helper.addClassForCell("obstacle", enemyPosition);
                cell.classList.add("dead");
                cell.classList.remove("enemy");
                // Code for Chrome, Safari and Opera
                cell.addEventListener("webkitAnimationEnd", resetObstacle);
                // Standard syntax
                cell.addEventListener("animationend", resetObstacle);
            }
        };

        var plot = function () {
            var cell = "";
            if (reportAliveStatus()) {
                var currentPos = "x" + enemyPosition[0] + " y" + enemyPosition[1];
                cell = document.getElementsByClassName(currentPos);
                cell[0].innerHTML += "I";
                cell[0].classList.add("enemy");
            } 
        };

        var reportPosition = function () {
            return enemyPosition;
        };

        var kill = function () {
            alive = false;
            enemySpawner.add();
            kills += 1;
            score.add();
            updateStats();
            if (kills === defaults.levels[currentLevel].killsRequired && currentLevel <= defaults.levels.length) {
                pauseController.pause();
                delayFunction(levelUp, 1500);
            } else if (kills === defaults.levels[currentLevel].killsRequired && currentLevel === defaults.levels.length) {
                pauseController.pause();
                helper.clearAllCells();
                enemies = [];
                currentLevel = 0;
                enemySpawner.resetSpawnlimit();
                helper.displayText("You win!");
                delayFunction(gameRestart, 1500);
            }
        };

        return {
            reportAliveStatus: reportAliveStatus,
            kill: kill,
            alive: alive,
            enemyPosition: reportPosition,
            calculateDirection: calculateDirection,
            collisioncheck: collisioncheck,
            move: move,
            plot: plot
        };
    };

   /*
    var cell = function () {
        var content = [];
        var add = function (symbol) {
            content.push(symbol);
        };
        var clear = function () {
            content = [];
        };
        return {
            add: add,
            clear: clear
        };
    };*/

// ------------------------------------------------------------------------------
//          General game specific helpers
// ------------------------------------------------------------------------------
    var score = (function () {
    // Scorekeeping. Can add one or reset score.
        var points = 0;
        var cell = document.getElementById("score");
        cell.innerHTML = points;
        var add = function () {
            points += 1;
            cell.innerHTML = points;
        };
        var reset = function () {
            points = 0;
            cell.innerHTML = points;
        };
        return {
            add: add,
            reset: reset
        };
    }());

    var isObstacle = function (coordinates) {
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        if (cell.innerHTML.indexOf("X") > -1) {
            return 1;
        } else {
            return 0;
        }
    };
    
    var isEnemy = function (coordinates) {
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        if (cell.innerHTML.indexOf("I") > -1) {
            return 1;
        } else {
            return 0;
        }
    };

    var isPlayer = function (coordinates) {
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        if (cell.innerHTML.indexOf("O") > -1) {
            return 1;
        } else {
            return 0;
        }
    };

    var updateStats = function () {
        var remain = defaults.levels[currentLevel].killsRequired - kills;
        var cell = document.getElementById("leftToKill");
        cell.innerHTML = remain;
    };

    // Cleartext translation of keycodes for readability
    var Key = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32,
        P: 80
    };

    var resetObstacle = function () {
        this.innerHTML = "X";
        this.classList.remove("enemy");
        this.classList.remove("dead");
        this.classList.add("obstacle");
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
            while (!helper.isEmpty(coordinates)) {
                coordinates = genCoordinates({skipCollisionCheck: false});
            }
            return coordinates;
        }
    };

    var placeObstacles = function () {
        var i = 0;
        var coordinates = [];
        var pos = "";
        var cell = [];
        var stopIndex = defaults.levels[currentLevel].numberOfObstacles;

        for (i = 0; i < stopIndex; i += 1) {
            coordinates = generateCoordinates({skipCollisionCheck: false});
            pos = "x" + coordinates[0] + "y" + coordinates[1];
            cell = document.getElementById(pos);
            cell.innerHTML = "X";
            helper.addClassForCell("obstacle", coordinates);
            cell.addEventListener("webkitAnimationEnd", resetObstacle); // Chrome, Safari, opera
            cell.addEventListener("animationend", resetObstacle);  // Standard syntax
        }
        return coordinates;
    };

        function delayFunction(toCall, time) {
        setTimeout(function () {
            toCall();
        }, time);
    }

// ------------------------------------------------------------------------------
//          Game logic at most abstract level
// ------------------------------------------------------------------------------

    var gameOver = function () {
        pauseController.pause();
        helper.clearAllCells();
        enemies = [];
        currentLevel = 0;
        enemySpawner.resetSpawnlimit();
        helper.displayText("GAME OVER");
        delayFunction(gameRestart, 1500);
    };

    var levelUp = function () {
        var levelnumber = 0;
        kills = 0;
        helper.clearAllCells();
        currentLevel += 1;
        levelnumber = currentLevel + 1;
        enemySpawner.resetSpawnlimit();
        enemies = [];
        helper.displayText("LEVEL " + levelnumber);
        delayFunction(startLevel, 1500);
    };

    var startLevel = function () {
        helper.clearAllCells();
        player.respawn();
        player.plot();
        var i = 0;
        var stop = defaults.levels[currentLevel].simultEnemies;
        for (i = 0; i < stop; i += 1) {
            enemySpawner.add();
        }
        placeObstacles();
        updateStats();
        pauseController.unpause();
    };

    var gameRestart = function () {
        score.reset();
        currentLevel = 0;
        kills = 0;
        helper.clearAllCells();
        player.alive = true;
        player.respawn();
        player.plot();
        var i = 0;
        var stop = defaults.levels[currentLevel].simultEnemies;
        for (i = 0; i < stop; i += 1) {
            enemySpawner.add();
        }
        placeObstacles();
        score.reset();
        updateStage();
        pauseController.unpause();
    };

    var updateStage = function () {
        var i = 0;
        var stop = enemies.length;
        for (i = 0; i < stop; i += 1) {
            if (enemies[i].reportAliveStatus()) {
                enemies[i].move();
                enemies[i].plot();
            }
        }
        for (i = 0; i < stop; i += 1) {
            if (enemies[i].reportAliveStatus()) {
                enemies[i].collisioncheck();
            }
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

    var handleKeyboardEvent = function (evt) {
        if (!evt) {
            evt = window.event;
        } // for old IE compatible
        var keycode = evt.keyCode || evt.which; // also for cross-browser compatible

        if (!pauseController.isPaused()) {
            switch (keycode) {
            case Key.LEFT:
                if (player.reportPosition()[0] > 0) {
                    player.movePlayer(-1, 0);
                }
                break;
            case Key.UP:
                if (player.reportPosition()[1] > 0) {
                    player.movePlayer(0, -1);
                }
                break;
            case Key.RIGHT:
                if (player.reportPosition()[0] < defaults.xLimit) {
                    player.movePlayer(1, 0);
                }
                break;
            case Key.DOWN:
                if (player.reportPosition()[1] < defaults.yLimit) {
                    player.movePlayer(0, 1);
                }
                break;
            case Key.P:
                if (pauseController.isPaused()) {
                    pauseController.unpause();
                } else {
                    pauseController.pause();
                }
                break;
            }
        } else {
             if (keycode === 80) {
                 pauseController.unpause();
             }
        }
    };

    var enemySpawner = (function () {
        var spawnlimit = defaults.levels[currentLevel].killsRequired;
        console.log("Spawn limit" + spawnlimit);
        var resetSpawnlimit = function () {
            spawnlimit = defaults.levels[currentLevel].killsRequired;
        };
        var add = function () {
            var enemy = "";
            if (spawnlimit > 0) {
                enemy = basicEnemy();
                enemy.plot();
                enemies.push(enemy);
                spawnlimit -= 1;
                return true;
            } else {
                return false;
            }
        };
        var remainingEnemies = function () {
            return spawnlimit;
        };
        return {
            add: add,
            remainingEnemies: remainingEnemies,
            resetSpawnlimit: resetSpawnlimit
        };
    }());

    var init = function () {
        helper.createBoard();
        player.plot();
        // Creating the enemies
        var i = 0;
        var stopindex = defaults.levels[currentLevel].simultEnemies;
        for (i = 0; i < stopindex; i += 1) {
            enemySpawner.add();
        }
        addEventListener("keydown", document, handleKeyboardEvent);

        i = 0;
        var stop = enemies.length;
        for (i = 0; i < stop; i += 1) {
            enemies[i].plot();
        }
        placeObstacles();
        pauseController.unpause();
        soundController.soundengine.music.play();
        updateStats();
    };

    return {
        init: init,
        update: updateStage,
        pauseController: pauseController
    };
}

var helper = documentModMachine();
var game = flyingswords(helper, defaults);
game.init();
