function CGame(oData) {
    var _bDisableEvents;
    var _bWin;
    var _bEndGame;
    var _iCounterMovingCell;
    var _iScore;
    var _szCurSwipeDir;
    var _aGridCells;
    var _aGridValues;
    var _aPrevGridValues;
    var _aMovingCells;
    var _oInterface;
    var _oContainerGrid;
    var _oContainerMovingGrid;
    var _oHammer;
    
    this._init = function () {
        _bDisableEvents = false;
        _bWin = false;
        _bEndGame = false;
        
        _iScore = 0;
        setVolume("soundtrack", 0.4);
        var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        s_oStage.addChild(oBg);

        this._initGrid();

        _oInterface = new CInterface();

        this._fillNewCell();
        this._fillNewCell();

        this.initListeners();
    };
    
    this.restart = function(){
        _bDisableEvents = false;
        _bWin = false;
        _bEndGame = false;
        _iScore = 0;
        setVolume("soundtrack", 0.4);
        
        //RESET GRID VALUES
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_COLS;j++){
                _aGridCells[i][j].reset();
                _aGridValues[i][j] = CELL_EMPTY; //THIS CELL IS EMPTY
                _aPrevGridValues[i][j] = CELL_EMPTY; 
            }
        }
        
        this._fillNewCell();
        this._fillNewCell();
        
        _oInterface.refreshScore(_iScore);
        
        $(s_oMain).trigger("restart_level",1);
         
    };
    
    this.unload = function () {
        this.removeListeners();
        
        _oInterface.unload();
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
        
        s_oGame = null;
    };
    
    this.resumeGame = function(){
        _bDisableEvents = false;
    };
    
    this.initListeners = function(){
        _oHammer = new Hammer(s_oCanvas);
        
        _oHammer.get('swipe').set({direction: Hammer.DIRECTION_ALL});
        _oHammer.get('swipe').set({velocity: 0.005});
        _oHammer.get('swipe').set({threshold: 0.1});
        _oHammer.on("swipeleft", function () {
            _szCurSwipeDir = "left";
            s_oGame._keyPressed();
        });
        _oHammer.on("swiperight", function () {
            _szCurSwipeDir = "right";
            s_oGame._keyPressed();
        });
        _oHammer.on("swipeup", function () {
            _szCurSwipeDir = "up";
            s_oGame._keyPressed();
        });
        _oHammer.on("swipedown", function () {
            _szCurSwipeDir = "down";
            s_oGame._keyPressed();
        });
        
        if(s_bMobile === false){
            document.onkeydown   = onKeyDown; 
        }
    };
    
    this.removeListeners = function(){
	_oHammer.off("swipeleft", function () {
            _szCurSwipeDir = "left";
        });
        _oHammer.off("swiperight", function () {
            _szCurSwipeDir = "right";
        });
        _oHammer.off("swipeup", function () {
            _szCurSwipeDir = "up";
        });
        _oHammer.off("swipedown", function () {
            _szCurSwipeDir = "down";
        });
        
        if(s_bMobile === false){
            document.onkeydown   = null; 
        }
    };
    
    function onKeyDown(evt) { 
        if(_bDisableEvents){
            return;
        }
        
        if(!evt){ 
            evt = window.event; 
        }  
        
        _bDisableEvents = true;
        switch(evt.keyCode) {  
           // left  
           case 37: {
                   _szCurSwipeDir = "left";
                   s_oGame._keyPressed();
                   break; 
               }
           //up  
           case 38: {
                   _szCurSwipeDir = "up";
                   s_oGame._keyPressed();
                   break; 
               }         
                
           // right  
           case 39: {
                   _szCurSwipeDir = "right";
                   s_oGame._keyPressed();
                   break; 
               }
		   //down
           case 40: {
                   _szCurSwipeDir = "down";
                   s_oGame._keyPressed();
                   break; 
               }     
        }  
        
        evt.preventDefault();
        return false;
    }
    
    this._keyPressed = function(){
        //SET PREVIOUS GRID
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_COLS;j++){
                _aPrevGridValues[i][j] = _aGridValues[i][j];
            }
        }
        
        _aMovingCells = new Array();
        this._findMatching();

        //this.printGridValues();
        this._trimGrid();
        
        if(this.isNewGridDifferentFromPrevious()){
            _iCounterMovingCell = 0;
            for(var i=0;i<_aMovingCells.length;i++){
                _aMovingCells[i].playMovingAnim();
            }
            playSound("moving", 1, false);
        }else{
            for(var i=0;i<_aMovingCells.length;i++){
                var pCoord = _aMovingCells[i].getCoord();
                _aGridCells[pCoord.row][pCoord.col].setValue(_aGridValues[pCoord.row][pCoord.col]);
                _aMovingCells[i].unload();
            }
            _bDisableEvents = false;
            
            this._checkWin();
        }
    };
    
    this.isNewGridDifferentFromPrevious = function(){
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_COLS;j++){
                if(_aPrevGridValues[i][j] !== _aGridValues[i][j]){
                    return true;
                }
            }
        }
        
        return false;
    };
    
    /////////////////////////////

    this._initGrid = function(){
        this._initGridBg();
        
        _oContainerMovingGrid = new createjs.Container();
        _oContainerMovingGrid.x = CANVAS_WIDTH/2 - (CELL_WIDTH+SPACE_BETWEEN_CELLS)*(NUM_COLS/2) + (CELL_WIDTH/2) + SPACE_BETWEEN_CELLS/2;
        _oContainerMovingGrid.y = CANVAS_HEIGHT/2 - (CELL_HEIGHT+SPACE_BETWEEN_CELLS)*(NUM_ROWS/2) + (CELL_HEIGHT/2);
        s_oStage.addChild(_oContainerMovingGrid);
        
        _oContainerGrid = new createjs.Container();
        _oContainerGrid.x = CANVAS_WIDTH/2 - (CELL_WIDTH+SPACE_BETWEEN_CELLS)*(NUM_COLS/2) + (CELL_WIDTH/2) + SPACE_BETWEEN_CELLS/2;
        _oContainerGrid.y = CANVAS_HEIGHT/2 - (CELL_HEIGHT+SPACE_BETWEEN_CELLS)*(NUM_ROWS/2) + (CELL_HEIGHT/2);
        s_oStage.addChild(_oContainerGrid);
        
        _aGridValues = new Array();
        _aPrevGridValues = new Array();
        _aGridCells = new Array();
        var iX = 0;
        var iY = 0;
        for(var i=0;i<NUM_ROWS;i++){
            _aGridCells[i] = new Array();
            _aGridValues[i] = new Array();
            _aPrevGridValues[i] = new Array();
            for(var j=0;j<NUM_COLS;j++){
                var oCell = new CCell(iX,iY,_oContainerGrid);
                _aGridCells[i][j] = oCell;
                _aGridValues[i][j] = CELL_EMPTY; //THIS CELL IS EMPTY
                _aPrevGridValues[i][j] = CELL_EMPTY;
                
                iX += CELL_WIDTH + SPACE_BETWEEN_CELLS;
            }
            
            iX = 0;
            iY += CELL_HEIGHT + SPACE_BETWEEN_CELLS;
        }
    };
    
    this._initGridBg = function(){
        var iX = CANVAS_WIDTH/2 - (CELL_WIDTH+SPACE_BETWEEN_CELLS)*(NUM_COLS/2) + (CELL_WIDTH/2) + SPACE_BETWEEN_CELLS/2;
        var iY = CANVAS_HEIGHT/2 - (CELL_HEIGHT+SPACE_BETWEEN_CELLS)*(NUM_ROWS/2) + (CELL_HEIGHT/2);
        var oSprite = s_oSpriteLibrary.getSprite("cell_empty");
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_COLS;j++){
                var oCellBg = createBitmap(oSprite);
                oCellBg.regX = oSprite.width/2;
                oCellBg.regY = oSprite.height/2;
                oCellBg.x = iX;
                oCellBg.y = iY;
                s_oStage.addChild(oCellBg);
                
                iX += CELL_WIDTH + SPACE_BETWEEN_CELLS;
            }
            
            iX = CANVAS_WIDTH/2 - (CELL_WIDTH+SPACE_BETWEEN_CELLS)*(NUM_COLS/2) + (CELL_WIDTH/2) + SPACE_BETWEEN_CELLS/2;
            iY += CELL_HEIGHT + SPACE_BETWEEN_CELLS;
        }
    };
    
    this._fillNewCell = function(){
        //FIND ALL EMPTY CELLS
        var aEmpties = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_COLS;j++){
                if(_aGridValues[i][j] === CELL_EMPTY){
                    aEmpties.push({row:i,col:j});
                }
            }
        }

        var iRandRow;
        var iRandCol;
        if(aEmpties.length === 0){
            //GAME OVER
            this._gameOver();
        }else{
            
            var iRand = Math.floor(Math.random() * aEmpties.length);
            iRandRow = aEmpties[iRand].row;
            iRandCol = aEmpties[iRand].col;
            _aGridValues[iRandRow][iRandCol] = _aGridValues[iRandRow][iRandCol] + 1; 
            _aGridCells[iRandRow][iRandCol].playSpawnAnim();
            
            _bDisableEvents = false;
        }
    };
    
    this._debugFillNewCell = function(iRow,iCol,iType){
        _aGridValues[iRow][iCol] = iType; 
        _aGridCells[iRow][iCol].setValue(iType);

        _bDisableEvents = false;
    };
    
    this._findMatching = function(){
        switch(_szCurSwipeDir){
            case "up":{
                this._findMatchingUp();
                break;
            }
            
            case "down":{
                this._findMatchingDown();
                break;
            }
            
            case "left":{
                this._findMatchingLeft();
                break;
            }
            
            case "right":{
                this._findMatchingRight();
                break;
            }
        } 
    };
    
    this._findMatchingUp = function(){
        for(var i=0;i<NUM_COLS;i++){
            var iRow = 0;
            var iBlankCells = 0;
            while(iRow < NUM_ROWS){
                if(_aGridValues[iRow][i] !== CELL_EMPTY){
                    var iType = _aGridValues[iRow][i];
                    //SET MOVING CELL
                    this._createMovingCell(iType,_aGridCells[iRow][i].getPos(),_aGridCells[iRow-iBlankCells][i].getPos(),iRow-iBlankCells,i);
                    _aGridCells[iRow][i].setEmpty();

                    var iNextRow = iRow+1;
                    while(iNextRow < NUM_ROWS){
                        if(_aGridValues[iNextRow][i] !== CELL_EMPTY){
                           
                           if(_aGridValues[iRow][i] === _aGridValues[iNextRow][i]){
                                //SET MOVING CELL
                                this._createMovingCell(iType,_aGridCells[iNextRow][i].getPos(),_aGridCells[iRow-iBlankCells][i].getPos(),iRow-iBlankCells,i);
                                _aGridCells[iNextRow][i].setEmpty();

                                //MATCHING FOUND
                                _aGridValues[iRow][i] += 1;
                                _aGridValues[iNextRow][i] = CELL_EMPTY;
                           }
                           break;
                        }else{
                           iNextRow++;
                        }
                    }

                    iRow++;
                }else{
                    iRow++;
                    iBlankCells++;
                }
            }
        }
    };
    
    this._findMatchingDown = function(){
        for(var i=0;i<NUM_COLS;i++){
            var iRow = NUM_ROWS-1;
            var iBlankCells = 0;
            while(iRow >= 0){
                if(_aGridValues[iRow][i] !== CELL_EMPTY){
                    var iType = _aGridValues[iRow][i];
                    //SET MOVING CELL
                    this._createMovingCell(iType,_aGridCells[iRow][i].getPos(),_aGridCells[iRow+iBlankCells][i].getPos(),iRow+iBlankCells,i);
                    _aGridCells[iRow][i].setEmpty();

                    var iNextRow = iRow-1;
                    while(iNextRow >=0){
                        if(_aGridValues[iNextRow][i] !== CELL_EMPTY){
                            
                           if(_aGridValues[iRow][i] === _aGridValues[iNextRow][i]){
                                //SET MOVING CELL
                                this._createMovingCell(iType,_aGridCells[iNextRow][i].getPos(),_aGridCells[iRow+iBlankCells][i].getPos(),iRow+iBlankCells,i);
                                _aGridCells[iNextRow][i].setEmpty();

                                //MATCHING FOUND
                                _aGridValues[iRow][i] += 1;
                                _aGridValues[iNextRow][i] = CELL_EMPTY;
                           }
                           break;
                        }else{
                           iNextRow--;
                        }
                    }

                    iRow--;
                }else{
                    iRow--;
                    iBlankCells++;
                }
            }
        }
    };
    
    this._findMatchingLeft = function(){
        for(var i=0;i<NUM_ROWS;i++){
            var iCol = 0;
            var iBlankCells = 0;
            while(iCol < NUM_COLS){
                if(_aGridValues[i][iCol] !== CELL_EMPTY){
                    var iType = _aGridValues[i][iCol];
                    //SET MOVING CELL
                    this._createMovingCell(iType,_aGridCells[i][iCol].getPos(),_aGridCells[i][iCol-iBlankCells].getPos(),i,iCol-iBlankCells);
                    _aGridCells[i][iCol].setEmpty();

                    var iNextCol = iCol+1;
                    while(iNextCol < NUM_COLS){
                        if(_aGridValues[i][iNextCol] !== CELL_EMPTY){
                           if(_aGridValues[i][iCol] === _aGridValues[i][iNextCol]){
                                //SET MOVING CELL
                                this._createMovingCell(iType,_aGridCells[i][iNextCol].getPos(),_aGridCells[i][iCol-iBlankCells].getPos(),i,iCol-iBlankCells);
                                _aGridCells[i][iNextCol].setEmpty();

                                //MATCHING FOUND
                                _aGridValues[i][iCol] += 1;
                                _aGridValues[i][iNextCol] = CELL_EMPTY;

                           }
                           break;
                        }else{
                           iNextCol++;
                        }
                    }

                    iCol++;
                }else{
                    iCol++;
                    iBlankCells++;
                }
                
            }
        }
    };
    
    this._findMatchingRight = function(){
        for(var i=0;i<NUM_ROWS;i++){
            var iCol = NUM_COLS-1;
            var iBlankCells = 0;
            while(iCol >= 0){
                if(_aGridValues[i][iCol] !== CELL_EMPTY){
                    var iType = _aGridValues[i][iCol];
                    //SET MOVING CELL
                    this._createMovingCell(iType,_aGridCells[i][iCol].getPos(),_aGridCells[i][iCol+iBlankCells].getPos(),i,iCol+iBlankCells);
                    _aGridCells[i][iCol].setEmpty();

                    var iNextCol = iCol-1;
                    while(iNextCol >= 0){
                        if(_aGridValues[i][iNextCol] !== CELL_EMPTY){
                           if(_aGridValues[i][iCol] === _aGridValues[i][iNextCol]){
                                //SET MOVING CELL
                                this._createMovingCell(iType,_aGridCells[i][iNextCol].getPos(),_aGridCells[i][iCol+iBlankCells].getPos(),i,iCol+iBlankCells);
                                _aGridCells[i][iNextCol].setEmpty();

                                //MATCHING FOUND
                                _aGridValues[i][iCol] += 1;
                                _aGridValues[i][iNextCol] = CELL_EMPTY;

                           }
                           break; 
                        }else{
                           iNextCol--;
                        }
                    }

                    iCol--;
                }else{
                    iCol--;
                    iBlankCells++;
                }
                
            }
        }
    };
    
    this._trimGrid = function(){
        switch(_szCurSwipeDir){
            case "up":{
                    for(var i=0;i<NUM_COLS;i++){
                        var iRow = 0;
                        var iBlankCell = 0;
                        while(iRow <NUM_ROWS){
                            if(_aGridValues[iRow][i] === CELL_EMPTY){
                                iBlankCell++;
                            }else if(iBlankCell >0){
                                _aGridValues[iRow-iBlankCell][i] = _aGridValues[iRow][i];
                                _aGridValues[iRow][i] = CELL_EMPTY; 
                            }
                            iRow++;
                        }
                    }
                    break;
            }
            case "down":{
                    for(var i=0;i<NUM_COLS;i++){
                        var iRow = NUM_ROWS-1;
                        var iBlankCell = 0;
                        while(iRow >=0){
                            if(_aGridValues[iRow][i] === CELL_EMPTY){
                                iBlankCell++;
                            }else if(iBlankCell >0){
                                _aGridValues[iRow+iBlankCell][i] = _aGridValues[iRow][i];
                                _aGridValues[iRow][i] = CELL_EMPTY;
                            }
                            iRow--;
                            
                        }
                    }
                    break;
            }
            case "left":{
                    for(var i=0;i<NUM_ROWS;i++){
                        var iCol = 0;
                        var iBlankCell = 0;
                        while(iCol<NUM_COLS){
                            if(_aGridValues[i][iCol] === CELL_EMPTY){
                                iBlankCell++;
                            }else if(iBlankCell >0){
                                _aGridValues[i][iCol-iBlankCell] = _aGridValues[i][iCol];
                                _aGridValues[i][iCol] = CELL_EMPTY;
                            }
                            iCol++; 
                        }
                    }
                    break;
            }
            case "right":{
                    for(var i=0;i<NUM_ROWS;i++){
                        var iCol = NUM_COLS-1;
                        var iBlankCell = 0;
                        while(iCol >= 0){
                            if(_aGridValues[i][iCol] === CELL_EMPTY){
                                iBlankCell++;
                            }else if(iBlankCell >0){
                                _aGridValues[i][iCol+iBlankCell] = _aGridValues[i][iCol];
                                _aGridValues[i][iCol] = CELL_EMPTY;
                            }
                            iCol--;
                            
                        }
                    }
                    break;
            }
        }
    };

    
    this._createMovingCell = function(iType,pStartPos,pEndPos,iRow,iCol){
        var oMovingCell = new CFakeMovingCell(iType,pStartPos,pEndPos,iRow,iCol,_oContainerMovingGrid);
        _aMovingCells.push(oMovingCell);
    };
    
    this.movingCellArrived = function(iRow,iCol){
        _aGridCells[iRow][iCol].playNewValueAnim(_aGridValues[iRow][iCol]);
        
        _iCounterMovingCell++;
        if(_iCounterMovingCell === _aMovingCells.length){
            //ALL MOVING CELLS ARE ARRIVED
            this._checkWin();

            //this.printGridValues();
        }
    };
    
    this._checkWin = function(){
        var bSkip = false;
        if(_bWin){
            bSkip = true;
        }
        var iCurMaxValue = 2;
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_COLS;j++){
                if(iCurMaxValue < Math.pow(2,_aGridValues[i][j])){
                    iCurMaxValue = Math.pow(2,_aGridValues[i][j]);
                }
                
                if(Math.pow(2,_aGridValues[i][j]) === FINAL_NUMBER){
                    _bEndGame = true;
                    break;
                }else if(!bSkip && Math.pow(2,_aGridValues[i][j]) === GOAL_NUMBER){
                    _bWin = true;
                    break;
                }
            }
        }
        
        if(iCurMaxValue > s_iBestScore){
            s_iBestScore = iCurMaxValue;
            saveItem("best_score",s_iBestScore);
            _oInterface.refreshBestScore();
        }
        
        _iScore = iCurMaxValue;
        _oInterface.refreshScore(_iScore);
        
        if(!bSkip && _bWin){
            _oInterface.showWin(GOAL_NUMBER);
            $(s_oMain).trigger("share_event", _iScore);
            $(s_oMain).trigger("save_score",_iScore);
        }else if(_bEndGame){
            _oInterface.showWin(FINAL_NUMBER);
            $(s_oMain).trigger("share_event", _iScore);
            $(s_oMain).trigger("save_score",_iScore);
        }else{
            this._fillNewCell();
        }
    };
    
    this._gameOver = function(){
        _bDisableEvents = true;
        setVolume("soundtrack", 1);
        
        _oInterface.gameOver(_iScore);
        $(s_oMain).trigger("share_event", _iScore);
        $(s_oMain).trigger("save_score",_iScore);
    };
    
    this.printGridValues = function(){
        var szGrid = "";
        for(var i=0;i<NUM_ROWS;i++){
            var szRow = "";
            for(var j=0;j<NUM_COLS;j++){
                szRow += "|"+_aGridValues[i][j];
            }
            szRow += "|"
            szGrid += szRow+"\n";
        }
        
        trace(szGrid);
    };
    
    this.onExit = function () {
        setVolume("soundtrack", 1);
        
        s_oGame.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
    };
    
    this.update = function () {

    };

    s_oGame = this;
    GOAL_NUMBER = oData.goal_number;
    
    this._init();
}

var s_oGame;