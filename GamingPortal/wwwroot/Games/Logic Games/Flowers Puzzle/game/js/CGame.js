function CGame(oData, iLevel, iScore){
    var _iLevel = iLevel;
    var _iScore = iScore;
    var _iCurPos;
    var _iStartRow;
    var _iStartCol;
    var _iNextX;
    var _iNextY;
    var _iDir = NONE;
    var _iPiecesConnected = 0;
    var _iMatrixDim;
    var _iNumMoves = 0;
    var _iNumFlowers;
    var _iHalfCellWidth;
    var _iHalfCellHeight;
    var _iCellWidth;
    var _iCellHeight;
            
    var _szActualColor;
    
    var _aOrangeLine = new Array();
    var _aGreenLine = new Array();
    var _aYellowLine = new Array();
    var _aRedLine = new Array();
    var _aBlueLine = new Array();
    var _aHeavenlyLine = new Array();
    var _aVioletLine = new Array();
    var _aPinkLine = new Array();
    var _aOrangeYellowkLine = new Array();
    var _aPurpleLine = new Array();
    
    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    
    var _bMoving = false;
    var _bFirstMoveDone = false;
    var _bLevelStarted = false;
    var _bStartMoving = false;
    
    var _aScrollingBg = new Array(2);
    var _aLevelInfo;
    var _aGrid = new Array();
    
    var _oContainerGrid;
    
    this._init = function(){
        
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
        
        $(s_oMain).trigger("start_level",[_iLevel]);
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); //Draws on canvas
        
        _aScrollingBg[0] = new CScrollingBg(s_oSpriteLibrary.getSprite('clouds_back'), 0);
        _aScrollingBg[1] = new CScrollingBg(s_oSpriteLibrary.getSprite('clouds_back'), -SCROLLING_BG_WIDTH);
        
        _iMatrixDim = _aLevelInfo[_iLevel].dim;
        _iNumFlowers = _aLevelInfo[_iLevel].points.length;


        _iCellHeight = _iCellWidth = parseInt(GRID_AREA_SIZE/_iMatrixDim);
        _iHalfCellWidth = _iHalfCellHeight = _iCellHeight/2;

        
        
        _oContainerGrid = new createjs.Container();
        s_oStage.addChild(_oContainerGrid);
        
        var oSourceImage = s_oSpriteLibrary.getSprite("grid_spritesheet");
        
        var oData = {   
                        images: [oSourceImage], 
                        framerate: 35,
                        // width, height & registration point of each sprite
                        frames: {width: CELL_WIDTH, height: CELL_HEIGHT, regX: CELL_WIDTH/2, regY: CELL_HEIGHT/2}, 
                        animations: {orange0:[0], orangeGrowing:[0, 9, "orange1"], orangeDwarfing:{frames:[9, 8, 7, 6, 5, 4, 3, 2, 1, 0], next: "orange0"}, orange1:[9], orange2:[10], orange3:[11], orange4:[12], orange5:[9], 
                                     green0:[13], greenGrowing:[13, 22, "green1"], greenDwarfing:{frames:[22, 21, 20, 19, 18, 17, 16, 15, 14, 13], next: "green0"}, green1:[22], green2:[23], green3:[24], green4:[25], green5:[22], 
                                     yellow0:[26], yellowGrowing:[26, 35, "yellow1"], yellowDwarfing:{frames:[35, 34, 33, 32, 31, 30, 29, 28, 27, 26], next: "yellow0"}, yellow1:[35], yellow2:[36], yellow3:[37], yellow4:[38], yellow5:[35], 
                                     red0:[39], redGrowing:[39, 48, "red1"], redDwarfing:{frames:[48, 47, 46, 45, 44, 43, 42, 41, 40, 39], next: "red0"}, red1:[48], red2:[49], red3:[50], red4:[51], red5:[48], 
                                     blue0:[52], blueGrowing:[52, 61, "blue1"], blueDwarfing:{frames:[61, 60, 59, 58, 57, 56, 55, 54, 53, 52], next: "blue0"}, blue1:[61], blue2:[62], blue3:[63], blue4:[64], blue5:[61], 
                                     heavenly0:[65], heavenlyGrowing:[65, 74, "heavenly1"], heavenlyDwarfing:{frames:[74, 73, 72, 71, 70, 69, 68, 67, 66, 65], next: "heavenly0"}, heavenly1:[74], heavenly2:[75], heavenly3:[76], heavenly4:[77], heavenly5:[74],
                                     violet0:[78], violetGrowing:[78, 87, "violet1"], violetDwarfing:{frames:[87, 86, 84, 83, 82, 81, 80, 79, 78], next: "violet0"}, violet1:[87], violet2:[88], violet3:[89], violet4:[90], violet5:[87],
                                     pink0:[91], pinkGrowing:[91, 100, "pink1"], pinkDwarfing:{frames:[100, 99, 98, 97, 96, 95, 94, 93, 92, 91], next: "pink0"}, pink1:[100], pink2:[101], pink3:[102], pink4:[103], pink5:[100],
                                     orangeyellow0:[104], orangeyellowGrowing:[104, 113, "orangeyellow1"], orangeyellowDwarfing:{frames:[113, 112, 111, 110, 109, 108, 107, 106, 105, 104], next: "orangeyellow0"}, orangeyellow1:[113], orangeyellow2:[114], orangeyellow3:[115], orangeyellow4:[116], orangeyellow5:[113],
                                     purple0:[117], purpleGrowing:[117, 126, "purple1"], purpleDwarfing:{frames:[126, 125, 124, 123, 122, 121, 120, 119, 118, 117], next: "purple0"}, purple1:[126], purple2:[127], purple3:[128], purple4:[129], purple5:[126], hide:[130]}
                    
            };
                    
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        for(var r=0; r<_iMatrixDim; r++){
            _aGrid[r] = new Array();
            for(var c=0; c<_iMatrixDim; c++){
                _aGrid[r][c] = new CCell(oSpriteSheet, r,c, 
                (START_X_GRID + c*_iCellWidth)+_iHalfCellWidth,  
                (START_Y_GRID + r*_iCellHeight)+ _iHalfCellHeight,
                _oContainerGrid, "hide", 
                (GRID_AREA_SIZE/_iMatrixDim) / CELL_WIDTH  );
            }
        }
        
        for(var i=0; i < _iNumFlowers; i++){
            _aGrid[_aLevelInfo[_iLevel].points[i].start_r][_aLevelInfo[_iLevel].points[i].start_c].changeCellState(_aLevelInfo[_iLevel].points[i].color, 0, 0, _iDir, NONE, true );
            _aGrid[_aLevelInfo[_iLevel].points[i].end_r][_aLevelInfo[_iLevel].points[i].end_c].changeCellState(_aLevelInfo[_iLevel].points[i].color, 0, 0, _iDir, NONE, true );
        }
        _bLevelStarted = true;
        
        s_oStage.on("stagemousemove", this.onMouseMove, this);
        
        if(s_bMobile && !s_bIsIphone){
            s_oStage.update();
        }
        
        this.refreshGridScale();
        
        _oInterface = new CInterface(_iLevel, _iNumMoves, _aLevelInfo[_iLevel].maxMoves);
    };
    
    this.refreshGridScale = function(){
        GRID_AREA_SIZE = CANVAS_WIDTH - s_iOffsetX*2;
        START_X_GRID = parseInt( (CANVAS_WIDTH-GRID_AREA_SIZE) / 2 );
        START_Y_GRID = parseInt( (CANVAS_HEIGHT-GRID_AREA_SIZE) / 2 );
        
        _iCellHeight = _iCellWidth = parseInt(GRID_AREA_SIZE/_iMatrixDim);
        _iHalfCellWidth = _iHalfCellHeight = _iCellHeight/2;
        
        for(var r=0; r<_iMatrixDim; r++){
            for(var c=0; c<_iMatrixDim; c++){
                _aGrid[r][c].refreshScale( 
                        (START_X_GRID + c*_iCellWidth)+_iHalfCellWidth, 
                        (START_Y_GRID + r*_iCellHeight)+ _iHalfCellHeight,
                        (GRID_AREA_SIZE/_iMatrixDim) / CELL_WIDTH  );
            }
        }
        
        if(s_bMobile && !s_bIsIphone){
            s_oStage.update();
        }
    };
    
    this.onCellClick = function(event, r, c){
        //TOUCH EVENTS
        if(_bLevelStarted){
        _iStartRow = r;
        _iStartCol = c;
            
            _iCurPos = {x: _aGrid[r][c].getX(), y: _aGrid[r][c].getY() };
            _szActualColor = _aGrid[r][c].getValue();

            if(_aGrid[r][c].getState() === 0 || _aGrid[r][c].getState() === 1 || _aGrid[r][c].getState() === 5){

                this._cancelThisLineColor(_szActualColor);
                switch(_szActualColor){
                    case "orange":
                        _aOrangeLine.push({r: r, c: c});
                        break;
                    case "green":
                        _aGreenLine.push({r: r, c: c});
                        break;
                    case "yellow":
                        _aYellowLine.push({r: r, c: c});
                        break;
                    case "red":
                        _aRedLine.push({r: r, c: c});
                        break;
                    case "blue":
                        _aBlueLine.push({r: r, c: c});
                        break;
                    case "heavenly":
                        _aHeavenlyLine.push({r: r, c: c});
                        break;
                    case "violet":
                        _aVioletLine.push({r: r, c: c});
                        break;
                    case "pink":
                        _aPinkLine.push({r: r, c: c});
                        break;
                    case "orangeyellow":
                        _aOrangeYellowkLine.push({r: r, c: c});
                        break;
                    case "purple":
                        _aPurpleLine.push({r: r, c: c});
                        break;
                }

                _bMoving = true;
            }else if(_aGrid[r][c].getState() === 2 || _aGrid[r][c].getState() === 3 || _aGrid[r][c].getState() === 4){

                var oArrayIndexStart = this.getCellPositionInArray(r, c, _aGrid[r][c].getValue());

                var aAppArray;
                switch(_szActualColor){
                    case "orange":
                        aAppArray = _aOrangeLine;
                        break;
                    case "green":
                        aAppArray = _aGreenLine;
                        break;
                    case "yellow":
                        aAppArray = _aYellowLine;
                        break;
                    case "red":
                        aAppArray = _aRedLine;
                        break;
                    case "blue":
                        aAppArray = _aBlueLine;
                        break;
                    case "heavenly":
                        aAppArray = _aHeavenlyLine;
                        break;
                    case "violet":
                        aAppArray = _aVioletLine;
                        break;
                    case "pink":
                        aAppArray = _aPinkLine;
                        break;
                    case "orangeyellow":
                        aAppArray = _aOrangeYellowkLine;
                        break;
                    case "purple":
                        aAppArray = _aPurpleLine;
                        break;
                }

                if(oArrayIndexStart.arrayDim > oArrayIndexStart.index+1){
                    this._cancelNextLines(oArrayIndexStart.index+1, _aGrid[r][c].getValue(), aAppArray);
                }

                var oLastCell = {r: aAppArray[oArrayIndexStart.index-1].r, c: aAppArray[oArrayIndexStart.index-1].c};
                if(_aGrid[oLastCell.r][oLastCell.c].getState() === 1){
                    _aGrid[r][c].changeCellState(_szActualColor, 2, _aGrid[oLastCell.r][oLastCell.c].getRotation()-180, _aGrid[oLastCell.r][oLastCell.c].getDirection(), _aGrid[oLastCell.r][oLastCell.c].getDirection());
                }else if(_aGrid[oLastCell.r][oLastCell.c].getState() === 4){
                    var iRotation;
                    switch(_aGrid[oLastCell.r][oLastCell.c].getDirectionNoChange()){
                        case UP:
                            iRotation = 90;
                            break;
                        case DOWN:
                            iRotation = -90;
                            break;
                        case LEFT:
                            iRotation = 0;
                            break;
                        case RIGHT:
                            iRotation = 180;
                            break;
                    }
                    _aGrid[r][c].changeCellState(_szActualColor, 2, iRotation, _aGrid[oLastCell.r][oLastCell.c].getDirectionNoChange(), _aGrid[oLastCell.r][oLastCell.c].getDirectionNoChange());
                }else{
                    _aGrid[r][c].changeCellState(_szActualColor, 2, _aGrid[oLastCell.r][oLastCell.c].getRotation(), _aGrid[oLastCell.r][oLastCell.c].getDirection(), _aGrid[oLastCell.r][oLastCell.c].getDirection());
                }
                _bMoving = true; 
            }
            
            if(s_bMobile && !s_bIsIphone){
                s_oStage.update();
            }
        }
    };
    
    this.onMouseMove = function(event){
        if(!_bMoving){
            return;
        }

        _iNextX = s_oStage.mouseX;
        _iNextY = s_oStage.mouseY;

        _bStartMoving = true;
    };
    
    this.releaseForm = function(event){
        _bMoving = false;
        _bFirstMoveDone = false;
        _bStartMoving = false;
        
        if(s_bMobile && !s_bIsIphone){
            s_oStage.update();
        }
    };
    
    this.getCellPositionInArray = function(r, c, szColor){
        switch(szColor){
            case "orange":
                for(var i=0; i< _aOrangeLine.length; i++){
                    if(_aOrangeLine[i].r === r && _aOrangeLine[i].c === c){
                        return {index: i, arrayDim:_aOrangeLine.length};
                    }
                }
                break;
            case "green":
                for(var i=0; i< _aGreenLine.length; i++){
                    if(_aGreenLine[i].r === r && _aGreenLine[i].c === c){
                        return {index: i, arrayDim:_aGreenLine.length};
                    }
                }
                break;
            case "yellow":
                for(var i=0; i< _aYellowLine.length; i++){
                    if(_aYellowLine[i].r === r && _aYellowLine[i].c === c){
                        return {index: i, arrayDim:_aYellowLine.length};
                    }
                }
                break;
            case "red":
                for(var i=0; i< _aRedLine.length; i++){
                    if(_aRedLine[i].r === r && _aRedLine[i].c === c){
                        return {index: i, arrayDim:_aRedLine.length};
                    }
                }
                break;
            case "blue":
                for(var i=0; i< _aBlueLine.length; i++){
                    if(_aBlueLine[i].r === r && _aBlueLine[i].c === c){
                        return {index: i, arrayDim:_aBlueLine.length};
                    }
                }
                break;
            case "heavenly":
                for(var i=0; i< _aHeavenlyLine.length; i++){
                    if(_aHeavenlyLine[i].r === r && _aHeavenlyLine[i].c === c){
                        return {index: i, arrayDim:_aHeavenlyLine.length};
                    }
                }
                break;
            case "violet":
                for(var i=0; i< _aVioletLine.length; i++){
                    if(_aVioletLine[i].r === r && _aVioletLine[i].c === c){
                        return {index: i, arrayDim:_aVioletLine.length};
                    }
                }
                break;
            case "pink":
                for(var i=0; i< _aPinkLine.length; i++){
                    if(_aPinkLine[i].r === r && _aPinkLine[i].c === c){
                        return {index: i, arrayDim:_aPinkLine.length};
                    }
                }
                break;
            case "orangeyellow":
                for(var i=0; i< _aOrangeYellowkLine.length; i++){
                    if(_aOrangeYellowkLine[i].r === r && _aOrangeYellowkLine[i].c === c){
                        return {index: i, arrayDim:_aOrangeYellowkLine.length};
                    }
                }
                break;
            case "purple":
                for(var i=0; i< _aPurpleLine.length; i++){
                    if(_aPurpleLine[i].r === r && _aPurpleLine[i].c === c){
                        return {index: i, arrayDim:_aPurpleLine.length};
                    }
                }
                break;
        }
    };
    
    this.updateColorArray = function(szColor, iRow, iCol ){
        switch(szColor){
            case "orange":
                _aOrangeLine.push({r: iRow, c: iCol});
                break;
            case "green":
                _aGreenLine.push({r: iRow, c: iCol});
                break;
            case "yellow":
                _aYellowLine.push({r: iRow, c: iCol});
                break;
            case "red":
                _aRedLine.push({r: iRow, c: iCol});
                break;
            case "blue":
                _aBlueLine.push({r: iRow, c: iCol});
                break;
            case "heavenly":
                _aHeavenlyLine.push({r: iRow, c: iCol});
                break;
            case "violet":
                _aVioletLine.push({r: iRow, c: iCol});
                break;
            case "pink":
                _aPinkLine.push({r: iRow, c: iCol});
                break;
            case "orangeyellow":
                _aOrangeYellowkLine.push({r: iRow, c: iCol});
                break;
            case "purple":
                _aPurpleLine.push({r: iRow, c: iCol});
                break;
        }
    };
                                
    this._cancelNextLines = function(iStart, szColor, aArray){
        aArray.length;

        for(var i=iStart; i< aArray.length; i++){
            if(_aGrid[aArray[i].r][aArray[i].c].getState() === 5){
                _aGrid[aArray[i].r][aArray[i].c].flowerDwarfing(0, 0, NONE, NONE);
                _iPiecesConnected--;
            }else if(_aGrid[aArray[i].r][aArray[i].c].getState() > 0){
                _aGrid[aArray[i].r][aArray[i].c].changeCellState("hide", null, 0, NONE, NONE, true);
            }
        }

        if(iStart === aArray.length){
            aArray.pop();
        }else{
            aArray.splice(iStart, (aArray.length-iStart));
        }
        
        if(aArray.length === 1){
            this._cancelThisLineColor(szColor);
        }
    };
    
    this.checkIfLevelCompleted = function(){
        for(var i=0; i<_iMatrixDim; i++){
            for(var j=0; j<_iMatrixDim; j++){
                if(_aGrid[i][j].getValue() === "hide"){
                    return false;
                }
            }
        }
        return true;
    };
    
    this._cancelThisLineColor = function(szColor){
        switch(szColor){
            case "orange":
                _aOrangeLine = [];
                break;
            case "green":
                _aGreenLine = [];
                break;
            case "yellow":
                _aYellowLine = [];
                break;
            case "red":
                _aRedLine = [];
                break;
            case "blue":
                _aBlueLine = [];
                break;
            case "heavenly":
                _aHeavenlyLine = [];
                break;
            case "violet":
                _aVioletLine = [];
                break;
            case "pink":
                _aPinkLine = [];
                break;
            case "orangeyellow":
                _aOrangeYellowkLine = [];
                break;
            case "purple":
                _aPurpleLine = [];
                break;
        }
        for(var i=0; i<_iMatrixDim; i++){
            for(var j=0; j<_iMatrixDim; j++){
                if(_aGrid[i][j].getValue() === szColor && _aGrid[i][j].getState() === 5){
                    _aGrid[i][j].flowerDwarfing(0, 0, NONE, NONE);
                    _iPiecesConnected--;
                }else if(_aGrid[i][j].getValue() === szColor && _aGrid[i][j].getState() > 1){
                    _aGrid[i][j].changeCellState("hide", null, 0, NONE, false);
                }else if(_aGrid[i][j].getValue() === szColor && _aGrid[i][j].getState() === 1){
                    
                    playSound("flower_closed", 1, false);

                    _aGrid[i][j].flowerDwarfing(0, 0, NONE, NONE);
                }
            }
        }
    };
    
    this.checkIfNextIsGoal = function(r, c){
        if(this._checkIfNotOccupied(r, c) === false){
            if(_aGrid[_iStartRow][_iStartCol].getValue() === _aGrid[r][c].getValue() && _aGrid[r][c].getState() === 0){
                return true;
            }
        }
        return false;
    };
    
    this._checkIfNear = function(iOldRow, iOldCol, iNewRow, iNewCol){
        
        if(iOldRow < iNewRow && iOldCol === iNewCol){           //down
            _iDir = DOWN;
            return {r:1, c:0};
        }else if(iOldRow > iNewRow && iOldCol === iNewCol){     //up
            _iDir = UP;
            return {r:-1, c:0};
        }else if(iOldRow === iNewRow && iOldCol > iNewCol){     //left
            _iDir = LEFT;
            return {r:0, c:-1};
        }else if(iOldRow === iNewRow && iOldCol < iNewCol){     //right
            _iDir = RIGHT;
            return {r:0, c:1};
        }
        return null;
    };
    
    this.checkIfThereIsAnotherLineNear = function(r, c){
        
        if(c > 0){
            if(_aGrid[r][c-1].getValue() === _szActualColor && _aGrid[r][c-1].getState() !== 5){     //left
                return LEFT;
            }
        }
        if(r > 0){
            if(_aGrid[r-1][c].getValue() === _szActualColor && _aGrid[r-1][c].getState() !== 5){     //up
                return UP;
            }
        }
        if(r < _iMatrixDim-1){
            if(_aGrid[r+1][c].getValue() === _szActualColor && _aGrid[r+1][c].getState() !== 5){    //down
                return DOWN;
            }
        }
        if(c < _iMatrixDim-1){
            if(_aGrid[r][c+1].getValue() === _szActualColor && _aGrid[r][c+1].getState() !== 5){     //right
                return RIGHT;
            }
        }
        return null;
    };
    
    this._checkIfNotOccupied = function(r, c){
        if(_aGrid[r][c].getValue() === "hide"){
            if((_iStartRow >= r-1 && _iStartRow <= r+1) && (_iStartCol >= c-1 && _iStartCol <= c+1))
            return true;
        }
        return false;
        
    };
    
    this._getTypeSprite = function(iNewDir, iOldDir){
        var oType = {typeOld: NONE, typeNew: NONE, rotationOld: 0, rotationNew: 0, changeSprite: false};
        switch(iOldDir){
            case DOWN:                 
                switch(iNewDir){
                    case LEFT:
                        oType.rotationOld = 90;
                        oType.typeOld = 4;
                        oType.rotationNew = 0;
                        oType.typeNew = 2;
                        break;
                    case RIGHT:
                        oType.rotationOld = 180;
                        oType.typeOld = 4;
                        oType.rotationNew = 180;
                        oType.typeNew = 2;
                        break;
                    case DOWN:
                        oType.rotationOld = 270;
                        oType.typeOld = 3;
                        oType.rotationNew = -90;
                        oType.typeNew = 2;
                        break;
                    case UP:
                        oType.rotationOld = 90;
                        oType.typeOld = 3;
                        oType.rotationNew = -90;
                        oType.typeNew = 2;
                        break;
                    case NONE:
                        oType.rotationOld = 0;
                        oType.typeOld = 1;
                        oType.rotationNew = 180;
                        oType.typeNew = 2;
                        break;
                }
                break;
            case UP:                        
                switch(iNewDir){
                    case LEFT:
                        oType.rotationOld = 0;
                        oType.typeOld = 4;
                        oType.rotationNew = 0;
                        oType.typeNew = 2;
                        break;
                    case RIGHT:
                        oType.rotationOld = 270;
                        oType.typeOld = 4;
                        oType.rotationNew = 180;
                        oType.typeNew = 2;
                        break;
                    case UP:
                        oType.rotationOld = 90;
                        oType.typeOld = 3;
                        oType.rotationNew = 90;
                        oType.typeNew = 2;
                        break;
                    case DOWN:
                        oType.rotationOld = 270;
                        oType.typeOld = 3;
                        oType.rotationNew = -90;
                        oType.typeNew = 2;
                        break;
                    case NONE:
                        oType.rotationOld = 0;
                        oType.typeOld = 1;
                        oType.rotationNew = 180;
                        oType.typeNew = 2;
                        break;
                }         
                break;
            case LEFT:                
                switch(iNewDir){
                    case UP:
                        oType.rotationOld = 180;
                        oType.typeOld = 4;
                        oType.rotationNew = 90;
                        oType.typeNew = 2;
                        break;
                    case DOWN:
                        oType.rotationOld = 270;
                        oType.typeOld = 4;
                        oType.rotationNew = -90;
                        oType.typeNew = 2;
                        break;
                    case LEFT:
                        oType.rotationOld = 0;
                        oType.typeOld = 3;
                        oType.rotationNew = 0;
                        oType.typeNew = 2;
                        break;
                    case RIGHT:
                        oType.rotationOld = 180;
                        oType.typeOld = 3;
                        oType.rotationNew = 0;
                        oType.typeNew = 2;
                        break;
                    case NONE:
                        oType.rotationOld = 90;
                        oType.typeOld = 1;
                        oType.rotationNew = -90;
                        oType.typeNew = 2;
                        break;
                }
                break;
            case RIGHT:                
                switch(iNewDir){
                    case DOWN:
                        oType.rotationOld = 0;
                        oType.typeOld = 4;
                        oType.rotationNew = -90;
                        oType.typeNew = 2;
                        break;
                    case UP:
                        oType.rotationOld = 90;
                        oType.typeOld = 4;
                        oType.rotationNew = 90;
                        oType.typeNew = 2;
                        break;
                    case RIGHT:
                        oType.rotationOld = 180;
                        oType.typeOld = 3;
                        oType.rotationNew = 180;
                        oType.typeNew = 2;
                        break;
                    case LEFT:
                        oType.rotationOld = 0;
                        oType.typeOld = 3;
                        oType.rotationNew = 0;
                        oType.typeNew = 2;
                        break;
                    case NONE:
                        oType.rotationOld = 90;
                        oType.typeOld = 1;
                        oType.rotationNew = -90;
                        oType.typeNew = 2;
                        break;
                }
                break;
            case NONE:
                switch(iNewDir){
                    case LEFT:
                        oType.rotationOld = 180;
                        oType.typeOld = 1;
                        oType.rotationNew = 0;
                        oType.typeNew = 2;
                        break;
                    case RIGHT:
                        oType.rotationOld = 0;
                        oType.typeOld = 1;
                        oType.rotationNew = 180;
                        oType.typeNew = 2;
                        break;
                    case DOWN:
                        oType.rotationOld = 90;
                        oType.typeOld = 1;
                        oType.rotationNew = -90;
                        oType.typeNew = 2;
                        break;
                    case UP:
                        oType.rotationOld = -90;
                        oType.typeOld = 1;
                        oType.rotationNew = 90;
                        oType.typeNew = 2;
                        break;
                }
                break;
        }
        return oType;
    };
    
    this.unload = function(){
        _oInterface.unload();
        
        
        for(var i=0; i<_iMatrixDim; i++){
            for(var j=0; j<_iMatrixDim; j++){
                _aGrid[i][j].unload();
            }
        }
        
        _aGrid = [];
        _aOrangeLine = [];
        _aGreenLine = [];
        _aYellowLine = [];
        _aRedLine = [];
        _aBlueLine = [];
        _aHeavenlyLine = [];
        _aVioletLine = [];
        _aPinkLine = [];
        _aOrangeYellowkLine = [];
        _aPurpleLine = [];
        
        s_oStage.removeAllEventListeners();
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren(); 
    };
 
    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("restart");
    };
    
    this.onRestart = function(){
        $(s_oMain).trigger("restart_level", _iLevel);
        $(s_oMain).trigger("show_interlevel_ad");
        this._cancelThisLineColor("orange");
        this._cancelThisLineColor("green");
        this._cancelThisLineColor("yellow");
        this._cancelThisLineColor("red");
        this._cancelThisLineColor("blue");
        this._cancelThisLineColor("heavenly");
        this._cancelThisLineColor("violet");
        this._cancelThisLineColor("pink");
        this._cancelThisLineColor("orangeyellow");
        this._cancelThisLineColor("purple");
        

        _iScore = 0;
        _iNumMoves = 0;
        _oInterface.refreshScore(_iNumMoves, _aLevelInfo[_iLevel].maxMoves);
        
        _bLevelStarted = true;

        s_oStage.update();
    };
    
    this.endPanel = function(){   
        var iNextLevel = _iLevel+1;
        
        _bLevelStarted = false;
        
        if(_iScore > s_aScore[s_iLastLevel-1] ){
            s_aScore[s_iLastLevel-1] = _iScore;
        }

        if(iNextLevel < _aLevelInfo.length){
            if(s_bMobile && !s_bIsIphone){
                setTimeout(function(){
                    _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'), iNextLevel-1, _iScore);
                    if(s_iLastLevel < iNextLevel+1){
                        s_iLastLevel = iNextLevel+1;
                    }
                    _oEndPanel.nextLevel();
                },500); 
            }else{
                _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'), iNextLevel-1, _iScore);
                if(s_iLastLevel < iNextLevel+1){
                    s_iLastLevel = iNextLevel+1;
                }
                _oEndPanel.nextLevel();
            }
            
        }else{
            if(s_bMobile && !s_bIsIphone){
                setTimeout(function(){
                    _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('bg_win'), iNextLevel-1, _iScore);
                    _oEndPanel.lastLevelCompleted();
                },500); 
            }else{
                _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('bg_win'), iNextLevel-1, _iScore);
            _oEndPanel.lastLevelCompleted();
            }
        }
        
        s_oLocalStorage.saveData();
        
    };
    
    this.nextLevel = function(){
        _iLevel++;
        this.unload();
        s_oMain.gotoGame(_iLevel, 0);
    };
    
    this.update = function(){
        if(!s_bMobile || s_bIsIphone){
            _aScrollingBg[0].move();
            _aScrollingBg[1].move();
        }
        
        if(_bStartMoving){
            
            var iRow = _iStartRow;
            var iCol = _iStartCol;
            var iOldDir = _aGrid[iRow][iCol].getDirectionNoChange();

            if((_iNextX > START_X_GRID && _iNextX <= START_X_GRID+GRID_AREA_SIZE ) &&    //check X
               (_iNextY > START_Y_GRID && _iNextY <= START_Y_GRID+GRID_AREA_SIZE )){     //check Y
                   
                var r = Math.floor((_iNextY-START_Y_GRID)/_iCellWidth);
                var c = Math.floor((_iNextX-START_X_GRID)/_iCellHeight); 
                
                if(!((r !== iRow && r >= 0) || (c !== iCol && c >= 0)) ){
                    return;
                }
                
                var oDirection = this._checkIfNear(iRow, iCol, r, c);
                
                var szColor = _aGrid[r][c].getValue();
                if(oDirection !== null){
                    if(this._checkIfNotOccupied(r, c)){
                        if(this.checkIfThereIsAnotherLineNear(r, c) !== null){
                            var oType = this._getTypeSprite(_iDir, iOldDir);

                            if(!_bFirstMoveDone){
                                if(!s_bMobile || s_bIsIphone){
                                    playSound("particle", 1, false);
                                }
                                _bFirstMoveDone = true;
                            }
                            if(oType.typeOld === 1){
                                _aGrid[iRow][iCol].flowerGrow(oType.typeOld, oType.rotationOld, _iDir, _iDir);

                            }else{
                                _aGrid[iRow][iCol].changeCellState(_szActualColor, oType.typeOld, oType.rotationOld, _iDir, _iDir, false );
                            }
                            iRow += oDirection.r;
                            iCol += oDirection.c;
                            _aGrid[iRow][iCol].changeCellState(_szActualColor, oType.typeNew, oType.rotationNew, _iDir, _iDir, true );
                            _iStartRow += oDirection.r;
                            _iStartCol += oDirection.c;
                            this.updateColorArray(_szActualColor, iRow, iCol );
                            if(_iNumMoves < _aLevelInfo[_iLevel].maxMoves - _iNumFlowers){
                                _iScore+=SCORE_TO_ADD;
                            }else{
                                _iScore-=SCORE_TO_SUBTRACT;
                            }
                            _iNumMoves++;
                            _oInterface.refreshScore(_iNumMoves, _aLevelInfo[_iLevel].maxMoves);
                        }
                    }else if(this.checkIfNextIsGoal(r, c)){
                        if(this.checkIfThereIsAnotherLineNear(r, c) !== null){
                            var oType = this._getTypeSprite(_iDir, iOldDir);
                            _aGrid[iRow][iCol].changeCellState(_szActualColor, oType.typeOld, oType.rotationOld, _iDir, _iDir, false );
                            iRow += oDirection.r;
                            iCol += oDirection.c;
                            _aGrid[iRow][iCol].flowerGrow(5, oType.rotationNew, _iDir, _iDir);
                            playSound("flower_open", 1, false);

                            this.updateColorArray(_szActualColor, iRow, iCol );

                            _bMoving = false;
                            _iPiecesConnected++;
                            
                            if(_iNumMoves < _aLevelInfo[_iLevel].maxMoves - _iNumFlowers){
                                _iScore+=SCORE_TO_ADD;
                            }else{
                                _iScore-=SCORE_TO_SUBTRACT;
                            }
                            _iNumMoves++;
                            _oInterface.refreshScore(_iNumMoves, _aLevelInfo[_iLevel].maxMoves);
                            if(_iPiecesConnected === _iNumFlowers && this.checkIfLevelCompleted()){
                                this.endPanel();
                            }else if(_iPiecesConnected === _iNumFlowers && !this.checkIfLevelCompleted()){
                                /*
                                _oTextErrorStroke =  new createjs.Text(TEXT_FILL_CELLS," 50px "+FONT, "#730358");
                                _oTextErrorStroke.x = CANVAS_WIDTH/2;
                                _oTextErrorStroke.y = -100;
                                _oTextErrorStroke.textAlign = "center";
                                _oTextErrorStroke.textBaseline = "alphabetic";
                                _oTextErrorStroke.lineWidth = 500;
                                _oTextErrorStroke.outline = 4;
                                s_oStage.addChild(_oTextErrorStroke);

                                _oTextError =  new createjs.Text(TEXT_FILL_CELLS," 50px "+FONT, "#ffffff");
                                _oTextError.x = CANVAS_WIDTH/2;
                                _oTextError.y = -100;
                                _oTextError.textAlign = "center";
                                _oTextError.textBaseline = "alphabetic";
                                _oTextError.lineWidth = 500;
                                s_oStage.addChild(_oTextError);
                                 * 
                                 */
                                
                                var iSize = 50;    
                                var iWidth = 500;
                                var iHeight = 120;
                                var iX = CANVAS_WIDTH/2;
                                var iY = -100;
                                var oTextErrorStroke = new CTLText(s_oStage, 
                                            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                                            iSize, "center", "#730358", FONT, 1.1,
                                            2, 2,
                                            TEXT_FILL_CELLS,
                                            true, true, true,
                                            false );
                                oTextErrorStroke.setOutline(4);            

                                var oTextError = new CTLText(s_oStage, 
                                            iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                                            iSize, "center", "#fff", FONT, 1.1,
                                            2, 2,
                                            TEXT_FILL_CELLS,
                                            true, true, true,
                                            false ); 
                                
                                createjs.Tween.get(oTextErrorStroke.getText()).to({y: CANVAS_HEIGHT/2 }, 1000, createjs.Ease.bounceOut).wait(500).call(function() {
                                    createjs.Tween.get(oTextErrorStroke.getText()).to({y: -100 }, 1000, createjs.Ease.backIn ).wait(500).call(function() {
                                        s_oStage.removeChild(oTextErrorStroke.getText());
                                    });
                                });
                                createjs.Tween.get(oTextError.getText()).to({y: CANVAS_HEIGHT/2 }, 1000,  createjs.Ease.bounceOut).wait(500).call(function() {
                                    createjs.Tween.get(oTextError.getText()).to({y: -100 }, 1000,  createjs.Ease.backIn ).wait(500).call(function() {
                                        s_oStage.removeChild(oTextError.getText());
                                    });
                                });
                            }
                        }
                    //if next cell is occupied by another color
                    }else if(_aGrid[r][c].getState() > 1 &&  _aGrid[r][c].getState() < 5 && szColor !== _szActualColor){
                        if(this.checkIfThereIsAnotherLineNear(r, c) !== null){
                            var iArrayIndexStart = this.getCellPositionInArray(r, c, szColor);
                            if(iArrayIndexStart){
                                switch(szColor){
                                    case "orange":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aOrangeLine);
                                        break;
                                    case "green":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aGreenLine);
                                        break;
                                    case "yellow":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aYellowLine);
                                        break;
                                    case "red":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aRedLine);
                                        break;
                                    case "blue":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aBlueLine);
                                        break;
                                    case "heavenly":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aHeavenlyLine);
                                        break;
                                    case "violet":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aVioletLine);
                                        break;
                                    case "pink":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aPinkLine);
                                        break;
                                    case "orangeyellow":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aOrangeYellowkLine);
                                        break;
                                    case "purple":
                                        this._cancelNextLines(iArrayIndexStart.index, szColor, _aPurpleLine);
                                        break;
                                }

                                var oType = this._getTypeSprite(_iDir, iOldDir);
                                if(oType.typeOld === 1){
                                    playSound("flower_open", 1, false);
                                }
                                _aGrid[iRow][iCol].changeCellState(_szActualColor, oType.typeOld, oType.rotationOld, _iDir, _iDir, false );
                                iRow += oDirection.r;
                                iCol += oDirection.c;
                                _aGrid[iRow][iCol].changeCellState(_szActualColor, oType.typeNew, oType.rotationNew, _iDir, _iDir, true );
                                _iStartRow += oDirection.r;
                                _iStartCol += oDirection.c;
                                this.updateColorArray(_szActualColor, iRow, iCol );
                            }
                            if(_iNumMoves < _aLevelInfo[_iLevel].maxMoves - _iNumFlowers){
                                _iScore+=SCORE_TO_ADD;
                            }else{
                                _iScore-=SCORE_TO_SUBTRACT;
                            }
                            _iNumMoves++;
                            _oInterface.refreshScore(_iNumMoves, _aLevelInfo[_iLevel].maxMoves);
                        }
                    }
                }
            }
            if(s_bMobile && !s_bIsIphone){
                s_oStage.update();
            }
        }
    };

    s_oGame=this;
    
    _aLevelInfo = s_aLevelsData;
    
    SCORE_TO_ADD = oData.score_to_add;
    SCORE_TO_SUBTRACT = oData.score_to_subtract;
    
    _oParent=this;
    this._init();
}

var s_oGame;
