function CGame(oData){
    var _bTouchActive;
    var _bStartGame;
    var _bDirection;
    var _bShuffling;
    
    var _aPiece;
    var _aGridPos;
    var _aGridLogic;
    var _aNeighborList;
 
    var _iWidth;
    var _iHeight;
    var _iNumCut;
    var _iNumPieces;
    var _iCellMoved;
    var _iNumShuffle;
    var _iTimeElaps;
    var _iCurCell;

    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _oImageContainer;
    
    var _oBlock;
    var _oLogo;
    var _oSourceImage;
    
    
    this._init = function(){
        
        _bTouchActive=false;
        _bStartGame=false;
        _bDirection = true;
        
        _iNumShuffle = NUM_SHUFFLE[s_iMode];
        _iNumCut = s_iMode +3;
        _iNumPieces = _iNumCut * _iNumCut;
        _iTimeElaps = 0;
        _iCurCell = null;
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); //Draws on canvas

        _aGridLogic = new Array();
        for(var i=0; i<_iNumCut; i++){
            _aGridLogic[i] = new Array();
            for(var j=0; j<_iNumCut; j++){
                _aGridLogic[i][j] = null;
            }            
        }   

        _oSourceImage = s_oSpriteLibrary.getSprite(s_szImage);
        _iWidth = _oSourceImage.width;
        _iHeight = _oSourceImage.height;

        _aGridPos = new Array();
        var _iOffsetX = _iWidth/_iNumCut;
        var _iOffsetY = _iHeight/_iNumCut;
        var oStartPos = {x: _iOffsetX/2, y: _iOffsetY/2};
        
        var iLineSize = 3;    
        for(var i=0; i<_iNumCut; i++){
            _aGridPos[i] = new Array();
            for(var j=0; j<_iNumCut; j++){
                
                _aGridPos[i][j] = {x: oStartPos.x + j*(_iOffsetX+iLineSize), y: oStartPos.y + i*(_iOffsetY+iLineSize)};
                
            }
        }
        
        var iLineOffset = (_iNumCut-1)*iLineSize;
        _oImageContainer = new createjs.Container();
        _oImageContainer.x = CANVAS_WIDTH/2 - 110;
        _oImageContainer.y = CANVAS_HEIGHT/2;
        _oImageContainer.regX = _iWidth/2 + iLineOffset/2;
        _oImageContainer.regY = _iHeight/2 + iLineOffset/2;
        s_oStage.addChild(_oImageContainer);
        
        this._initPieces();

        var oSprite = s_oSpriteLibrary.getSprite("logo");
        _oLogo = createBitmap(oSprite);
        _oLogo.x = 250;
        _oLogo.y = 150;
        _oLogo.regX = oSprite.width/2;
        _oLogo.regY = oSprite.height/2;        
        s_oStage.addChild(_oLogo);

        _oInterface = new CInterface();         
    
        _oBlock = new createjs.Shape();
        _oBlock.graphics.beginFill("rgba(158,158,158,0.01)").drawRect(0, 0, _iWidth +iLineOffset, _iHeight+iLineOffset);
        _oBlock.on("click", function(){});
        _oImageContainer.addChild(_oBlock);
    
        this._shufflePieces();

        var hammer = new Hammer(s_oCanvas);
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        hammer.get('swipe').set({ velocity: 0.005});
        hammer.get('swipe').set({ threshold: 0.1 });


        hammer.on("swipeleft",function(){_oParent._swipeControl("left");});
        hammer.on("swiperight",function(){_oParent._swipeControl("right");});
        hammer.on("swipeup",function(){_oParent._swipeControl("up");});
        hammer.on("swipedown",function(){_oParent._swipeControl("down");});

    };
    
    this._swipeControl = function(szType){
        
        if(_iCurCell === null){
            return;
        }

        var iRow = _aPiece[_iCurCell].getLogicPos().row;
        var iCol = _aPiece[_iCurCell].getLogicPos().col;
        var iSwapCell;
        
        switch(szType) {
            case "left":{   
                    if(iCol === 0){
                       return;
                    }
                    iSwapCell = _aGridLogic[iRow][iCol-1];
                   
                
                break;
            }
            case "right":{                    
                    if(iCol === _iNumCut-1){
                       return;
                    }
                    iSwapCell = _aGridLogic[iRow][iCol+1];
                
                break;
            }
            case "up":{
                    if(iRow === 0){
                       return;
                    }
                    iSwapCell = _aGridLogic[iRow-1][iCol];
                
                break;
            }
            case "down":{
                    if(iRow === _iNumCut-1){
                       return;
                    }
                    iSwapCell = _aGridLogic[iRow+1][iCol];                    
                
                break;
            }
        }    
        
        _aPiece[_iCurCell].setTargetVisible(false);        
        _oParent._movePieces(_iCurCell, iSwapCell);
        _iCurCell = null;
        
    };
    
    this._initPieces = function(){
    
        var iX;
        var iY;
        var iRow = 0;
        var iCol = 0;
    
        _aPiece = new Array();
        for(var i=0; i<_iNumPieces; i++){
            iX = _aGridPos[iRow][iCol].x;
            iY = _aGridPos[iRow][iCol].y;
            _aPiece[i] = new CPiece(iX, iY, i, _oImageContainer, iRow, iCol);
            _aPiece[i].getIndex();
            
            _aGridLogic[iRow][iCol] = i;
            
            iCol++;
            if(iCol===_iNumCut){
                iCol = 0;
                iRow++;
            }                   
        }

        _bShuffling = true;
    };
    
    this._shufflePieces = function(){
        _iNumShuffle--;
        
        if(_iNumShuffle < 0){
            _oInterface.setButVisible(true);
            _bShuffling = false;
            _oBlock.visible = false;
            _bStartGame = true;
            return;
        }
        
        var iRandomPiece = Math.floor(Math.random()*_iNumPieces);
        var iRow = _aPiece[iRandomPiece].getLogicPos().row;
        var iCol = _aPiece[iRandomPiece].getLogicPos().col;
        
        this._updateNeighborList(iRow, iCol);
        
        var iRandomPieceToSwap = _aNeighborList[Math.floor(Math.random()*_aNeighborList.length)];
        
        this._movePieces(iRandomPiece, iRandomPieceToSwap);

    };
    
    this._movePieces = function(iPiece, iPieceToSwap){
        _oBlock.visible = true;
        playSound("swoosh",1,false);
        
        var iPieceX = _aPiece[iPiece].getPos().x;
        var iPieceY = _aPiece[iPiece].getPos().y;
        var iPieceRow = _aPiece[iPiece].getLogicPos().row;
        var iPieceCol = _aPiece[iPiece].getLogicPos().col;
        
        var iSwapPieceX = _aPiece[iPieceToSwap].getPos().x;
        var iSwapPieceY = _aPiece[iPieceToSwap].getPos().y;
        var iSwapPieceRow = _aPiece[iPieceToSwap].getLogicPos().row;
        var iSwapPieceCol = _aPiece[iPieceToSwap].getLogicPos().col;
        
        _iCellMoved = 2;
        
        _aPiece[iPiece].move(iSwapPieceX, iSwapPieceY);
        _aPiece[iPiece].setLogicPos(iSwapPieceRow, iSwapPieceCol);
        
        _aPiece[iPieceToSwap].move(iPieceX, iPieceY);
        _aPiece[iPieceToSwap].setLogicPos(iPieceRow, iPieceCol);
        
        this._updateLogicGrid();
        
    };
    
    this._updateNeighborList = function(iRow, iCol){        
        _aNeighborList = new Array();
        
        if(iRow-1 >= 0){
            _aNeighborList.push(_aGridLogic[iRow-1][iCol]);
        }
        if(iRow+1 < _iNumCut){
            _aNeighborList.push(_aGridLogic[iRow+1][iCol]);
        }
        if(iCol-1 >= 0){
            _aNeighborList.push(_aGridLogic[iRow][iCol-1]);
        }
        if(iCol+1 < _iNumCut){
            _aNeighborList.push(_aGridLogic[iRow][iCol+1]);
        }
    };
    
    this._isInNeighbor = function(iIndex){
        var bFlag = false;
        for(var i=0; i<_aNeighborList.length; i++){
            if(_aNeighborList[i] === iIndex){
                bFlag = true;
                break;
            }
        }
        
        return bFlag;
    };
    
    this._updateLogicGrid = function(){
        var iRow;
        var iCol; 
        for(var i=0; i<_iNumPieces; i++){
            iRow = _aPiece[i].getLogicPos().row;
            iCol = _aPiece[i].getLogicPos().col; 
            _aGridLogic[iRow][iCol] = _aPiece[i].getIndex();
        }

    };
    
    this.onCellMoved = function(){
        _iCellMoved--;

        if(_iCellMoved === 0 && _bShuffling){
            this._shufflePieces();
        } else if(_iCellMoved === 0 && !_bShuffling){
            this._updateLogicGrid();
            this._checkWin();
            _oBlock.visible = false;
        }
    };
        
    this.onPieceClick = function(iIndex){

        if(_iCurCell === null){
            _iCurCell = iIndex;
            _aPiece[_iCurCell].setTargetVisible(true);
            
        } else if(_iCurCell !== null && this._isInNeighbor(iIndex)){
            //SWAP
            this._movePieces(_iCurCell, iIndex);
            _aPiece[_iCurCell].setTargetVisible(false);
            _iCurCell = null;
            return;

        } else if(_iCurCell !== iIndex && !this._isInNeighbor(iIndex)){
           
            _aPiece[_iCurCell].setTargetVisible(false);
            _iCurCell = iIndex;
            _aPiece[iIndex].setTargetVisible(true);
            
        }
        
        this._updateNeighborList(_aPiece[_iCurCell].getLogicPos().row, _aPiece[_iCurCell].getLogicPos().col);
        
    };    
    
    this._checkWin = function(){
        
        var iWinCounter = 0;
        for(var iRow=0; iRow<_iNumCut; iRow++){
            for(var iCol=0; iCol<_iNumCut; iCol++){
                if(_aGridLogic[iRow][iCol] !== iWinCounter){
                    return;
                }
                iWinCounter++;
            }
            
        }
        _bStartGame = false;
        this.gameOver();
        
    };
    
    this.restartGame = function () {
        this.unload();
        this._init();
    };        
    
    this.unload = function(){
        _bStartGame = false;
        
        _oBlock.off("click", function(){});
        
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        for(var i=0; i<_aPiece.length; i++){
            _aPiece[i].unload();
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

           
    };
 
    this.onPause = function(){
        _bStartGame = false;
        new CPausePanel(s_oSpriteLibrary.getSprite('msg_box'));
    };
    
    this.onPauseExit = function(){
        _bStartGame = true;
    };
 
    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._onExitHelp = function () {
         _bStartGame = true;
    };
    
    this.gameOver = function(){  
        
        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        
        var iScore = Math.floor( (TIME_BONUS_LIMIT[s_iMode] - _iTimeElaps) / 100 );
        if(iScore < 0){
            iScore = 0;
        }
        _oEndPanel.show(_iTimeElaps,iScore);
    };

    
    this.update = function(){
        if(_bStartGame){
            _iTimeElaps += s_iTimeElaps;
            if(_iTimeElaps > 5999000){
                _iTimeElaps = 5999000;
            }                
            _oInterface.refreshTime(formatTime(_iTimeElaps));           
        }
    };

    s_oGame=this;
    
    NUM_SHUFFLE[0] = oData.num_shuffle_3x3;
    NUM_SHUFFLE[1] = oData.num_shuffle_4x4;
    NUM_SHUFFLE[2] = oData.num_shuffle_5x5;
    
    SHUFFLE_SPEED[0] = oData.shuffle_speed_3x3;
    SHUFFLE_SPEED[1] = oData.shuffle_speed_4x4;
    SHUFFLE_SPEED[2] = oData.shuffle_speed_5x5;
    
    TIME_BONUS_LIMIT[0] = oData.bonus_time_3x3;
    TIME_BONUS_LIMIT[1] = oData.bonus_time_4x4;
    TIME_BONUS_LIMIT[2] = oData.bonus_time_5x5;
    
    _oParent=this;
    this._init();
}

var s_oGame;
