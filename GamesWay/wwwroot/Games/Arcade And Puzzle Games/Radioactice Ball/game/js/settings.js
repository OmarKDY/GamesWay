var CANVAS_WIDTH = 960;
var CANVAS_HEIGHT = 540;

var EDGEBOARD_X = 80;
var EDGEBOARD_Y = 55;

var FPS_TIME = 1000 / 30;
var DISABLE_SOUND_MOBILE = false;

var PRIMARY_FONT = "aldo_the_apacheregular";

var STATE_LOADING = 0;
var STATE_MENU = 1;
var STATE_HELP = 1;
var STATE_GAME = 3;

var ON_MOUSE_DOWN = 0;
var ON_MOUSE_UP = 1;
var ON_MOUSE_OVER = 2;
var ON_MOUSE_OUT = 3;
var ON_DRAG_START = 4;
var ON_DRAG_END = 5;

var TYPES_OF_BALL = 4;
var TYPES_OF_EXPLOSION = 4;
var COLORS_OF_BALLS = 3;

var TOT_LEVELS = 10;

var TIME_RESTART = 4;

var MAX_FORCE_UP_RATE = 700;
var MAX_ROPE = 2;

var MAX_BALL_INSTANCE = 20;

var FORCE_RATE_BALL = new Array();

var BALLS_LEVEL = new Array();
var BRICKS_LEVEL = new Array();

for (var i = 0; i < TOT_LEVELS; i++) {
    BALLS_LEVEL[i] = new Array();
    BRICKS_LEVEL[i] = new Array();
}

//LEVEL 1
BALLS_LEVEL[0][0] = {x: CANVAS_WIDTH / 2 - 200, y: CANVAS_HEIGHT / 2 - 100, type: 3, XDir: 1, color: 0};
//BALLS_LEVEL[0][1] = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 100, type: 3, XDir: -1};

//LEVEL 2
BALLS_LEVEL[1][0] = {x: CANVAS_WIDTH / 2 - 200, y: CANVAS_HEIGHT / 2 - 100, type: 3, XDir: 1, color: 0};
BALLS_LEVEL[1][0] = {x: CANVAS_WIDTH / 2 + 200, y: CANVAS_HEIGHT / 2 - 130, type: 3, XDir: 1, color: 0};

BRICKS_LEVEL[1][0] = {x: CANVAS_WIDTH / 2 - 200, y: CANVAS_HEIGHT / 2};

//LEVEL 3
BALLS_LEVEL[2][0] = {x: CANVAS_WIDTH / 2 - 300, y: CANVAS_HEIGHT / 2 - 100, type: 1, XDir: 1, color: 0};
BALLS_LEVEL[2][1] = {x: CANVAS_WIDTH / 2 + 100, y: CANVAS_HEIGHT / 2 - 130, type: 3, XDir: -1, color: 1};
BALLS_LEVEL[2][2] = {x: CANVAS_WIDTH / 2 + 300, y: CANVAS_HEIGHT / 2 - 150, type: 2, XDir: 1, color: 0};

//LEVEL 4
BALLS_LEVEL[3][0] = {x: CANVAS_WIDTH / 2 - 300, y: CANVAS_HEIGHT / 2 - 60, type: 1, XDir: 1, color: 1};
BALLS_LEVEL[3][1] = {x: CANVAS_WIDTH / 2 + 100, y: CANVAS_HEIGHT / 2 - 130, type: 3, XDir: -1, color: 1};

BRICKS_LEVEL[3][0] = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 50};

//LEVEL 5
BALLS_LEVEL[4][0] = {x: CANVAS_WIDTH / 2 - 300, y: CANVAS_HEIGHT / 2 - 130, type: 3, XDir: 1, color: 2};
BALLS_LEVEL[4][1] = {x: CANVAS_WIDTH / 2 + 300, y: CANVAS_HEIGHT / 2 - 130, type: 3, XDir: -1, color: 0};

BRICKS_LEVEL[4][0] = {x: CANVAS_WIDTH / 2 + 200, y: CANVAS_HEIGHT / 2 + 50};
BRICKS_LEVEL[4][1] = {x: CANVAS_WIDTH / 2 - 200, y: CANVAS_HEIGHT / 2 + 50};

//LEVEL 6
BALLS_LEVEL[5][0] = {x: CANVAS_WIDTH / 2 - 300, y: CANVAS_HEIGHT / 2 + 20, type: 2, XDir: -1, color: 1};
BALLS_LEVEL[5][1] = {x: CANVAS_WIDTH / 2 + 300, y: CANVAS_HEIGHT / 2 - 130, type: 3, XDir: 1, color: 0};
BALLS_LEVEL[5][2] = {x: CANVAS_WIDTH / 2 + 100, y: CANVAS_HEIGHT / 2 - 20, type: 2, XDir: 1, color: 1};

