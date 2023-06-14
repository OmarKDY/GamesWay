function CMaze(iMode) {
    var _oMazeContainer;
    var _iMode = iMode;
    
    // Entering position (where the Maze enter will be)
    var _iENTRANCE_X = 0;                       // 0 means the right of the canvas
    var _iENTRANCE_Y = 0;                       // 0 means the top of the canvas

    // Starting position (where the Maze exit will be)
    var _iSTARTING_X = NUM_COLS[_iMode] -1;           // "NUM_COLS - 1" means the right of the canvas
    var _iSTARTING_Y = NUM_ROWS[_iMode] -1;           // "NUM_ROWS - 1" means the bottom of the canvas
    
    var _iENTER = oWallLeft;                          // Entrance wall
    var _iEXIT = oWallRight;                          // Exit wall

    var _aMaze = new Array( NUM_COLS[_iMode] );       // Maze is a two-dimension array of cells
    
    var iOffsetH = (CANVAS_WIDTH/2) - (CELL_WIDTH[_iMode] * (NUM_COLS[_iMode]/2));
    var iOffsetV = (CANVAS_HEIGHT/2) - (CELL_WIDTH[_iMode] * (NUM_ROWS[_iMode]/2));
    
    // Initialize the maze as NUM_COLS x NUM_ROWS, setting all cells 
    // to have NOT been visited and all four walls turned on (true)
    this._init = function() {
        // start by creating a NUM_ROWSxNUM_COLS maze
        for(var r = 0; r < NUM_ROWS[_iMode] ; r++) {
            _aMaze[r] = new Array( NUM_COLS[_iMode] );
            for(var c = 0; c < NUM_COLS[_iMode] ; c++) {
                _aMaze[r][c] = new Array(5);
                _aMaze[r][c][oWallUp] = true;
                _aMaze[r][c][oWallRight] = true;
                _aMaze[r][c][oWallDown] = true;
                _aMaze[r][c][oWallLeft] = true;
                _aMaze[r][c][4] = false;
            }
        }
        this.generateMaze(_iSTARTING_X,_iSTARTING_Y);      // start the maze at exit points
        this.installDoors();                               // setup the enterance and exit points

        this.drawMaze();
    };
    
    // Recursive function, passing in the "current cell"
    this.generateMaze = function(w, h) {
        _aMaze[w][h][4] = true;                                               // Mark the current cell as "visited"
        var neighbors_unshuffled = this.getNeighbors(w,h);                    // Get a list of neighbors
        var neighbors = this.shuffleNeighbors(neighbors_unshuffled);          // Randomly shuffle our neighbors
        for(var i = 0; i < neighbors.length; i++) {                           // loop through our neighbors list...
            if(_aMaze[neighbors[i][0]][neighbors[i][1]][4] == false) {        // check if this neighbor has been visited
                this.removeWall(w,h,neighbors[i]);                            // remove the wall between this cell, and the current neighbor
                this.generateMaze(neighbors[i][0], neighbors[i][1]);          // Recursively call generateMaze, passing in this new neighbor
            }
        }
    }

    // Examines the exit location and makes the proper adjustment based on the EXIT values
    this.installDoors = function() {
        // Install Exit opening [0 = top, 1 = right, 2 = bottom, 3 = left] with respect to ending cell
        if (_iEXIT == oWallUp)
            _aMaze[_iSTARTING_X][_iSTARTING_Y][oWallUp] = false;
        if (_iEXIT == oWallRight)
            _aMaze[_iSTARTING_X][_iSTARTING_Y][oWallRight] = false;
        if (_iEXIT == oWallDown)
            _aMaze[_iSTARTING_X][_iSTARTING_Y][oWallDown] = false;
        if (_iEXIT == oWallLeft)
            _aMaze[_iSTARTING_X][_iSTARTING_Y][oWallLeft] = false;
    }
    
    // Returns a list of arrays (w,h) that are above, below, left, and right of the cell that is passed in.
    // Be careful: we need to check where our boundaries are so we don't end up with a neighbor location beyond the edges of our 2D array (maze)
    this.getNeighbors = function(w,h) {
        var neighbors = new Array();            // list of neighbors
        var current_neighbor = 0;               // keep track of the number of neighbors we're at

        if(h != 0)                  // first add the neighbor above
        {   neighbors[current_neighbor] = new Array(w, h-1);
            current_neighbor++; }
        if(w < NUM_COLS[_iMode] - 1)          // add the neighbor to the right
        {   neighbors[current_neighbor] = new Array(w+1, h);
            current_neighbor++; }
        if(h < NUM_ROWS[_iMode] - 1)         // add the neighbor below
        {   neighbors[current_neighbor] = new Array(w, h+1);
            current_neighbor++; }
        if(w != 0)                  // add the neighbor to the left
            neighbors[current_neighbor] = new Array(w-1, h);
        return neighbors;
    }

    // This function does a fair shuffle on the list passed in
    this.shuffleNeighbors = function(neighbors) {
        for(var i = 0; i < neighbors.length; i++)                               // loop through the neighbors, finding a random place for the current one
        {   var random_index = Math.floor(Math.random()*neighbors.length);      // get a random number based on the length of our list
            var temp_array = new Array(2);                                      // swap the two arrays at 'i' and 'random_index' (deep copy)
            temp_array[0] = neighbors[i][0];
            temp_array[1] = neighbors[i][1];
            neighbors[i][0] = neighbors[random_index][0];
            neighbors[i][1] = neighbors[random_index][1];
            neighbors[random_index][0] = temp_array[0];
            neighbors[random_index][1] = temp_array[1];
        } return neighbors;
    }

    // This function removes the wall between the cell at "w,h" and the cell represented by the array "neighbor[w,h]".
    // The "wall" is represented by a "true" (or "false" for absence) in the "_aMaze" array.
    this.removeWall = function(w, h, neighbor) {
        // if the neighbor is above us
        if(neighbor[1] < h)
        {   // remove the wall above us [0] and the neighbor's bottom wall [2]
            _aMaze[w][h][oWallUp] = false;
            _aMaze[neighbor[oWallUp]][neighbor[oWallRight]][oWallDown] = false;
            return; }
        // if the neighbor is below us
        if(neighbor[1] > h)
        {   // remove the wall below us [2] and the neighbor's top wall [0]
            _aMaze[w][h][oWallDown] = false;
            _aMaze[neighbor[oWallUp]][neighbor[oWallRight]][oWallUp] = false;
            return; }
        // if the neighbor is to the right of us
        if(neighbor[0] > w)
        {   // remove the wall to the right of us [1] and the neighbor's left wall [3]
            _aMaze[w][h][oWallRight] = false;
            _aMaze[neighbor[oWallUp]][neighbor[oWallRight]][oWallLeft] = false;
            return; }
        // if the neighbor is to the left of us
        if(neighbor[0] < w)
        {   // remove the wall to the left of us [3] and the neighbor's right wall [1]
            _aMaze[w][h][oWallLeft] = false;
            _aMaze[neighbor[oWallUp]][neighbor[oWallRight]][oWallRight] = false;
            return; }
    }

    this._returnOffsetH = function() {
        return iOffsetH;
    };

    this._returnOffsetV = function() {
        return iOffsetV;
    };

    this._returnStartingX = function() {
        return _iSTARTING_X;
    };

    this._returnStartingY = function() {
        return _iSTARTING_Y;
    };

    this._returnEntranceX = function() {
        return _iENTRANCE_X;
    };

    this._returnEntranceY = function() {
        return _iENTRANCE_Y;
    };

    this._returnEnter = function() {
        return _iENTER;
    };

    this._returnExit = function() {
        return _iEXIT;
    };
    
    this._returnWall = function(Row, Col, Wall) {
        
        if (_aMaze[Row][Col][Wall] === false) {
            return false;
        } else {
            return true;
        }
    };

    // Function to graphically draw the maze
    this.drawMaze = function() {
        // After the maze is generated, create a table - each with cells containing borders that match each cell in the maze
        _oMazeContainer = new createjs.Container();
        s_oStage.addChild(_oMazeContainer);
        
        {for (var r = 0; r < NUM_ROWS[_iMode]; r++) {
            s_aCellList[r] = new Array();
            for (var c = 0; c < NUM_COLS[_iMode]; c++) {
                    s_aCellList[r][c] = new CCell(r, c, 
                    iOffsetH + (CELL_WIDTH[_iMode] * r + CELL_WIDTH[_iMode]/2), // X of the new cell
                    iOffsetV + (CELL_WIDTH[_iMode] * c + CELL_WIDTH[_iMode]/2), // Y of the new cell
                    [_aMaze[r][c][oWallUp], _aMaze[r][c][oWallRight], _aMaze[r][c][oWallDown], _aMaze[r][c][oWallLeft]],    // if the walls are on (true/false)
                    _iMode, _oMazeContainer);
                }
            } 
        } 
        
    }
    s_oMaze = this;
    
    this._init();
};

var s_oMaze;