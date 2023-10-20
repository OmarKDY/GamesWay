var CANVAS_WIDTH = 1920;
var CANVAS_HEIGHT = 1080;

var EDGEBOARD_X = 140;
var EDGEBOARD_Y = 70;

var FPS_TIME      = 1000/24;
var DISABLE_SOUND_MOBILE = false;

var PRIMARY_FONT = "blackplotan";

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

var EASY_MODE = 0;
var NORMAL_MODE = 1;
var HARD_MODE = 2;

var NUM_SHUFFLE = new Array();
var SHUFFLE_SPEED = new Array();
var TIME_BONUS_LIMIT = new Array();

var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;