function CGame(oData) {
    var _fMultiplier;
    var _bStartGame;
    var _bDisableEvents;    
    var _bPressStart;
    var _bPressMove;
    var _bCheckEntry;
    var _bJumped;
    var _bPlayerRotation;
    var _bPlayerReleased;
    var _bTouchedTrampoline;
    var _bFlipCompleted;
    var _bTutorial;

    var _iTotalScore;
    var _iScore;
    var _iLevelScore;
    var _iTurn;
    var _iPlayerTurn;
    var _iGraphicIndex;
    var _iLevelStars;
    var _iStars;
    
    var _aHitAreaListeners;
    var _aTrampolinesPhysics;
    var _aTrampolines;
    
    var _oData;
    var _oBg;
    var _oShake;
    var _oPlane;
    var _oMountain;
    var _oPhysicWorld;
    var _oPhysicObjectsCreator;    
    var _oGameContainer;
    var _oObjectsContainer;
    var _oBgContainer;
    var _oPopupContainer;
    var _oPlayer;
    var _oFloor;
    var _oInterface;
    var _oEndPanel;
    var _oWinPanel;
    var _oHelpPanel;
    var _oHitArea;
    var _oFlipCompletedTextBack;
    var _oFlipCompletedText;
    var _oWaterSplash;
    var _oTutorialContainer;
    var _oCoinStartPos;
    
    this._init = function () {        
        _oBgContainer = new createjs.Container();
        s_oStage.addChild(_oBgContainer);
        
        // THIS INDEX WILL BE USED FOR LEVEL GRAPHICS
        if (s_iLevel < 3) {
            _iGraphicIndex = 0;
        } else if (s_iLevel > 2 && s_iLevel < 6) {
            _iGraphicIndex = 1;
        } else if (s_iLevel > 5 && s_iLevel < 9) {
            _iGraphicIndex = 2;
        } else {
            _iGraphicIndex = 3;
        }        
        var oSprite = s_oSpriteLibrary.getSprite('bg_game'+_iGraphicIndex);
        _oBg = createBitmap(oSprite);
        _oBgContainer.addChild(_oBg);
        
        this._initPlane();
        
        _oGameContainer = new createjs.Container();        
        s_oStage.addChild(_oGameContainer);

        _oObjectsContainer = new createjs.Container();        
        _oGameContainer.addChild(_oObjectsContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('rock_'+_iGraphicIndex);
        _oMountain = createBitmap(oSprite);
        _oMountain.x = -60;
        _oMountain.y = 20;
        _oObjectsContainer.addChild(_oMountain);
        
        _oPopupContainer = new createjs.Container();
        _oGameContainer.addChild(_oPopupContainer);
        
        _aTrampolines = [];
        this._addTrampolines();

        this._resetVariables();        
        this._initNewGame();
        this._initPlayer();
        
        _aTrampolinesPhysics = [];
        _aTrampolinesPhysics = _oPhysicObjectsCreator.addTrampolinePhysics();
        _oFloor = _oPhysicObjectsCreator.addFloor(_oObjectsContainer);
        
        this._updateCamera();        
        this._initHitArea();

        _oInterface = new CInterface(_oPopupContainer);
        _oInterface.refreshTurnText(_iTurn+1);
        
        if (s_bFirstTimePlaying === true) {
            _oHelpPanel = CHelpPanel();
        } else {
            this.initNewLevelText();
            this._onExitHelp();
        }
    };
    
    this._initPlane = function(){
        var iWidth = 443;
        var iHeight = 108;

        var oData = {
            images: [s_oSpriteLibrary.getSprite('plane')], 
            framerate: 20,
            frames: {width: iWidth, height: iHeight, regX: 0, regY: 0}, 
            animations: {idle:[0, 6, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oPlane = createSprite(oSpriteSheet, "idle", 0, 0, iWidth, iHeight);
        _oPlane.regX = iWidth * 0.5;
        _oPlane.regY = iHeight * 0.5;
        _oPlane.x = CANVAS_WIDTH + 250;
        _oPlane.y = CANVAS_HEIGHT_HALF - 400;
        _oBgContainer.addChild(_oPlane);
        
        this._initPlaneTween();
    };
    
    this._initPlaneTween = function(){
        createjs.Tween.get(_oPlane)
            .wait(PLANE_WAIT_TIME)
            .to({x: -500}, PLANE_SPEED)
            .call( this._onPlaneTweenEnd );
    };
    
    this._onPlaneTweenEnd = function(){
        if (!_bStartGame) {
            return;
        }
        
        _oPlane.x = CANVAS_WIDTH + 250;
        s_oGame._initPlaneTween();
    };
    
    this._addTrampolines = function(){
        var oTrampoline = this._addTrampolineSprite(0.55,INFOS_TOPTRAMPOLINE);
        _aTrampolines.push(oTrampoline);
        var oTrampoline = this._addTrampolineSprite(0.7,INFOS_MIDDLETRAMPOLINE);
        _aTrampolines.push(oTrampoline);
        var oTrampoline = this._addTrampolineSprite(1,INFOS_BOTTOMTRAMPOLINE);
        _aTrampolines.push(oTrampoline);
    };
    
    this._addTrampolineSprite = function(iScale,aInfos){
        var oSprite = s_oSpriteLibrary.getSprite('trampoline'+_iGraphicIndex);
        var oTrampoline = createBitmap(oSprite);
        oTrampoline.scaleX = oTrampoline.scaleY = iScale;
        oTrampoline.regX = oSprite.width * 0.5 - 10;
        oTrampoline.regY = oSprite.height * 0.5 - 5;
        oTrampoline.x = aInfos.x[s_iLevel] * WORLD_SCALE;
        oTrampoline.y = aInfos.y[s_iLevel] * WORLD_SCALE;
        _oObjectsContainer.addChild(oTrampoline);
        
        return oTrampoline;
    };
    
    this._initHitArea = function(){
        var oParent = this;
        _aHitAreaListeners = [];
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("green").drawRect(0,250,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        
        _aHitAreaListeners[0] = _oHitArea.on("mousedown", function(evt){ oParent.onPressed(evt); });
        _aHitAreaListeners[1] = _oHitArea.on("pressmove", function(evt){ oParent.onPressMove(evt); });
        _aHitAreaListeners[2] = _oHitArea.on("pressup", this.onReleased);        
        _oGameContainer.addChild(_oHitArea);        
    };
    
    this._initNewGame = function(){
        s_oPhysicsController = new CPhysicsController();
        _oPhysicObjectsCreator = new CPhysicObjectsCreator(s_oPhysicsController.getWorld());
        _oPhysicWorld = new CPhysicWorld(_oPhysicObjectsCreator, _oGameContainer);
        this._updatePhysics();
    };
    
    this._initPlayer = function(){
        _oPlayer = _oPhysicObjectsCreator.addPlayer(_oObjectsContainer);
        _oPlayer.update();
        
        // ADD "WATER" MASK TO THE PLAYER
        var oWaterMask = new createjs.Shape();
        oWaterMask.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0, -200, CANVAS_WIDTH, 1350);
        _oGameContainer.addChild(oWaterMask);
        
        var aPlayerSprites = _oPlayer.getSpriteArray();
        for (var i = 0; i < aPlayerSprites.length; i++) {
            aPlayerSprites[i].mask = oWaterMask;
        };
    };
    
    this._resetVariables = function () {
        _oEndPanel = null;
        _oWinPanel = null;
        _oWaterSplash = null;        

        this._resetStageVariables();
        _bStartGame = false;
        _bDisableEvents = false;

        _iTurn = 0;        
        _iPlayerTurn = 0;
        _iScore = 0;
        _iLevelScore = 0;
        _iTotalScore = s_iTotalScore;
        _iStars = 0;
        _iLevelStars = 0;

        setVolume("soundtrack", 0.5);
    };
    
    this._resetStageVariables = function(){
        _bPressStart = false;
        _bPressMove = false;
        _bTouchedTrampoline = false;
        _bPlayerRotation = false;
        _bPlayerReleased = false;
        _bJumped = false;
        _bCheckEntry = false;
        _bFlipCompleted = false;
    };
    
    this.startShake = function(){
        if (_oShake) {
            if (_oShake.isActive() === true) {
                return;
            }
        }
        
        _oShake = new CShake(s_oStage, 500, 5, 20);
    };
    
    this._resetStage = function(){
        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oGameContainer.addChild(oFade);
                
        // RESET TRAMPOLINES AND FLOOR PHYSIC
        for (var i = 0; i < _aTrampolinesPhysics.length; i++) {
            s_oPhysicsController.destroyBodyVector(_aTrampolinesPhysics[i]);
            _aTrampolinesPhysics[i] = null;
        };        
        s_oPhysicsController.update();        
        _aTrampolinesPhysics = [];
        _aTrampolinesPhysics = _oPhysicObjectsCreator.addTrampolinePhysics();
        _oFloor = _oPhysicObjectsCreator.addFloor(_oObjectsContainer);
        
        if (_iPlayerTurn > 2) {
            _iPlayerTurn = 0;
        }
        _oPlayer.resetPosition(_iPlayerTurn);
        this._resetStageVariables();        
        _oInterface.refreshTurnText(_iTurn+1);
        
        createjs.Tween.get(oFade)
        .to({alpha: 0}, RESET_STAGE_FADE_SPEED, createjs.Ease.cubicOut)
        .call(function () {
             createjs.Tween.removeTweens(oFade);
            _oGameContainer.removeChild(oFade);
        });
    };
        
    this.unload = function () {        
        _oHitArea.off("mousedown", _aHitAreaListeners[0]);
        _oHitArea.off("pressmove", _aHitAreaListeners[1]);
        _oHitArea.off("pressup", _aHitAreaListeners[2]);        
        _aHitAreaListeners = [];
        
        _bStartGame = false;
        _oInterface.unload();
        this.destroyPhysicsEngine();
        
        createjs.Tween.removeAllTweens();
        _oBgContainer.removeAllChildren();
        _oPopupContainer.removeAllChildren();
        _oObjectsContainer.removeAllChildren();
        _oGameContainer.removeAllChildren();
        s_oStage.removeAllChildren();
        s_oGame = null;
    };
    
    this.destroyPhysicsEngine = function () {
        s_oPhysicsController.destroyWorld();
        _oFloor = null;
        _oPlayer.unload();
        _oPlayer = null;
        _oPhysicObjectsCreator = null;
        _oPhysicWorld = null;                
        s_oPhysicsController = null;
    };

    this.onExit = function () {
        setVolume("soundtrack", 1);
        $("#canvas").trigger("end_session");
        $("#canvas").trigger("show_interlevel_ad");
        this.unload();
        s_oMain.gotoMenu();        
    };

    this.restart = function () {
        setVolume("soundtrack", 0.5);
        $("#canvas").trigger("restart_level");
        this.unload();
        s_oMain.gotoGame();
    };

    this._onExitHelp = function () {
        _bStartGame = true;
        if (s_iLevel === 0) {
            _bTutorial = true;
        }
        s_bFirstTimePlaying = false;
    };
    
    this._updateScore = function () {
        // UPDATE TOTAL SCORE
        _iTotalScore += _iLevelScore;
        s_iTotalScore = _iTotalScore;
        saveItem("cliff_diving_total_score", s_iTotalScore);

        // AVERAGE STAR SCORE OF ALL THE DIVES
        _iLevelStars = Math.round(_iStars / LEVEL_TURNS[s_iLevel]);
        
        // UPDATE LEVEL STARS
        if (_iLevelStars > s_aStars[s_iLevel]) {
            s_aStars[s_iLevel] = _iLevelStars;
            setItemJson("cliff_diving_stars", s_aStars);
        };
    };
    
    this.setCoinStart = function(oPos){
        _oCoinStartPos = oPos;
    };
    
    this.addCoin = function(){        
        var oSprite = s_oSpriteLibrary.getSprite('coin');
        var oCoin = createBitmap(oSprite);        
        oCoin.regX = oSprite.width * 0.5;
        oCoin.regY = oSprite.height * 0.5;
        oCoin.x = _oCoinStartPos.x;
        oCoin.y = _oCoinStartPos.y;
        oCoin.alpha = 0;
        _oGameContainer.addChild(oCoin);
        
        var oIconPos = _oInterface.getScoreIconPos();
        createjs.Tween.get(oCoin)
            .to({alpha: 1}, 200, createjs.Ease.quadIn);    
        createjs.Tween.get(oCoin)
            .to({x: oIconPos.x}, COIN_SPEED, createjs.Ease.quintIn);
        createjs.Tween.get(oCoin)
            .to({y: oIconPos.y}, COIN_SPEED, createjs.Ease.cercOut)
            .call(function(){
                _oInterface.pulseScoreIcon();                      
                _oGameContainer.removeChild(oCoin);
                createjs.Tween.removeTweens(oCoin);
            });
    };
    
    this.addScore = function (iValue) {
        // ADD N COINS (WITH LITTLE DELAY)
        if(_bFlipCompleted){
            iValue += FLIP_VALUE;
        };
        _iLevelScore += iValue;
        var i = 0;
        var oParent = this;
        function callBackFunction() {
            oParent.addCoin(i);
            _iScore++;
            _oInterface.refreshScoreText(_iScore+s_iTotalScore);
            i++;            
            if (i < iValue){
                setTimeout(callBackFunction, 100);
            }
        }
        callBackFunction();
    };

    this.initNewLevelText = function () {
        var oLevelTextBack = this.showMessage(TEXT_LEVEL + " " + (s_iLevel+1), SECONDARY_FONT_COLOUR);
        oLevelTextBack.outline = 5;
        var oLevelText = this.showMessage(TEXT_LEVEL + " " + (s_iLevel+1), PRIMARY_FONT_COLOUR);
        
        oLevelTextBack.x = oLevelText.x = CANVAS_WIDTH_HALF;
        oLevelTextBack.y = oLevelText.y = CANVAS_HEIGHT_HALF;

        createjs.Tween.get(oLevelTextBack)
            .to({y: 0, alpha: 0}, TEXT_MESSAGES_SPEED*3, createjs.Ease.sineOut)
            .call(function() {
                createjs.Tween.removeTweens(oLevelTextBack);
                _oPopupContainer.removeChild(oLevelTextBack);
            });
        createjs.Tween.get(oLevelText)
            .to({y: 0, alpha: 0}, TEXT_MESSAGES_SPEED*3, createjs.Ease.sineOut)
            .call(function() {
                createjs.Tween.removeTweens(oLevelText);
                _oPopupContainer.removeChild(oLevelText);
            });
    };

    this.initScoreText = function (iValue, iX, iY) {
        var oScoreTextBack = this.showMessage("+" + iValue, SECONDARY_FONT_COLOUR);
        oScoreTextBack.outline = 5;
        var oScoreText = this.showMessage("+" + iValue, PRIMARY_FONT_COLOUR);
        
        if (iX && iY) {
            oScoreTextBack.x = oScoreText.x = iX;
            oScoreTextBack.y = oScoreText.y = iY;
        } else {
            oScoreTextBack.x = oScoreText.x = CANVAS_WIDTH_HALF;
            oScoreTextBack.y = oScoreText.y = CANVAS_HEIGHT - 300;
        }
        
        createjs.Tween.get(oScoreTextBack)
            .to({y: 0, alpha: 0}, TEXT_MESSAGES_SPEED*3, createjs.Ease.sineOut)
            .call(function() {
                createjs.Tween.removeTweens(oScoreTextBack);
                _oPopupContainer.removeChild(oScoreTextBack);
            });
        createjs.Tween.get(oScoreText)
            .to({y: 0, alpha: 0}, TEXT_MESSAGES_SPEED*3, createjs.Ease.sineOut)
            .call(function() {
                createjs.Tween.removeTweens(oScoreText);
                _oPopupContainer.removeChild(oScoreText);
            });
    };

    this.showMessage = function(szText, iColor){
        var oMessage = new createjs.Text(szText, FONT_SIZE_TEXT_MESSAGE + PRIMARY_FONT, iColor);
        oMessage.textAlign = "center";
        oMessage.textBaseline = "alphabetic";
        oMessage.x = CANVAS_WIDTH_HALF;
        oMessage.y = CANVAS_HEIGHT_HALF;
        _oPopupContainer.addChild(oMessage);
        
        return oMessage;
    };
    
    this.showEncouragmentMessage = function(){
        // ACCORDING TO THE POSITION OF THE BODY, THE DIVE WILL BE "BETTER", AND A TEXT WILL APPEAR
        var iAngle = _oPlayer.getBodyAngle();
        
        var szMessage;
        var iValue;
        
        // ADD TAKEN COINS AND THE BONUS FOR THE CORRECT DIVE            
        if (iAngle > 180 - DIVE_OFFSET_PERFECT && iAngle < 180 + DIVE_OFFSET_PERFECT) {
            szMessage = TEXT_ENCOURAGEMENT2;    // PERFECT ENTRANCE
            iValue = DIVE_VALUE_PERFECT;
            _iStars += 3;            
        } else if (iAngle > 180 - DIVE_OFFSET_GOOD && iAngle < 180 + DIVE_OFFSET_GOOD) {
            szMessage = TEXT_ENCOURAGEMENT0;    // GOOD ENTRANCE
            iValue = DIVE_VALUE_GOOD;            
            _iStars += 2;
        } else {
            szMessage = TEXT_ENCOURAGEMENT1;    // CORRECT (BUT POOR) ENTRANCE
            iValue = DIVE_VALUE;
            _iStars += 1;
        }

        this.addScore(iValue);
        
        var oMsgBack = this.showMessage(szMessage, SECONDARY_FONT_COLOUR);
        oMsgBack.outline = 5;
        var oMsg = this.showMessage(szMessage, PRIMARY_FONT_COLOUR);
        
        createjs.Tween.get(oMsgBack)
            .to({alpha: 0}, 1500, createjs.Ease.quadIn);    
        createjs.Tween.get(oMsgBack)
            .to({y: 0}, 1500, createjs.Ease.quadIn)
            .call(function(){
                createjs.Tween.removeTweens(oMsgBack);
                _oPopupContainer.removeChild(oMsgBack);
            });
        createjs.Tween.get(oMsg)
            .to({alpha: 0}, 1500, createjs.Ease.quadIn);    
        createjs.Tween.get(oMsg)
            .to({y: 0}, 1500, createjs.Ease.quadIn)
            .call(function(){
                createjs.Tween.removeTweens(oMsg);
                _oPopupContainer.removeChild(oMsg);
            });
    };
    
    this.onCorrectDive = function(){
        playSound("bonus", 1, false);
        
        _iTurn++;   // ADD NEW TURN        
        _iPlayerTurn++;
        
        // RESET THE STAGE FOR NEXT DIVE
        var oParent = this;
        setTimeout(function() { oParent.checkNextLevel(); }, 1000); 
    };

    this.checkNextLevel = function(){
        // IF THERE'S ANOTHER TURN
        if (LEVEL_TURNS[s_iLevel] > _iTurn) {
            this._resetStage();
        } else {
            this._gameWin();
        }
    };
    
    this.unlockNextLevel = function(){
        if (s_iLastLevel < s_iLevel+1) {
            s_iLastLevel += 1;
        }
        saveItem("cliff_diving_last_level", s_iLastLevel);
    };

    this._gameWin = function(){
        this.unlockNextLevel();        
        setTimeout(function() { _bStartGame = false; }, 1000);
        this._updateScore();                
        _oInterface.refreshScoreText(s_iTotalScore);
        
        if (_oWinPanel === null) {
            createjs.Tween.removeTweens(_oPlane);
            
            $("#canvas").trigger("share_event", s_iTotalScore);
            $("#canvas").trigger("save_score", s_iTotalScore);
            
            playSound("game_win", 1, false);
            stopSound("soundtrack");
            setTimeout(function() { playSound("soundtrack", 0.5, false); }, 3000);

            _oWinPanel = new CWinPanel(s_iTotalScore, _iLevelStars);
            _bDisableEvents = true;
        }
    };
    
    this._gameOver = function (szText) {
        setTimeout(function() { _bStartGame = false; }, 1000);
        _iLevelScore = 0;
        this._updateScore();

        if (_oEndPanel === null) {
            createjs.Tween.removeTweens(_oPlane);
            
            $("#canvas").trigger("share_event", s_iTotalScore);
            $("#canvas").trigger("save_score", s_iTotalScore);
            
            playSound("game_over", 1, false);
            stopSound("soundtrack");
            setTimeout(function() { playSound("soundtrack", 0.5, false); }, 3000);

            setTimeout(function() { _oEndPanel = new CEndPanel(s_iTotalScore, szText); }, MESSAGE_GAMEOVER_DELAY);
            _bDisableEvents = true;
        }
    };
        
    this.setStartGame = function (bValue) {
        _bStartGame = bValue;
        _bDisableEvents = bValue;
    };
    
    this.removeTutorialMessage = function(){
        _oTutorialContainer.alpha = 0;
        createjs.Tween.removeTweens(_oTutorialContainer);
        _oGameContainer.removeChild(_oTutorialContainer);
        _oTutorialContainer = null;
    };
    
    this._showTutorialMessage = function(szText) {
        _bTutorial = false;
        
        if (_oTutorialContainer) {
            this.removeTutorialMessage();
        };
                
        _oTutorialContainer = new createjs.Container();
        _oGameContainer.addChild(_oTutorialContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box_small');
        var oPanel = createBitmap(oSprite);  
        oPanel.regX = oSprite.width*0.5;
        oPanel.regY = oSprite.height*0.5;
        oPanel.x = CANVAS_WIDTH_HALF;
        oPanel.y = CANVAS_HEIGHT_HALF - 300;        
        
        var oText = new createjs.Text(szText,FONT_SIZE_HELP+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        oText.textAlign = "center";
        oText.textBaseline = "middle";
        oText.lineWidth = 520;
        oText.x = oPanel.x;
        oText.y = oPanel.y - 50;
        
        _oTutorialContainer.alpha = 0;
        _oTutorialContainer.addChild(oPanel, oText);
        
        createjs.Tween.get(_oTutorialContainer)
            .to({alpha: 1}, 200, createjs.Ease.quadIn)
            .call(s_oGame._removeTutorial);
    };
    
    this._removeTutorial = function(){
        createjs.Tween.get(_oTutorialContainer)
            .to({alpha: 0}, TUTORIAL_FADEOUT_SPEED, createjs.Ease.quadIn)
            .call(function(){
                createjs.Tween.removeTweens(_oTutorialContainer);
                _oGameContainer.removeChild(_oTutorialContainer);
            });
    };
    
    this.onPressed = function(evt){
        if (_bPressStart || _bTouchedTrampoline || _bCheckEntry){
            return;
        }
        
        _bPressStart = true;
        _oPlayer.setActive(true);
        
        // IF THE PLAYER HASN'T JUMPED YET
        if (!_bJumped) {
            if (s_iLevel === 0 && _bTutorial) {
                s_oGame._showTutorialMessage(TEXT_TUTORIAL1);
            }
        // IF THE PLAYER HAS ALREADY JUMPED
        } else {            
            _bPlayerRotation = true;
        }
        
        this.onPressMove();
    };
    
    this.onPressMove = function(evt){
        if (!_bPressStart || _bTouchedTrampoline) {
            return;
        }
        _bPressMove = true;
    };
    
    this.onReleased = function(){
        if (!_bPressStart || !_bPressMove ) {
            return;
        }
        // IF THE PLAYER HAS ALREADY JUMPED
        if (!_bJumped) {
            _bJumped = true;
            
            _bTutorial = true;
            if (s_iLevel === 0 && _bTutorial) {
                s_oGame._showTutorialMessage(TEXT_TUTORIAL2);
            }
            if (soundPlaying("jump") === false) {
                playSound("jump", 1, false);
            }
                        
            _oPlayer.onJump();            
        // IF THE PLAYER HASN'T JUMPED YET        
        } else {
            _bPlayerReleased = true;
            _oPlayer.onJumpingPressReleased();
        }
        
        _bPressMove = false;
        _bPressStart = false;        
    };
    
    this.onLandedOnWater = function(){
        _oPlayer.addWaterResistance();
    };
    
    this.addWaterSplash = function( oBody ){
        if (_oWaterSplash) {
            return;
        }        
        if (soundPlaying("water") === false) {
            playSound("water", 1, false);
        }
        
        var aImages = [s_oSpriteLibrary.getSprite('watersplash0')];
        if (_iGraphicIndex === 1) {
            aImages = [s_oSpriteLibrary.getSprite('watersplash1')];
        } else if (_iGraphicIndex === 2) {
            aImages = [s_oSpriteLibrary.getSprite('watersplash2')];
        };
        
        var iSize = 384;
        var oData = {
            images: aImages, 
            framerate: 10,
            frames: {width: iSize, height: iSize, regX: 0, regY: 0}, 
            animations: {idle:[0, 9, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oWaterSplash = createSprite(oSpriteSheet, "idle", 0, 0, iSize, iSize);
        _oWaterSplash.regX = iSize * 0.5;
        _oWaterSplash.regY = iSize - 50;
        _oWaterSplash.x = oBody.GetPosition().x * WORLD_SCALE;
        _oWaterSplash.y = oBody.GetPosition().y * WORLD_SCALE;
        _oWaterSplash.addEventListener("animationend", this._removeWaterSplash);
        _oObjectsContainer.addChild(_oWaterSplash);
        
        this.setCoinStart({x: _oWaterSplash.x, y: _oWaterSplash.y});
    };
    
    this._removeWaterSplash = function(){
        _oObjectsContainer.removeChild(_oWaterSplash);
        _oWaterSplash = null;
    };
    
    this.onFlipCompleted = function(){
        _bFlipCompleted = true;
        
        if (_oFlipCompletedTextBack || _oFlipCompletedText) {
            return;
        } 
        
        _oFlipCompletedTextBack = this.showMessage(TEXT_FLIP, SECONDARY_FONT_COLOUR);
        _oFlipCompletedTextBack.outline = 5;
        _oFlipCompletedText = this.showMessage(TEXT_FLIP, PRIMARY_FONT_COLOUR);
        
        createjs.Tween.get(_oFlipCompletedTextBack)
            .to({y: 0, alpha: 0}, TEXT_MESSAGES_SPEED*2, createjs.Ease.sineOut)
            .call(function() {
                createjs.Tween.removeTweens(_oFlipCompletedTextBack);
                _oPopupContainer.removeChild(_oFlipCompletedTextBack);
            });
        createjs.Tween.get(_oFlipCompletedText)
            .to({y: 0, alpha: 0}, TEXT_MESSAGES_SPEED*2, createjs.Ease.sineOut)
            .call(function() {
                createjs.Tween.removeTweens(_oFlipCompletedText);
                _oPopupContainer.removeChild(_oFlipCompletedText);
            });
    };
    
    this.onTouchedTrampoline = function(oBodyPart){
        if(!_bJumped) {
            return;
        }
        if (soundPlaying("collision") === false) {
            playSound("collision", 1, false);
        }
        this.startShake();
        _oPlayer.changeHeadAnimation(HEAD_HIT);
        _oPlayer.addTrampolinePush();
        this._addCollisionAnimation(oBodyPart);
        _bTouchedTrampoline = true;
        this.onReleased();
    };
    
    this._addCollisionAnimation = function(oBodyPart){
        var oPos = s_oPhysicsController.getBodyPosition(oBodyPart);
        var iWidth = 243;
        var iHeight = 163;

        var oData = {
            images: [s_oSpriteLibrary.getSprite('collision')], 
            framerate: 10,
            frames: {width: iWidth, height: iHeight, regX: 0, regY: 0}, 
            animations: {idle:[0, 3, false]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var oCollisionAnim = createSprite(oSpriteSheet, "idle", 0, 0, iWidth, iHeight);
        oCollisionAnim.regX = iWidth * 0.5;
        oCollisionAnim.regY = iHeight * 0.5;
        oCollisionAnim.x = oPos.x;
        oCollisionAnim.y = oPos.y;
        oCollisionAnim.addEventListener("animationend", function(){ _oObjectsContainer.removeChild(oCollisionAnim); });
        _oObjectsContainer.addChild(oCollisionAnim);
    };
    
    this.checkForEntry = function(iFixture){
        if (_bCheckEntry) {
            return;
        }
        _bCheckEntry = true;
        
        if (_oTutorialContainer) {
            this.removeTutorialMessage();
        };
        
        var _bNextDive = true;
        
        // IF THE PLAYER HAS HIT SOME OBSTACLES
        if (_bTouchedTrampoline) {
            _bNextDive = false;
            this._gameOver(TEXT_GAMEOVER_HIT);
            return;
        }
        // IF NO ROTATION HAS BEEN DONE, IT'S BAD ENTRY
        if (!_bPlayerRotation) {
            _bNextDive = false;
            this._gameOver(TEXT_GAMEOVER_ROTATION);
            return;
        }
        // IF THE PLAYER DIDN'T RELEASE THE TOUCH/MOUSE, IT'S BAD ENTRY
        if (!_bPlayerReleased) {
            _bNextDive = false;
            this._gameOver(TEXT_GAMEOVER_RELEASE);
            return;
        }
        
        // IF THE PLAYER ENTERS WITH HIS BACK (OR AT A WRONG ANGLE), IT'S BAD ENTRY
        if (_oPlayer.getBodyAngle() < ENTRY_ANGLE_MIN || _oPlayer.getBodyAngle() > ENTRY_ANGLE_MAX ) {
            _bNextDive = false;
            this._gameOver(TEXT_GAMEOVER_DIVE);
            return;
        }
        // IF THE PLAYER FALLS DOWN WITH HEAD OR TORSO FIRST, IT'S BAD ENTRY
        if (iFixture === FIXTURE_TORSO || iFixture === FIXTURE_HEAD ) {
            _bNextDive = false;
            this._gameOver(TEXT_GAMEOVER_DIVE);
            return;
        } else {
            _bNextDive = true;
        }
        
        // GOOD ENTRY            
        if (_bNextDive) {
            this.showEncouragmentMessage();
            this.onCorrectDive();
            return;
        }
    };
    
    this._updatePhysics = function(){
        // KEEP THE SPRITES' POSITION ON THEIR PHYSIC OBJECTS        
        if (_oPlayer) {
            _oPlayer.update();
        }
        
        s_oPhysicsController.update();
    };

    this._updateCamera = function(){
        if (!_oPlayer) {
            return;
        }
        
        var iDestY = CAMERA_CANVAS_OFFSET - _oPlayer.getTorsoY();        
        if (iDestY > CAMERA_CANVAS_MAX_Y) {
            iDestY = CAMERA_CANVAS_MAX_Y;
        }
        if (iDestY < CAMERA_CANVAS_MIN_Y) {
            iDestY = CAMERA_CANVAS_MIN_Y;
        }
        
        createjs.Tween.get(_oObjectsContainer).to({y: iDestY}, CAMERA_MOVEMENT_SPEED, createjs.Ease.cubicOut);
        
        // UPDATE THE DEBUG CANVAS POSITION            
        if (DEBUG_BOX2D) {            
            var oCanvasOffset = {x: 0, y: _oObjectsContainer.y};
            s_oPhysicsController.updateDebugPosition(oCanvasOffset);
        }
    };
    
    this._checkPlayerMovement = function(){
        if (_bJumped === false) {
            if (_bPressMove === false) {
                _fMultiplier = 0;
            } else {
                // ADD AN INCREASING FORCE MULTIPLIER, TO HAVE A PROGRESSIVE MOVEMENT OF THE PLAYER
                _oPlayer.onPreparation( easeOutCubic(_fMultiplier,0,1,1) );
                _fMultiplier += 0.05;
                if (_fMultiplier > 1) {
                    _fMultiplier = 1;
                }
            }
        } else {
            if (_bPressMove === false) {
                _fMultiplier = 0;
            } else {
                // ADD AN INCREASING FORCE MULTIPLIER, TO HAVE A PROGRESSIVE MOVEMENT OF THE PLAYER
                _oPlayer.onJumpingPressDown( easeOutCubic(_fMultiplier,0,1,1) );
                _fMultiplier += 0.05;
                if (_fMultiplier > 1) {
                    _fMultiplier = 1;
                }
            }
        }
    };

    this.update = function () {        
        if (!_bStartGame) {
            return;
        }
        
        for (var i = 0; i < UPDATE_LOOP_VAR; i++) {            
            this._updatePhysics();
        };
        
        this._updateCamera();
        this._checkPlayerMovement();
    };
    
    s_oGame = this;

    _oData = oData;
    DIVE_VALUE = oData.dive_value;
    DIVE_VALUE_GOOD = oData.dive_value_good;
    DIVE_VALUE_PERFECT = oData.dive_value_perfect;
    DIVE_OFFSET_PERFECT = oData.dive_offset_perfect;
    DIVE_OFFSET_GOOD = oData.dive_offset_good;
    DIVE_OFFSET_POOR = oData.dive_offset_poor;
    ENTRY_ANGLE_MIN = 180 - DIVE_OFFSET_POOR;
    ENTRY_ANGLE_MAX = 180 + DIVE_OFFSET_POOR;
    FLIP_VALUE = oData.flip_value;
    PLANE_WAIT_TIME = oData.plane_wait_time;
    PLANE_SPEED = oData.plane_speed;
    
    this._init();
}

var s_oGame = null;