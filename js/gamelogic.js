"use strict";

//  ------------------------------------------------------------------------------ //
//  The game object below                                                          //
//  ------------------------------------------------------------------------------ //

function flyingswords() {
    var currentLevel = 0;
    var kills = 0;
    var enemies = [];

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

    function delayFunction(toCall, time) {
        setTimeout(function () {
            toCall();
        }, time);
    }

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

    var checkCollision = function (coordinates) {
        var currentPos = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(currentPos);
        if (cell.innerText.length > 1) {
            return 1;
        } else {
            return 0;
        }
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

    var placeShield = function () {
        var coordinates = generateCoordinates({skipCollisionCheck: false});
        var id = "x" + coordinates[0] + "y" + coordinates[1];
        var cell = document.getElementById(id);
        cell.innerHTML = "0";
        cell.classList.add("shield");
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

    var updateStage = function () {
        var toUpdate = entities.living();
        var i = 0;
        var stop = toUpdate.length;
        for (i = 0; i < stop; i += 1) {
            if (entities.all()[toUpdate[i]].reportAliveStatus()) {  // TODO: Redundant check? living() already picks out alive entities
                entities.all()[toUpdate[i]].move();
            }
        }
        grid.plotChanged();
    };

    var pauseController = (function () {
        var paused = true;
        var clock = "";
        var pause = function (playerTriggered) {
            paused = true;
            clearInterval(clock);
            if (playerTriggered !== undefined) {
                var cell = document.getElementById("instructions");
                cell.innerText = defaults.texts.pause;
            }
            return paused;
        };
        var unpause = function () {
            clock = setInterval(updateStage, defaults.levels[currentLevel].clockSpeed);
            var cell = document.getElementById("instructions");
            cell.innerText = defaults.texts.instructions;
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


// ------------------------------------------------------------------------------
//          Game logic at most abstract level
// ------------------------------------------------------------------------------

    var boss = function () {
        var alive = true;
        var position = [Math.floor(defaults.xLimit / 2 - 2), 0];  // Gives pos of B in BOSS.

        var calculateDirection = function (player, enemy) {
        // Follow only in X direction
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

        var move = function () {
        // Moves the left corner of the boss
            if (alive) {
                var i = 0;
                var tempPos = [0, 0];
                var playerpos = player.reportPosition();
                for (i = 0; i < 4; i += 1) {
                    tempPos[0] = position[0] + i;
                    helper.clearCell(tempPos);
                    helper.removeClassForCell("enemy", tempPos);
                }
                var directionX = calculateDirection((playerpos[0] - 1), position[0]);
                // var directionY = calculateDirection(playerpos[1], position[1]);
                position[0] = position[0] + directionX;
                // position[1] = position[1] + directionY;
            }
        };

        var plot = function () {
            var cell = "";
            if (alive) {
                // TODO: Tidy up this part
                var currentPos = ""; // "x" + position[0] + "y" + position[1];
                cell = document.getElementById("x" + position[0] + "y" + position[1]);
                cell.innerHTML += "B";
                cell.classList.add("enemy");
                cell = document.getElementById("x" + (position[0] + 1) + "y" + position[1]);
                cell.innerHTML += "O";
                cell.classList.add("enemy");
                cell = document.getElementById("x" + (position[0] + 2) + "y" + position[1]);
                cell.innerHTML += "S";
                cell.classList.add("enemy");
                cell = document.getElementById("x" + (position[0] + 3) + "y" + position[1]);
                cell.innerHTML += "S";
                cell.classList.add("enemy");
            }
        };

        var fire = function () {}; // Todo: When to trigger?

        var reportAliveStatus = function () {
            return alive;
        };

        return {
            move: move,
            plot: plot,
            reportAliveStatus: reportAliveStatus
        };
    };

    // // // ONGOING DEVELOPMENT
    var uniqueId = (function () {
        var id = 0;
        var create = function () {
            id += 1;
            return id;
        };
        return {
            create: create
        };
    }());
    
    var grid = (function () {
        var squares = {};
        var squaresToUpdate = [];
        var name = "";
        var i = 0;
        var j = 0;
        for (i = 0; i < defaults.yLimit + 1; i += 1) {
            for (j = 0; j < defaults.xLimit + 1; j += 1) {
                name = "x" + j + "y" + i;
                squares[name] = [];
            }
        }

        var addEntity = function (pos, id) {
            console.log("grid.addEntity: " + pos + " " + id);
            squares[pos].push(id);              // Add entity to it´s square
            if (squaresToUpdate.indexOf(pos) === -1) {
                squaresToUpdate.push(pos);      // Flag the square as needing update if not already flagged
            }
            return;
        };

        var removeEntity = function (pos, id) {
            var index = squares[pos].indexOf(id);   // Finding out where in the array of the square the entity id is
            squares[pos].splice(index, 1);          // Removing the entity id directly in place in entity array of the square
            if (squaresToUpdate.indexOf(pos) === -1) {
                squaresToUpdate.push(pos);      // Flag the square as needing update if not already flagged
            }
            return;
        };

        var plotChanged = function () {
            console.log("in plotChanged");
            var square = "";
            var j = 0;
            var currentSquareID = "";
            var entityIDs = "";
            var currentEntity = "";
            var stopindex = squaresToUpdate.length; 
            console.log("squaresToUpdate.length: " + stopindex + " " + squaresToUpdate);
            for (i = 0; i < stopindex; i += 1) {    // Iterating over each changed square
                currentSquareID = squaresToUpdate[i];   // Less complex handle for the current square
                square = document.getElementById(squaresToUpdate[i]);   // Access to current square in DOM. 
                square.innerHTML = "";                                  // Cleaning the current square before adding to it
                if (squares[squaresToUpdate[i]].length > 1) {
                    console.log("BOOOOM - COllision");
                }
                for (j = 0; j < squares[squaresToUpdate[i]].length; j += 1) {      // Iterating over each entity in the square
                    entityIDs = squares[currentSquareID];     // Less complex handle for array with IDs of entities in current square
                    currentEntity = entities.all()[entityIDs[j]];  // Giving current entity a handle
                    square.innerHTML += currentEntity.identifier();  // Adding the character of current entity to the square
                }
            }
            squaresToUpdate = [];  // Cleaning of array of positions with updates before next iteration
        };

        return {
            addEntity: addEntity,
            removeEntity: removeEntity,
            squares: squares,
            plotChanged: plotChanged
        };
    }());

    var entities = (function () {
        var allEntities = {};
        var alive = [];
        var thePlayerID = "";

        var all = function () {
            return allEntities;
        };

        var living = function () {
            return alive;
        };

        var spawnEntity = function (type) {
            var id = uniqueId.create(); // Setting up an id for the new entity
            if (type == player) {
                thePlayerID = id;
            }
            allEntities[id] = type(id);  // Spawning a new entity and adding it to the entity-object
            allEntities[id].plot();  // Plotting to make visible. TODO - change to triggering a replot changed instead. 
            //console.log("entities.spawnEntity - allEntities[id].enemyPosition(): " + allEntities[id].enemyPosition());
            var pos = "x" + allEntities[id].position()[0] + "y" +  allEntities[id].position()[1];
            grid.addEntity(pos, id);
            alive.push(id);
            return id;
        };

        var despawnAll = function () {
            allEntities = {};
            alive = [];
            return;
        };

        var despawnEntity = function (id) {
            delete allEntities[id];
            var index = arr.indexOf(id);
            alive.splice(index,1);
        };

        var playerID = function () {
            return thePlayerID;
        };

        return {
            spawnEntity: spawnEntity,
            despawnEntity: despawnEntity,
            despawnAll: despawnAll,
            all: all,
            living: living,
            playerID: playerID
        };
    }());

    // END OF ONGING DEVELOPMENT

    var enemySpawner = (function () {
        var spawnlimit = defaults.levels[currentLevel].killsRequired;

        var resetSpawnlimit = function () {
            spawnlimit = defaults.levels[currentLevel].killsRequired;
        };
        var add = function () {
            var enemy = "";
            if (spawnlimit > 0) {
                enemy = basicEnemy();
                //enemy = boss();
                enemy.plot();
                enemies.push(enemy);
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

    var gameOver = function () {
        pauseController.pause();
        helper.clearAllCells();
        enemies = [];
        currentLevel = 0;
        enemySpawner.resetSpawnlimit();
        helper.displayText(defaults.texts.gameover);
        delayFunction(gameRestart, defaults.defDelay);
    };

    var player = function (id) {
        var myGlobalId = id;
        console.log("Player id: " + myGlobalId);
        var direction = [];
        var identifyingCharacter = "O";
        var position = defaults.playerPos;
        var alive = true;
        var shield = 0;
        var shieldhandler = (function () {
            var equiped = false;
            var increase = function (amount) {
                if (amount === undefined) {
                    amount = 1;
                }
                shield += amount;
            };

            var broken = function () {
                equiped = false;
                identifier = "O";
                placeShield();
                helper.removeClassForCell("shieldEquiped", position);
                var cell = document.getElementById("x" + position[0] + "y" + position[1]);
                cell.innerHTML = cell.innerHTML.replace("0", identifier);
            };

            var decrease = function (amount) {
                if (amount === undefined) {
                    amount = 1;
                }
                shield -= amount;
                if (shield < 1) {
                    broken();
                }
            };

            var isEquiped = function () {
                return equiped;
            };

            var equip = function () {
                equiped = true;
                shield += 3;
                var cell = document.getElementById("x" + position[0] + "y" + position[1]);
                helper.addClassForCell("shieldEquiped", position);
                cell.innerHTML = cell.innerHTML.replace(identifier, "");
                identifier = "0";
            };

            return {
                equip: equip,
                isEquiped: isEquiped,
                decrease: decrease,
                increase: increase,
                broken: broken
            };
        }());

        var plot = function () {
            // Plot player at given postion (updated by .move) and kill if collided
            var currentPos = "x" + position[0] + "y" + position[1];
            var moveToId = "x" + (position[0] + direction[0]) + "y" + (position[1] + direction[1]);
            var cell = [];
            var nextCell = "";
            cell = document.getElementById(currentPos);
            cell.innerText += identifyingCharacter;
            cell.classList.add("player");
            if (shieldhandler.isEquiped()) {
                cell.classList.add("shieldEquiped");
            }
            if (checkCollision(position)) {
                if (cell.innerHTML.indexOf("0") >= 0 && !shieldhandler.isEquiped()) {
                    // Picking up a shield
                    shieldhandler.equip();
                    cell.classList.remove("shield");
                    console.log("Shield equiped. Strength: " + shield);
                } else if (cell.innerHTML.indexOf("X") === 0 && shieldhandler.isEquiped()) {
                    // Colliding with an obstacle while equiped with shield
                    nextCell = document.getElementById(moveToId);
                    if (nextCell.innerText.length === 0) {
                        nextCell.innerHTML += "X";
                        nextCell.classList.add("obstacle");
                        cell.classList.remove("obstacle");
                        cell.innerHTML = cell.innerHTML.replace("X", "");
                    } else {
                        // TODO - invert the move to by * -1 and move the player back.
                    }
                    shieldhandler.decrease();
                } else {
                    // Standard case - without a shield any collision is fatar
                    alive = false;
                    pauseController.pause();
                    cell.classList.add("dead");
                    // Code for Chrome, Safari and Opera
                    cell.addEventListener("webkitAnimationEnd", gameOver);
                    // Standard syntax
                    cell.addEventListener("animationend", gameOver);
                }
            }
        };

        var movePlayer = function (xDir, yDir) {
            if (xDir === undefined) {
                xDir = 0;
            }
            if (yDir === undefined) {
                yDir = 0;
            }
            direction = [xDir, yDir];
            grid.removeEntity("x" + position[0] + "y" + position[1], myGlobalId);
            console.log("movePlayer - grid.removeEntity " + "x" + position[0] + "y" + position[1] + " " + "ID:" + myGlobalId)
            helper.removeClassForCell("player", position);
            helper.removeClassForCell("shieldEquiped", position);
            position[0] = position[0] + xDir;
            position[1] = position[1] + yDir;
            grid.addEntity("x" + position[0] + "y" + position[1], myGlobalId);
            console.log("In player move. Position: " + position);
            grid.plotChanged();
            //plot();
        };

        var respawn = function () {
            position = [Math.floor(defaults.xLimit / 2), Math.floor(defaults.yLimit / 2)];
            shieldhandler.broken();
        };

        var reportPosition = function () {
            return position;
        };
        
        var identifier = function () {
            return identifyingCharacter;
        };

        var reportAliveStatus = function () {
            return alive;
        };

        return {
            position: reportPosition,
            reportAliveStatus: reportAliveStatus,
            move: movePlayer,
            plot: plot,
            respawn: respawn,
            shield: shield,
            identifier: identifier
        };
    };

    var gameRestart = function () {
        score.reset();
        currentLevel = 0;
        kills = 0;
        helper.clearAllCells();
        player.alive = true;
        player.respawn();
        player.plot();
        pauseController.unpause();
        var i = 0;
        var stop = defaults.levels[currentLevel].simultEnemies;
        for (i = 0; i < stop; i += 1) {
            //enemySpawner.add();
            entities.spawnEntity(basicEnemy);
        }
        placeObstacles();
        score.reset();
        updateStage();
        pauseController.unpause();
    };

    var startLevel = function () {
        helper.clearAllCells();
        player.respawn();
        player.plot();
        var i = 0;
        var stop = defaults.levels[currentLevel].simultEnemies;
        for (i = 0; i < stop; i += 1) {
            //enemySpawner.add();
            entities.spawnEntity(basicEnemy); 
        }
        placeObstacles();
        updateStats();
        pauseController.unpause();
    };

    var levelUp = function () {
        var levelnumber = 0;
        kills = 0;
        helper.clearAllCells();
        currentLevel += 1;
        levelnumber = currentLevel + 1;
        //enemySpawner.resetSpawnlimit();  // TODO - Replace this! 
//        enemies = [];
        entities.despawnAll();
        helper.displayText(defaults.texts.levelup + levelnumber);
        delayFunction(startLevel, defaults.defDelay);
    };

    var win = function () {
        pauseController.pause();
        helper.clearAllCells();
        // enemies = [];
        entities.despawnAll();
        currentLevel = 0;
        //enemySpawner.resetSpawnlimit();    // TODO - replace this if necessary! 
        helper.displayText(defaults.texts.win);
        delayFunction(gameRestart, defaults.defDelay);
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
                if (entities.all()[entities.playerID()].position()[0] > 0) {
                    entities.all()[entities.playerID()].move(-1, 0);
                }
                break;
            case Key.UP:
                if (entities.all()[entities.playerID()].position()[1] > 0) {
                    entities.all()[entities.playerID()].move(0, -1);
                }
                break;
            case Key.RIGHT:
                if (entities.all()[entities.playerID()].position()[0] < defaults.xLimit) {
                    entities.all()[entities.playerID()].move(1, 0);
                }
                break;
            case Key.DOWN:
                if (entities.all()[entities.playerID()].position()[1] < defaults.yLimit) {
                    entities.all()[entities.playerID()].move(0, 1);
                }
                break;
            case Key.P:
                if (pauseController.isPaused()) {
                    pauseController.unpause();
                } else {
                    pauseController.pause({byPlayer: true});
                }
                break;
            }
        } else {
            if (keycode === 80) {
                pauseController.unpause();
            }
        }
    };

    var init = function () {
        helper.createBoard();
        //grid.create();
        entities.spawnEntity(player);
        //player.plot();
        var i = 0;
        var stopindex = defaults.levels[currentLevel].simultEnemies;
        for (i = 0; i < stopindex; i += 1) {
            //enemySpawner.add();
            entities.spawnEntity(basicEnemy);
        }
        addEventListener("keydown", document, handleKeyboardEvent);
        placeObstacles();
        placeShield();
        pauseController.unpause();
        //soundController.soundengine.music.play();
        updateStats();
    };

    var basicEnemy = function (id) {
        var myGlobalId = id;
        var alive = true;
        var identifyingCharacter = "I";

        var identifier = function () { 
            return identifyingCharacter;
        };
        var enemyPosition = putBabyInACorner();

        var reportAliveStatus = function () {
            return alive;
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

        var move = function () {
            if (alive) {
                var playerpos = entities.all()[1].position();  // TODO - expose player in entities API instead of assuming id 1
                grid.removeEntity("x" + enemyPosition[0] + "y" + enemyPosition[1], myGlobalId); // helper.clearCell(enemyPosition);
                helper.removeClassForCell("enemy", enemyPosition);
                var directionX = calculateDirection(playerpos[0], enemyPosition[0]);
                var directionY = calculateDirection(playerpos[1], enemyPosition[1]);
                enemyPosition[0] = enemyPosition[0] + directionX;
                enemyPosition[1] = enemyPosition[1] + directionY;
                grid.addEntity("x" + enemyPosition[0] + "y" + enemyPosition[1], myGlobalId);
                console.log("in basic enemy move");
            }
        };

        var kill = function () {
            alive = false;
            enemySpawner.add();
            kills += 1;
            score.add();
            updateStats();
            if (kills === defaults.levels[currentLevel].killsRequired && currentLevel === defaults.levels.length - 1) {
                win();
            } else if (kills === defaults.levels[currentLevel].killsRequired && currentLevel <= defaults.levels.length) {
                pauseController.pause();
                delayFunction(levelUp, defaults.defDelay);
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

        return {
            reportAliveStatus: reportAliveStatus,
            kill: kill,
            alive: alive,
            position: reportPosition,
            calculateDirection: calculateDirection,
            collisioncheck: collisioncheck,
            move: move,
            plot: plot,
            identifier: identifier
        };
    };

    return {
        init: init,
        update: updateStage,
        pauseController: pauseController,
        grid: grid
    };
}

var game = flyingswords();
game.init();
