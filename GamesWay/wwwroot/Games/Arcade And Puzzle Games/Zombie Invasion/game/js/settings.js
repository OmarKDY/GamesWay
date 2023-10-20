var CANVAS_WIDTH = 1136;
var CANVAS_HEIGHT = 832;

var EDGEBOARD_X = 0;
var EDGEBOARD_Y = 200;

var PRIMARY_FONT = "ZombieA";

var DISABLE_SOUND_MOBILE = false;

var FPS = 30;
var FPS_TIME      = 1000/FPS;

var SOUNDTRACK_VOLUME_IN_GAME = 0.25;

var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var ON_MOUSE_DOWN = 0;
var ON_MOUSE_UP   = 1;
var ON_MOUSE_OVER = 2;
var ON_MOUSE_OUT  = 3;
var ON_DRAG_START = 4;
var ON_DRAG_END   = 5;
var ON_PRESS_MOVE = 6;

var PLAYER_LIFE;

var SPAWN_TIME;
var SPAWN_TIME_DECREASE;

var STAGE_START_TIME;
var STAGE_TIME_INCREASE;


var MAX_START_TOP=370;
var MAX_START_BOT=750;
var MAX_END_TOP = 410;
var MAX_END_BOT = 750;

var START_SIZE=MAX_START_BOT-MAX_START_TOP;
var END_SIZE=MAX_END_BOT-MAX_END_TOP;

var ZOMBIE_ON_STAGE = new Array(); //This sets probability of spawn of each type of zombie. [zombie0,zombie1,zombie2,zombie3] 

var MAX_SPAWN = new Array();

var SURVIVOR_ON_STAGE;

var AD_SHOW_COUNTER;
var ENABLE_CHECK_ORIENTATION;
var ENABLE_FULLSCREEN;