function CInterface(iLevel) {
    var _oAudioToggle;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosPanelScore;
    var _pStartPosPanelLife;
    var _pStartPosPanelTime;
    var _pStartPosFullscreen;
    
    var _bStoppedTime;
    var _oButExit;
    var _oPauseText;
    var _oButContinue;
    var _oScoreText;
    var _oScoreTextCont;
    var _oLifeText;
    var _oLifeTextCont;
    var _oTimeText;
    var _oTimeTextCont;
    var _oFade;
    var _oGameOver;
    var _oButReturnToMenu;
    var _oButRestart;
    var _oTextGameOver;
    var _oTextGameOverCont;
    var _oTextGameOverScore;
    var _oTextGameOverScoreCont;
    var _oTransBg;
    var _oButNextLevel;
    var _oTextLevelComplete;
    var _oTextScoreLevelComplete;
    var _oFan;
    var _oPanelScore;
    var _oPanelHearth;
    var _oPanelTime;
    var _oFrame;
    var _oGameOverContainer;
    var _oTimeIsUpContainer;
    var _oLevelTextLeft;
    var _oLevelTextRight;
    var _oLevelContainer;
    var _oHelpPanel;
    var _oHelpTextContainer;
    var _oButNext;
    var _oButPrev;
    var _oGameOverPanel;
    var _bPressYet;
    var _oContrast;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    this._init = function (iLevel) {

        var oButtonX;

        _bStoppedTime = false;

        _oFrame = createBitmap(s_oSpriteLibrary.getSprite("frame"));
        s_oStage.addChild(_oFrame); //Draws on canvas
        s_oStage.setChildIndex(_oFrame, s_oStage.numChildren - 1);

        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');
        oButtonX = CANVAS_WIDTH - (oSpriteExit.width / 2 + 20);
        _pStartPosExit = {x: oButtonX, y: (oSpriteExit.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('icon_audio');
            _pStartPosAudio = {x: _pStartPosExit.x - (oSprite.width / 2) - 10, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
            var oSpriteFullscreen = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: _pStartPosExit.x - (oSpriteFullscreen.width / 2) - 10, y: (oSpriteFullscreen.height / 2) + 10};
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            var oSpriteFullscreen = s_oSpriteLibrary.getSprite('but_fullscreen');
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSpriteFullscreen,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        var oSpriteFan = s_oSpriteLibrary.getSprite("fan");
        var oData = {
            images: [oSpriteFan],
            // width, height & registration point of each sprite
            frames: {width: oSpriteFan.width / 3, height: oSpriteFan.height, regX: (oSpriteFan.width / 2) / 3, regY: oSpriteFan.height / 2},
            animations: {move: [0, 2, "move", 0.5]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oFan = createSprite(oSpriteSheet, "move", (oSpriteFan.width / 2) / 2, oSpriteFan.height / 2, oSpriteFan.width / 3, oSpriteFan.height);
        _oFan.x = CANVAS_WIDTH / 2;
        _oFan.y = CANVAS_HEIGHT / 2 - 45;
        s_oStage.addChild(_oFan);
        s_oStage.setChildIndex(_oFan, 1);

        _oLevelContainer = new createjs.Container();

        var iYPos = 70;
        _oLevelTextLeft = new createjs.Text("0" + iLevel, "bold " + 72 + "px " + PRIMARY_FONT, "#02724e");
        _oLevelTextLeft.textAlign = "center";
        _oLevelTextLeft.textBaseline = "alphabetic";
        _oLevelTextLeft.x = -220;
        _oLevelTextLeft.y = iYPos;

        _oLevelTextRight = new createjs.Text("0" + iLevel, "bold " + 72 + "px " + PRIMARY_FONT, "#02724e");
        _oLevelTextRight.textAlign = "center";
        _oLevelTextRight.textBaseline = "alphabetic";
        _oLevelTextRight.x = 220;
        _oLevelTextRight.y = iYPos;

        _oLevelContainer.addChild(_oLevelTextLeft, _oLevelTextRight);
        _oLevelContainer.x = CANVAS_WIDTH / 2;
        _oLevelContainer.y = CANVAS_HEIGHT / 2;
        s_oStage.addChild(_oLevelContainer);
        s_oStage.setChildIndex(_oLevelContainer, 1);

        var oPanelScore;
        var oSpritePanelScore = s_oSpriteLibrary.getSprite("panel_score");
        oPanelScore = createBitmap(oSpritePanelScore);
        oPanelScore.regX = oSpritePanelScore.width / 2;
        oPanelScore.regY = oSpritePanelScore.height / 2;

        var pScorePos = {x: 80, y: 13};

        _oScoreText = new createjs.Text("0", "bold " + 40 + "px " + PRIMARY_FONT, "#ffffff");
        _oScoreText.textAlign = "left";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.x = -pScorePos.x;
        _oScoreText.y = pScorePos.y;

        _oScoreTextCont = new createjs.Text("0", "bold " + 40 + "px " + PRIMARY_FONT, "#000000");
        _oScoreTextCont.textAlign = "left";
        _oScoreTextCont.textBaseline = "alphabetic";
        _oScoreTextCont.x = -pScorePos.x;
        _oScoreTextCont.y = pScorePos.y;
        _oScoreTextCont.outline = 0.2;

        _oPanelScore = new createjs.Container();
        _oPanelScore.addChild(oPanelScore, _oScoreText, _oScoreTextCont);
        _pStartPosPanelScore = {x: CANVAS_WIDTH / 2 - 300, y: CANVAS_HEIGHT / 2 - 230};
        _oPanelScore.x = _pStartPosPanelScore.x;
        _oPanelScore.y = _pStartPosPanelScore.y;

        s_oStage.addChild(_oPanelScore);

        var oPanelHearth;
        var oSpritePanelHearth = s_oSpriteLibrary.getSprite("panel_hearth");
        oPanelHearth = createBitmap(oSpritePanelHearth);
        oPanelHearth.regX = oSpritePanelHearth.width / 2;
        oPanelHearth.regY = oSpritePanelHearth.height / 2;

        var pLifePos = {x: 0, y: 13};

        _oLifeText = new createjs.Text("X3", "bold " + 36 + "px " + PRIMARY_FONT, "#ffffff");
        _oLifeText.textAlign = "left";
        _oLifeText.textBaseline = "alphabetic";
        _oLifeText.x = pLifePos.x;
        _oLifeText.y = pLifePos.y;

        _oLifeTextCont = new createjs.Text("X3", "bold " + 36 + "px " + PRIMARY_FONT, "#000000");
        _oLifeTextCont.textAlign = "left";
        _oLifeTextCont.textBaseline = "alphabetic";
        _oLifeTextCont.x = pLifePos.x;
        _oLifeTextCont.y = pLifePos.y;
        _oLifeTextCont.outline = 0.2;

        _oPanelHearth = new createjs.Container();
        _oPanelHearth.addChild(oPanelHearth, _oLifeText, _oLifeTextCont);
        _pStartPosPanelLife = {x: CANVAS_WIDTH / 2 - 90, y: CANVAS_HEIGHT / 2 - 230};
        _oPanelHearth.x = _pStartPosPanelLife.x;
        _oPanelHearth.y = _pStartPosPanelLife.y;

        s_oStage.addChild(_oPanelHearth);

        var oPanelTime;
        var oSpritePanelTime = s_oSpriteLibrary.getSprite("panel_time");
        oPanelTime = createBitmap(oSpritePanelTime);
        oPanelTime.regX = oSpritePanelTime.width / 2;
        oPanelTime.regY = oSpritePanelTime.height / 2;

        var pTimePos = {x: -4, y: 13};

        _oTimeText = new createjs.Text(TIME_LEVEL[0], "bold " + 36 + "px " + PRIMARY_FONT, "#ffffff");
        _oTimeText.textAlign = "left";
        _oTimeText.textBaseline = "alphabetic";
        _oTimeText.x = pTimePos.x;
        _oTimeText.y = pTimePos.y;

        _oTimeTextCont = new createjs.Text(TIME_LEVEL[0], "bold " + 36 + "px " + PRIMARY_FONT, "#000000");
        _oTimeTextCont.textAlign = "left";
        _oTimeTextCont.textBaseline = "alphabetic";
        _oTimeTextCont.x = pTimePos.x;
        _oTimeTextCont.y = pTimePos.y;
        _oTimeTextCont.outline = 0.2;

        _oPanelTime = new createjs.Container();
        _oPanelTime.addChild(oPanelTime, _oTimeText, _oTimeTextCont);
        _pStartPosPanelTime = {x: CANVAS_WIDTH / 2 + 40, y: CANVAS_HEIGHT / 2 - 230};
        _oPanelTime.x = CANVAS_WIDTH / 2 + 80;
        _oPanelTime.y = CANVAS_HEIGHT / 2 - 180;

        s_oStage.addChild(_oPanelTime);

        _bPressYet = false;

        this.createContrast();

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
        
        
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);

        _oPanelScore.x = _pStartPosPanelScore.x + iNewX;
        _oPanelScore.y = _pStartPosPanelScore.y + iNewY;

        _oPanelHearth.x = _pStartPosPanelLife.x + iNewX;
        _oPanelHearth.y = _pStartPosPanelLife.y + iNewY;

        _oPanelTime.x = _pStartPosPanelTime.x + iNewX;
        _oPanelTime.y = _pStartPosPanelTime.y + iNewY;

    };

    this.createContrast = function () {
        _oContrast = new createjs.Shape();
        _oContrast.graphics.beginFill("black").drawRect(80, 85, 800, 370);
        _oContrast.alpha = 0.0;
        s_oStage.addChild(_oContrast);
        s_oStage.setChildIndex(_oContrast, 3);
    };

    this.refreshLife = function (iLife) {
        _oLifeText.text = "X" + iLife;
        _oLifeTextCont.text = "X" + iLife;
    };

    this.refreshLevel = function (iLv) {
        var iLevel = iLv + 1;
        if (iLevel > 9) {
            _oLevelTextLeft.text = iLevel;
            _oLevelTextRight.text = iLevel;
        }
        else
        {
            _oLevelTextLeft.text = "0" + iLevel;
            _oLevelTextRight.text = "0" + iLevel;
        }
    };

    this.showLevelNum = function (iLevel) {
        var iLv = iLevel + 1;

        var oLevelText;
        var oLevelTextCont;
        
        var oLevelContainer = new createjs.Container();
        oLevelContainer.scaleX = 0;
        oLevelContainer.scaleY = 0;
        oLevelContainer.x = CANVAS_WIDTH / 2;
        oLevelContainer.y = CANVAS_HEIGHT / 2;
        oLevelContainer.regX = 100;
        oLevelContainer.regY = 120;
        s_oStage.addChild(oLevelContainer);

        oLevelText = new CTLText(oLevelContainer, 
                    0, 0, 200, 120, 
                    60, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LEVEL + " " + iLv,
                    true, true, true,
                    false );
                    
        var oLevelTextCont = new CTLText(oLevelContainer, 
                    0, 0, 200, 120, 
                    60, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LEVEL + " " + iLv,
                    true, true, true,
                    false );
        
        oLevelTextCont.setOutline(1);
        
        

        this.animContrast(0.5);

        createjs.Tween.get(oLevelContainer).to({scaleX: 1, scaleY: 1}, 1000, createjs.Ease.elasticOut).call(function () {
            createjs.Tween.get(oLevelContainer).wait(500).to({scaleX: 0, scaleY: 0}, 1000, createjs.Ease.elasticIn).call(function () {
                s_oStage.removeChild(oLevelContainer);
                s_oGame.canInput(true);
                s_oGame.setPause(false);
                if (s_bMobile === true)
                    s_oGame.blockJoypad(false);
            });
        });
    };

    this.showTimeIsUp = function () {

        var oTimeIsUpText;
        var oTimeIsUpTextCont;
        var pLvPos = {x: 0, y: 0};
        
        _oTimeIsUpContainer = new createjs.Container();
        _oTimeIsUpContainer.scaleX = 0;
        _oTimeIsUpContainer.scaleY = 0;
        _oTimeIsUpContainer.x = CANVAS_WIDTH / 2;
        _oTimeIsUpContainer.y = CANVAS_HEIGHT / 2;
        s_oStage.addChild(_oTimeIsUpContainer);
        
        oTimeIsUpText = new CTLText(_oTimeIsUpContainer, 
                    pLvPos.x-100, pLvPos.y, 200, 120, 
                    60, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_TIME_IS_UP,
                    true, true, true,
                    true );


        oTimeIsUpTextCont = new CTLText(_oTimeIsUpContainer, 
                    pLvPos.x-100, pLvPos.y, 200, 120, 
                    60, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_TIME_IS_UP,
                    true, true, true,
                    false );

        oTimeIsUpTextCont.setOutline(1);

       

        createjs.Tween.get(_oTimeIsUpContainer).to({scaleX: 1, scaleY: 1}, 1000, createjs.Ease.elasticOut).call(function () {
            createjs.Tween.get(_oTimeIsUpContainer).wait(500).to({scaleX: 0, scaleY: 0}, 1000, createjs.Ease.elasticIn).call(function () {
                s_oStage.removeChild(_oTimeIsUpContainer);
                s_oGame.restartLevel();

            });
        });
    };

    this.gameOver = function (iScore) {
        s_oGame.setPause(true);

        _oButExit.block(true);

        var oSpriteGameOver = s_oSpriteLibrary.getSprite("game_over_bg");
        _oGameOver = createBitmap(oSpriteGameOver);
        _oGameOver.alpha = 0;
        s_oStage.addChild(_oGameOver);

        var oSpriteGameOverPanel = s_oSpriteLibrary.getSprite("game_over_panel");
        _oGameOverPanel = createBitmap(oSpriteGameOverPanel);
        _oGameOverPanel.x = CANVAS_WIDTH / 2;
        _oGameOverPanel.y = -oSpriteGameOverPanel.height / 2;
        _oGameOverPanel.regX = oSpriteGameOverPanel.width / 2;
        _oGameOverPanel.regY = oSpriteGameOverPanel.height / 2;

        s_oStage.addChild(_oGameOverPanel);

        _oGameOverContainer = new createjs.Container();
        var pGameOverPos = {x: 0, y: 40};
        var iSizeFont = 40;

        _oTextGameOver = new CTLText(_oGameOverContainer, 
                    pGameOverPos.x-100, pGameOverPos.y, 200, iSizeFont, 
                    iSizeFont, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_GAMEOVER,
                    true, true, true,
                    false );
                    
        

        _oTextGameOverCont = new CTLText(_oGameOverContainer, 
                    pGameOverPos.x-100, pGameOverPos.y, 200, iSizeFont, 
                    iSizeFont, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_GAMEOVER,
                    true, true, true,
                    false );

        _oTextGameOverCont.setOutline(1);

        _oTextGameOverScore = new CTLText(_oGameOverContainer, 
                    pGameOverPos.x-100, pGameOverPos.y+50, 200, iSizeFont*2, 
                    iSizeFont, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    iScore,
                    true, true, true,
                    false );
                    

        _oTextGameOverScoreCont = new CTLText(_oGameOverContainer, 
                    pGameOverPos.x-100, pGameOverPos.y+50, 200, iSizeFont*2, 
                    iSizeFont, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    iScore,
                    true, true, true,
                    false );
        _oTextGameOverScoreCont.setOutline(1);
        
        _oGameOverContainer.x = CANVAS_WIDTH / 2;
        _oGameOverContainer.y = -200;

        s_oStage.addChild(_oGameOverContainer);

        createjs.Tween.get(_oGameOverPanel).to({y: 190}, 1000, createjs.Ease.backOut);
        createjs.Tween.get(_oGameOver).to({alpha: 1}, 1000, createjs.Ease.backOut).call(function () {
            createjs.Tween.get(_oGameOverContainer).to({y: CANVAS_HEIGHT / 2 - 170}, 1000, createjs.Ease.bounceOut).call(function () {
                var oSpriteRestart = s_oSpriteLibrary.getSprite("but_restart");
                var oSpriteExit = s_oSpriteLibrary.getSprite("but_exit_big");
                _oButReturnToMenu = new CGfxButton((CANVAS_WIDTH / 2 + 100), CANVAS_HEIGHT / 2 + 130, oSpriteExit);
                _oButReturnToMenu.addEventListener(ON_MOUSE_UP, s_oInterface._onButReturnToMenuRelease, this);
                _oButRestart = new CGfxButton((CANVAS_WIDTH / 2 - 100), CANVAS_HEIGHT / 2 + 130, oSpriteRestart);
                _oButRestart.addEventListener(ON_MOUSE_UP, s_oInterface._onButRestartLevelRelease, this);
            });
        });
        $(s_oMain).trigger("share_event", iScore);
        $(s_oMain).trigger("save_score", iScore);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oGameOver;
            oGameOver = playSound("game_over",1,false);
            setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
            oGameOver.on("end", function () {
                setVolume("soundtrack",1);
                oGameOver = null;
            });
        }
    };

    this._onButRestartLevelRelease = function () {
        s_oStage.removeChild(_oGameOverContainer, _oGameOver, _oGameOverPanel);
        _oButRestart.unload();
        _oButReturnToMenu.unload();
        _oButRestart = null;
        _oButReturnToMenu = null;
        _oGameOver = null;
        _oGameOverContainer = null;
        _oGameOverPanel = null;
        $(s_oMain).trigger("show_interlevel_ad");
        s_oGame.restartLevelFromGameOver();
        _oButExit.block(false);
    };


    this.finishGame = function (iScore) {
        s_oGame.setPause(true);
        if (s_bMobile === true)
            s_oGame.blockJoypad(true);
        _oButExit.block(true);

        var oCongratConatiner = new createjs.Container();
        oCongratConatiner.x = CANVAS_WIDTH / 2;
        oCongratConatiner.y = -200;
        s_oStage.addChild(oCongratConatiner);
        
        var oScoreContainer = new createjs.Container();
        oScoreContainer.x = CANVAS_WIDTH / 2;
        oScoreContainer.y = -200;
        s_oStage.addChild(oScoreContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;
        s_oStage.addChild(_oFade);

        var oTextCongrat;
        var oTextCongratCont;
        var pCongratPos = {x: 0, y: 0};
        var iSizeFont = 50;

        oTextCongrat = new CTLText(oCongratConatiner, 
                    pCongratPos.x-250, pCongratPos.y, 500, iSizeFont*2, 
                    iSizeFont*2, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_CONGRATULATIONS,
                    true, true, true,
                    false );


        oTextCongratCont = new CTLText(oCongratConatiner, 
                    pCongratPos.x-250, pCongratPos.y, 500, iSizeFont*2, 
                    iSizeFont*2, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_CONGRATULATIONS,
                    true, true, true,
                    false );
        oTextCongratCont.setOutline(1);

        var oTextScore;
        var oTextScoreCont;
        var oTextPoint;
        var oTextPointCont;
        var pScorePos = {x: 0, y: 0};
        var iSizeFont = 50;

        oTextScore = new CTLText(oScoreContainer, 
                    pScorePos.x-100, pScorePos.y, 200, iSizeFont, 
                    iSizeFont, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_TOTAL_SCORE,
                    true, true, false,
                    false );



        oTextScoreCont = new CTLText(oScoreContainer, 
                    pScorePos.x-100, pScorePos.y, 200, iSizeFont, 
                    iSizeFont, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_TOTAL_SCORE,
                    true, true, false,
                    false );
        oTextScoreCont.setOutline(1);
        
        oTextPoint = new CTLText(oScoreContainer, 
                    pScorePos.x-100, pScorePos.y+40, 200, iSizeFont, 
                    iSizeFont, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    iScore,
                    true, true, false,
                    false );


        oTextPointCont = new CTLText(oScoreContainer, 
                    pScorePos.x-100, pScorePos.y+40, 200, iSizeFont, 
                    iSizeFont, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    iScore,
                    true, true, false,
                    false );
        oTextPointCont.setOutline(1);            


        

        
        

        createjs.Tween.get(_oFade).to({alpha: 0.5}, 1000, createjs.Ease.backOut).call(function () {
            createjs.Tween.get(oCongratConatiner).to({y: CANVAS_HEIGHT / 2 - 150}, 1000, createjs.Ease.backOut).call(function () {
                createjs.Tween.get(oScoreContainer).wait(500).to({y: CANVAS_HEIGHT / 2}, 1000, createjs.Ease.bounceOut).call(function () {
                    var oSpriteRestart = s_oSpriteLibrary.getSprite("but_play");
                    _oButReturnToMenu = new CGfxButton((CANVAS_WIDTH / 2), CANVAS_HEIGHT / 2 + 150, oSpriteRestart);
                    _oButReturnToMenu.setScale(0.8);
                    _oButReturnToMenu.addEventListener(ON_MOUSE_UP, s_oInterface._onButReturnToMenuRelease, this);
                });
            });
        });
        $(s_oMain).trigger("share_event", iScore);
        $(s_oMain).trigger("save_score", iScore);
    };

    this._onButNextLevelRelease = function () {
        _oTextLevelComplete.unload();
        _oTextScoreLevelComplete.unload();
        
        s_oStage.removeChild(_oFade);
        _oTextLevelComplete = null;
        _oFade = null;
        _oTextScoreLevelComplete = null;

        _oButNextLevel.unload();
        _oButNextLevel = null;
        _oButPause.block(false);
        s_oGame.nextLevel();
    };

    this._onButReturnToMenuRelease = function () {
        s_oGame.onExit();
    };

    this.refreshScore = function (iScore) {
        _oScoreText.text = iScore;
        _oScoreTextCont.text = iScore;
    };

    this.colorTime = function (szColor) {
        _oTimeText.color = szColor;
    };

    this.refreshTime = function (iTime) {
        _oTimeText.text = iTime;
        _oTimeTextCont.text = iTime;
    };

    this._onButPauseRelease = function () {
        s_oGame.setPause(true);

        _oTransBg = new createjs.Shape();
        _oTransBg.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oTransBg.alpha = 0.5;
        s_oStage.addChild(_oTransBg);

        _oPauseText = new createjs.Text("Pause", "bold " + 48 + "px " + PRIMARY_FONT, "#ffffff");
        _oPauseText.textAlign = "center";
        _oPauseText.textBaseline = "alphabetic";
        _oPauseText.x = CANVAS_WIDTH / 2;
        _oPauseText.y = CANVAS_HEIGHT / 2 - 250;
        s_oStage.addChild(_oPauseText);

        _oButPause.block(true);

        var oSpriteContinue = s_oSpriteLibrary.getSprite('but_continue');
        _oButContinue = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, oSpriteContinue);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onButContinueRelease, this);
    };

    this._onButContinueRelease = function () {
        _oButContinue.unload();
        _oButContinue = null;

        s_oStage.removeChild(_oPauseText, _oTransBg);
        _oTransBg = false;
        _oPauseText = null;

        _oButPause.block(false);

        s_oGame.setPause(false);
    };

    this.onButNextPrevPage = function (oInfo) {
        switch (oInfo.page) {
            case 1:
                this.helpPage1(oInfo.level);
                _oButNext.block(true);
                
                break;
            case 2:
                this.helpPage2(oInfo.level);
                _oButPrev.block(true);
                _oButNext.block(true);
                
                break;
            case 3:
                this.helpPage3(oInfo.level);
                _oButPrev.block(true);
                _oButNext.block(true);
                
                break;
        }
    };

    this.helpPage1 = function (iLv) {

        var oHelpText;
        var oHelpTextCont;
        var iSize = 36;

        if (_oHelpTextContainer) {
            s_oStage.removeChild(_oHelpTextContainer);
        }

        if (!_oHelpPanel) {
            var oSpriteHelpPanel = s_oSpriteLibrary.getSprite('help_panel');
            _oHelpPanel = createBitmap(oSpriteHelpPanel);
            _oHelpPanel.on("click", function () {
                s_oInterface.finishHelp(iLv);
                
            }, null, true);
            s_oStage.addChild(_oHelpPanel);
        }

        if (_oButNext) {
            _oButPrev.unload();
            _oButPrev = null;
        } else {

            var oSpriteButNext = s_oSpriteLibrary.getSprite("but_arrow");

            _oButNext = new CGfxButton(CANVAS_WIDTH / 2 + 267, CANVAS_HEIGHT / 2, oSpriteButNext);
        }
        _oButNext.addEventListenerWithParams(ON_MOUSE_UP, this.onButNextPrevPage, this, {level: iLv, page: 2});

        _oHelpTextContainer = new createjs.Container();

        oHelpText = new CTLText(_oHelpTextContainer, 
                    -150, -30, 300, 220, 
                    iSize, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_PAGE_1,
                    true, true, true,
                    false );

        var oHelpTextCont = new CTLText(_oHelpTextContainer, 
                    -150, -30, 300, 220, 
                    iSize, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_PAGE_1,
                    true, true, true,
                    false );
        oHelpTextCont.setOutline(1);
        
        _oHelpTextContainer.x = CANVAS_WIDTH / 2 + 80;
        _oHelpTextContainer.y = CANVAS_HEIGHT / 2 - 90;
        _oHelpTextContainer.alpha = 0;
        
        createjs.Tween.get(_oHelpTextContainer).to({alpha: 1}, 500).call(function () {
            if (_oButPrev)
                _oButPrev.block(false);
            if (_oButNext)
                _oButNext.block(false);
        });
        s_oStage.addChild(_oHelpTextContainer);
    };

    this.helpPage2 = function (iLv) {

        var oHelpText;
        var oHelpTextCont;
        var iLineWidth = 300;
        var iSize = 33;

        s_oStage.removeChild(_oHelpTextContainer);

        var oSpriteButNext = s_oSpriteLibrary.getSprite("but_arrow");

        _oButNext.addEventListenerWithParams(ON_MOUSE_UP, this.onButNextPrevPage, this, {level: iLv, page: 3});

        if (!_oButPrev)
            _oButPrev = new CGfxButton(CANVAS_WIDTH / 2 - 267, CANVAS_HEIGHT / 2, oSpriteButNext);

        _oButPrev.addEventListenerWithParams(ON_MOUSE_UP, this.onButNextPrevPage, this, {level: iLv, page: 1});

        _oButPrev.setScale(-1);

        _oHelpTextContainer = new createjs.Container();

        oHelpText = new CTLText(_oHelpTextContainer, 
                    -150, -30, 300, 220, 
                    iSize, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );


        oHelpTextCont = new CTLText(_oHelpTextContainer, 
                    -150, -30, 300, 220, 
                    iSize, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
        oHelpTextCont.setOutline(1);
        
        if (s_bMobile === true) {
            oHelpText.refreshText(TEXT_HELP_PAGE_2_MOBILE);
            oHelpTextCont.refreshText(TEXT_HELP_PAGE_2_MOBILE);
        }
        else
        {
            oHelpText.refreshText(TEXT_HELP_PAGE_2_PC);
            oHelpTextCont.refreshText(TEXT_HELP_PAGE_2_PC);
        }


        _oHelpTextContainer.x = CANVAS_WIDTH / 2 + 80;
        _oHelpTextContainer.y = CANVAS_HEIGHT / 2 - 100;
        _oHelpTextContainer.alpha = 0;
        createjs.Tween.get(_oHelpTextContainer).to({alpha: 1}, 500).call(function () {
            if (_oButPrev)
                _oButPrev.block(false);
            if (_oButNext)
                _oButNext.block(false);
        });
        s_oStage.addChild(_oHelpTextContainer);
    };

    this.helpPage3 = function (iLv) {

        var oHelpText;
        var oHelpTextCont;
        var iLineWidth = 300;
        var iSize = 36;

        s_oStage.removeChild(_oHelpTextContainer);

        _oButNext.addEventListenerWithParams(ON_MOUSE_UP, this.finishHelp, this, iLv);

        _oButPrev.addEventListenerWithParams(ON_MOUSE_UP, this.onButNextPrevPage, this, {level: iLv, page: 2});

        _oHelpTextContainer = new createjs.Container();

        oHelpText = new CTLText(_oHelpTextContainer, 
                    -150, -30, 300, 220, 
                    iSize, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_PAGE_3_PART1 + " " + EXTRA_POINT + " " + TEXT_HELP_PAGE_3_PART2,
                    true, true, true,
                    false );


        oHelpTextCont = new CTLText(_oHelpTextContainer, 
                    -150, -30, 300, 220, 
                    iSize, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_PAGE_3_PART1 + " " + EXTRA_POINT + " " + TEXT_HELP_PAGE_3_PART2,
                    true, true, true,
                    false );
        oHelpTextCont.setOutline(1); 

        _oHelpTextContainer.x = CANVAS_WIDTH / 2 + 80;
        _oHelpTextContainer.y = CANVAS_HEIGHT / 2 - 90;
        _oHelpTextContainer.alpha = 0;

        _oHelpPanel.off("click");
        createjs.Tween.get(_oHelpTextContainer).to({alpha: 1}, 500).call(function () {
            _oButPrev.block(false);
            _oButNext.block(false);
        });
        s_oStage.addChild(_oHelpTextContainer);
    };

    this.finishHelp = function (iLv) {
        s_oStage.removeChild(_oHelpTextContainer);
        _oHelpTextContainer = null;
        if (_oButNext) {
            _oButNext.unload();
            _oButNext = null;
        }
        if (_oButPrev) {
            _oButPrev.unload();
            _oButPrev = null;
        }
        createjs.Tween.get(_oHelpPanel).to({alpha: 0}, 500, createjs.Ease.cubicOut).call(function () {
            s_oStage.removeChild(_oHelpPanel);
            _oHelpPanel = null;
            if (_bPressYet === false) {
                s_oInterface.showLevelNum(iLv);
                _bPressYet = true;
            }
        });
    };

    this.animContrast = function (iValue) {
        createjs.Tween.get(_oContrast).to({alpha: iValue}, 2000, createjs.Ease.cubicOut);
    };

    this.unload = function () {

        s_oStage.removeChild(_oTextGameOver, _oButReturnToMenu, _oFade);
        _oTextGameOver = null;
        _oButReturnToMenu = null;
        _oFade = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            if (_oAudioToggle) {
                _oAudioToggle.unload();
                _oAudioToggle = null;
            }
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        s_oInterface = null;

    };

    this._onExit = function () {
        s_oGame.onExit();
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };

    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };

    s_oInterface = this;

    this._init(iLevel);

    return this;
}

var s_oInterface = null;