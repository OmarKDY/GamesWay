function CGame() {
    var _iTotalScore;
    var _iLevel;
    var _iLevelMoves;
    var _iLevelScore;
    var _iLevelStars;
    var _iCurrentPosition;
    var _iEndPosition;
    
    var _bStartGame;
    var _bStartWater;
    var _bClickBlocked;
    var _bPaused;
    var _bCircuitOver;
    
    var _oGameContainer;
    var _oCloudsAnimator;
    var _oBoard;
    var _oPopupContainer;
    var _oHelpPanel;
    var _oDispenser;
    var _oMascotte;
    var _oInterface;
    var _oWinPanel;
    var _oLosePanel;
    var _oBg;
    var _oEndPipe;

    var _aSolutionFound;

    this._init = function() {
        s_oTweenController = new CTweenController();
        this._resetVariables();       
        $(s_oMain).trigger("start_level", _iLevel+1);
       
        _oGameContainer = new createjs.Container();
        s_oStage.addChild(_oGameContainer);
       
        this._initBackground();
        _oBoard = new CBoard(_oGameContainer, _iLevel);
        this._initDispenser();
        _oMascotte = new CMascotte(_oGameContainer);        
        this._initEndPipe();
        this._addFrameLogo();
        _oInterface = new CInterface(_iLevel, _oGameContainer);

        this._resetLevelInformation();
        _oInterface.refreshScore(_iTotalScore);
        
        _oPopupContainer = new createjs.Container;
        _oGameContainer.addChild(_oPopupContainer);
        
        if (_iLevel === 0) {
            _oHelpPanel = CHelpPanel();
        } else {
            this._onExitHelp();
        }

        setVolume("soundtrack", 0.5);
        
    };
    
    this._initBackground = function(){
        var oSprite = s_oSpriteLibrary.getSprite("sky");
        _oBg = createBitmap(oSprite);
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oGameContainer.addChild(_oBg);
        
        _oCloudsAnimator = new CCloudsAnimator(_oGameContainer);

        var oSprite = s_oSpriteLibrary.getSprite("buildings");
        var oBuildings = createBitmap(oSprite);        
        oBuildings.y = 145;
        
        var oSprite = s_oSpriteLibrary.getSprite("floor");
        var oFloor = createBitmap(oSprite);
        oFloor.y = 376;

        var oSprite = s_oSpriteLibrary.getSprite("glass");
        var oGlass = createBitmap(oSprite);
        oGlass.regX = oSprite.width * 0.5;
        oGlass.regY = oSprite.height * 0.5;
        oGlass.x = CANVAS_WIDTH_HALF;
        oGlass.y = CANVAS_HEIGHT_HALF + 14;

        var oSprite = s_oSpriteLibrary.getSprite("frame");
        var oFrame = createBitmap(oSprite);
        oFrame.regX = oSprite.width * 0.5;
        oFrame.regY = oSprite.height * 0.5;
        oFrame.x = CANVAS_WIDTH_HALF;
        oFrame.y = CANVAS_HEIGHT_HALF - 12;

        _oGameContainer.addChild(oBuildings, oFloor, oGlass, oFrame);
    };
    
    this._addFrameLogo = function(){
        var oSprite = s_oSpriteLibrary.getSprite("frame_logo");
        var oFrameLogo = createBitmap(oSprite);
        oFrameLogo.regX = oSprite.width * 0.5;
        oFrameLogo.regY = oSprite.height * 0.5;
        oFrameLogo.x = CANVAS_WIDTH_HALF - 15;
        oFrameLogo.y = 58;
        _oGameContainer.addChild(oFrameLogo);
        
        new createjs.Tween.get(oFrameLogo, {loop: true})
            .wait(FRAME_LOGO_PULSE_WAIT)
            .to({scaleX: FRAME_LOGO_PULSE_VAR, scaleY: FRAME_LOGO_PULSE_VAR}, FRAME_LOGO_PULSE_SPEED, createjs.Ease.backIn)
            .to({scaleX: 1, scaleY: 1}, FRAME_LOGO_PULSE_SPEED, createjs.Ease.backIn)
            .to({scaleX: FRAME_LOGO_PULSE_VAR, scaleY: FRAME_LOGO_PULSE_VAR}, FRAME_LOGO_PULSE_SPEED, createjs.Ease.backIn)
            .to({scaleX: 1, scaleY: 1}, FRAME_LOGO_PULSE_SPEED, createjs.Ease.backIn);            
    };
    
    this._updateTotalScore = function(){
        _iTotalScore = 0;        
        for (var i = 0; i < s_aScores.length; i++) {
            _iTotalScore += s_aScores[i];
        };
        s_iTotalScore = _iTotalScore;
    };
    
    this._initDispenser = function(){
        var iSpriteWidth = 132;
        var iSpriteHeight = 452;
        
        var data = { 
            images: [s_oSpriteLibrary.getSprite("dispenser_container")],
            frames: {width: iSpriteWidth, height: iSpriteHeight, regX: iSpriteWidth * 0.5, regY: iSpriteHeight * 0.5}, 
            animations: { idle: [0, 39, 'idle']},
            framerate: FPS_DISPENSER 
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);
        
        _oDispenser = createSprite(oSpriteSheet, 'idle', 0, 0, iSpriteWidth, iSpriteHeight);
        _oDispenser.x = 275;
        _oDispenser.y = 395;
        _oGameContainer.addChild(_oDispenser);
    };
    
    
    
    this._resetVariables = function(){
        _iLevel = s_oLevelSettings.getCurrentLevel();
        this._updateTotalScore();
        _iLevelScore = 0;
        _iLevelStars = 0;
        
        _oWinPanel = null;
        _oLosePanel = null;

        _bStartGame = false;
        _bStartWater = false;
        _bClickBlocked = false;
        _bPaused = false;
        _bCircuitOver = false;
    };
    
    this._resetLevelInformation = function(){
        _iLevelMoves = MOVES_INFO;
        _oInterface.updateLevelMoves(_iLevelMoves);
        _oInterface.refreshScore(_iTotalScore);
    };
    
    this._initEndPipe = function(){
        var iSpriteWidth = 192;
        var iSpriteHeight = 456;
        
        var aSpriteImages = [];
        for (var i = 0; i < 205; i++) {
            aSpriteImages.push(s_oSpriteLibrary.getSprite("soda_bottle_" + i));
        };
        
        var data = {
            images: aSpriteImages,
            frames: {width: iSpriteWidth, height: iSpriteHeight},
            animations: {IDLE: [0, 0, "IDLE"],
                         ANIMATION: [1, 9, false],
                         END_ANIMATION: [10, 204, false]},
            framerate: FPS_PIPE_END_FLOW
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);
        _oEndPipe = createSprite(oSpriteSheet, "IDLE", iSpriteWidth * 0.5, iSpriteHeight * 0.5, iSpriteWidth, iSpriteHeight);
        _oEndPipe.x = 1010;
        _oEndPipe.y = 173;
        _oGameContainer.addChild(_oEndPipe);
        
        _iEndPosition = _oBoard.findSquarePosition(END_POSITION_COLUMN, END_POSITION_ROW);
    };
    
    this._unload = function() {
        _bStartGame = false;
        _oBoard.unload();

        if (_oWinPanel !== null) {
            _oWinPanel.unload(); 
        }
        if (_oLosePanel !== null) {
            _oLosePanel.unload(); 
        }
        
        _oInterface.unload();
        _oGameContainer.removeAllChildren();
        _oCloudsAnimator = null;
        createjs.Tween.removeAllTweens();

        if (s_bMobile === false) {
            document.onkeydown = null;
            document.onkeyup = null;
        }
    };

    this.onExit = function(){
        this._unload();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        setVolume("soundtrack", 1);
        s_oMain.gotoMenu();
    };

    this._onExitHelp = function(){
        _bStartGame = true;
    };

    this.pause = function(bValue){
        _bStartGame = !bValue;
        _bPaused = bValue;
        
        // PAUSE/UNPAUSE PIPE ANIMATION
        var aSquares = _oBoard.getArray();
        for (var i = 0; i < aSquares.length; i++) {
            aSquares[i].setPaused(bValue);
        }
    };

    this._calculateLevelStars = function(){
        if (_iLevelMoves > MOVES_INFO/STARS_VARIABLE_MAX) {
            _iLevelStars = 3;
        } else if (_iLevelMoves > MOVES_INFO/STARS_VARIABLE_MIN && _iLevelMoves <= MOVES_INFO/STARS_VARIABLE_MAX) {
            _iLevelStars = 2;
        } else {
            _iLevelStars = 1;
        }
    };
    
    this.updateAndSaveScores = function(){
        // UPDATE STARS
        
        this._calculateLevelStars();

        if (s_aStars[_iLevel] < _iLevelStars) {
            s_aStars[_iLevel] = _iLevelStars;
        }

        // UPDATE SCORE
        _iLevelScore = _iLevelStars * STAR_SCORE;
        if (s_aScores[_iLevel] < _iLevelScore) {
            s_aScores[_iLevel] = _iLevelScore;
        }
        this._updateTotalScore();

        // UPDATE THE LAST LEVEL PLAYABLE
        if (s_iLastLevel < _iLevel+2) {
            s_iLastLevel = _iLevel+2;
        }
        
        s_oLocalStorage.saveData();
    };
    
    this.gameWin = function(){
        this._stopSoundtrackAndRestart(2500);
        _bStartGame = false;

        if (_oWinPanel === null) {
            playSound("character_laugh",1,false);
            playSound("game_win",1,false);

            _oWinPanel = new CWinPanel(_oPopupContainer, _iLevel, _iTotalScore, _iLevelScore, _iLevelStars);
            _oWinPanel.show(_oMascotte);
            
            // SET THE MASCOTTE IN FRONT OF THE PANEL
            _oMascotte.changeContainer( _oWinPanel.getContainer() );
        }
    };

    this._gameOver = function(){
        this._stopSoundtrackAndRestart(3500);
        
        if (_oLosePanel === null) {
            playSound("cry",1,false);
            playSound("game_over",1,false);

            _oLosePanel = new CLosePanel(_oPopupContainer, _iTotalScore);
            _oLosePanel.show(_oMascotte);            

            // SET THE MASCOTTE IN FRONT OF THE PANEL AND SET THE CORRECT ANIMATION
            _oMascotte.playAnimation("lose");
            _oMascotte.changeContainer(_oLosePanel.getContainer());
        }
    };

    this._stopSoundtrackAndRestart = function(iWaitTime){
        stopSound("soundtrack");
        if (soundPlaying("soundtrack") === false) {
            setTimeout( function(){ playSound("soundtrack",0.5,true); }, iWaitTime);
        };
    };
    
    this.restartGame = function(){
        this._unload();
        $(s_oMain).trigger("restart_level", _iLevel);
        s_oLevelSettings.loadLevel(_iLevel);
        s_oMain.gotoGame();        
    };
    
    this.onNextLevel = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        this._unload();
        $(s_oMain).trigger("end_level", _iLevel);
        s_oLevelSettings.loadLevel(_iLevel+1);
        s_oMain.gotoGame();
    };

    this.endLevel = function(){
        _oInterface.refreshScore(_iTotalScore);        
        $(s_oMain).trigger("end_level", _iLevel);
    };

    this._checkLevel = function(){
        // CHECK IF THE PIPES ARE IN THE CORRECT ORDER FOR THE SOLUTION
        if (this._checkIfSolutionIsFound()) {
            s_oInterface.showFFWDBut();
            this.updateAndSaveScores();
            this._openWaterOnStartPipe();
        } else {
            // IF NO MOVES ARE LEFT, IT'S GAME OVER
            if (_iLevelMoves === 0) {
                _bStartGame = false;
                this._gameOver();
            // ELSE, CONTINUE THE GAME
            } else {
                return false;
            }
        }
    };
    
    this._checkIfSolutionIsFound = function(){
        
        var iStartCol = 0;
        var iStartRow = 1;
        var oPipe = _oBoard.findSquareWithItsPosition(iStartCol,iStartRow);
        var oState = oPipe.getCurPipeState();
        var iStartProvenience = PROVENIENCE_TOP;
        
        _aSolutionFound = new Array();
        _aSolutionFound.push({dir:{col: 0, row: 0}, provenience: iStartProvenience});
        _aSolutionFound.push({dir:{col: iStartCol, row: iStartRow}, provenience: iStartProvenience});
        var bWinnerPathFound = this._getAvailablePath(oState, iStartProvenience, iStartCol, iStartRow);

        return bWinnerPathFound;
    };
        
    this._getAvailablePath = function(oPipeState, iStartProvenience, iStartCol, iStartRow){
        var iExitProvenience = this._getExitProvenience(oPipeState, iStartProvenience);
        var oNextDir;
        if(iExitProvenience !== null){
            oNextDir = this._getNextDirection(iExitProvenience, iStartCol, iStartRow);
            if(oNextDir.col > END_POSITION_COLUMN && oNextDir.row === END_POSITION_ROW){
                /// WIN CONDITION
                return true;
            }else {
                /// CONTINUE TO CHECK
                var oNextPipeState = this._getNextPipeState(oNextDir.col, oNextDir.row);
                if(oNextPipeState){
                    var iNextProvenience = this._getInvertedProvenience(iExitProvenience);
                    _aSolutionFound.push({dir:oNextDir, provenience: iNextProvenience});
                    return this._getAvailablePath(oNextPipeState, iNextProvenience, oNextDir.col, oNextDir.row);
                }else {
                    return false;
                }
            }
        } else {
            return false;
        } 
    };
    
    this._getNextPipeState = function(iCol, iRow){
        if(iRow<0 || iRow === NUM_SQUARE_ROWS){
            return null;
        }
        if(iCol<0 || iCol === NUM_SQUARE_COLUMNS){
            return null;
        }

        var oPipe = _oBoard.findSquareWithItsPosition(iCol, iRow);
        var oState = null;
        if(oPipe){
            oState = oPipe.getCurPipeState();
        }
        
        return oState;
    };
    
    this._getNextDirection = function(iNextProvenience, iStartCol, iStartRow){
        var iNextCol = iStartCol;
        var iNextRow = iStartRow;
        switch(iNextProvenience){
            case PROVENIENCE_TOP:{
                    iNextRow--;
                break;
            };
            case PROVENIENCE_RIGHT:{
                    iNextCol++;
                break;
            };
            case PROVENIENCE_BOTTOM:{
                    iNextRow++;
                break;
            };
            case PROVENIENCE_LEFT:{
                    iNextCol--;
                break;
            };
        }

        return {col: iNextCol, row: iNextRow};
        
    };
    
    this._getExitProvenience = function(oPipeState, iStartProvenience){
        var szStartProvenience;
        switch(iStartProvenience){
            case PROVENIENCE_TOP:{
                    szStartProvenience = "open_top";
                break;
            };
            case PROVENIENCE_RIGHT:{
                    szStartProvenience = "open_right";
                break;
            };
            case PROVENIENCE_BOTTOM:{
                    szStartProvenience = "open_bottom";
                break;
            };
            case PROVENIENCE_LEFT:{
                    szStartProvenience = "open_left";
                break;
            };
        }
        
        var iNextProvenience = null;
        if(oPipeState[szStartProvenience]){ /// CONDITION THAT CHECK WATER START FLOWABILITY
            for(var szDir in oPipeState){
                
                if(szDir !== szStartProvenience && oPipeState[szDir]){
                    switch(szDir){
                        case "open_top":{
                                iNextProvenience = PROVENIENCE_TOP;
                            break;
                        };
                        case "open_right":{
                                iNextProvenience = PROVENIENCE_RIGHT;
                            break;
                        };
                        case "open_bottom":{
                                iNextProvenience = PROVENIENCE_BOTTOM;
                            break;
                        };
                        case "open_left":{
                                iNextProvenience = PROVENIENCE_LEFT;
                            break;
                        };
                    }
                }
            }
        }
        
        return iNextProvenience;
    };
    
    this._getInvertedProvenience = function(iStartProvenience){
        var iInvertedProvenience;
        switch(iStartProvenience){
            case PROVENIENCE_TOP:{
                    iInvertedProvenience = PROVENIENCE_BOTTOM;
                break;
            };
            case PROVENIENCE_RIGHT:{
                    iInvertedProvenience = PROVENIENCE_LEFT;
                break;
            };
            case PROVENIENCE_BOTTOM:{
                    iInvertedProvenience = PROVENIENCE_TOP;
                break;
            };
            case PROVENIENCE_LEFT:{
                    iInvertedProvenience = PROVENIENCE_RIGHT;
                break;
            };
        }
        return iInvertedProvenience;
    };
    
    this.onClickedPipe = function(){
        playSound("place_pipe",1,false);
        this._subtractMoves();
        this._checkLevel();
    };
    
    this._subtractMoves = function(){
        if (_iLevelMoves < 1) {
            return;
        }
        
        _iLevelMoves--;
        _oInterface.updateLevelMoves(_iLevelMoves);
    };
    
    this.removeLastScore = function(){
        s_aScores[_iLevel] = 0;
    };
    
    this._openWaterOnStartPipe = function(){
        // FIND THE START PIPE
        var aSquares = _oBoard.getArray();

        for (var i = 0; i < aSquares.length; i++) {
            var oInfo = aSquares[i].getPipeInfos();

            // ONCE FOUND THE START PIPE, OPEN WATER
            if (oInfo.img === PIPE_IMG_START) {
                _bStartGame = false;
                _iCurrentPosition = 0;
                this._startWater();
            }
        }
    };
    
    this._startWater = function(){
        if (!_bStartWater) {
            _bStartWater = true;
        }

        var iCol = _aSolutionFound[_iCurrentPosition].dir.col;
        var iRow = _aSolutionFound[_iCurrentPosition].dir.row;
        var iProvenience = _aSolutionFound[_iCurrentPosition].provenience;
        var oPipe = _oBoard.findSquareWithItsPosition(iCol,iRow);

        oPipe.setWatered(iProvenience);
        
        if (soundPlaying("water_movement") === false) {
            playSound("water_movement",1,false);
        };
    };
   
    this.onPipeAnimationEnd = function(){
        _iCurrentPosition++;
        // IF WE ARE AT THE END OF THE CIRCUIT, START THE GAME WIN ANIMATIONS
        if(_iCurrentPosition === _aSolutionFound.length){
            _bCircuitOver = true;
            _oMascotte.playAnimation("win");
            this._startEndPipeAnimation();
        } else { // ELSE, PROCEED WITH THE CIRCUIT
            this._startWater();
        }
    };

    this._startEndPipeAnimation = function(){
        if (soundPlaying("water_movement") === false) {
            playSound("water_movement",1,false);
        };
        
        var oParent = this;
        _oEndPipe.gotoAndPlay("ANIMATION");
        _oEndPipe.on("animationend", function(){
            if (_oWinPanel === null) {
                _oEndPipe.gotoAndPlay("END_ANIMATION");
                oParent.gameWin();
            }
        });
    };

    this.FFWDWaterAnimation = function(){
        var iFramerate = 1000;
        _oEndPipe.framerate = iFramerate;
        for(var i=0; i<_aSolutionFound.length; i++){
            var iCol = _aSolutionFound[i].dir.col;
            var iRow = _aSolutionFound[i].dir.row;

            var oPipe = _oBoard.findSquareWithItsPosition(iCol,iRow);
            oPipe.setFrameRate(iFramerate);
        };
        s_oInterface.hideFFWDBut();
    };

    this.isStartGame = function(){
        return _bStartGame;
    };

    this.update = function() {
        // UPDATE CLOUDS MOVEMENT
        _oCloudsAnimator.update();
    };
    
    s_oGame = this;

    this._init();
}

var s_oGame;
var s_oTweenController;