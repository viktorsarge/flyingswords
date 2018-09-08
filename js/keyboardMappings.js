"use strict";

document.onkeydown = function (e) {
    var Key = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        P: 80
    };
    switch (e.keyCode) {
    case Key.LEFT:
        player.move("left");
        break;
    case Key.UP:
        player.move("up");
        break;
    case Key.RIGHT:
        player.move("right");
        break;
    case Key.DOWN:
        player.move("down");
        break;
    case Key.P:
        game.switchPauseState();
        break;
    }
};