BRICKS_LEVEL[5][0] = {x: CANVAS_WIDTH / 2 + 200, y: CANVAS_HEIGHT / 2 + 70};

//LEVEL 7
BALLS_LEVEL[6][0] = {x: CANVAS_WIDTH / 2 - 300, y: CANVAS_HEIGHT / 2 + 130, type: 1, XDir: -1, color: 1};
BALLS_LEVEL[6][1] = {x: CANVAS_WIDTH / 2 + 300, y: CANVAS_HEIGHT / 2 - 130, type: 2, XDir: -1, color: 1};
BALLS_LEVEL[6][2] = {x: CANVAS_WIDTH / 2 - 250, y: CANVAS_HEIGHT / 2 - 130, type: 2, XDir: -1, color: 2};
BALLS_LEVEL[6][3] = {x: CANVAS_WIDTH / 2 + 250, y: CANVAS_HEIGHT / 2 + 130, type: 1, XDir: -1, color: 2};

BRICKS_LEVEL[6][0] = {x: CANVAS_WIDTH / 2 + 250, y: CANVAS_HEIGHT / 2 + 90};
BRICKS_LEVEL[6][1] = {x: CANVAS_WIDTH / 2 - 250, y: CANVAS_HEIGHT / 2 + 90};

//LEVEL 8
BALLS_LEVEL[7][0] = {x: CANVAS_WIDTH / 2 - 300, y: CANVAS_HEIGHT / 2 + 130, type: 3, XDir: 1, color: 2};
BALLS_LEVEL[7][1] = {x: CANVAS_WIDTH / 2 + 300, y: CANVAS_HEIGHT / 2 - 130, type: 3, XDir: -1, color: 2};
BALLS_LEVEL[7][2] = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 130, type: 3, XDir: 1, color: 2};

BRICKS_LEVEL[7][0] = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 50};
BRICKS_LEVEL[7][1] = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 77};

//LEVEL 9
BALLS_LEVEL[8][0] = {x: CANVAS_WIDTH / 2 + 250, y: CANVAS_HEIGHT / 2 - 45, type: 3, XDir: -1, color: 0};
BALLS_LEVEL[8][1] = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 100, type: 2, XDir: -1, color: 1};
BALLS_LEVEL[8][2] = {x: CANVAS_WIDTH / 2 - 250, y: CANVAS_HEIGHT / 2 - 45, type: 3, XDir: 1, color: 2};

BRICKS_LEVEL[8][0] = {x: CANVAS_WIDTH / 2 + 200, y: CANVAS_HEIGHT / 2 + 10};
BRICKS_LEVEL[8][1] = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 40};
BRICKS_LEVEL[8][2] = {x: CANVAS_WIDTH / 2 - 200, y: CANVAS_HEIGHT / 2 + 10};

//LEVEL 10
BALLS_LEVEL[9][0] = {x: CANVAS_WIDTH / 2 + 240, y: CANVAS_HEIGHT / 2 - 120, type: 1, XDir: -1, color: 0};
BALLS_LEVEL[9][1] = {x: CANVAS_WIDTH / 2 + 140, y: CANVAS_HEIGHT / 2 - 110, type: 1, XDir: -1, color: 0};
BALLS_LEVEL[9][2] = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 110, type: 1, XDir: -1, color: 1};
BALLS_LEVEL[9][3] = {x: CANVAS_WIDTH / 2 - 140, y: CANVAS_HEIGHT / 2 - 110, type: 1, XDir: -1, color: 2};
BALLS_LEVEL[9][4] = {x: CANVAS_WIDTH / 2 - 240, y: CANVAS_HEIGHT / 2 - 120, type: 1, XDir: 1, color: 2};
BALLS_LEVEL[9][5] = {x: CANVAS_WIDTH / 2 - 250, y: CANVAS_HEIGHT / 2 + 10, type: 3, XDir: -1, color: 0};
BALLS_LEVEL[9][0] = {x: CANVAS_WIDTH / 2 + 250, y: CANVAS_HEIGHT / 2, type: 3, XDir: 1, color: 0};


BRICKS_LEVEL[9][0] = {x: CANVAS_WIDTH / 2 + 222, y: CANVAS_HEIGHT / 2 - 80};
BRICKS_LEVEL[9][1] = {x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 - 80};
BRICKS_LEVEL[9][2] = {x: CANVAS_WIDTH / 2 - 222, y: CANVAS_HEIGHT / 2 - 80};
BRICKS_LEVEL[9][3] = {x: CANVAS_WIDTH / 2 + 390, y: CANVAS_HEIGHT / 2 + 110};
BRICKS_LEVEL[9][4] = {x: CANVAS_WIDTH / 2 - 390, y: CANVAS_HEIGHT / 2 + 100};


FORCE_RATE_BALL = [0.7, 0.8, 0.9, 1];

var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;
var SOUNDTRACK_VOLUME_IN_GAME = 0.2;