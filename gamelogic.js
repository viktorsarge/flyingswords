"use strict";


//  ------------------------------------------------------------------------------ //
//  The game object below                                                          //
//  ------------------------------------------------------------------------------ //

function flyingswords(helper, defaults) {
    var currentLevel = 0;
    var kills = 0;
    var enemies = [];
/*
    function cleanOutDead (enem) {
        var i = 0;
        var stop = enem.length;
        var splicelist = [];
        for (i = stop; i > 0; i -= 1) {
            if (!enem[i].reportAliveStatus()) {
                console.log("Enemy " + i + "dead");
                enem.splice(i, 1);
            }
        }
    return enem;
    }
*/

    var checkCollision = function (coordinates) {
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        if (cell.innerText.length > 1) {
            return 1;
        } else {
            return 0;
        }
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

    var soundengine = (function () {
        var musicon = true;
        var music = new Audio("gamemusic.wav");
        music.addEventListener("ended", function () {
            this.currentTime = 0;
            this.play();
        }, false);

        var togglePlayback = function () {
            if (musicon) {
                music.pause();
                musicon = false;
            } else {
                music.play();
                musicon = true;
            }
        };
        return {
            togglePlayback: togglePlayback,
            musicon: musicon,
            music: music
        };
    }());

    var snd = new Audio("flyingswords-krasch.wav");

    var player = (function () {

        var position = defaults.playerPos;
        var alive = true;

        var movePlayer = function (xDir, yDir) {
            helper.clearCell(player.position);
            helper.removeClassForCell("player", player.position);
            player.position[0] = player.position[0] + xDir;
            player.position[1] = player.position[1] + yDir;
            plot();
            //updateStage();  // For a more chess styled gameplay
        };

        var plot = function () {
            // Plot player at given postion (updated by .move) and kill if collided
            var currentPos = "x" + player.position[0] + "y" + player.position[1];
            var cell = [];
            cell = document.getElementById(currentPos);
            cell.innerText += "O";
            cell.classList.add("player");
            if (checkCollision(player.position)) {
                alive = false;
                gameOver();
            }
        };

        var respawn = function () {
            player.position = [Math.floor(defaults.xLimit / 2), Math.floor(defaults.yLimit / 2)];
        };

        return {
            position: position,
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

    var createEnemy = function () {
        var alive = true;
        var enemyPosition = putBabyInACorner();

        var reportAliveStatus = function () {
            return alive;
        };

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
        };

        var plot = function () {
            var cell = "";
            if (alive) {
                //console.log(enemyPosition);
                var currentPos = "x" + enemyPosition[0] + " y" + enemyPosition[1];
                cell = document.getElementsByClassName(currentPos);
                cell[0].innerHTML += "I";
                cell[0].classList.add("enemy");
            } else {
                var pos = "x" + enemyPosition[0] + "y" + enemyPosition[1];
                cell = document.getElementById(pos);
                cell.innerHTML = "X";
                helper.addClassForCell("obstacle", enemyPosition);
                 // Code for Chrome, Safari and Opera
                cell.addEventListener("webkitAnimationEnd", resetObstacle);
                // Standard syntax
                cell.addEventListener("animationend", resetObstacle);
            }
        };

        var reportPosition = function () {
            return enemyPosition;
        };

        var kill = function () {
            alive = false;
            enemySpawner.add();
            kills += 1;
            if (kills - 1 === defaults.levels[currentLevel].killsRequired) {
                levelUp();
            }
        };

        return {
            reportAliveStatus: reportAliveStatus,
            kill: kill,
            alive: alive,
            reposition: reposition,
            enemyPosition: reportPosition,
            calculateDirection: calculateDirection,
            respawn: respawn,
            move: move,
            plot: plot
        };
    };

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
            console.log(points);
            cell.innerHTML = "-" + points + "-";
        };
        var reset = function () {
            points = 0;
            console.log(points + "- Reset");
            cell.innerHTML = "- " + points + " -";
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

    var isPlayer = function (coordinates) {
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        if (cell.innerHTML.indexOf("O") > -1) {
            return 1;
        } else {
            return 0;
        }
    };

    var gameclock = (function () {
        var clock = "";
        var start = function () {
            clock = setInterval(game.update, 1000);
        };
        var stop = function () {
            clearInterval(clock);
        };
        return {
            start: start,
            stop: stop
        };
    }());

    // Cleartext translation of keycodes for readability
    var Key = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32
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
            while (!isEmpty(coordinates)) {
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
        var stopIndex = defaults.numberOfObstacles;

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

    function gameoverDelay() {
        setTimeout(function () {
            gameRestart();
        }, 1500);
    }

    function levelUpDelay() {
        setTimeout(function () {
            startLevel();
        }, 1500);
    }

// ------------------------------------------------------------------------------
//          Game logic at most abstract level
// ------------------------------------------------------------------------------
    var state = "pause";

    var gameOver = function () {
        state = "pause";
        gameclock.stop();
        helper.clearAllCells();
        enemies = [];
        currentLevel = 0;
        enemySpawner.resetSpawnlimit();
        helper.displayText("GAME OVER");
        gameoverDelay();
    };
    
    var levelUp = function () {
        var levelnumber = 0;
        kills = 0;
        state = "pause";
        gameclock.stop();
        currentLevel += 1;
        levelnumber = currentLevel + 1;
        enemySpawner.resetSpawnlimit();
        enemies = [];
        helper.clearAllCells();
        helper.displayText("LEVEL " + levelnumber);
        levelUpDelay();
    };

    var startLevel = function () {
        helper.clearAllCells();
        player.respawn();
        player.plot();
        var i = 0;
        var stop = defaults.numberOfEnemies;
        for (i = 0; i < stop; i += 1) {
            enemySpawner.add();
        }
        placeObstacles();
        state = "play";
        gameclock.start();
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
        var stop = defaults.numberOfEnemies;
        for (i = 0; i < stop; i += 1) {
            enemySpawner.add();
        }
        placeObstacles();
        updateStage();
        score.reset();
        gameclock.start();
        state = "play";
    };

    var updateStage = function () {
        var cell = [];
        var position = "";
        var i = 0;
        var stop = enemies.length;
        for (i = 0; i < stop; i += 1) {
            enemies[i].move();
            enemies[i].plot();
        }
        for (i = 0; i < stop; i += 1) {
            if (checkCollision(enemies[i].enemyPosition())) {
                enemies[i].kill();
                snd.play();
                if (isObstacle(enemies[i].enemyPosition())) {
                    position = "x" + enemies[i].enemyPosition()[0] + " y" + enemies[i].enemyPosition()[1];
                    cell = document.getElementsByClassName(position);
                    cell[0].classList.remove("obstacle");
                    cell[0].classList.add("dead");
                    cell[0].classList.remove("enemy");
                    if (player.alive) {
                        score.add();
                    }
                } else if (isPlayer(enemies[i].enemyPosition())) {
                    gameOver();
                } else {
                    position = "x" + enemies[i].enemyPosition()[0] + " y" + enemies[i].enemyPosition()[1];
                    cell = document.getElementsByClassName(position);
                    cell[0].classList.add("dead");
                    cell[0].classList.remove("enemy");
                    if (player.alive) {
                        score.add();
                    }
                }
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

        if (state === "play") {
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
                //state = "pause";//player.movePlayer(0, 0);
                break;
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
            console.log("Spawn limit" + spawnlimit);
            if (spawnlimit > 0) {
                enemies.push(createEnemy());
                spawnlimit -= 1;
                return true;
            } else {
                return false;
            }
        };
        return {
            add: add,
            resetSpawnlimit: resetSpawnlimit
        };
    }());

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
        state = "play";
        gameclock.start();
        console.log("Cells w content" + helper.getCellsWithContent());
        soundengine.music.play();
    };

    // Creating the enemies
    var i = 0;
    var stopindex = defaults.numberOfEnemies;
    for (i = 0; i < stopindex; i += 1) {
        enemySpawner.add();
    }

    return {
        init: init,
        soundengine: soundengine,
        update: updateStage
    };
}

var helper = documentModMachine();
var game = flyingswords(helper, defaults);
game.init();
