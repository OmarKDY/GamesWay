function CGame(iLevel) {
    var _iTotalScore;
    var _iLevel;
    var _iTimeInLevel;
    var _iLevelGoal;
    var _iLevelScore;
    var _iStartOpening;
    var _iCurrentPosition;
    var _iLongestCircuit;
    
    var _bStartGame;
    var _bStartWater;
    var _bClickBlocked;
    var _bPaused;
    
    var _oBoardContainer;
    var _oBoard;
    var _oPopupContainer;
    var _oNextPanel;
    var _oNextStroke;
    var _oHelpPanel;
    var _oMascotte;
    var _oInterface;
    var _oWinPanel;
    var _oLosePanel;
    var _oBg;
    var _oLampLeft;
    var _oLampRight;

    this._init = function() {
       this.resetVariables();       
       $(s_oMain).trigger("start_level", _iLevel+1);
       
        var oSprite = s_oSpriteLibrary.getSprite("bg_game");
        _oBg = createBitmap(oSprite);
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oBg);
        
        // CREATE THE MOVING LAMPS, THE "NEXT" PANEL, THE MASCOTTE
        this.initLamps();
        this.initNextPanel();
        _oMascotte = new CMascotte();        
        
        _oBoardContainer = new createjs.Container;
        s_oStage.addChild(_oNextPanel, _oBoardContainer, _oNextStroke);
        _oBoard = new CBoard(_oBoardContainer);
        _oInterface = new CInterface(_iLevel+1);        
        this.initStartPipe();
        this.resetLevelInformation();
        
        _oPopupContainer = new createjs.Container;
        s_oStage.addChild(_oPopupContainer);
        
        if (_iLevel === 0) {
            _oHelpPanel = new CHelpPanel();
        } else {
            this._onExitHelp();
        };

        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
    };
    
    this.initNextPanel = function(){
        var oSprite = s_oSpriteLibrary.getSprite("next_panel");
        _oNextPanel = createBitmap(oSprite);
        _oNextPanel.x = NEXT_COLUMN_Y - 62;
        _oNextPanel.y = 0;
        
        var oSprite = s_oSpriteLibrary.getSprite("next_pipe");
        _oNextStroke = createBitmap(oSprite);
        _oNextStroke.regX = oSprite.width/2;
        _oNextStroke.regY = oSprite.height/2;
        _oNextStroke.x = NEXT_COLUMN_Y + 2;
        _oNextStroke.y = ROWS_COORDS[4] + NEXT_COLUMN_OFFSET_Y;
        
        var iScaleVar = 1.2;
        
        new createjs.Tween.get(_oNextStroke, {loop: true})
            .to({scaleX: iScaleVar, scaleY: iScaleVar}, 850, createjs.Ease.quadOut)
            .to({scaleX: 1, scaleY: 1}, 650, createjs.Ease.quadIn);
    };
    
    this.initLamps = function(){
        var iAnimationRotation = 3;
        var iAnimationWidth = 409;
        var iAnimationHeight = 388;
        
        var data = {
            images: [s_oSpriteLibrary.getSprite("lamp")],
            frames: {width: iAnimationWidth, height: iAnimationHeight},
            animations: { idle: [0, 24, 'idle'] },
            framerate: 30
        };        
        var oSpriteSheet = new createjs.SpriteSheet(data);
        
        _oLampLeft = createSprite(oSpriteSheet, 'idle', 0, 0, iAnimationWidth, iAnimationHeight);
        _oLampLeft.regX = 182;
        _oLampLeft.regY = 89;
        _oLampLeft.x = 170;
        _oLampLeft.y = 70;
        
        _oLampRight = createSprite(oSpriteSheet, 'idle', 0, 0, iAnimationWidth, iAnimationHeight);
        _oLampRight.regX = 182;
        _oLampRight.regY = 89;
        _oLampRight.x = 1185;
        _oLampRight.y = _oLampLeft.y;
        _oLampRight.scaleX = -1;
        s_oStage.addChild(_oLampLeft, _oLampRight);
        
        new createjs.Tween.get(_oLampLeft, {loop:true})
            .to({rotation: -1*iAnimationRotation}, 1500, createjs.Ease.quadOut)
            .to({rotation: 0}, 1500, createjs.Ease.quadIn)
            .to({rotation: iAnimationRotation}, 1500, createjs.Ease.quadOut)
            .to({rotation: 0}, 1500, createjs.Ease.quadIn);
        new createjs.Tween.get(_oLampRight, {loop:true})
            .to({rotation: 1*iAnimationRotation}, 1600, createjs.Ease.quadOut)
            .to({rotation: 0}, 1600, createjs.Ease.quadIn)
            .to({rotation: -1*iAnimationRotation}, 1600, createjs.Ease.quadOut)
            .to({rotation: 0}, 1600, createjs.Ease.quadIn);
    };
    
    this.resetStage = function(){
        _oMascotte.animationIdle();
        _oBoard.unload();
        _oBoard = new CBoard(_oBoardContainer);
        
        this.initStartPipe();
    };
    
    this.resetVariables = function(){
        _iLevel = iLevel;
        _iTotalScore = s_iTotalScore;
        _iLevelScore = 0;
        _iLongestCircuit = 0;
        
        _oWinPanel = null;
        _oLosePanel = null;

        _bStartGame = false;
        _bStartWater = false;
        _bClickBlocked = false;
        _bPaused = false;
    };
    
    this.resetLevelInformation = function(){
        _iTimeInLevel = s_oLevelSettings.getStartTime(_iLevel);
        _iLevelGoal = s_oLevelSettings.getLevelGoal(_iLevel);
        _oInterface.updateLevelGoal(0);
        _oInterface.activateButSkip(false);
        _oInterface.refreshScore(_iLevelScore);
    };
    
    this.initStartPipe = function(){
        var iRandomType = Math.floor((Math.random() * 4) + 0);
        var aTypes = [PIPE_START1, PIPE_START2, PIPE_START3, PIPE_START4];
        var aStartOpenings = [PROVENIENCE_LEFT, PROVENIENCE_RIGHT, PROVENIENCE_BOTTOM, PROVENIENCE_TOP];
        
        var aType = aTypes[iRandomType];
        _iStartOpening = aStartOpenings[iRandomType];

        _oBoard.updateSquare(START_POSITION_COLUMN, START_POSITION_ROW, aType);
        
        var iStartPosition = _oBoard.findSquarePosition(START_POSITION_COLUMN, START_POSITION_ROW);
        var oStartSquare = _oBoard.getSquare(iStartPosition);
        oStartSquare.setStartArrow();
    };
    
    this._unload = function() {
        _bStartGame = false;
        _oBoard.unload();

        if(_oWinPanel !== null){
            _oWinPanel.unload(); }

        if(_oLosePanel !== null){
            _oLosePanel.unload(); }
        
        _oInterface.unload();
        s_oStage.removeAllChildren();
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
        if (_iCurrentPosition !== undefined) {
            var oPipe = _oBoard.getSquare(_iCurrentPosition);
            oPipe.setPaused(bValue);
        };
    };
    
    this.gameWin = function(){
        stopSound("soundtrack");
        
        _bStartGame = false;
        playSound("character_laugh",1,false);
        playSound("game_win",1,false);
            
        // UPDATE THE LAST LEVEL PLAYABLE
        var iNewLevel = _iLevel+2;
        if(iNewLevel > s_iLastLevel){
            s_iLastLevel = iNewLevel;
            saveItem("pipebeer_lastlevel", s_iLastLevel);
        }

        // UPDATE AND SAVE SCORE
        _iTotalScore += _iLevelScore;
        s_iTotalScore = _iTotalScore;            
        saveItem("pipebeer_totalscore", s_iTotalScore);
        
        if (_iLongestCircuit > s_iLongestCircuit) {
            s_iLongestCircuit = _iLongestCircuit;
            saveItem("pipebeer_longestcircuit", s_iLongestCircuit);
        };
            
        if(_oWinPanel === null){
            _oMascotte.animationWin();
            
            _oWinPanel = new CWinPanel(_oPopupContainer);
            _oWinPanel.show(_oMascotte);
            
            var oContainer = _oWinPanel.getContainer();
            _oMascotte.changeContainer(oContainer);
        };
        
        setTimeout(function(){ playSound("soundtrack",0.5,true); }, 3000);
    };

    this.gameOver = function(){
        stopSound("soundtrack");
        
        if(_oLosePanel === null){
            playSound("game_over",1,false);
            playSound("cry",1,false);

            _oMascotte.animationLose();
            
            _oLosePanel = new CLosePanel(_oPopupContainer);
            _oLosePanel.show(_oMascotte);
            
            var oContainer = _oLosePanel.getContainer();
            _oMascotte.changeContainer(oContainer);
        }
        
        setTimeout(function(){ playSound("soundtrack",0.5,true); }, 3000);
    };

    this.restartGame = function(){
        $(s_oMain).trigger("restart_level", _iLevel);
                
        this.resetVariables();
        this.resetStage();
        this.resetLevelInformation();
        
        this._onExitHelp();       
    };
    
    this.onNextLevel = function(){
        this._unload();
        $(s_oMain).trigger("end_level", _iLevel);        
        s_oMain.gotoGame(_iLevel+1);                
        $(s_oMain).trigger("show_interlevel_ad");
    };
    
    this.getLevel = function(){
        return _iLevel;
    };
    
    this.endLevel = function(){
        _oInterface.refreshScore(_iLevelScore);        
        $(s_oMain).trigger("end_level", _iLevel);
        
        // IF THE LEVEL GOAL WAS NOT REACHED, GAME OVER
        if (_iLevelGoal > 0) {
            this.gameOver();
        // IF THE LEVEL GOAL WAS REACHED, THE LEVEL IS WON
        } else {
            this.gameWin();
        };
    };
    
    this.checkLevel = function(){
        _bStartGame = false;
        
        // FOR EACH UNUSED PIPE, SUBTRACT POINTS
        var aSquares = _oBoard.getArray();
        for (var i = 0; i < aSquares.length; i++) {
            var oSquare = aSquares[i];
            var aInfo = oSquare.getInfoArray();

            if (oSquare.isWatered() === false) {
                if (aInfo[0] > 0 && aInfo[0] < 4) {
                    oSquare.startExplode(UNUSED_PIPE_MALUS);
                    s_oGame.subtractPoints(UNUSED_PIPE_MALUS);
                };
            };
        };
        
        this.endLevel();
    };
    
    this.setClickBlocked = function(bValue){
        _bClickBlocked = bValue;
    };
    
    this.getClickBlocked = function(){
        return _bClickBlocked;
    };
    
    this.subtractLevelGoal = function(){
        _iLevelGoal--;
        _oInterface.updateLevelGoal(LEVEL_GOAL[_iLevel] - _iLevelGoal);
    };
    
    this.subtractPoints = function(iValue){
        _iLevelScore -= iValue;
        
        if (_iLevelScore < 0) {
            _iLevelScore = 0;
        };

        _oInterface.refreshScore(_iLevelScore);
    };
    
    this.addPipePoints = function(){
        if (!_bStartGame) {
            return; 
        };
        
        if (_iLevelGoal > 0) {
            _iLevelScore += USED_PIPE_UNDER_GOAL;
        } else {
            _iLevelScore += USED_PIPE_ABOVE_GOAL;
        };
        
        _iLongestCircuit++;
        
        playSound("bonus",1,false);
        _oInterface.refreshScore(_iLevelScore);
    };
    
    this.skipToLevelEnd = function(){
        if (!_bStartWater) {
            return;
        };
        
        var aSquares = _oBoard.getArray();
        for (var i = 0; i < aSquares.length; i++) {
            var oSquare = aSquares[i];
            oSquare.setMaxSpeed();
        };
    };
    
    this.startWater = function(iColumn, iRow, iProvenience){
        if (!_bStartWater) {
            _bStartWater = true;
        };
        
        var iPipePos = _oBoard.findSquarePosition(iColumn, iRow);
        var oPipe = _oBoard.getSquare(iPipePos);
        _iCurrentPosition = iPipePos;

        if (oPipe === undefined) {
            this.checkLevel();
        } else {
            playSound("water_movement",1,false);
            oPipe.setWatered(iProvenience);
        };
    };

    this.isStartGame = function() {
        return _bStartGame;
    };
    
    this.checkNextSquare = function(_aSquareInfo, iProvenience, iColumn, iRow){
        switch (_aSquareInfo[0]){
            case 2: // ANGLES ONLY
                switch (iProvenience){
                    case PROVENIENCE_TOP:
                        if (_aSquareInfo[3] === true) {
                            this.moveRight(iColumn, iRow);
                        } else if (_aSquareInfo[5] === true) {
                            this.moveLeft(iColumn, iRow);
                        };
                        break;
                    case PROVENIENCE_BOTTOM:
                        if (_aSquareInfo[3] === true) {
                            this.moveRight(iColumn, iRow);
                        } else if (_aSquareInfo[5] === true) {
                            this.moveLeft(iColumn, iRow);
                        };
                        break;
                    case PROVENIENCE_LEFT:
                        if (_aSquareInfo[2] === true) {
                            this.moveUp(iColumn, iRow);
                        } else if (_aSquareInfo[4] === true) {
                            this.moveDown(iColumn, iRow);
                        };
                        break;
                    case PROVENIENCE_RIGHT:
                        if (_aSquareInfo[2] === true) {
                            this.moveUp(iColumn, iRow);
                        } else if (_aSquareInfo[4] === true) {
                            this.moveDown(iColumn, iRow);
                        };
                        break;
                };
                break;
            default:
                switch (iProvenience){
                    case PROVENIENCE_TOP:
                        this.moveDown(iColumn, iRow);
                        break;
                    case PROVENIENCE_BOTTOM:
                        this.moveUp(iColumn, iRow);
                        break;
                    case PROVENIENCE_LEFT:
                        this.moveRight(iColumn, iRow);
                        break;
                    case PROVENIENCE_RIGHT:
                        this.moveLeft(iColumn, iRow);
                        break;
                };
                break;            
        };
    };

    this.moveUp = function(iColumn, iRow) {
        var iNextColumn = iColumn;
        var iNextRow = iRow-1;
        
        var iNextPosition = s_oBoard.findSquarePosition(iNextColumn, iNextRow);
        if (iNextPosition === undefined) {
            // OUT OF THE BOARD            
            this.checkLevel();
            return;
        };

        var oNextSquare = s_oBoard.getSquare(iNextPosition);
        var aNextSquareInfo = oNextSquare.getInfoArray();
        var iProvenience = PROVENIENCE_BOTTOM;

        switch (aNextSquareInfo[0]) {
            default: // EMPTY OR BLOCKED
                _oBoard.startSplash(iNextColumn,iNextRow,0);                
                break;
            case 1:  // HORIZONTAL
                if (aNextSquareInfo[2] === true) {
                    this.startWater(iNextColumn, iNextRow, iProvenience);
                } else {
                    _oBoard.startSplash(iNextColumn,iNextRow,0);                    
                };
                break;
            case 2:  // ANGLE
                if (aNextSquareInfo[4] === false) {
                    _oBoard.startSplash(iNextColumn,iNextRow,0);                    
                } else {
                    this.startWater(iNextColumn, iNextRow, iProvenience);
                };
                break;
            case 3:  // CROSS
                this.startWater(iNextColumn, iNextRow, iProvenience);
                break;                
        };
    };
    
    this.moveDown = function(iColumn, iRow) {
        var iNextColumn = iColumn;
        var iNextRow = iRow+1;
        
        var iNextPosition = s_oBoard.findSquarePosition(iNextColumn, iNextRow);      
        if (iNextPosition === undefined) {      // OUT OF THE BOARD            
            this.checkLevel();   
            return;
        };
        
        var oNextSquare = s_oBoard.getSquare(iNextPosition);
        var aNextSquareInfo = oNextSquare.getInfoArray();
        var iProvenience = PROVENIENCE_TOP;

        switch (aNextSquareInfo[0]) {
            default: // EMPTY OR BLOCKED
                _oBoard.startSplash(iNextColumn,iNextRow,180);
                break;
            case 1:  // HORIZONTAL
                if (aNextSquareInfo[4] === true) {
                    this.startWater(iNextColumn, iNextRow, iProvenience);
                } else {
                    _oBoard.startSplash(iNextColumn,iNextRow,180);
                }
                break;
            case 2:  // ANGLE
                if (aNextSquareInfo[2] === false) {
                    _oBoard.startSplash(iNextColumn,iNextRow,180);
                } else {
                    this.startWater(iNextColumn, iNextRow, iProvenience);    
                };
                break;
            case 3:  // CROSS
                this.startWater(iNextColumn, iNextRow, iProvenience);
                break;
        };
    };

    this.moveRight = function(iColumn, iRow) {
        var iNextColumn = iColumn+1;
        var iNextRow = iRow;
        
        var iNextPosition = s_oBoard.findSquarePosition(iNextColumn, iNextRow);
        if (iNextPosition === undefined) {
            // OUT OF THE BOARD
            this.checkLevel();
            return;
        };
        
        var oNextSquare = s_oBoard.getSquare(iNextPosition);
        var aNextSquareInfo = oNextSquare.getInfoArray();
        var iProvenience = PROVENIENCE_LEFT;

        switch (aNextSquareInfo[0]) {
            default:
                _oBoard.startSplash(iNextColumn,iNextRow,90);
                break;
            case 1: // HORIZONTAL
                if (aNextSquareInfo[3] === true) {
                    this.startWater(iNextColumn, iNextRow, iProvenience);
                } else {
                    _oBoard.startSplash(iNextColumn,iNextRow,90);
                };
                break;
            case 2: // ANGLE
                if (aNextSquareInfo[5] === false) {
                    _oBoard.startSplash(iNextColumn,iNextRow,90);
                } else {
                    this.startWater(iNextColumn, iNextRow, iProvenience);    
                };
                break;
            case 3: // CROSS
                this.startWater(iNextColumn, iNextRow, iProvenience);
                break;                
        };
    };

    this.moveLeft = function(iColumn, iRow) {
        var iNextColumn = iColumn-1;
        var iNextRow = iRow;
        
        var iNextPosition = s_oBoard.findSquarePosition(iNextColumn, iNextRow);        
        if (iNextPosition === undefined) {            
            // OUT OF THE BOARD
            this.checkLevel();
            return;
        };
        
        var oNextSquare = s_oBoard.getSquare(iNextPosition);
        var aNextSquareInfo = oNextSquare.getInfoArray();
        var iProvenience = PROVENIENCE_RIGHT;

        switch (aNextSquareInfo[0]) {
            default:
                _oBoard.startSplash(iNextColumn,iNextRow,270);
                break;
            case 1: // HORIZONTAL
                if (aNextSquareInfo[5] === true) {
                    this.startWater(iNextColumn, iNextRow, iProvenience);
                } else {
                    _oBoard.startSplash(iNextColumn,iNextRow,270);
                };
                break;
            case 2: // ANGLE
                if (aNextSquareInfo[3] === false) {
                    _oBoard.startSplash(iNextColumn,iNextRow,270);
                } else {
                    this.startWater(iNextColumn, iNextRow, iProvenience);
                };
                break;
            case 3: // CROSS
                this.startWater(iNextColumn, iNextRow, iProvenience);
                break;
        };
    };
    
    this.update = function() {
        if (_bStartGame !== true) {
            return;
        };
        
        // A "OPEN THE WATER" COUNTDOWN WILL START AT THE BEGINNING OF EACH LEVEL
        if (!_bStartWater) {
            if (!_bPaused) {
                _iTimeInLevel -= s_iTimeElaps;
            };
            if(_iTimeInLevel > 0){
                _oInterface.refreshTime(formatTime(_iTimeInLevel));  
            } else {
               _iTimeInLevel = 0;
                playSound("water_open",1,false);
                // START WATERING THE START PIPE, THEN PROCEED FROM THERE
                this.startWater(START_POSITION_COLUMN, START_POSITION_ROW, _iStartOpening);
            };
        };
    };

    s_oGame = this;

    this._init();
}

var s_oGame;