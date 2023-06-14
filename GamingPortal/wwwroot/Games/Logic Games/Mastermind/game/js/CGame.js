function CGame(oData){
    var _bInitGame;
    var _iScore;
    var _oInterface;
    var _oParent;
    var _aPieces = new Array();
    var _oPieceTable;
    var _iCurrentRow;
    var _aNumbers = new Array();
    var _aComboBox = new Array();
    var _oRowsContainer;
    var _oButArrowUp;
    var _oButArrowDown;
    var _iCountArrows;
    var _iYFix;
    var _iBestScore;
    var _oBrain;
    
    
    
    this._init = function(){
        _bInitGame=true;
        $(s_oMain).trigger("start_level",s_oLevelSettings.getCurrentLevel());
        _iYFix = 0;
        _iCountArrows = 0;
        _iScore=START_SCORE*NUM_ROWS;
        var iBScoreSave = getItem("score_level_"+s_oLevelSettings.getCurrentLevel());
            if(iBScoreSave===null||iBScoreSave==="undefined"){
                _iBestScore = 0;
            }else{
                _iBestScore = iBScoreSave;
            }
            
            
        
        _oRowsContainer = new createjs.Container();
        _oRowsContainer.x = iFirstRowPos.x;
        _oRowsContainer.y = iFirstRowPos.y;
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg); //Draws on canvas
        
        _oInterface = new CInterface(_iBestScore);
        _oInterface.refreshScore(_iScore);
        _oInterface.refreshAttempts(NUM_ROWS);
        
        if (s_bFirstPlay === true){
            new CPanelTutorial();
        }else{
            this.startGame();
        }
        

    };
    
    this.startGame = function(){
        if (s_oSoundtrack!==null){
            setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
        }
        s_bFirstPlay = false;
        
        s_oStage.addChild(_oRowsContainer);
        
        _oPieceTable = new CPieceTable(NUM_PIECES);
        
        _iCurrentRow = 0;
        
        for (var i=0;i<NUM_PIECES;i++){
            _aNumbers[i] = i;
        }
        
        _aNumbers = this.getRandomSubarray(_aNumbers,NUM_COLS);
        
        for (var i=0;i<NUM_ROWS;i++){
           var row = new createBitmap(s_oSpriteLibrary.getSprite("row"));
           row.y = -(PIECE_HEIGHT*i);
           _oRowsContainer.addChild(row);
           _aPieces[i] = new Array();
           for (var j=0;j<NUM_COLS;j++){
              _aPieces[i][j] = new CCell(j,i,row.x+(j*(PIECE_WIDTH))+(PIECE_WIDTH/2),row.y+(PIECE_HEIGHT/2),_oRowsContainer);
           }
           _aComboBox[i] = new CComboBox(row.x+(7*PIECE_WIDTH)+(BALL_WIDTH_HEIGHT/2)+2,row.y+(PIECE_HEIGHT/2)-BALL_WIDTH_HEIGHT,_oRowsContainer); //TESTARE
        };
        
        var graphics = new createjs.Graphics().beginFill("red").drawRect((CANVAS_WIDTH/2-325),(CANVAS_HEIGHT/2-265),650,484);
        var shape = new createjs.Shape(graphics);
        shape.alpha = 0;
        _oRowsContainer.mask = shape;
        s_oStage.addChild(shape);
        
        var oSprite = s_oSpriteLibrary.getSprite("arrow");
        _oButArrowUp = new CGfxButton(iFirstRowPos.x+325,iFirstRowPos.y-(CANVAS_HEIGHT/2-265),oSprite,s_oStage);
        _oButArrowUp.addEventListener(ON_MOUSE_DOWN,this.onButUp,this);
        _oButArrowDown = new CGfxButton(iFirstRowPos.x+325,iFirstRowPos.y+90,oSprite,s_oStage);
        _oButArrowDown.getButtonImage().rotation = 180;
        _oButArrowDown.addEventListener(ON_MOUSE_DOWN,this.onButDown,this);
        _oButArrowDown.setVisible(false);
        if (NUM_ROWS<=7){
            _oButArrowUp.setVisible(false);
        }
        
        _oBrain = new CBrain();
    };
    
    this.onButUp = function(){
        _oButArrowUp.setClickable(false);
        _oButArrowDown.setClickable(false);
        new createjs.Tween.get(_oRowsContainer).to({y: _oRowsContainer.y + 69},700, createjs.Ease.cubicOut).call(function(){_oButArrowUp.setClickable(true);_oButArrowDown.setClickable(true);});
        _iYFix+=69;
        _iCountArrows++;
        _oButArrowDown.setVisible(true);
        _oButArrowDown.setClickable(true);
        if (_iCountArrows===NUM_ROWS-7){
            _oButArrowUp.setVisible(false);
            _oButArrowUp.setClickable(false);
        }
    };
    
    this.onButDown = function(){
        _oButArrowUp.setClickable(false);
        _oButArrowDown.setClickable(false);
       new createjs.Tween.get(_oRowsContainer).to({y: _oRowsContainer.y - 69},700, createjs.Ease.cubicOut).call(function(){_oButArrowUp.setClickable(true);_oButArrowDown.setClickable(true);});
       _iYFix-=69;
       _iCountArrows--;
       _oButArrowUp.setVisible(true);
       _oButArrowUp.setClickable(true);
       if (_iCountArrows===0){
           _oButArrowDown.setVisible(false);
           _oButArrowDown.setClickable(false);
       }
    };
        
        
    this.onSnap = function(oMyPiece){
        var bSnapped = false;
        var iDistance;
        var oMyPiecePos = {x:_oPieceTable.getPosition().x+oMyPiece.getPosition().x,y:_oPieceTable.getPosition().y+oMyPiece.getPosition().y};
        var oCellPosition;
        var iColor = oMyPiece.getColor();
        var iCurrentColor;
        
        for (var i=0;i<_aPieces[_iCurrentRow].length;i++){
            oCellPosition = {x:_aPieces[_iCurrentRow][i].getPosition().x+iFirstRowPos.x,y:_aPieces[_iCurrentRow][i].getPosition().y+iFirstRowPos.y+_iYFix};
            iDistance = Math.sqrt(Math.pow((oCellPosition.x-oMyPiecePos.x),2)+Math.pow((oCellPosition.y-oMyPiecePos.y),2));
            if (iDistance<40&&_iCurrentRow>=_iCountArrows){
                if (_aPieces[_iCurrentRow][i].getAlreadyPlaced()===false){
                    iCurrentColor = _aPieces[_iCurrentRow][i].getCurrentColor();
                    _oPieceTable.addPiece(iCurrentColor,_oPieceTable.getXNewPiece(iCurrentColor));
                }
                _aPieces[_iCurrentRow][i].setPiece(iColor);
                playSound("color_"+iColor);
                bSnapped = true;
            }
        }
        if (bSnapped===false){
            oMyPiece.setStandardPos();
        }else{
            oMyPiece.unload();
        }
        this.onCheck();
    };
    
    this.onClickPiece = function(){
       _oBrain.unloadCloud(); 
    };
    
    this.removeCell = function(iColor){
        _oPieceTable.addPiece(iColor,_oPieceTable.getXNewPiece(iColor));
    };
    
    this.onCheck = function(){
        var iBlackBall = 0;
        var iGrayBall = 0;
       var bAllCellFully = true;
       var bWin = true;
       var bCurrentFind;
       var iCurrentColor;
       for (var i=0;i<_aPieces[_iCurrentRow].length;i++){
           if (_aPieces[_iCurrentRow][i].getAlreadyPlaced()===true){
               bAllCellFully = false;
           }
       }
       if (bAllCellFully === true){
           for (var i=0;i<_aPieces[_iCurrentRow].length;i++){
               iCurrentColor = _aPieces[_iCurrentRow][i].getCurrentColor();
               if (iCurrentColor===_aNumbers[i]){
                   iBlackBall++;
               }else{
                   bWin = false;
                   bCurrentFind = false;
                   for (var j=0; j<_aPieces[_iCurrentRow].length;j++){
                       if (iCurrentColor===_aNumbers[j]){
                           bCurrentFind = true;
                       }
                   }
                   if (bCurrentFind === true){
                       iGrayBall++;
                   }
               }
           }
           if (bWin === true){
               _oBrain.showHappyBrain();
               _oBrain.showTextWin();
               playSound("right_sequence");
               _aComboBox[_iCurrentRow].addBalls(iBlackBall,iGrayBall);
               for (var i=0; i<_aPieces[_iCurrentRow].length; i++){
                        _aPieces[_iCurrentRow][i].disableCell();
                }
                this.manageInput(false);
               if (_iScore>_iBestScore){
                   saveItem("score_level_"+s_oLevelSettings.getCurrentLevel(),_iScore);
               }
               if (s_iLastLevel<s_oLevelSettings.getNextLevel()){
                    saveItem("level_mastermind",s_oLevelSettings.getNextLevel());
                }
               this.createInvisibleShape();
               setTimeout(function(){
                   $(s_oMain).trigger("end_level",s_oLevelSettings.getCurrentLevel());
                   new CEndPanel().show("win",_iScore);
               },2100);
           }else{
               _oBrain.showAngryBrain();
               playSound("wrong_sequence");
               if (_iCurrentRow!==NUM_ROWS-1){
                    _oBrain.assembleTextMiss(iBlackBall,iGrayBall);
               }else{
                   _oBrain.showTextLose();
               }
                for (var i=0; i<_aPieces[_iCurrentRow].length; i++){
                        _aPieces[_iCurrentRow][i].disableCell();
                }
               _oPieceTable.unload();
                    _oPieceTable = new CPieceTable(NUM_PIECES);
                    _aComboBox[_iCurrentRow].addBalls(iBlackBall,iGrayBall);
                    for (var i=0; i<_aPieces[_iCurrentRow].length; i++){
                        _aPieces[_iCurrentRow][i].disableCell();
                    }
                    _iCurrentRow++;
                    _oInterface.refreshAttempts(NUM_ROWS-_iCurrentRow);
                    _iScore-=START_SCORE;
                    _oInterface.refreshScore(_iScore);
                if (_iCurrentRow===NUM_ROWS){
                   _oInterface.refreshScore(_iScore);
                   this.createInvisibleShape();
                   setTimeout(function(){
                       $(s_oMain).trigger("end_level",s_oLevelSettings.getCurrentLevel());
                        new CEndPanel().show("lose",_iScore);
                    },2100);
               }
           }
       }
    };
    
    this.manageInput = function(bVal){
        if (bVal===true){
            _oPieceTable.initAllListener();
        }else{
            _oPieceTable.removeAllListener();
        }
        
        _oButArrowUp.setClickable(bVal);
        _oButArrowDown.setClickable(bVal);
    };
    
    this.restartGame = function () {
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_level",s_oLevelSettings.getCurrentLevel());
        
        this.unload();
        this._init();
    }; 
    
    this.createInvisibleShape = function(){
       var shape = new createjs.Shape();
       shape.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
       shape.alpha = 0.01;
       shape.on("mousedown",this.onOver,this);
       s_oStage.addChild(shape);
    };
    
    this.unload = function(){
        _bInitGame = false;
        
        _oInterface.unload();
        
        if (_oPieceTable!==undefined&&_oPieceTable!==null){
            _oPieceTable.unload();
        }
        
        if (_oBrain!==undefined&&_oBrain!==null){
            _oBrain.unload();
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

           
    };
 
    this.onExit = function(){
        $(s_oMain).trigger("end_session");
        
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._onExitHelp = function () {
         _bStartGame = true;
         $(s_oMain).trigger("start_level",1);
    };
    
    this.onOver = function(){
        
    };
    
    this.getRandomSubarray = function (arr,size){
        var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
    return shuffled.slice(min);
    };
    
    this.update = function(){
        
    };

    s_oGame=this;
    
    START_SCORE = oData.points_for_attempts;
    
    
    _oParent=this;
    this._init();
}

var s_oGame;
