var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 960;

var EDGEBOARD_X = 80;
var EDGEBOARD_Y = 85;

var GAME_NAME = "flowers";

var FONT = "boogaloo";

var SOUNDTRACK_VOLUME_IN_GAME = 0.6;

var SCROLLING_BG_WIDTH = 640;
var SCROLLING_BG_HEIGHT = 741;

var CELL_WIDTH  = 110;
var CELL_HEIGHT = 110;

var PARTICLE_WIDTH  = 70;
var PARTICLE_HEIGHT = 70;

var GRID_AREA_SIZE = 600;
var START_X_GRID = parseInt( (CANVAS_WIDTH-GRID_AREA_SIZE) / 2 );
var START_Y_GRID = parseInt( (CANVAS_HEIGHT-GRID_AREA_SIZE) / 2 );

var FPS = 30;
var FPS_TIME      = 1000/FPS;
var DISABLE_SOUND_MOBILE = false;

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

var ORANGE  = 0;
var GREEN   = 1;
var YELLOW  = 2;
var RED     = 3;
var BLUE    = 4;

var NONE    = -1;
var DOWN    = 0;
var UP      = 1;
var LEFT    = 2;
var RIGHT   = 3;
var CHANGED = 4;

var NUM_ROWS_PAGE_LEVEL = 2;
var NUM_COLS_PAGE_LEVEL = 5;

var DIFFICULTY_EASY = 0;
var DIFFICULTY_MEDIUM = 1;
var DIFFICULTY_HARD = 2;

var NUM_LEVELS;

var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;

var SCORE_TO_ADD;
var SCORE_TO_SUBTRACT;