var GOAL_AREA = new Array();
GOAL_AREA[0] = {x: 0, y: -40, width: 750, height: 435};
GOAL_AREA[1] = {x: -26, y: -94, width: 750, height: 420};
GOAL_AREA[2] = {x: -18, y: -78, width: 750, height: 400};
GOAL_AREA[3] = {x: 16, y: -206, width: 750, height: 500};
GOAL_AREA[4] = {x: -34, y: -202, width: 750, height: 500};


var STAKE_POS = new Array();
STAKE_POS[0] = [{x:-160, y:-260}, {x:-165, y:190}, {x:165, y:190}, {x:160, y:-260}];
STAKE_POS[1] = [{x:-185, y:-300}, {x:-190, y:170}, {x:140, y:150}, {x:135, y:-350}];
STAKE_POS[2] = [{x:-170, y:-330}, {x:-175, y:165}, {x:140, y:180}, {x:140, y:-280}];
STAKE_POS[3] = [{x:-120, y:-530}, {x:-125, y:90}, {x:155, y:135}, {x:150, y:-400}];
STAKE_POS[4] = [{x:-145, y:-400}, {x:-150, y:140}, {x:80, y:90}, {x:75, y:-540}];

var POST_POS = new Array();
POST_POS[0] = {x:0, y:66};
POST_POS[1] = {x:-26, y:20};
POST_POS[2] = {x:-18, y:34};
POST_POS[3] = {x:-4, y:-70};
POST_POS[4] = {x:12, y:-70};

var TARGET_AREA_SPRITE_OFFSET = new Array();
TARGET_AREA_SPRITE_OFFSET[0] = {red:{x:0, y:0}, yellow:{x:0, y:0}, green:{x:0, y:0}};
TARGET_AREA_SPRITE_OFFSET[1] = {red:{x:0, y:0}, yellow:{x:4, y:-6}, green:{x:5, y:-9}};
TARGET_AREA_SPRITE_OFFSET[2] = {red:{x:0, y:0}, yellow:{x:-3, y:-6}, green:{x:-4, y:-9}};
TARGET_AREA_SPRITE_OFFSET[3] = {red:{x:0, y:0}, yellow:{x:-6, y:-18}, green:{x:-9, y:-27}};
TARGET_AREA_SPRITE_OFFSET[4] = {red:{x:0, y:0}, yellow:{x:6, y:-20}, green:{x:8, y:-30}};

var Y_BAR_OFFSET = new Array();
Y_BAR_OFFSET[0] = -150;
Y_BAR_OFFSET[1] = -150;
Y_BAR_OFFSET[2] = -150;
Y_BAR_OFFSET[3] = -180;
Y_BAR_OFFSET[4] = -180;

var GREEN_INDICATOR_RANGE = new Array();
GREEN_INDICATOR_RANGE[0] = {horiz:{left:-14, right:14}, vert:{top:-29, bot:24}};
GREEN_INDICATOR_RANGE[1] = {horiz:{left:-17, right:11}, vert:{top:-25, bot:32}};
GREEN_INDICATOR_RANGE[2] = {horiz:{left:-12, right:15}, vert:{top:-25, bot:32}};
GREEN_INDICATOR_RANGE[3] = {horiz:{left:-7, right:16}, vert:{top:-23, bot:39}};
GREEN_INDICATOR_RANGE[4] = {horiz:{left:-13, right:4}, vert:{top:-11, bot:39}};