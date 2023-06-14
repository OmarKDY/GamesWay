function CCell(iColumn, iRow, iX, iY, aWalls, iMode, oMazeContainer) {
    var _iColumn;
    var _iRow;
    var _iX;
    var _iY;
    var _aWalls;
    var _iMode;
    var _oSpriteContainer;
    var _originalImgSize = 30;          // the original size of the wall images (30px, in our case)
    var _iScale = CELL_WIDTH[iMode] / _originalImgSize;

    this._init = function(iColumn, iRow, iX, iY, aWallInfos, _iMode, oMazeContainer){
        _iColumn = iColumn;
        _iRow = iRow;
        _iX = iX;
        _iY = iY;
        _iMode = iMode;
        
        _oSpriteContainer = new createjs.Container();
        _oSpriteContainer.scaleX = _oSpriteContainer.scaleY = _iScale + 0.03;
        _oSpriteContainer.x = iX;
        _oSpriteContainer.y = iY;
        _oSpriteContainer.regX = 15;
        _oSpriteContainer.regY = 15;
        oMazeContainer.addChild(_oSpriteContainer);

        _aWalls = new Array();          // Create the walls
        
        var _iThick = _iScale * 1.1;
        var _iScaleVar = 0.07;
        
        if (aWallInfos[0]) {
            _aWalls[0] = createBitmap(s_oSpriteLibrary.getSprite('horiz_wall'));    // Top wall (horizontal)
            _oSpriteContainer.addChild(_aWalls[0]); 
            // if it's on the edge of the maze, it must be thicker
            if (_iRow === 0) {
                _aWalls[0].scaleY = _iThick;
            };
        };
        if (aWallInfos[1]) {
            _aWalls[1] = createBitmap(s_oSpriteLibrary.getSprite('vert_wall'));     // Right wall (vertical)
            _aWalls[1].scaleY += _iScaleVar;
            _aWalls[1].x = _originalImgSize;                                        // The X-offset of the wall
            _oSpriteContainer.addChild(_aWalls[1]); 
            if (_iColumn === NUM_COLS[_iMode] - 1) {
                _aWalls[1].scaleX = _iThick;
            };
        };
        if (aWallInfos[2]) {
            _aWalls[2] = createBitmap(s_oSpriteLibrary.getSprite('horiz_wall'));    // Bottom wall (horizontal)
            _aWalls[2].y = _originalImgSize;                                        // The Y-offset of the wall    
            _oSpriteContainer.addChild(_aWalls[2]); 
            // if it's on the edge of the maze, it must be thicker
            if (_iRow === NUM_ROWS[_iMode] - 1) {
                _aWalls[2].scaleY = _iThick;
            };
        };
        if (aWallInfos[3]) {
            _aWalls[3] = createBitmap(s_oSpriteLibrary.getSprite('vert_wall'));     // Left wall (vertical)
            _aWalls[3].scaleY += _iScaleVar;
            _oSpriteContainer.addChild(_aWalls[3]); 
            if (_iColumn === 0) {
                _aWalls[3].scaleX = _iThick;
            };
        };
    }

    this._getCellX = function() {
        return _oSpriteContainer.x; }
    
    this._getCellY = function() {
        return _oSpriteContainer.y; }
    
    this._init(iColumn, iRow, iX, iY, aWalls, iMode, oMazeContainer);
};