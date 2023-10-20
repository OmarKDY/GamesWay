function CBoard(oBoardContainer, iLevel) {
    var _oBoardContainer;
    var _oThis;
    
    var _iLevel;

    var _aSquares;
    var _aColumnsCoords;
    var _aRowsCoords;
    var _aBoardCoordinates;
    
    this._init = function () {
        _iLevel = iLevel;
        _oBoardContainer = oBoardContainer;
        _aSquares = [];
        
        // SET COORDINATES OF THE SQUARE MATRIX
        this.initSquareMatrixCoordinates();
        this.initBoardCoordinates();
        
        // GENERATE THE SQUARES FOR THE SOLUTION
        for (var i = 0; i < PIECES_SOLUTION.length; i++) {
            var iPosition = this.findSquarePosition(PIECES_SOLUTION[i]["column"], PIECES_SOLUTION[i]["row"]);
            var oSquare = new CPipe(PIECES_SOLUTION[i]["type"], PIECES_SOLUTION[i]["column"], PIECES_SOLUTION[i]["row"], 
                _oBoardContainer, iPosition, _aColumnsCoords, _aRowsCoords);
            _aSquares.push(oSquare);
        };
        
        // GENERATE THE EXTRA SQUARES
        for (var i = 0; i < EXTRA_PIECES.length; i++) {
            var iPosition = this.findSquarePosition(PIECES_SOLUTION[i]["column"], PIECES_SOLUTION[i]["row"]);
            var oSquare = new CPipe(EXTRA_PIECES[i]["type"], EXTRA_PIECES[i]["column"], EXTRA_PIECES[i]["row"], 
                _oBoardContainer, iPosition, _aColumnsCoords, _aRowsCoords);
            _aSquares.push(oSquare);
        };
        
        this.randomizeBoard();        
    };
    
    this.initSquareMatrixCoordinates = function(){
        _aColumnsCoords = [];
        _aRowsCoords = [];
        
        for (var i = 0; i < NUM_SQUARE_COLUMNS; i++) {
            _aColumnsCoords[i] = EDGEBOARD_X + BOARD_START_LEFT + (SQUARES_SIZE*i);
        };
        
        for (var j = 0; j < NUM_SQUARE_ROWS; j++) {
            _aRowsCoords[j] = EDGEBOARD_Y + BOARD_START_TOP + (SQUARES_SIZE*j);
        };
    };
    
    this.initBoardCoordinates = function(){
        _aBoardCoordinates = [];

        var aCoordinates = [];
        for (var i = 0; i < _aRowsCoords.length; i++) {
            for (var j = 0; j < _aColumnsCoords.length; j++) {
                aCoordinates = [_aColumnsCoords[j], _aRowsCoords[i]];
                _aBoardCoordinates.push(aCoordinates);
            };
        };
    };
    
    this.returnBoardCoordinates = function(){
        return _aBoardCoordinates;
    };
    
    this.randomizeBoard = function(){
        var iNotRandomizedSquares = 0;

        for (var i = 0; i < _aSquares.length; i++) {
            var iRandomRotation = 90 * Math.floor((Math.random() * 3) + 0);
            if (iRandomRotation === 0) {
                iNotRandomizedSquares++;
            };
            
            _aSquares[i].rotatePipe(iRandomRotation);
        };
        
        // IF THE SQUARES HAVEN'T BEEN SHUFFLED ENOUGH, TRY AGAIN
        if ( ((iNotRandomizedSquares*100)/_aSquares.length) > RANDOM_MIN_PERCENTAGE ) {
            this.randomizeBoard();
        };
    };
    
    this.getContainer = function() {
        return _oBoardContainer;
    };
    
    this.getSquare = function(iPosition) {
        return _aSquares[iPosition];
    };
    
    this.getArray = function(){
        return _aSquares;
    };
    
    this.findSquareWithItsPosition = function(iColumn, iRow){
        // GIVEN A COLUMN AND A ROW, WE'LL GET THE SQUARE
        for (var i = 0; i < _aSquares.length; i++) {
            if ( _aSquares[i].getColumn() === iColumn && _aSquares[i].getRow() === iRow) {
                return _aSquares[i];
            };
        };
    };

    this.findSquarePosition = function(iColumn, iRow){
        // GIVEN A COLUMN AND A ROW, WE'LL GET THE POSITION
        for (var i = 0; i < _aBoardCoordinates.length; i++) {
            if (_aBoardCoordinates[i][0] === _aColumnsCoords[iColumn] && 
                _aBoardCoordinates[i][1] === _aRowsCoords[iRow]) {
                return i;
            };
        };
    };
        
    this.unload = function () {
        _oBoardContainer.removeAllChildren();
    };

    _oThis = this;

    this._init();
}