function CBoard(oParentContainer){
    var _iWidth;
    var _iHeight;
    var _iNextWhiteToPlace;
    var _iNextBlackToPlace;
    var _aPoints;
    var _aBlackPieces;
    var _aWhitePieces;
    var _aMills;
    var _aMillsActive;
    var _oCurPieceSelected;
    var _oWhiteBox;
    var _oBlackBox;
    
    var _oContainer;
    var _oParentContainer = oParentContainer;
    var _oThis = this;
    
    this._init = function(){
        this.reset();
        
        s_oBoardSettings = new CBoardSettings();
        
        _oContainer = new createjs.Container();
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2;
        _oParentContainer.addChild(_oContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("board");
        var oBg = createBitmap(oSpriteBg);
        _oContainer.addChild(oBg);
        
        _iWidth = oSpriteBg.width;
        _iHeight = oSpriteBg.height;
        
        this._initPoints();
        this._initMills();
        
        var oSpriteBox = s_oSpriteLibrary.getSprite("chipbox");
        
        //PLACE PIECES BOXES
        _oWhiteBox = createBitmap(oSpriteBox);
        _oWhiteBox.x = 0;
        _oWhiteBox.y = _iHeight/2;
        _oWhiteBox.regX = oSpriteBox.width/2;
        _oWhiteBox.regY = oSpriteBox.height/2;
        _oContainer.addChild(_oWhiteBox);

        
        _oBlackBox = createBitmap(oSpriteBox);
        _oBlackBox.x =  _iWidth;
        _oBlackBox.y = _iHeight/2;
        _oBlackBox.regX = oSpriteBox.width/2;
        _oBlackBox.regY = oSpriteBox.height/2;
        _oContainer.addChild(_oBlackBox);
        
        this._initPieces();
        
        _oContainer.regX = _iWidth/2;
        _oContainer.regY = _iHeight/2;

    };
    
    this.reset = function(){
        _aMillsActive = new Array();
        _oCurPieceSelected = null;
        _iNextWhiteToPlace = 0;
        _iNextBlackToPlace = 0;
    };
    
    this.restart = function(){
        for(var i=0;i<_aBlackPieces.length;i++){
            _aBlackPieces[i].unload();
        }
        
        for(var j=0;j<_aWhitePieces.length;j++){
            _aWhitePieces[j].unload();
        }
        
        for(var k=0;k<_aMills.length;k++){
            _aMills[k].hide();
        }
        
        for(var t=0;t<_aPoints.length;t++){
            _aPoints[t].unload();
        }
        
        this.reset();
        
        this._initPoints();
        this._initPieces();
    };
    
    this._initPoints = function(){
        var aPosPoint = s_oBoardSettings.getAllPointPos();
        
        _aPoints = new Array();
        for(var i=0;i<aPosPoint.length;i++){
            _aPoints[i] = new CBoardPoint(aPosPoint[i].x,aPosPoint[i].y,i,_oContainer);
            
            _aPoints[i].addEventListener(ON_SELECT_POINT,this._onSelectPoint,this);
        } 
    };
    
    this._onSelectPoint = function(iIndex){
        
        this.unlightAllPoints();
        
        switch(s_oGame.getState()){
            case GAME_STATE_PLACING:{
                    this.placePiece(s_oGame.getTurn(),iIndex);
                    break;
            }
            case GAME_STATE_MOVEMENT:{
                    this.moveSelectedPiece(iIndex);
                    break;
            }
        }
        
        
    };
    
    this._initMills = function(){
        var aList = s_oBoardSettings.getMillList();
        var aInfos = s_oBoardSettings.getMillInfos();
        
        _aMills = new Array();
        for(var i=0;i<aList.length;i++){
            var oMill = new CMill(aInfos[i],aList[i],_oContainer);
            
            _aMills.push(oMill);
        }
    };
    
    this._initPieces = function(){
        //PLACE BLACK AND WHITE PIECES
        _aWhitePieces = new Array();
        _aBlackPieces = new Array();
        var iY = 257;
        for(var i=0;i<NUM_PIECES;i++){
            var oWhite = new CPiece(_oWhiteBox.x,iY,WHITE_PLAYER,_oContainer);
            
            oWhite.setScale(PIECE_SCALE_IN_BOARD);
            _aWhitePieces.push(oWhite);
            
            var oBlack = new CPiece(_oBlackBox.x,iY,BLACK_PLAYER,_oContainer);
            oBlack.setScale(PIECE_SCALE_IN_BOARD);
            _aBlackPieces.push(oBlack);
            
            iY += PIECE_START_Y_OFFSET*PIECE_SCALE_IN_BOARD;
        }
    };
    
    this.startGame = function(){
        for(var k=0;k<_aPoints.length;k++){
            _aPoints[k].highlight();
        }
    };
    
    this.placePiece = function(iCurTurn,iIndex){
        var pPos = s_oBoardSettings.getPointPos(iIndex);
        if(iCurTurn === WHITE_PLAYER){
            _aWhitePieces[_iNextWhiteToPlace].move(pPos,"anim",iIndex,null);
            _aPoints[iIndex].setState(_aWhitePieces[_iNextWhiteToPlace]);
            
            _iNextWhiteToPlace++;
        }else{
            _aBlackPieces[_iNextBlackToPlace].move(pPos,"anim",iIndex,null);
            _aPoints[iIndex].setState(_aBlackPieces[_iNextBlackToPlace]);
            
            _iNextBlackToPlace++;
        }
        
        
        
        if( this._checkMills() ){
            //OPPONENT MUST REMOVE A PIECE
            this.initOpponentPieceRemoval(iCurTurn);
        }else{
            var bEndPlaceState = (_iNextBlackToPlace === _aBlackPieces.length)?true:false;
            s_oGame.changeTurn(bEndPlaceState);
            
            if(!bEndPlaceState){
                if(s_iMode === MODE_CPU && s_oGame.getTurn() === BLACK_PLAYER){
                    var iPointIndex = s_oAi.evaluateInPlacingState(_aPoints,s_oGame.getTurn(),_iNextBlackToPlace);
                    
                    setTimeout(function(){_oThis.placePiece(s_oGame.getTurn(),iPointIndex);},AI_TIME);
                }else{
                    this.highlightAllPoints();
                }
            }
        }
    };
    
    this.moveSelectedPiece = function(iPointIndex){
        if(_oCurPieceSelected === null){
            return;
        }
        
        this.unlightAllPoints();
        this.disableAllPieces();
        
        var iPrevPointIndex = _oCurPieceSelected.getPointIndex();
        _aPoints[iPrevPointIndex].setState(null);
        _oCurPieceSelected.move(s_oBoardSettings.getPointPos(iPointIndex),"end",iPointIndex,this._onEndMove,this);
        _aPoints[iPointIndex].setState(_oCurPieceSelected);
    };
    
    this.highlightAllPoints = function(){
        //RESTORE POINT LISTENERS
        for(var k=0;k<_aPoints.length;k++){
            if(_aPoints[k].getState() === -1){
                _aPoints[k].highlight();
            }
        }
    };
    
    this.unlightAllPoints = function(){
        //SHUTDOWN POINT HIGHLIGHTS
        for(var k=0;k<_aPoints.length;k++){
            _aPoints[k].disable();
        }
    };
    
    this.prepareForMovState = function(iCurTurn){
        _iNextBlackToPlace = 0;
        _iNextWhiteToPlace = 0;
        this.unlightAllPoints();
        
        this.setPieceClickablePerTurn(iCurTurn);
    };
    
    this.setPieceClickablePerTurn = function(iTurn){
        
        //CHECK IF THE CURRENT PLAYER HAVE ANY MOVEABLE PIECE
        if( this._checkIfAnyAvailableMove(iTurn) === false){
            this.gameOver(iTurn===WHITE_PLAYER?BLACK_PLAYER:WHITE_PLAYER);
        }else{
            if(s_iMode === MODE_CPU && iTurn === BLACK_PLAYER){

                var oMovInfos = s_oAi.evaluateInMovState(_aPoints,iTurn,_aBlackPieces);

                _oCurPieceSelected = oMovInfos.piece;
                setTimeout(function(){_oThis.moveSelectedPiece(oMovInfos.end)},AI_TIME);
            }else{
                //INIT LISTENER FOR THE PIECES
                if(iTurn === WHITE_PLAYER){
                    for(var k=0;k<_aWhitePieces.length;k++){
                        _aWhitePieces[k].initListener();
                        _aWhitePieces[k].addEventListener(ON_SELECT_PIECE,this._onSelectPiece,this);
                    }

                    for(var k=0;k<_aBlackPieces.length;k++){
                        _aBlackPieces[k].removeListener();
                    }
                }else{
                    for(var k=0;k<_aBlackPieces.length;k++){
                        _aBlackPieces[k].initListener();
                        _aBlackPieces[k].addEventListener(ON_SELECT_PIECE,this._onSelectPiece,this);
                    }

                    for(var k=0;k<_aWhitePieces.length;k++){
                        _aWhitePieces[k].removeListener();
                    }
                }
            }
        }

    };
    
    this._checkIfAnyAvailableMove = function(iTurn){
        if(iTurn === WHITE_PLAYER && _aWhitePieces.length === 3){
            return true;
        }else if(iTurn === BLACK_PLAYER && _aBlackPieces.length === 3){
            return true;
        }
        
        
        for(var k=0;k<_aPoints.length;k++){
            if(_aPoints[k].getState() === iTurn){
                var aAdjacents = s_oBoardSettings.getAdjacentsPerPoint(k);
                var iCont = 0;
                for(var i=0;i<aAdjacents.length;i++){
                    if(_aPoints[aAdjacents[i]].getState() === -1){
                        iCont++;
                    }
                }
                if( iCont > 0 ){
                    return true;
                }
            }
            
        }
        
        return false;
    };
    
    this.resetMills = function(){
        for(var k=0;k<_aMills.length;k++){
            _aMills[k].hide();
            var aMill = _aMills[k].getPointList();
            for(var j=0;j<aMill.length;j++){
                _aPoints[aMill[j]].setMill(-1);
            }
        }
    };
    
    this._checkMills = function(){
        
        var aPrevMills = new Array();
        for(var i=0;i<_aMillsActive.length;i++){
            aPrevMills[i] = _aMillsActive[i];
        }
        
        _aMillsActive = new Array();
        
        this.resetMills();
        
        for(var k=0;k<_aMills.length;k++){
            if(this._checkIfMillIsFilled(k) ){
                _aMills[k].show();
                
                _aMillsActive.push(k);
                
                //SET POINTS IN MILL
                var aMill = _aMills[k].getPointList();
                for(var j=0;j<aMill.length;j++){
                    _aPoints[aMill[j]].setMill(k);
                }
            }
        }
        
        //COMPARE MILLS STATE
        var bNewMill = false;
        if(_aMillsActive.length > aPrevMills.length){
            bNewMill = true;
        }else if(_aMillsActive.length === aPrevMills.length){
            for(var j=0;j<_aMillsActive.length;j++){
                if(_aMillsActive[j] !== aPrevMills[j]){
                    bNewMill = true;
                }
            }
        }
        
        return bNewMill;
    };
    
    this._checkIfMillIsFilled = function(iIndex){
        var aMill = _aMills[iIndex].getPointList();
        var iPieceType = _aPoints[aMill[0]].getState();
        for(var i=0;i<aMill.length;i++){
            if(_aPoints[aMill[i]].getState() === -1 || _aPoints[aMill[i]].getState() !== iPieceType){
                return false;
            }
        }
        
        return true;
    };
    
    this.initOpponentPieceRemoval = function(iCurTurn){
        playSound("bonus",1,false);
        
        s_oGame.refreshTextHelp(TEXT_STATE1);
        
        //DISABLE BOARD LISTENERS
        for(var k=0;k<_aPoints.length;k++){
            _aPoints[k].disable();
        }
        
        if(s_iMode === MODE_CPU && iCurTurn === BLACK_PLAYER){
            var iPointIndex = s_oAi.chooseOpponentPieceToRemove(_aPoints, this.findAllRemoveablePieces(iCurTurn),iCurTurn);
            setTimeout(function(){_oThis._onRemovePiece(_aPoints[iPointIndex].getPiece(),iPointIndex);},AI_TIME);
        }else{
            //HIGHLIGHT ALL OPPONENT PIECES THAT USER CAN REMOVE
            var iCont = 0;
            for(var i=0;i<_aPoints.length;i++){
                if(_aPoints[i].getState() !== -1 && _aPoints[i].getState() !== iCurTurn && _aPoints[i].isInMill() === false){

                    var oPiece = _aPoints[i].getPiece();

                    oPiece.highlight();
                    oPiece.initListener();
                    oPiece.addEventListener(ON_SELECT_PIECE,this._onRemovePiece,this);

                    iCont++;
                }
            }

            //IF ALL OPPONENT PIECES ARE INVOLVED IN A MILL, USER CAN REMOVE ANY OF THEM
            if(iCont === 0){
                for(var i=0;i<_aPoints.length;i++){
                    if(_aPoints[i].getState() !== -1 && _aPoints[i].getState() !== iCurTurn){
                        var oPiece = _aPoints[i].getPiece();

                        oPiece.highlight();
                        oPiece.initListener();
                        oPiece.addEventListener(ON_SELECT_PIECE,this._onRemovePiece,this);
                    }
                }
            }
        }
        
        
    };
    
    this._onRemovePiece = function(oPiece,iIndex){
        _aPoints[iIndex].setState(null);
        _aPoints[iIndex].setMill(-1);
        
        playSound("removepiece",1,false);
        
        oPiece.move(WASTE_PIECE_POS,"loop_anim",iIndex,oPiece.unload,oPiece);
        
        //REMOVE PIECE FROM ARRAY
        if(s_oGame.getTurn() === WHITE_PLAYER){
            for(var i=0;i<_aBlackPieces.length;i++){
                if(_aBlackPieces[i] === oPiece){
                    _aBlackPieces.splice(i,1);
                    _iNextBlackToPlace--;
                    break;
                }
            }
            
        }else{
            for(var i=0;i<_aWhitePieces.length;i++){
                if(_aWhitePieces[i] === oPiece){
                    _aWhitePieces.splice(i,1);
                    _iNextWhiteToPlace--;
                    break;
                }
            }
        }
        
        this.disableAllPieces();
        
        var bEndPlaceState = (_iNextBlackToPlace === _aBlackPieces.length)?true:false;

        s_oGame.changeTurn(bEndPlaceState);
        
        if(!bEndPlaceState && s_oGame.getState() === GAME_STATE_PLACING){
            if(s_iMode === MODE_CPU && s_oGame.getTurn() === BLACK_PLAYER){
                var iPointIndex = s_oAi.evaluateInPlacingState(_aPoints,s_oGame.getTurn(),_iNextBlackToPlace);
                
                setTimeout(function(){_oThis.placePiece(s_oGame.getTurn(),iPointIndex);},AI_TIME);
            }else{
                this.highlightAllPoints();
            }
            
            
            s_oGame.refreshTextHelp(TEXT_STATE0);
            
        }else if(s_oGame.getState() === GAME_STATE_MOVEMENT){
            s_oGame.refreshTextHelp(TEXT_STATE2);
            
            this.setPieceClickablePerTurn(s_oGame.getTurn());
            
            //CHECK IF ANY PLAYER HAVE JUST TWO PAWNS
            if(_aBlackPieces.length === 2 || _aWhitePieces.length === 2){
                this.gameOver(_aBlackPieces.length>_aWhitePieces.length?BLACK_PLAYER:WHITE_PLAYER);
                return;
            }
        }
        
        this._checkMills();
    };
    
    this.findAllRemoveablePieces = function(iTurn){
        var aRemoveablePoints = new Array();
        var iCont = 0;
        for(var i=0;i<_aPoints.length;i++){

            if(_aPoints[i].getState() !== -1 && _aPoints[i].getState() !== iTurn && _aPoints[i].isInMill() === false){
                aRemoveablePoints.push(i);
                iCont++;
            }
        }
        
        //IF ALL OPPONENT PIECES ARE INVOLVED IN A MILL, USER CAN REMOVE ANY OF THEM
        if(iCont === 0){
            aRemoveablePoints = new Array();
            for(var i=0;i<_aPoints.length;i++){
                if(_aPoints[i].getState() !== -1 && _aPoints[i].getState() !== iTurn){
                    aRemoveablePoints.push(i);
                }
            }
        }

        return aRemoveablePoints;
    };
    
    this.disableAllPieces = function(){
        //UNLIGHT ALL PIECES
        for(var j=0;j<_aBlackPieces.length;j++){
            _aBlackPieces[j].unlight();
            _aBlackPieces[j].removeListener();
        }

        for(var j=0;j<_aWhitePieces.length;j++){
            _aWhitePieces[j].unlight();
            _aWhitePieces[j].removeListener();
        }
    };
    
    this._onSelectPiece = function(oPiece,iPointIndex){
        if(iPointIndex === -1){
            return;
        }
        
        if(_oCurPieceSelected !== null){
            _oCurPieceSelected.unlight();
        }
        
        _oCurPieceSelected = oPiece;
        
        
        if(this._highlightReachablePoints(iPointIndex,s_oGame.getTurn()===WHITE_PLAYER?_aWhitePieces:_aBlackPieces)){
            oPiece.highlight();
        }else{
            oPiece.highlightRed();
        }
    };
    
    this._highlightReachablePoints = function(iPointIndex,aPieceArray){
        this.unlightAllPoints();
        
        var iCont = 0;
        if(aPieceArray.length === 3){
            for(var i=0;i<_aPoints.length;i++){
                if(_aPoints[i].getState() === -1){
                    _aPoints[i].highlight();
                    iCont++;
                }
            }
        }else{
            var aAdjacents = s_oBoardSettings.getAdjacentsPerPoint(iPointIndex);
            
            for(var i=0;i<aAdjacents.length;i++){
                if(_aPoints[aAdjacents[i]].getState() === -1){
                    _aPoints[aAdjacents[i]].highlight();
                    iCont++;
                }
            }
        }
        
        
        return iCont===0?false:true;
    };
    
    this.gameOver = function(iWinner){
        this.disableAllPieces();
        
        s_oGame.gameOver(iWinner,_aWhitePieces,_aBlackPieces);
    };
    
    this._onEndMove = function(){
        _oCurPieceSelected = null;
        
        if( this._checkMills() ){
            this.initOpponentPieceRemoval(s_oGame.getTurn());
        }else{
            s_oGame.changeTurn(false);
        
            this.setPieceClickablePerTurn(s_oGame.getTurn());
        }
    };
    
    this.printBoardState = function(){
        for(var k=0;k<_aPoints.length;k++){
            trace("_aPoints["+k+"] "+_aPoints[k].getState());
        }
    };
    
    this._init();
    
}