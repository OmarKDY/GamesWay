var CANVAS_WIDTH = 768;
var CANVAS_HEIGHT = 1400;

var EDGEBOARD_X = 40;
var EDGEBOARD_Y = 260;

var PIECE_WIDTH = 81;
var PIECE_HEIGHT = 69;
var BALL_WIDTH_HEIGHT = 20;
var BUT_LEVEL_WIDTH = 95;
var BUT_LEVEL_HEIGHT = 84;

var NUM_ROWS_PAGE_LEVEL;
var NUM_COLS_PAGE_LEVEL;

var NUM_PIECES; //Numbers of colors avaiable, MAX 8;
var NUM_ROWS; //Chances of guess the Combination of Colors;
var NUM_COLS;

var s_bFirstPlay = true;

var PRIMARY_FONT = "comfortaabold";

var FPS           = 30;
var FPS_TIME      = 1000/FPS;
var DISABLE_SOUND_MOBILE = false;
var ENABLE_FULLSCREEN = true;


var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;

var START_SCORE;


var SOUNDTRACK_VOLUME_IN_GAME = 0.3;
var iFirstRowPos = {x:(CANVAS_WIDTH/2)-324,y:(CANVAS_HEIGHT/2)+150};
