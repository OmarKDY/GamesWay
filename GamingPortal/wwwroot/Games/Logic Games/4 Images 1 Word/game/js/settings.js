var CANVAS_WIDTH = 1280;
var CANVAS_HEIGHT = 1920;

var EDGEBOARD_X = 120;
var EDGEBOARD_Y = 150;

var FPS_TIME      = 1000/24;
var DISABLE_SOUND_MOBILE = false;

var PRIMARY_FONT = "ArialRoundedMTBold";

var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;
var STATE_LANGUAGE = 3;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;

var LANGUAGE_EN    = 0;
var LANGUAGE_FR    = 1;
var LANGUAGE_IT    = 2;
var LANGUAGE_ES    = 3;
var LANGUAGE_GER   = 4;
var LANGUAGE_POR   = 5;

var PADDING = 10;

var GAME_ELEMENT_HEIGHT = -180;

var GAME_LANGUAGE;
var NUMBER_OF_WORDS = 21;  //NUMBER OF QUEST CREATED IN JSON FILE
var NUMBER_QUEST_IMAGE = 4; //NUMBER OF IMAGE FOR THE QUESTS
var BONUS_TIME=true;

var ALPHABET = [];
ALPHABET = new Array();
ALPHABET[0] = ['A','A','A','B','C','D','E','E','E','F','G','H','H','I','I','J','K','L','M','N','N','O','O','O','P','Q','R','S','S','T','T','T','U','V','W','X','Y','Z'];
ALPHABET[1] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
ALPHABET[2] = ['A','A','A','B','C','D','E','E','E','F','G','H','I','I','I','J','K','L','L','M','N','N','O','O','P','Q','R','S','T','T','U','V','W','L','X','Y','Z'];
ALPHABET[3] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
ALPHABET[4] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
ALPHABET[5] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

var SHOW_CREDITS = true;
var SOUNDTRACK_VOLUME_IN_GAME = 1;
var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;