function CGame(oData, iPlayers, iGoal) {
    var _bStartGame;
    var _bGameReady;
    var _bDisableEvents;
    var _bWin;
    var _bMatchOver;
    var _bMatchLocked;
    var _bFirstTile;
    var _bDrawnedTile;
    var _bDomino;
    var _bSelectedTile;
    
    var _iPlayers;
    var _iGoal;
    var _iTurn;
    var _iSide1Value;     // THE VALUE OF THE 1ST SIDE OF THE BOARD
    var _iSide2Value;     // THE VALUE OF THE 2ND SIDE OF THE BOARD
    var _iDrawnTilesSide1;
    var _iDrawnTilesSide2;
    var _iMatchTimer;
    var _iWinnerPoints;
    var _iWinnerPlayer;
    var _iDistributionOffsetX;
    var _iDistributionOffsetY;
    var _iDistributionTurn;
    var _iScale;
    var _iOffsetDouble;
    var _iOffsetTiles;
    var _iTilesContainerOffsetY;

    var _oInterface;
    var _oBg;
    var _oSideArrowsText;
    var _oFrame;
    var _oEndPanel;
    var _oMatchOverPanel;
    var _oHelpPanel;  
    var _oTilesContainer;
    var _oSide1Tile;      // THE LAST TILE ON 1ST SIDE OF THE BOARD
    var _oSide2Tile;      // THE LAST TILE ON 2ND SIDE OF THE BOARD
    var _oLockedText;
    var _oDominoText;
    var _oShake;
    var _oTilesBox;
    var _oMessageBox;
    var _oMessageBoxDomino;
    var _oMsgContainerLocked;
    var _oMsgContainerDomino;
    var _oLockedContinueButton;
    var _oDominoContinueButton;
    var _oBlockInput;
    var _oArrowsContainer;
    var _oLeftSideArrow;
    var _oRightSideArrow;
    var _oSelectedTile;
        
    var _aScore;          // THE SCORES OF EACH PLAYER
    var _aTilesDeck;      // THIS ARRAY CONTAINS ALL THE TILES
    var _aPlayers;
    var _aLockedPlayers;
    var _aCorrectTiles;
    
    this._init = function(){
        _aTilesDeck = new Array();
        _aPlayers = new Array();
        _aScore = new Array();
        _aLockedPlayers = new Array();
        
        _iPlayers = iPlayers;
        _iGoal = iGoal;
        _iTurn = 0;
        _iSide1Value = _iSide2Value = 0;
        _iMatchTimer = 0;
        _iDrawnTilesSide1 = _iDrawnTilesSide2 = 0;
        _iWinnerPoints = 0;
        _iWinnerPlayer = 0;
        _iDistributionTurn = 0;
        _iDistributionOffsetX = _iDistributionOffsetY = 0;
        _iScale = 1;
        _iOffsetDouble = TILE_WIDTH * 0.75;
        _iOffsetTiles = TILE_WIDTH * 0.95;
        _iTilesContainerOffsetY = 38;

        _oEndPanel = null;
        _oMatchOverPanel = null;
        _oSelectedTile = null;
        
        _bDisableEvents = false;
        _bGameReady = false;
        _bWin = false;
        _bFirstTile = true;
        _bDrawnedTile = false;
        _bMatchOver = false;
        _bDomino = false;
        _bMatchLocked = false;
        _bSelectedTile = false;
        
        switch(_iPlayers) {
            case 2: 
                for (var i = 0; i < s_aPlayersScore2.length; i++) {
                    _aScore[i] = s_aPlayersScore2[i]; };
                break;
            case 3: 
                for (var i = 0; i < s_aPlayersScore3.length; i++) {
                    _aScore[i] = s_aPlayersScore3[i]; };
                break;
            case 4: 
                for (var i = 0; i < s_aPlayersScore4.length; i++) {
                    _aScore[i] = s_aPlayersScore4[i]; };
                break;
        };
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_game');
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = oSpriteBg.width/2;
        _oBg.y = oSpriteBg.height/2;
        _oBg.regX = CANVAS_WIDTH_HALF;
        _oBg.regY = (CANVAS_HEIGHT_HALF + _iTilesContainerOffsetY)/2;

        _oFrame = createBitmap(s_oSpriteLibrary.getSprite("game_frame"));
        s_oStage.addChild(_oBg, _oFrame);
        
        // CREATE A BOX FOR THE TILES, WITH SOME ANIMATIONS
        _oTilesBox = new CBoxAnimation(_iPlayers, _aPlayers);
        
        // INIT THE PLAYERS AND TILES
        this._initPlayersAndTiles();

        // INIT MESSAGE TEXTS
        _oMsgContainerLocked = new createjs.Container();
        s_oStage.addChild(_oMsgContainerLocked);
        this._initLockedText();
        
        _oMsgContainerDomino = new createjs.Container();
        s_oStage.addChild(_oMsgContainerDomino);
        this._initDominoText();

        _oInterface = new CInterface();
        
        // ADD SOME ARROWS FOR THE SIDE SELECTION
        _oArrowsContainer = new createjs.Container();
        s_oStage.addChild(_oArrowsContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("side_selection");
        var oContainerBg = createBitmap(oSprite);
        oContainerBg.regX = oSprite.width * 0.5;
        oContainerBg.regY = oSprite.height * 0.5;
        _oArrowsContainer.addChild(oContainerBg);
        
        _oSideArrowsText = new CTLText(_oArrowsContainer, 
                    -75, -18, 150, 40, 
                    20, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SELECTSIDE,
                    true, true, true,
                    false );
                    
     
        
        var oSprite = s_oSpriteLibrary.getSprite("arrow_left");
        _oLeftSideArrow = new CGfxButton(-90, 0, oSprite, _oArrowsContainer);
        _oLeftSideArrow.addEventListenerWithParams(ON_MOUSE_UP, this._onSelectedSide, this, LEFT_SIDE);        
        var oSprite = s_oSpriteLibrary.getSprite("arrow_right");
        _oRightSideArrow = new CGfxButton(90, 0, oSprite, _oArrowsContainer);
        _oRightSideArrow.addEventListenerWithParams(ON_MOUSE_UP, this._onSelectedSide, this, RIGHT_SIDE);
        
        _oArrowsContainer.x = CANVAS_WIDTH_HALF;
        _oArrowsContainer.y = CANVAS_HEIGHT_HALF;
        _oArrowsContainer.visible = false;
        
        
        
        _oBlockInput = new createjs.Shape();
        _oBlockInput.graphics.beginFill("#ff0000").drawRect(0, _aPlayers[0].getY() - 50, CANVAS_WIDTH, 100);
        _oBlockInput.alpha = 0.01;
        _oBlockInput.visible = true;
        _oBlockInput.on("mousedown",function(){});
        s_oStage.addChild(_oBlockInput);

        if (FIRST_GAME === true) {
            _oHelpPanel = new CHelpPanel(_iGoal);
        } else {
            this._onExitHelp();
        }
    };
    
    this._initLockedText = function(){
        var iX = CANVAS_WIDTH_HALF;
        var iY = CANVAS_HEIGHT_HALF + _iTilesContainerOffsetY;
        
        _oMessageBox = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
        _oMessageBox.regX = 616/2;
        _oMessageBox.regY = 617/2;
        _oMessageBox.scaleX = _oMessageBox.scaleY = 0.5;
        _oMessageBox.x = iX;
        _oMessageBox.y = iY;
        _oMsgContainerLocked.addChild(_oMessageBox); 
  
        
        _oLockedText = new CTLText(_oMsgContainerLocked, 
                    iX-100, iY - 100, 200, 70, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_PLAYER + " " + _iTurn + " " + TEXT_LOCKED,
                    true, true, true,
                    false );


               

        _oLockedContinueButton = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 100, s_oSpriteLibrary.getSprite('but_continue'), _oMsgContainerLocked);
        _oLockedContinueButton.addEventListener(ON_MOUSE_UP, this._onLockedContinue, this);
        
        _oMsgContainerLocked.alpha = 0;
    };
    
    this._initDominoText = function(){
        var iX = CANVAS_WIDTH_HALF;
        var iY = CANVAS_HEIGHT_HALF + _iTilesContainerOffsetY;
        
        _oMessageBoxDomino = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
        _oMessageBoxDomino.regX = 616/2;
        _oMessageBoxDomino.regY = 617/2;
        _oMessageBoxDomino.scaleX = _oMessageBoxDomino.scaleY = 0.5;
        _oMessageBoxDomino.x = iX;
        _oMessageBoxDomino.y = iY;
        _oMsgContainerDomino.addChild(_oMessageBoxDomino);
        
        _oDominoText = new CTLText(_oMsgContainerDomino, 
                    iX-100, iY - 100, 200, 70, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_PLAYER + " " + _iTurn + " " + TEXT_DOMINO,
                    true, true, true,
                    false );
                    
    
        
        
        
        _oDominoContinueButton = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 100, s_oSpriteLibrary.getSprite('but_continue'), _oMsgContainerDomino);
        _oDominoContinueButton.addEventListener(ON_MOUSE_UP, this._onDominoContinue, this);
        
        _oMsgContainerDomino.alpha = 0;
    };

    this._initPlayersAndTiles = function(){
        // CREATE THE PLAYERS
        for (var i = 0; i < _iPlayers; i++) {
            _aPlayers[i] = new CPlayer(i, _aScore[i]);
        };
        
        // CREATE THE TILES CONTAINER
        _oTilesContainer = new createjs.Container();
        _oTilesContainer.x = CANVAS_WIDTH_HALF;
        _oTilesContainer.y = CANVAS_HEIGHT_HALF + _iTilesContainerOffsetY;
        s_oStage.addChild(_oTilesContainer);
        
        // CREATE AN ARRAY OF THE TILES VALUES
        for (var i = 0; i < TILES_NUMBER; i++) {
            var oTile = new CTile(_oTilesContainer, i, NO_PLAYER, 0, 0);
            _aTilesDeck.push(oTile);
        };
        shuffle(_aTilesDeck);   // RANDOMIZE THE TILES ARRAY
        
        // ADD TILES TO THE PLAYERS' DECKS
        var iPlayer = 0;
        for (var i = 0; i < _iPlayers * INITIAL_TILES; i++) {
            _aPlayers[iPlayer].addTile(_aTilesDeck[i]);
            iPlayer++;
            
            if (iPlayer >= _iPlayers) {
                iPlayer = 0;
            }
        };
        
        // SET TILES INVISIBLE
        for (var i = 0; i < _iPlayers; i++) {
            for (var j = 0; j < INITIAL_TILES; j++) {
                _aPlayers[i].setTileVisible(j, false);
            };
        };

        for (var i = 0; i < TILES_NUMBER; i++) {
            _aTilesDeck[i].setVisible(false);
        };

        _aTilesDeck = null;

        // SET THE DECK IN THE MIDDLE OF THE SCREEN
        _oTilesContainer.x = CANVAS_WIDTH_HALF;
        _oTilesContainer.y = CANVAS_HEIGHT_HALF;
        _oTilesContainer.regX = CANVAS_WIDTH_HALF/2;
        _oTilesContainer.regY = CANVAS_HEIGHT_HALF/2 + _iTilesContainerOffsetY;
    };
    
    this.unload = function(){
        _oInterface.unload();
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
        s_oGame = null;
    };

    this.onExit = function(){
        s_oGame.unload();
        s_oMain.gotoMenu();

        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
    };

    this.restart = function(){
        this.unload();
        s_oMain.gotoGame(_iPlayers, _iGoal);
        $(s_oMain).trigger("restart_level",1);
        
        s_oStage.update();
        
        _bDisableEvents = false;
        _bWin = false;
    };

    this._onExitHelp = function(){
        _bStartGame = true;
        FIRST_GAME = false;
        s_oBox.openTileBox();
    };

    this._gameOver = function(){
        _bStartGame = false;
        if(_oEndPanel === null){
            playSound("game_over",1,0);
            this.showEndPanel();
        }
    }; 

    this._checkWin = function(){
        if(_bWin){
            playSound("game_win",1,0);
            
            // IF THERE'S A NEW HIGH SCORE
            if (_aScore[0] > s_aBestScore) {
                s_aBestScore = _aScore[0];
                setItemJson("classicdomino_best_score", _aScore[0]);
            }
           
            this.showEndPanel();
        }
    };
    
    this.showEndPanel = function() {
        _oEndPanel = new CEndPanel(_iPlayers, _iWinnerPlayer, _iWinnerPoints);
        _bDisableEvents = true;
        
        _oMsgContainerLocked.visible = false;
        _oMsgContainerDomino.visible = false;
        
        $(s_oMain).trigger("share_event", _aScore[0]);
        $(s_oMain).trigger("save_score", [_aScore[0],_iPlayers]);
    };
    
    this.checkDrawned = function() {
        return _bDrawnedTile;
    };
    
    this.setGlowVisibleFalse = function(){
        if (_iTurn > 0 || !_bGameReady || s_oBox !== null) {
            return;
        }
        
        var aTiles = _aPlayers[0].getTilesArray();

        for (var i = 0; i < aTiles.length; i++) {
            var oTile = aTiles[i];
            oTile.setGlowVisible(false);
        };
    };
    
    this.setGlowVisibleTrue = function(){
        if (_iTurn > 0 || !_bGameReady || s_oBox !== null) {
            return;
        }
        
        var aTiles = _aPlayers[0].getTilesArray();
        
        for (var i = 0; i < aTiles.length; i++) {
            var oTile = aTiles[i];
            // SET EVERY GLOW INVISIBLE
            oTile.setGlowVisible(false);
            
            // IF THE TILE CAN BE DRAWN, SET THE GLOW VISIBLE
            if (oTile.getDotsValue(0) === _iSide1Value ||
                oTile.getDotsValue(0) === _iSide2Value ||
                oTile.getDotsValue(1) === _iSide1Value ||
                oTile.getDotsValue(1) === _iSide2Value) {
                
                if (s_bGlowActive) {
                    oTile.setGlowVisible(true);
                }
                
                _aCorrectTiles.push(oTile);
            }
        };
    };
    
    
    this.checkToDrawn = function() {
        _bDrawnedTile = true;
        _aCorrectTiles = new Array();
        
        this.setGlowVisibleTrue();

        if (_aCorrectTiles.length === 0) {
            _bDrawnedTile = false;
            // IF THE PLAYER HAS NOTHING TO DRAWN, IT'S LOCKED AND HAS TO PASS
            if (_aPlayers[0].getLocked() === false) {
                _aPlayers[0].setLocked(true);
            }
            this.passTurn();
        } else {
            _bDrawnedTile = false;
            if (_aPlayers[0].getLocked() === true) {
                _aPlayers[0].setLocked(false);                
            }
        }
    };
    
    this.cpuDrawTile = function() {
        _bDrawnedTile = true;
        
        var aTiles = _aPlayers[_iTurn].getTilesArray();
        var aCorrectTiles = new Array();

        for (var i = 0; i < aTiles.length; i++) {
            var oTile = aTiles[i];
            
            if (oTile.getDotsValue(0) === _iSide1Value ||
                oTile.getDotsValue(0) === _iSide2Value ||
                oTile.getDotsValue(1) === _iSide1Value ||
                oTile.getDotsValue(1) === _iSide2Value) {
                aCorrectTiles.push(oTile);
            }
        };    
        
        // IF THE PLAYER HAS NOTHING TO DRAWN, IT'S LOCKED AND HAS TO PASS
        if (aCorrectTiles.length === 0) {
            if (_aPlayers[_iTurn].getLocked() === false) {
                _aPlayers[_iTurn].setLocked(true);
            }
            
            this.passTurn();
        // DRAW THE HIGHEST-VALUED TILE
        } else {
            _aPlayers[_iTurn].setLocked(false);
            this.sortTilesByValue(aCorrectTiles);
            this.checkClickedTile(aCorrectTiles[0]);
            _bDrawnedTile = false;
        }
    };
    
    this.sortTilesByValue = function(aTiles) {
        function compare(a,b) {
            if (a.getDotsValue(0)+a.getDotsValue(1) < b.getDotsValue(0)+b.getDotsValue(1)) {
                return -1; }
            if (a.getDotsValue(0)+a.getDotsValue(1) > b.getDotsValue(0)+b.getDotsValue(1)) {
                return 1; }
            return 0;
        };

        aTiles.sort(compare);
    };
    
    this.passTurn = function() {
        _bDrawnedTile = false;
        
        var iSpeed = 1000;
        
        var iPlayerN = _iTurn+1;
        _oLockedText.refreshText(TEXT_PLAYER + " " + iPlayerN + " " + TEXT_LOCKED);
        
        // SHOW A "LOCKED" MESSAGE AND CHANGE TURN
        new createjs.Tween.get(_oMsgContainerLocked)
            .to({alpha: 1}, iSpeed/2, createjs.Ease.cubicIn);

        playSound("locked",1,0);            
    };
    
    this._selectTileSide = function(oTile){
        _oSelectedTile = oTile;
        _bSelectedTile = true;
        _oArrowsContainer.visible = true;
        _oArrowsContainer.alpha = 0;
        createjs.Tween.get(_oArrowsContainer)
            .to({alpha: 1}, 500, createjs.Ease.cubicIn)
            .call(function(){
                createjs.Tween.removeTweens(_oArrowsContainer);
            });
        
        oTile.setDrawn(); // SET THE TILE AS DRAWN
        
    };
    
    this._onSelectedSide = function(iSide) {
        if (!_bSelectedTile) {
            return;
        }
        
        _bDrawnedTile = true;
        createjs.Tween.get(_oArrowsContainer)
            .to({alpha: 0}, 500, createjs.Ease.cubicIn)
            .call(function(){
                _oArrowsContainer.visible = false;
                createjs.Tween.removeTweens(_oArrowsContainer);
            });
        _bSelectedTile = false;
        var _iSide;
        var iRotation;
        var iAngleVar = 90;
        
        if (iSide === LEFT_SIDE) {
            if (_oSelectedTile.isDouble() === false ) {
                iRotation = -1 * iAngleVar;
                if (_oSelectedTile.getDotsValue(0) === _iSide1Value) {
                    iRotation = iAngleVar;
                }
            } else {
                iRotation = 0;  // IF IT'S A DOUBLE, DON'T ROTATE
            }
            _iSide = SIDE_LEFT_ATTACH;
        } else {
            if ( _oSelectedTile.isDouble() === false ) {
                iRotation = iAngleVar;
                if (_oSelectedTile.getDotsValue(0) === _iSide2Value) {
                    iRotation = -1 * iAngleVar;
                }
            } else {
                iRotation = 0;  // IF IT'S A DOUBLE, DON'T ROTATE
            }
            _iSide = SIDE_RIGHT_ATTACH;
        };
        
        this.moveToBoard(_oSelectedTile, iRotation, _iSide);
        _oSelectedTile = null;
    };
    
    this.checkIfBothSidesCanBeAttached = function(oTile){
        if (oTile.getDotsValue(0) === _iSide1Value && oTile.getDotsValue(1) === _iSide2Value && 
            !(oTile.getDotsValue(0) !== _iSide1Value && oTile.getDotsValue(1) !== _iSide2Value )) {            
            return true;
        }
        if (oTile.getDotsValue(1) === _iSide1Value && oTile.getDotsValue(0) === _iSide2Value && 
            !(oTile.getDotsValue(1) !== _iSide1Value && oTile.getDotsValue(0) !== _iSide2Value )) {
            return true;
        }
        if (oTile.getDotsValue(0) !== _iSide1Value && oTile.getDotsValue(1) !== _iSide2Value ) {
            return false;
        }
        if (oTile.getDotsValue(1) !== _iSide1Value && oTile.getDotsValue(0) !== _iSide2Value ) {
            return false;
        }
        return false;
    };
    
    this.checkClickedTile = function(oTile){
        if (_bSelectedTile) {
            return;
        };
        
        var iRotation;
        var iAngleVar = 90;

        // IF IT'S THE FIRST TILE TO BE DRAWN
        if (_bFirstTile === true) {
            if (_iTurn === 0) {
                if (oTile.isPlayerTile() ) {
                    oTile.setDrawn(); // SET THE TILE AS DRAWN
                    _bDrawnedTile = true;

                    // CHECK IF IT'S A DOUBLE
                    iRotation = -iAngleVar;
                    if ( oTile.isDouble() === true ) {
                        iRotation = 0;
                    }
                    this.moveToBoard(oTile, iRotation, CENTER_ATTACH);
                } else {
                    this.callShake( oTile.getTile() );
                }
            } else {
                oTile.setDrawn(); // SET THE TILE AS DRAWN
                _bDrawnedTile = true;

                // CHECK IF IT'S A DOUBLE
                iRotation = iAngleVar;
                if ( oTile.isDouble() === true ) {
                    iRotation = 0;
                }
                this.moveToBoard(oTile, iRotation, CENTER_ATTACH);
            }
        } else if (_bFirstTile === false) {
            if (_iTurn === 0) {
                // IF A TILE CAN BE ATTACHED ON BOTH SIDES, LET THE PLAYER CHOOSE ONE
                if (this.checkIfBothSidesCanBeAttached(oTile) === true){
                    this._selectTileSide(oTile);
                    return;
                }
            }
            
            // ATTACH SIDE SETTING
            if (oTile.getDotsValue(0) === _iSide1Value ||
                oTile.getDotsValue(1) === _iSide1Value ) {
                oTile.setDrawn(); // SET THE TILE AS DRAWN
                _bDrawnedTile = true;
                if ( oTile.isDouble() === false ) {
                    iRotation = -1 * iAngleVar;
                    if (oTile.getDotsValue(0) === _iSide1Value) {
                        iRotation = iAngleVar;
                    }
                } else {
                    iRotation = 0;  // IF IT'S A DOUBLE, DON'T ROTATE
                }
                this.moveToBoard(oTile, iRotation, SIDE_LEFT_ATTACH);
            } else if (oTile.getDotsValue(0) === _iSide2Value ||
                       oTile.getDotsValue(1) === _iSide2Value ) {
                
                oTile.setDrawn(); // SET THE TILE AS DRAWN
                _bDrawnedTile = true;
                if ( oTile.isDouble() === false ) {
                    iRotation = iAngleVar;
                    if (oTile.getDotsValue(0) === _iSide2Value) {
                        iRotation = -1 * iAngleVar;
                    }
                } else {
                    iRotation = 0;  // IF IT'S A DOUBLE, DON'T ROTATE
                }
                this.moveToBoard(oTile, iRotation, SIDE_RIGHT_ATTACH);
            } else {
                // IF THIS TILE CAN'T BE ATTACHED TO ANYTHING
                this.callShake( oTile.getTile() );
            }
        }
    };

    this.callShake = function(oTile) {
        playSound("wrong",1,0);
        this.stopShake();
        _oShake = new CShake(oTile, 300, 1, 5);
    };
    
    this.stopShake = function(){
        if(_oShake){
            _oShake.stopTremble();
            _oShake = null;
        }
    };
    
    this.moveToBoard = function(oTile, iRotation, iSide) {
        var _iRotation = iRotation;
        var _iSide = iSide;
        var _oTile = oTile;
        
        this.stopShake();
        _oTile.removeHitArea();
        var iValue = _oTile.getValue();
        
        // GET THE POSITION OF THE TILE FROM WHERE TO START OUR TWEEN
        var oContainer = _aPlayers[_iTurn].getContainer();
        var iPoint = oContainer.localToLocal(_oTile.getX(), _oTile.getY(), _oTilesContainer);
        var oNewTile = new CTile(_oTilesContainer, iValue, _iTurn, iPoint.x, iPoint.y);
        
        playSound("select",1,0);
        
        // TURN THE TILE IF NEEDED
        if (oNewTile.isTurned() === false) {
            if (_iTurn === 0) {
                oNewTile.turnTileInvisible();
            } else {
                oNewTile.turnTile();
            }
        }
        
        _oTile.unload();
        _aPlayers[_iTurn].removeTile(_oTile);
        
        var iX = CANVAS_WIDTH_HALF/2;
        var iY = CANVAS_HEIGHT_HALF/2 + _iTilesContainerOffsetY*2;
        var iOffset;
        
        var iAngleOffset = TILE_WIDTH/4.5;
        
        // UPDATE THE VALUES TO MOVE
        switch (_iSide) {
            case CENTER_ATTACH: // ONLY FOR THE FIRST TILE OF THE GAME
                _oSide1Tile = _oSide2Tile = oNewTile;
                _iSide1Value = oNewTile.getDotsValue(0);
                _iSide2Value = oNewTile.getDotsValue(1);
                
                this.startTileMovement(oNewTile, iX, iY, _iRotation);
                break;
            case SIDE_LEFT_ATTACH: // LEFT SIDE
                if ( oTile.isDouble() || _oSide1Tile.isDouble() ) {
                    iOffset = _iOffsetDouble;
                } else {
                    iOffset = _iOffsetTiles;
                }
                
                // SAVE THE NEW VALUE OF THIS SIDE
                if (_iRotation > 0) { 
                    _iSide1Value = oNewTile.getDotsValue(1);
                } else {
                    _iSide1Value = oNewTile.getDotsValue(0);
                }
                
                if (_iDrawnTilesSide1 < DRAWNTILES_LIMIT1) {
                    iX = _oSide1Tile.getX() - iOffset;
                    iY = _oSide1Tile.getY();
                } else if (_iDrawnTilesSide1 === DRAWNTILES_LIMIT1-1) {
                    iX = _oSide1Tile.getX();
                    iY = _oSide1Tile.getY() - iOffset;
                    if (oTile.isDouble() === false) {
                        _iRotation += 90;
                    }
                } else if (_iDrawnTilesSide1 === DRAWNTILES_LIMIT1) {
                    iX = _oSide1Tile.getX();
                    if (oTile.isDouble() || _oSide1Tile.isDouble() ) {
                        if ( oTile.isDouble() && _oSide1Tile.isDouble()) {
                            // BOTH DOUBLE
                            iX -= iAngleOffset;
                            iY = _oSide1Tile.getY() - iOffset*1.25;
                        } else {
                            if (oTile.isDouble()) {
                                // 2ND DOUBLE
                                iX -= iAngleOffset*1.1;
                                iY = _oSide1Tile.getY() - iOffset*0.7;
                            } else {
                                // 1ST DOUBLE
                                iY = _oSide1Tile.getY() - iOffset*1.3;
                            }
                        }
                    } else {
                        // BOTH SINGLE
                        iX -= iAngleOffset;
                        iY = _oSide1Tile.getY() - iOffset*0.8;
                    }
                    _iRotation += 90;
                } else if (_iDrawnTilesSide1 < DRAWNTILES_LIMIT2) {
                    iX = _oSide1Tile.getX();
                    iY = _oSide1Tile.getY() - iOffset;
                    _iRotation += 90;
                } else if (_iDrawnTilesSide1 === DRAWNTILES_LIMIT2-1) {
                    iX = _oSide1Tile.getX() + iOffset;
                    iY = _oSide1Tile.getY();
                    if (oTile.isDouble() === false) {
                        _iRotation += 180;
                    }
                } else if (_iDrawnTilesSide1 === DRAWNTILES_LIMIT2) {
                    iY = _oSide1Tile.getY();
                    if (oTile.isDouble() || _oSide1Tile.isDouble() ) {
                        if ( oTile.isDouble() && _oSide1Tile.isDouble()) {
                            // BOTH DOUBLE
                            iX = _oSide1Tile.getY() + iOffset*1.25;
                            iY -= iAngleOffset;
                        } else {
                            if (oTile.isDouble()) {
                                // 2ND DOUBLE                                   
                                iX = _oSide1Tile.getX() + iOffset*0.7;
                                iY -= iAngleOffset*1.1;
                            } else {
                                // 1ST DOUBLE                                   
                                iX = _oSide1Tile.getX() + iOffset*1.3;
                            }
                        }
                    } else {
                        // BOTH SINGLE
                        iX = _oSide1Tile.getX() + iOffset*0.8;
                        iY -= iAngleOffset;
                    }
                    _iRotation += 180;
                } else if (_iDrawnTilesSide1 >= DRAWNTILES_LIMIT3) {
                    iX = _oSide1Tile.getX();
                    iY = _oSide1Tile.getY() + iAngleOffset*3.2;
                    _iRotation += 180;
                } else {
                    _iRotation += 180;
                    iX = _oSide1Tile.getX() + iOffset;
                    iY = _oSide1Tile.getY();
                }
                
                _oSide1Tile = oNewTile;
                _iDrawnTilesSide1 += 1;
                this.startTileMovement(oNewTile, iX, iY, _iRotation);
                break;
            case SIDE_RIGHT_ATTACH: // RIGHT SIDE
                if ( oTile.isDouble() || _oSide2Tile.isDouble() ) {
                    iOffset = _iOffsetDouble;
                } else {
                    iOffset = _iOffsetTiles;
                }

                // SAVE THE NEW VALUE OF THIS SIDE
                if (_iRotation > 0) { 
                    _iSide2Value = oNewTile.getDotsValue(0);
                } else {
                    _iSide2Value = oNewTile.getDotsValue(1);
                }
                
                if (_iDrawnTilesSide2 < DRAWNTILES_LIMIT1) {
                    iX = _oSide2Tile.getX() + iOffset;
                    iY = _oSide2Tile.getY();
                } else if (_iDrawnTilesSide2 === DRAWNTILES_LIMIT1-1) {
                    iX = _oSide2Tile.getX();
                    iY = _oSide2Tile.getY() + iOffset;
                    if (oTile.isDouble() === false) {
                        _iRotation += 90;
                    }
                } else if (_iDrawnTilesSide2 === DRAWNTILES_LIMIT1) {
                    iX = _oSide2Tile.getX();
                    if (oTile.isDouble() || _oSide2Tile.isDouble() ) {
                        if ( oTile.isDouble() && _oSide2Tile.isDouble()) {
                            // BOTH DOUBLE
                            iX += iAngleOffset;
                            iY = _oSide2Tile.getY() + iOffset*1.25;
                        } else {
                            if (oTile.isDouble()) {
                                // 2ND DOUBLE
                                iX += iAngleOffset*1.1;
                                iY = _oSide2Tile.getY() + iOffset*0.7;
                            } else {
                                // 1ST DOUBLE
                                iY = _oSide2Tile.getY() + iOffset*1.3;
                            }
                        }
                    } else {
                        // BOTH SINGLE
                        iX += iAngleOffset;
                        iY = _oSide2Tile.getY() + iOffset*0.8;
                    }
                    _iRotation += 90;
                } else if (_iDrawnTilesSide2 < DRAWNTILES_LIMIT2) {
                    iX = _oSide2Tile.getX();
                    iY = _oSide2Tile.getY() + iOffset;
                    _iRotation += 90;
                } else if (_iDrawnTilesSide2 === DRAWNTILES_LIMIT2-1) {
                    iX = _oSide2Tile.getX() - iOffset;
                    iY = _oSide2Tile.getY();
                    if (oTile.isDouble() === false) {
                        _iRotation += 180;
                    }
                } else if (_iDrawnTilesSide2 === DRAWNTILES_LIMIT2) {
                    iY = _oSide2Tile.getY();
                    if (oTile.isDouble() || _oSide2Tile.isDouble() ) {
                        if ( oTile.isDouble() && _oSide2Tile.isDouble()) {
                            // BOTH DOUBLE
                            iX = _oSide2Tile.getY() - iOffset*1.25;
                            iY -= iAngleOffset;
                        } else {
                            if (oTile.isDouble()) {
                                // 2ND DOUBLE
                                iX = _oSide2Tile.getX() - iOffset*0.7;
                                iY += iAngleOffset*1.1;
                            } else {
                                // 1ST DOUBLE
                                iX = _oSide2Tile.getX() - iOffset*1.3;
                            }
                        }
                    } else {
                        // BOTH SINGLE
                        iX = _oSide2Tile.getX() - iOffset*0.8;
                        iY += iAngleOffset;
                    }
                    _iRotation += 180;
                } else if (_iDrawnTilesSide2 >= DRAWNTILES_LIMIT3) {
                    iX = _oSide1Tile.getX();
                    iY = _oSide1Tile.getY() - iAngleOffset*3.2;
                    _iRotation += 180;
                } else {
                    _iRotation += 180;
                    iX = _oSide2Tile.getX() - iOffset;
                    iY = _oSide2Tile.getY();
                }
                 
                _oSide2Tile = oNewTile;
                _iDrawnTilesSide2 += 1;
                this.startTileMovement(oNewTile, iX, iY, _iRotation);
                break;
        };
    };

    this.zoomCamera = function(){
        var iSpeed = 1000;
        
        if (_iScale > TILE_SCALE_LIMIT) {
            _iScale -= TILE_SCALE_VAR;
        }
        
        new createjs.Tween(_oBg)
            .to({scaleX: _iScale, scaleY: _iScale}, iSpeed, createjs.Ease.cubicInOut);
        new createjs.Tween(_oTilesContainer)
            .to({scaleX: _iScale, scaleY: _iScale}, iSpeed, createjs.Ease.cubicInOut);
    };
    
    this.startTileMovement = function(oTile, iX, iY, iRotation) {
        var oTileSprite = oTile.getTile();
        var iMovementSpeed = 750;

        oTile.removeHitArea();
        oTile.setPlayerTile(false);
        
        // SET THE TILE INDEX ON TOP OF THE OTHERS
        _oTilesContainer.setChildIndex( oTileSprite, _oTilesContainer.numChildren - 1);
        
        // COMPENSATE THE ZOOM, BACK TO THE ORIGINAL SCALE
        var iScaleVar = 1 - _iScale;
        oTileSprite.scaleX += iScaleVar;
        oTileSprite.scaleY += iScaleVar;
        
        // MOVE THE TILE
        new createjs.Tween(oTileSprite)
            .to({ x: iX, y: iY, rotation: iRotation, scaleX: TILE_INIT_SCALE, scaleY: TILE_INIT_SCALE}, iMovementSpeed, createjs.Ease.cubicIn)
            .call( function() {
                playSound("tile",0.2,0);
                if (iX !== 0 || iY !== 0) {
                    s_oGame.zoomCamera();      // CAMERA "ZOOM" EFFECT
                }
                s_oGame.checkAfterTileMoved(); // CHECK FOR DOMINO OR NEXT TURN
            });
    };
    
    this.checkAfterTileMoved = function(){
        if (s_oGame.checkForDomino(_iTurn) === true) {
            _bDomino = true;
            _bStartGame = false;
            s_oGame.showDominoText();
            return;
        } else {
            _aPlayers[_iTurn].arrangeTiles();
            s_oGame.changeTurn();
        }
    };
    
    this.checkFirstTile = function() {
        _bGameReady = true;
        
        var iFirstPlayer;           // THE FIRST PLAYER TO PLAY
        var iFirstTileValue = 0;    // THE FIRST TILE'S VALUE
        var oFirstTile;             // THE FIRST TILE TO BE DRAWN
        
        // CHECK THE FIRST TILE TO BE DRAWN (THE HIGHEST-VALUE DOUBLE)
        // SO WE'LL ALSO HAVE THE FIRST PLAYER TO PLAY.
        for (var i = 0; i < _iPlayers; i++) {
            var aTilesArray = _aPlayers[i].getTilesArray();
            
            for (var j = 0; j < aTilesArray.length; j++) {
                var iValue = aTilesArray[j].getDotsValue(0)+aTilesArray[j].getDotsValue(1);
                
                if (iValue >= iFirstTileValue) {
                    if ( aTilesArray[j].isDouble() ) {
                        iFirstTileValue = aTilesArray[j].getDotsValue(0)+aTilesArray[j].getDotsValue(1);
                        oFirstTile = j;
                        iFirstPlayer = i; };
                }
            };
        };
        
        // IF THERE'S NO DOUBLE TO CHOOSE, CHOOSE THE HIGHEST VALUE TILE
        if (iFirstTileValue === 0) {
            for (var i = 0; i < _iPlayers; i++) {
                var aTilesArray = _aPlayers[i].getTilesArray();

                for (var j = 0; j < aTilesArray.length; j++) {
                    var iValue = aTilesArray[j].getDotsValue(0)+aTilesArray[j].getDotsValue(1);
                    
                    if (iValue >= iFirstTileValue) {
                        iFirstTileValue = aTilesArray[j].getDotsValue(0)+aTilesArray[j].getDotsValue(1);
                        oFirstTile = j;
                        iFirstPlayer = i; 
                    }
                };
            };
        }

        _iTurn = iFirstPlayer;
        var aTilesArray = _aPlayers[iFirstPlayer].getTilesArray();
        var oTile = aTilesArray[oFirstTile];
        
        // IF THE FIRST PLAYER IS THE HUMAN PLAYER, SET THE GLOW VISIBLE
        if (iFirstPlayer === 0) {
            if (s_bGlowActive) {
                oTile.setGlowVisible(true);
            }
            _oBlockInput.visible = false;
        // IF IT'S A CPU PLAYER, DRAW THE TILE
        } else if (iFirstPlayer > 0) {
            this.checkClickedTile(oTile);
        }
        _aPlayers[_iTurn].setTurn(true);
        this.setTurnVisibility();
    };
    
    this._checkGame = function() {
        if (_bMatchOver === true) {
            return; }

        if (_bFirstTile === true) {
            _bFirstTile = false; }

        if (!_bDrawnedTile) {
            // IF IT'S THE HUMAN PLAYER'S TURN, CHECK THE TILES
            if (_iTurn === 0) {
                _oBlockInput.visible = false;
                s_oGame.checkToDrawn();
            // IF IT'S A CPU PLAYER'S TURN, CHECK THE TILES TO DRAW THE BEST
            } else {
                _oBlockInput.visible = true;
                if (_bDomino === true) {
                    return;
                } else {
                    s_oGame.cpuDrawTile();
                }
            }
        }

        // CHECK HOW MANY PLAYERS ARE LOCKED
        if (_bDomino === false) {
            s_oGame.checkLockedPlayers();
        }
    };
    
    this.checkForDomino = function(i) {        
        var aTilesArray = _aPlayers[i].getTilesArray();
        // IF A PLAYER HAS FINISHED HIS TILES, THE MATCH IS OVER (DOMINO)
        if (aTilesArray.length === 0) {
            return true;
        } else {
            return false;
        }
    };
    
    this.showDominoText = function() {
        var iSpeedStart = 500;

        // SHOW THE TILES
        for (var i = 0; i < _iPlayers; i++) {
            var aTilesArray = _aPlayers[i].getTilesArray();
            
            for (var j = 0; j < aTilesArray.length; j++) {
                var oTile = aTilesArray[j];
                if (i > 0) {
                    oTile.turnTile();
                }
            };
        };

        // SHOW A "DOMINO" MESSAGE, THIS PLAYER WINS THIS MATCH
        var iPlayerN = _iTurn+1;
        _oDominoText.refreshText(TEXT_PLAYER + " " + iPlayerN + " " + TEXT_DOMINO);
        
        new createjs.Tween.get(_oMsgContainerDomino)
            .to({alpha: 1}, iSpeedStart, createjs.Ease.cubicIn);
        
        playSound("domino",1,0);
    };

    this._onLockedContinue = function() {
        if (_oMsgContainerLocked.alpha < 1) {
            return;
        }
        
        // IF THE GAME IS NOT OVER YET, CHANGE TURN
        if (_bMatchOver === false) {
            new createjs.Tween.get(_oMsgContainerLocked)
                .to({alpha: 0}, 500, createjs.Ease.cubicIn)
                .call(s_oGame.changeTurn);
        // IF THE GAME IS OVER
        } else {            
            s_oGame.getMatchWinnerScore();
            s_oGame.matchOver();
        }
    };
    
    this._onDominoContinue = function() {
        if (_oMsgContainerDomino.alpha < 1) {
            return;
        }
        
        // CALCULATE THE TOTAL SCORE (LOSER PLAYERS' TOTAL 
        // SCORE, MINUS THE WINNER PLAYER'S SCORE)        
        for (var i = 0; i < _iPlayers; i++) {
            if (i !== _iTurn) { // IF IT'S THE WINNING PLAYER
                _iWinnerPoints += s_oGame.totalTilesValue(i);
            } else {
                _iWinnerPoints -= s_oGame.totalTilesValue(i);
            }
        };
        _iWinnerPlayer = _iTurn;        
        
        s_oGame.matchOver();
    };
    
    this.checkLockedPlayers = function() {
        // CHECK THE ACTUAL SITUATION OF THE GAME
        for (var i = 0; i < _iPlayers; i++) {
            if ( s_oGame.checkForDomino(i) === false) {
                // CHECK HOW MANY PLAYERS ARE LOCKED
                if ( _aPlayers[i].getLocked() === true) {
                    _aLockedPlayers[i] = true;
                } else {
                    _aLockedPlayers[i] = false;
                }
                
                // IF THERE'S A "LOCKED" SITUATION, IT'S MATCH OVER
                this.checkLockedMatch();
            }
        };
    };
    
    this.checkLockedMatch = function() {
        if (_iPlayers === 2) {
            if (_aLockedPlayers[0] === true &&
                _aLockedPlayers[1] === true ) {
                _bMatchOver = true;
            } else {
                _bMatchOver = false;
            }
        } else if (_iPlayers === 3) {
            if (_aLockedPlayers[0] === true &&
                _aLockedPlayers[1] === true &&
                _aLockedPlayers[2] === true ) {
                _bMatchOver = true;
            } else {
                _bMatchOver = false;
            }
        } else if (_iPlayers === 4) {
            if (_aLockedPlayers[0] === true &&
                _aLockedPlayers[1] === true &&
                _aLockedPlayers[2] === true &&
                _aLockedPlayers[3] === true ) {
                _bMatchOver = true;
            } else {
                _bMatchOver = false;
            }
        }
    };
    
    this.totalTilesValue = function(iPlayer) {
        var aTilesArray = _aPlayers[iPlayer].getTilesArray();
        var iPlayerTilesValue = 0;
        
        for (var i = 0; i < aTilesArray.length; i++) {
            var oTile = aTilesArray[i];
            if (iPlayer > 0) {
                oTile.turnTile();
            }
            iPlayerTilesValue += oTile.getDotsValue(0) + oTile.getDotsValue(1);
        };
        
        return iPlayerTilesValue;   // THE TOTAL VALUE OF THE ARRAY
    };
    
    this.getMatchWinnerScore = function(aMatchScores){
        if (_bMatchLocked) {
            return;
        }
        
        // CALCULATE HOW MANY POINTS EACH PLAYER HAS SCORED
        var aMatchScores = new Array();
        for (var i = 0; i < _iPlayers; i++) {
            var iPlayerTilesValue = s_oGame.totalTilesValue(i);
            aMatchScores[i] = [i, iPlayerTilesValue];
        };

        // THE WINNER IS THE PLAYER WITH THE LOWEST TILE VALUE
        aMatchScores.sort(function(a, b) {
            var valueA, valueB;

            valueA = a[1]; // 1 is the PlayerTilesValue
            valueB = b[1];
            if (valueA < valueB) {
                return -1;
            }
            else if (valueA > valueB) {
                return 1;
            }
            return 0;
        });

        // THE WINNER SCORE IS THE TOTAL OF THE OTHER PLAYER'S POINTS MINUS HIS/HER SCORE
        for (var i = 1; i < aMatchScores.length; i++) {
            _iWinnerPoints += aMatchScores[i][1];
        }; 
        _iWinnerPoints -= aMatchScores[0][1];
        _iWinnerPlayer = aMatchScores[0][0];
    };
    
    this.lockedMatch = function() {
        s_oGame.getMatchWinnerScore();
        _bMatchLocked = true;
    };
    
    this.resetScore = function(iPlayers){
        // RESET THE SAVED SCORES (FOR NEXT GAMES)        
        switch (iPlayers) {
            case 2:
                s_aPlayersScore2 = [0,0];
                setItemJson("classicdomino_scores2", s_aPlayersScore2);
                _aScore = s_aPlayersScore2;
                break;
            case 3:
                s_aPlayersScore3 = [0,0,0];
                setItemJson("classicdomino_scores3", s_aPlayersScore3);
                _aScore = s_aPlayersScore3;
                break;
            case 4:
                s_aPlayersScore4 = [0,0,0,0];
                setItemJson("classicdomino_scores4", s_aPlayersScore4);
                _aScore = s_aPlayersScore4;
                break;
        }
    };
    
    this.saveScore = function(){
        switch(_iPlayers) {
            case 2: 
                setItemJson("classicdomino_scores2", _aScore);
                for (var i = 0; i < _aScore.length; i++) {
                    s_aPlayersScore2[i] = _aScore[i];
                };
                break;
            case 3: 
                setItemJson("classicdomino_scores3", _aScore);
                for (var i = 0; i < _aScore.length; i++) {
                    s_aPlayersScore3[i] = _aScore[i];
                };
                break;
            case 4: 
                setItemJson("classicdomino_scores4", _aScore);
                for (var i = 0; i < _aScore.length; i++) {
                    s_aPlayersScore4[i] = _aScore[i];
                };
                break;
        };
    };
    
    this.matchOver = function() {
        // UPDATE THE PLAYERS' SCORE
        _aScore[_iWinnerPlayer] += _iWinnerPoints;
        this.saveScore();

        // CHECK IF THERE'S A PLAYER WITH THE MAX SCORE (GAME OVER - WIN/LOSE)
        this.checkForWinner();
    };
    
    this.checkForWinner = function() {
        var bMatchOver = false;
        
        for (var i = 0; i < _iPlayers; i++) {
            // THE GAME IS OVER (WIN/LOSE)
            if (_aScore[i] >= WIN_SCORE[_iGoal]) {
                bMatchOver = true;
                // IF THE HUMAN PLAYER WINS THE GAME
                if (i === 0) {
                    _bWin = true;
                    this._checkWin();
                // IF A CPU PLAYER WINS THE GAME
                } else {
                    this._gameOver();
                }
            }
        };
        
        // THE GAME IS NOT OVER YET, NEW MATCH!
        if (bMatchOver === false) {
            // SHOW A "MATCH OVER" MESSAGE WITH PLAYERS' SCORES
            this.matchOverScreen();
        }
    };
    
    this.matchOverScreen = function() {
        _bStartGame = false;

        if (_oMatchOverPanel === null) {
            playSound("match_over",1,0);
            _oMatchOverPanel = new CMatchOver(_iPlayers, _iWinnerPlayer, _iWinnerPoints);
            _bDisableEvents = true;
            
            _oMsgContainerLocked.visible = false;
            _oMsgContainerDomino.visible = false;
        }
    };

    this.checkBoard = function(){ 
        var oClickPanel = new createjs.Shape();
        oClickPanel.graphics.beginFill("rgba(0,0,0,0.4)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oClickPanel.on("click", s_oGame.returnToEndPanel, s_oGame, true, oClickPanel);
        s_oStage.addChild(oClickPanel);
        
        _oMatchOverPanel.hide();
    };

    this.returnToEndPanel = function(evt, oClickPanel){ 
        s_oStage.removeChild(oClickPanel);
        _oMatchOverPanel.show();
    };

    this.getScore = function(iPlayer) {
        return _aScore[iPlayer];
    };
    
    this.setValueSide1 = function(value) {
        _iSide1Value = value; };

    this.setValueSide2 = function(value) {
        _iSide2Value = value; };

    this.getValueSide1 = function() {
        return _iSide1Value; };
    
    this.getValueSide2 = function() {
        return _iSide2Value; };
    
    this.getTurn = function() {
        return _iTurn; };
    
    this.gameReady = function() {
        return _bGameReady; };
    
    this.setTurnVisibility = function(){
        for (var i = 0; i < _iPlayers; i++) {
            if (i === _iTurn) {
                _aPlayers[i].setTurn(true);
            } else {
                _aPlayers[i].setTurn(false);
            }
        };
    };
    
    this.changeTurn = function() {
        _bDrawnedTile = false;
        _iTurn += 1;

        if (_iTurn >= _iPlayers) {
            _iTurn = 0;
        }

        s_oGame.setTurnVisibility();

        // SET EVERY GLOW INVISIBLE
        if (_iTurn !== 0) {
            var aTiles = _aPlayers[0].getTilesArray();

            for (var i = 0; i < aTiles.length; i++) {
                var oTile = aTiles[i];
                oTile.setGlowVisible(false);
            };
        }
        
        s_oGame._checkGame();
    };

    this.update = function() {
        // DELAY THE CLOSING ANIMATIONS, AT THE END OF A LOCKED MATCH
        if (_bStartGame && _bMatchOver && !_bMatchLocked) {
            _iMatchTimer += s_iTimeElaps;

            if (_iMatchTimer > MATCHOVER_TIMER) {
                if (_bDomino === true) {
                    return;
                }
                
                _bStartGame = false;
                _iMatchTimer = 0;
                this.lockedMatch();
                return;
            }
        }
    };

    s_oGame = this;

    this._init();
}

var s_oGame;