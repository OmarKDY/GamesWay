// THE VALUE OF EACH SIDE OF TILES
var TILE_VALUES = [ [0,0],
                    [1,2],
                    [2,3],
                    [2,4],
                    [1,5],
                    [5,5],
                    [3,6],
                    [0,1],
                    [2,2],
                    [3,3],
                    [3,4],
                    [2,5],
                    [0,6],
                    [4,6],
                    [1,1],
                    [0,3],
                    [0,4],
                    [4,4],
                    [3,5],
                    [1,6],
                    [5,6],
                    [0,2],
                    [1,3],
                    [1,4],
                    [0,5],
                    [4,5],
                    [2,6],
                    [6,6] ];

// FRAME 28 IS THE BACK!
var TILE_BACK = 28;

// ROTATION ANGLE OF THE PLAYERS HANDS
var PLAYER_ROTATION = [0, 0, 270, 90];

// COORDINATES OF THE PLAYERS' LOCKS (FOR THEIR INTERFACE)
var PLAYER_LOCK_POSITIONS = [[CANVAS_WIDTH_HALF + 220, CANVAS_HEIGHT_HALF + 345],  // PLAYER 1: BOTTOM (HUMAN)
                             [CANVAS_WIDTH_HALF - 260, CANVAS_HEIGHT_HALF - 335],  // PLAYER 2: TOP
                             [CANVAS_WIDTH_HALF + 308, CANVAS_HEIGHT_HALF - 238],  // PLAYER 3: RIGHT
                             [CANVAS_WIDTH_HALF - 348, CANVAS_HEIGHT_HALF + 242]]; // PLAYER 4: LEFT

// COORDINATES OF THE PLAYERS' TEXT (FOR THEIR INTERFACE)
var PLAYER_TEXT_COORDINATES = [[CANVAS_WIDTH_HALF - 265, CANVAS_HEIGHT_HALF + 360],  // PLAYER 1: BOTTOM (HUMAN)
                               [CANVAS_WIDTH_HALF + 150, CANVAS_HEIGHT_HALF - 315],  // PLAYER 2: TOP
                               [CANVAS_WIDTH_HALF + 260, CANVAS_HEIGHT_HALF + 250],  // PLAYER 3: RIGHT
                               [CANVAS_WIDTH_HALF - 380, CANVAS_HEIGHT_HALF - 200]]; // PLAYER 4: LEFT
                           
var PLAYER_SCORE_COORDINATES = [[CANVAS_WIDTH_HALF - 265, CANVAS_HEIGHT_HALF + 385],  // PLAYER 1: BOTTOM (HUMAN)
                                [CANVAS_WIDTH_HALF + 150, CANVAS_HEIGHT_HALF - 295],  // PLAYER 2: TOP
                                [CANVAS_WIDTH_HALF + 290, CANVAS_HEIGHT_HALF + 250],  // PLAYER 3: RIGHT
                                [CANVAS_WIDTH_HALF - 400, CANVAS_HEIGHT_HALF - 200]]; // PLAYER 4: LEFT

// COORDINATES OF THE PLAYERS' HANDS(FOR THEIR INTERFACE)
var PLAYER_HANDS_COORDS = [ [CANVAS_WIDTH_HALF + 200, CANVAS_HEIGHT_HALF + 420],  // PLAYER 1: BOTTOM (HUMAN)
                            [CANVAS_WIDTH_HALF - 260, CANVAS_HEIGHT_HALF - 262],  // PLAYER 2: TOP
                            [CANVAS_WIDTH_HALF + 330, CANVAS_HEIGHT_HALF - 70],   // PLAYER 3: RIGHT
                            [CANVAS_WIDTH_HALF - 330, CANVAS_HEIGHT_HALF - 50]];  // PLAYER 4: LEFT

var TILE_INIT_SCALE = 0.7;
var TILE_WIDTH = 84;
var TILE_HEIGHT = 138;
var TILE_SCALE_LIMIT = 0.74;
var TILE_SCALE_VAR = 0.07;

var NO_PLAYER = 5;  // USED FOR NOT ASSIGNED YET TILES

var FIRST_GAME;