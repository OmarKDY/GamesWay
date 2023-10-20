var PIPE_EMPTY =       {'img': 0, 'solution_rot': [0],      'open_top': false, 'open_right': false, 'open_bottom': false, 'open_left': false};
var PIPE_HORIZONTAL1 = {'img': 1, 'solution_rot': [90,270], 'open_top': true,  'open_right': false, 'open_bottom': true,  'open_left': false};
var PIPE_HORIZONTAL2 = {'img': 1, 'solution_rot': [0,180],  'open_top': false, 'open_right': true,  'open_bottom': false, 'open_left': true};
var PIPE_ANGLE1 =      {'img': 2, 'solution_rot': [90],     'open_top': true,  'open_right': true,  'open_bottom': false, 'open_left': false};
var PIPE_ANGLE2 =      {'img': 2, 'solution_rot': [180],    'open_top': false, 'open_right': true,  'open_bottom': true,  'open_left': false};
var PIPE_ANGLE3 =      {'img': 2, 'solution_rot': [270],    'open_top': false, 'open_right': false, 'open_bottom': true,  'open_left': true};
var PIPE_ANGLE4 =      {'img': 2, 'solution_rot': [0],      'open_top': true,  'open_right': false, 'open_bottom': false, 'open_left': true};
var PIPE_CROSS  =      {'img': 3, 'solution_rot': [0],      'open_top': true,  'open_right': true,  'open_bottom': true,  'open_left': true};
var PIPE_START1 =      {'img': 4, 'solution_rot': [90],     'open_top': false, 'open_right': true,  'open_bottom': false, 'open_left': false};
var PIPE_START2 =      {'img': 4, 'solution_rot': [270],    'open_top': false, 'open_right': false, 'open_bottom': false, 'open_left': true};
var PIPE_START3 =      {'img': 4, 'solution_rot': [180],    'open_top': false, 'open_right': false, 'open_bottom': true,  'open_left': false};
var PIPE_START4 =      {'img': 4, 'solution_rot': [0],      'open_top': true,  'open_right': false, 'open_bottom': false, 'open_left': false};

var SQUARE_TYPES = [PIPE_EMPTY, 
                    PIPE_HORIZONTAL1, 
                    PIPE_HORIZONTAL2, 
                    PIPE_ANGLE1, 
                    PIPE_ANGLE2, 
                    PIPE_ANGLE3, 
                    PIPE_ANGLE4,
                    PIPE_CROSS,
                    PIPE_START1, 
                    PIPE_START2, 
                    PIPE_START3, 
                    PIPE_START4];