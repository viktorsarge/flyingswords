"use strict";

// Self running function to create player
// The player moves on input and is independant from game clock
var player = (function () {
    // Run on init
    var position = defaults.playerPos();
    var x1 = position[0];
    var y1 = position[1];
    var x2 = x1;
    var y2 = y1;
    var type = "player";
    var id = idGenerator.generate(type);
    var life = 4;
    var shieldDisplay = document.getElementById("shield");
    shieldDisplay.innerHTML = life - 1;

    var move = function (direction) {
        var cellRef;
        if (!game.isPaused()) {
            switch (direction) {
            case "up":
                y2 = y1 - 1;
                if (worldmap.isEmptyPos(x2, y2)) {
                    if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                        helper.removeHTMLbyId(id);
                        cellRef = document.getElementById("x" + x1 + "y" + y1);
                        cellRef.addEventListener("webkitAnimationEnd", removePlayertrailClass); // Chrome, Safari, opera
                        cellRef.addEventListener("animationend", removePlayertrailClass);  // Standard syntax
                        helper.addFadingBackground(x1, y1, type);
                        helper.plotObjectByPosAndType(x2, y2, type, id);
                        y1 = y2;
                    } else {
                        y2 = y1;
                    }
                } else {
                    console.log("KILL!");
                    takeDamadge();
                    // TODO - kill the object that was collided? 
                }
                break;

            case "down":
                y2 = y1 + 1;
                if (worldmap.isEmptyPos(x2, y2)) {
                    if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                        helper.removeHTMLbyId(id);
                        cellRef = document.getElementById("x" + x1 + "y" + y1);
                        cellRef.addEventListener("webkitAnimationEnd", removePlayertrailClass); // Chrome, Safari, opera
                        cellRef.addEventListener("animationend", removePlayertrailClass);  // Standard syntax
                        helper.addFadingBackground(x1, y1, type);
                        helper.plotObjectByPosAndType(x2, y2, type, id);
                        y1 = y2;
                    } else {
                        y2 = y1;
                    }
                } else {
                    console.log("KILL!");
                    takeDamadge();
                    // TODO - kill the object that was collided? 
                }
                break;

            case "right":
                x2 = x1 + 1;
                if (worldmap.isEmptyPos(x2, y2)) {
                    if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                        helper.removeHTMLbyId(id);
                        cellRef = document.getElementById("x" + x1 + "y" + y1);
                        cellRef.addEventListener("webkitAnimationEnd", removePlayertrailClass); // Chrome, Safari, opera
                        cellRef.addEventListener("animationend", removePlayertrailClass);  // Standard syntax
                        helper.addFadingBackground(x1, y1, type);
                        helper.plotObjectByPosAndType(x2, y2, type, id);
                        x1 = x2;
                    } else {
                        x2 = x1;
                    }
                } else {
                    console.log("KILL!");
                    takeDamadge();
                    // TODO - kill the object that was collided? 
                }
                break;

            case "left":
                x2 = x1 - 1;
                if (worldmap.isEmptyPos(x2, y2)) {
                    if (worldmap.moveIdFromTo(id, x1, y1, x2, y2)) {
                        helper.removeHTMLbyId(id);
                        cellRef = document.getElementById("x" + x1 + "y" + y1);
                        cellRef.addEventListener("webkitAnimationEnd", removePlayertrailClass); // Chrome, Safari, opera
                        cellRef.addEventListener("animationend", removePlayertrailClass);  // Standard syntax
                        helper.addFadingBackground(x1, y1, type);
                        helper.plotObjectByPosAndType(x2, y2, type, id);
                        x1 = x2;
                    } else {
                        x2 = x1;
                    }
                } else {
                    console.log("KILL!");
                    takeDamadge();
                    // TODO - kill the object that was collided? 
                }
                break;
            }
        }
    };

    var reset = function () {
        position = defaults.playerPos();
        x1 = position[0];
        y1 = position[1];
        x2 = x1;
        y2 = y1;
        worldmap.addIdAt(id, x1, y1);
        helper.plotObjectByPosAndType(x2, y2, type, id);
        life = 4;
        shieldDisplay.innerHTML = life - 1;
    };

    var reportPosition = function () {
        return [x2, y2];
    };

    var takeDamadge = function () {
        var playerRef;
        life -= 1;
        shieldDisplay.innerHTML = life - 1;
        playerRef = document.getElementById(id);
        playerRef.addEventListener("webkitAnimationEnd", removeDamadgeClass); // Chrome, Safari, opera
        playerRef.addEventListener("animationend", removeDamadgeClass );  // Standard syntax
        playerRef.classList.add("damadge");

        if (life < 1) {
            game.restart();
        }
    };

    return {
        move: move,
        reset: reset,
        reportPosition: reportPosition,
        takeDamadge: takeDamadge
    };
}());