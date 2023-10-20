function CBoard(oBoardContainer) {
    var _oBoardContainer;
    var _oSplash;
    
    var _iLevel;

    var _aSquares = [];
    var _aNextSquares = [];
    
    this._init = function () {
        _iLevel = s_oGame.getLevel();
        _oBoardContainer = oBoardContainer;
        
        this.initSplash();
        
        // GENERATE A RANDOM START
        if (_iLevel < 3) {
            START_POSITION_COLUMN = Math.floor((Math.random() * 2) + 4); // WE EXCLUDE 3 COLUMNS FROM EACH SIDE
            START_POSITION_ROW = Math.floor((Math.random() * 2) + 2);    // WE EXCLUDE 2 ROW FROM EACH SIDE
        } else {
            START_POSITION_COLUMN = Math.floor((Math.random() * 5) + 3); // WE EXCLUDE 2 COLUMNS FROM EACH SIDE
            START_POSITION_ROW = Math.floor((Math.random() * 4) + 1);    // WE EXCLUDE 1 ROW FROM EACH SIDE
        };
        
        // Generate the squares
        for (var j = 0; j < ROWS_COORDS.length; j++) {
            for (var k = 0; k < COLUMNS_COORDS.length; k++) {
                var oSquare = new CPipe(PIPE_EMPTY, k, j, _iLevel);
                _aSquares.push(oSquare);
            };
        };

        // Add random special squares from 3rd level on
        if (_iLevel > 1) {
            this.generateSpecialSquare();
        };

        // Generate the squares for next pipes
        for (var i = 0; i < 5; i++) {
           this.generateNextSquare(BOARD_COORDS[BOARD_SQUARES+i][0], BOARD_COORDS[BOARD_SQUARES+i][1]);        
           _aNextSquares[i].setX(BOARD_SQUARES+i);
           _aNextSquares[i].setY(BOARD_SQUARES+i);
        };
    };
    
    this.startSplash = function(iColumn, iRow, iAngle){
        _oSplash.visible = true;
        _oSplash.x = COLUMNS_COORDS[iColumn];
        _oSplash.y = ROWS_COORDS[iRow];
        _oSplash.rotation = iAngle;                        
        _oSplash.gotoAndPlay("idle");
        
        _oSplash.addEventListener("animationend", function(){
            s_oGame.checkLevel();

            new createjs.Tween.get(_oSplash)
                .to({alpha: 0}, 1000, createjs.Ease.cubicOut);            
        });
    };
    
    this.initSplash = function(){
        var data = {
            images: [s_oSpriteLibrary.getSprite("splash")],
            frames: {width: 102, height: 82},
            animations: { idle: [0, 13, false] },
            framerate: 20
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);
        _oSplash = createSprite(oSpriteSheet, 'idle', 0, 0, 102, 82);
        _oSplash.regX = 51;
        _oSplash.regY = 35;
        _oSplash.visible = false;
        _oBoardContainer.addChild(_oSplash);
    };
    
    this.generateSpecialSquare = function(){
        var iRandomColumn = Math.floor((Math.random() * 9) + 0);
        var iRandomRow = Math.floor((Math.random() * 7) + 0);
        
        if (iRandomColumn === START_POSITION_COLUMN && iRandomRow === START_POSITION_ROW) {
            iRandomColumn = Math.floor((Math.random() * 9) + 0);
            iRandomRow = Math.floor((Math.random() * 7) + 0);
        };
        
        this.updateSquare(iRandomColumn, iRandomRow, PIPE_BARRIER);
    };
    
    this.generateNextSquare = function(iCol, iRow){
        var aRandomSquarePercentage = [0,0,1,1,1,1,2,2,2,2];    // 0: CROSS, 1: ANGLE, 2: HORIZONTAL
        var iRandomN = aRandomSquarePercentage[Math.floor(Math.random() * aRandomSquarePercentage.length)];
        var aType;
        var aPipes;
        
        switch(iRandomN) {
            case 0:
                aPipes = [PIPE_CROSS];
                break;
            case 1:
                aPipes = [PIPE_ANGLE1,PIPE_ANGLE2,PIPE_ANGLE3,PIPE_ANGLE4];                
                break;
            case 2:
                aPipes = [PIPE_HORIZONTAL1,PIPE_HORIZONTAL2];
                break;
        };
        
        aType = aPipes[Math.floor(Math.random() * aPipes.length)];
        
        var oSquare = new CPipe(aType, iCol, iRow, _iLevel);
        _aNextSquares.push(oSquare);
    };
    
    this.updateNextSquares = function(){
        // REMOVE THE FIRST SQUARE OF THE ARRAY
        _aNextSquares.splice(0, 1);
        
        // CREATE A NEW 5TH POSITION SQUARE
        s_oBoard.generateNextSquare(BOARD_COORDS[BOARD_SQUARES+4][0], BOARD_COORDS[BOARD_SQUARES+4][1]);
        
        // MOVE THE NEXT SQUARES UP OF ONE POSITION IN THE ARRAY
        for (var i = 0; i < 5; i++) {
            _aNextSquares[i].setX(BOARD_SQUARES+i);
            _aNextSquares[i].setY(BOARD_SQUARES+i);
        };
        
        s_oGame.setClickBlocked(false);
    };
    
    this.updateSquare = function(iColumn, iRow, aType){
        var iPosition = s_oBoard.findSquarePosition(iColumn, iRow);
        var oSquare = _aSquares[iPosition];
        
        oSquare.setInfoArray(aType);
    };
    
    this.getNextSquare = function(){
        return _aNextSquares[0];
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
    
    this.findSquarePosition = function(iColumn, iRow){
        // GIVEN A COLUMN AND A ROW, WE'LL GET THE POSITION
        for (var i = 0; i < BOARD_COORDS.length; i++) {
            if (BOARD_COORDS[i][0] === COLUMNS_COORDS[iColumn] && 
                BOARD_COORDS[i][1] === ROWS_COORDS[iRow]) {
                return i;
            };
        };
    };
        
    this.unload = function () {
        s_oBoard = null;
        _oBoardContainer.removeAllChildren();
    };

    s_oBoard = this;

    this._init();
}

var s_oBoard;