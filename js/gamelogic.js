
var helper = helpers();
helper.createBoard();
placeObstacles(6);

var gameobjects = function() {

};

var game = function() {
	var pauseState = false;
	var level = 0;

	var restartLevel = function () {

	};

	var switchPauseState = function () {
		if (pauseState) {
			pauseState = false;
		} else {
			pauseState = true;
		}
	};

	var init = function() {
		return true;
	};

	var start = function() {
		pauseState = false;
		return true;
	};

	var pause = function() {
		pauseState = true;
		return true;
	};

	var isPaused = function() {
		return pauseState;
	};

	var update = function() {

	};

	return {
		init: init,
		start: start,
		pause: pause,
		isPaused: isPaused,
		switchPauseState: switchPauseState,
		restartLevel: restartLevel 
	}
}();

