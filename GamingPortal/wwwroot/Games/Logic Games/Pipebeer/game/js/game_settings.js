var COLUMNS_COORDS = [376,442,507,573,639,705,771,837,903,969];
var ROWS_COORDS = [132,198,264,330,396,462,528];
var NEXT_COLUMN_Y = 1085;
var NEXT_COLUMN_OFFSET_Y = 24;

var BOARD_COORDS;
BOARD_COORDS = [[COLUMNS_COORDS[0],ROWS_COORDS[0]],
                [COLUMNS_COORDS[1],ROWS_COORDS[0]],
                [COLUMNS_COORDS[2],ROWS_COORDS[0]],
                [COLUMNS_COORDS[3],ROWS_COORDS[0]],
                [COLUMNS_COORDS[4],ROWS_COORDS[0]],
                [COLUMNS_COORDS[5],ROWS_COORDS[0]],
                [COLUMNS_COORDS[6],ROWS_COORDS[0]],
                [COLUMNS_COORDS[7],ROWS_COORDS[0]],
                [COLUMNS_COORDS[8],ROWS_COORDS[0]],
                [COLUMNS_COORDS[9],ROWS_COORDS[0]],
                [COLUMNS_COORDS[0],ROWS_COORDS[1]],
                [COLUMNS_COORDS[1],ROWS_COORDS[1]],
                [COLUMNS_COORDS[2],ROWS_COORDS[1]],
                [COLUMNS_COORDS[3],ROWS_COORDS[1]],
                [COLUMNS_COORDS[4],ROWS_COORDS[1]],
                [COLUMNS_COORDS[5],ROWS_COORDS[1]],
                [COLUMNS_COORDS[6],ROWS_COORDS[1]],
                [COLUMNS_COORDS[7],ROWS_COORDS[1]],
                [COLUMNS_COORDS[8],ROWS_COORDS[1]],
                [COLUMNS_COORDS[9],ROWS_COORDS[1]],
                [COLUMNS_COORDS[0],ROWS_COORDS[2]],
                [COLUMNS_COORDS[1],ROWS_COORDS[2]],
                [COLUMNS_COORDS[2],ROWS_COORDS[2]],
                [COLUMNS_COORDS[3],ROWS_COORDS[2]],
                [COLUMNS_COORDS[4],ROWS_COORDS[2]],
                [COLUMNS_COORDS[5],ROWS_COORDS[2]],
                [COLUMNS_COORDS[6],ROWS_COORDS[2]],
                [COLUMNS_COORDS[7],ROWS_COORDS[2]],
                [COLUMNS_COORDS[8],ROWS_COORDS[2]],
                [COLUMNS_COORDS[9],ROWS_COORDS[2]],
                [COLUMNS_COORDS[0],ROWS_COORDS[3]],
                [COLUMNS_COORDS[1],ROWS_COORDS[3]],
                [COLUMNS_COORDS[2],ROWS_COORDS[3]],
                [COLUMNS_COORDS[3],ROWS_COORDS[3]],
                [COLUMNS_COORDS[4],ROWS_COORDS[3]],
                [COLUMNS_COORDS[5],ROWS_COORDS[3]],
                [COLUMNS_COORDS[6],ROWS_COORDS[3]],
                [COLUMNS_COORDS[7],ROWS_COORDS[3]],
                [COLUMNS_COORDS[8],ROWS_COORDS[3]],
                [COLUMNS_COORDS[9],ROWS_COORDS[3]],
                [COLUMNS_COORDS[0],ROWS_COORDS[4]],
                [COLUMNS_COORDS[1],ROWS_COORDS[4]],
                [COLUMNS_COORDS[2],ROWS_COORDS[4]],
                [COLUMNS_COORDS[3],ROWS_COORDS[4]],
                [COLUMNS_COORDS[4],ROWS_COORDS[4]],
                [COLUMNS_COORDS[5],ROWS_COORDS[4]],
                [COLUMNS_COORDS[6],ROWS_COORDS[4]],
                [COLUMNS_COORDS[7],ROWS_COORDS[4]],
                [COLUMNS_COORDS[8],ROWS_COORDS[4]],
                [COLUMNS_COORDS[9],ROWS_COORDS[4]],
                [COLUMNS_COORDS[0],ROWS_COORDS[5]],
                [COLUMNS_COORDS[1],ROWS_COORDS[5]],
                [COLUMNS_COORDS[2],ROWS_COORDS[5]],
                [COLUMNS_COORDS[3],ROWS_COORDS[5]],
                [COLUMNS_COORDS[4],ROWS_COORDS[5]],
                [COLUMNS_COORDS[5],ROWS_COORDS[5]],
                [COLUMNS_COORDS[6],ROWS_COORDS[5]],
                [COLUMNS_COORDS[7],ROWS_COORDS[5]],
                [COLUMNS_COORDS[8],ROWS_COORDS[5]],
                [COLUMNS_COORDS[9],ROWS_COORDS[5]],
                [COLUMNS_COORDS[0],ROWS_COORDS[6]],
                [COLUMNS_COORDS[1],ROWS_COORDS[6]],
                [COLUMNS_COORDS[2],ROWS_COORDS[6]],
                [COLUMNS_COORDS[3],ROWS_COORDS[6]],
                [COLUMNS_COORDS[4],ROWS_COORDS[6]],
                [COLUMNS_COORDS[5],ROWS_COORDS[6]],
                [COLUMNS_COORDS[6],ROWS_COORDS[6]],
                [COLUMNS_COORDS[7],ROWS_COORDS[6]],
                [COLUMNS_COORDS[8],ROWS_COORDS[6]],
                [COLUMNS_COORDS[9],ROWS_COORDS[6]],
                // THE NEXT POSITIONS ARE FOR THE NEXT SQUARES TO ARRIVE, NOT THE BOARD
                [NEXT_COLUMN_Y, ROWS_COORDS[4] + NEXT_COLUMN_OFFSET_Y],
                [NEXT_COLUMN_Y, ROWS_COORDS[3] + NEXT_COLUMN_OFFSET_Y],
                [NEXT_COLUMN_Y, ROWS_COORDS[2] + NEXT_COLUMN_OFFSET_Y],
                [NEXT_COLUMN_Y, ROWS_COORDS[1] + NEXT_COLUMN_OFFSET_Y],
                [NEXT_COLUMN_Y, ROWS_COORDS[0] + NEXT_COLUMN_OFFSET_Y]];
            
                    //  IMG, ROT,   TOP, RIGHT,BOTTOM,  LEFT
var PIPE_EMPTY =        [ 0,   0, false, false, false, false];
var PIPE_HORIZONTAL1 =  [ 1,  90,  true, false,  true, false];
var PIPE_HORIZONTAL2 =  [ 1,   0, false,  true, false,  true];
var PIPE_ANGLE1 =       [ 2,  90,  true,  true, false, false];
var PIPE_ANGLE2 =       [ 2, 180, false,  true,  true, false];
var PIPE_ANGLE3 =       [ 2, 270, false, false,  true,  true];
var PIPE_ANGLE4 =       [ 2,   0,  true, false, false,  true];
var PIPE_CROSS =        [ 3,   0,  true,  true,  true,  true];
var PIPE_START1 =       [ 4,  90, false,  true, false, false];
var PIPE_START2 =       [ 4, 270, false, false, false,  true];
var PIPE_START3 =       [ 4,   0,  true, false, false, false];
var PIPE_START4 =       [ 4, 180, false, false,  true, false];
var PIPE_BARRIER =      [11,   0, false, false, false, false];