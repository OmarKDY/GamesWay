function CInterface(iScore) {
    var _oAudioToggle;
    var _pStartPosPause;
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    
    var _bStoppedTime;
    var _oButPause;
    var _oPauseText;
    var _oButExit;
    var _oButContinue;
    var _oUpEdge;
    var _oLife;
    var _oLifeText;
    var _oScoreText;
    var _oFade;
    var _oButReturnToMenu;
    var _oTextGameOver;
    var _oTransBg;
    var _oButNextLevel;
    var _oTextLevelComplete;
    var _oTextScoreLevelComplete;
    var _oTextCongrat;
    var _oHelpPanel;
    var _oHelpText;
    var _oLevelText;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function (iScore) {
        var oSprite = s_oSpriteLibrary.getSprite('icon_audio');
        var oButtonX = CANVAS_WIDTH - (oSprite.width / 2) - 130;

        _bStoppedTime = false;

        _oUpEdge = createBitmap(s_oSpriteLibrary.getSprite("up_edges"));
        s_oStage.addChild(_oUpEdge);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _pStartPosAudio = {x: oButtonX, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
             _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
             _pStartPosFullscreen = {x: oButtonX, y: (oSprite.height / 2) + 10};
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,true);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oScoreText = new CTLText(s_oStage, 
                    CANVAS_WIDTH / 2 - 150, CANVAS_HEIGHT / 2 - 430, 100, 70, 
                    50, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE+"\n"+iScore,
                    true, true, true,
                    false );
                    
        
       

        _oLevelText =new CTLText(s_oStage, 
                    CANVAS_WIDTH / 2 - 290, CANVAS_HEIGHT / 2 - 430, 100, 70, 
                    50, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LEVEL_UPPERCASE,
                    true, true, true,
                    false );
                    
        

        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');
        oButtonX = CANVAS_WIDTH - (oSpriteExit.width / 2) - 100;
        _pStartPosExit = {x: oButtonX + 85, y: (oSpriteExit.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oSpritePause = s_oSpriteLibrary.getSprite('but_pause');
        oButtonX = CANVAS_WIDTH - (oSpritePause.width / 2) - 90;
        _pStartPosPause = {x: oButtonX, y: (oSpritePause.height / 2) + 10};
        _oButPause = new CGfxButton(_pStartPosPause.x, _pStartPosPause.y, oSpritePause,s_oStage);
        _oButPause.addEventListener(ON_MOUSE_UP, this._onButPauseRelease, this);

        var oSpriteLife = s_oSpriteLibrary.getSprite("life");

        _oLife = createBitmap(oSpriteLife);
        _oLife.x = CANVAS_WIDTH * 0.5 + 60;
        _oLife.y = 120;
        _oLife.regX = oSpriteLife.width * 0.5;
        _oLife.regY = oSpriteLife.width * 0.5;
        s_oStage.addChild(_oLife);

        _oLifeText = new createjs.Text("x" + LIFE, "normal " + 40 + "px " + PRIMARY_FONT, "#ffffff");
        _oLifeText.textAlign = "center";
        _oLifeText.textBaseline = "alphabetic";
        _oLifeText.x = CANVAS_WIDTH * 0.5 + 100;
        _oLifeText.y = 125;
        s_oStage.addChild(_oLifeText);

        s_oGame.setPause(true);
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
        _oButPause.setPosition(_pStartPosPause.x - iNewX, _pStartPosPause.y + iNewY);
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
    };

    this.rereshNumLevel = function () {

    };

    this.refreshBallLife = function (iValue) {
        _oLifeText.text = "x" + +iValue;
    };

    this.gameOver = function (iScore) {
        s_oGame.setPause(true);

        _oButPause.block(true);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;
        s_oStage.addChild(_oFade);

        _oTextGameOver = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-300, -120, 600, 300, 
                    100, "center", "#ffff00", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE_GAMEOVER + "\n\n" + iScore,
                    true, true, true,
                    false );
                    
        
      

        createjs.Tween.get(_oFade).to({alpha: 0.5}, 1000, createjs.Ease.backOut).call(function () {
            createjs.Tween.get(_oTextGameOver.getText()).to({y: CANVAS_HEIGHT / 2 - 200}, 1000, createjs.Ease.bounceOut).call(function () {
                var oSpriteRestart = s_oSpriteLibrary.getSprite("but_restart");
                _oButReturnToMenu = new CGfxButton((CANVAS_WIDTH / 2), CANVAS_HEIGHT / 2 + 200, oSpriteRestart,s_oStage);
                _oButReturnToMenu.addEventListener(ON_MOUSE_UP, s_oInterface._onButReturnToMenuRelease, this);
            });
        });

        $(s_oMain).trigger("share_event", iScore);
        $(s_oMain).trigger("save_score", iScore);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oGameOver = playSound("game_over",1,false);
            setVolume("soundtrack",0);
            
            oGameOver.on("end", function () {
                setVolume("soundtrack",1);
                oGameOver = null;
            });
        }
    };

    this.levelComplete = function (iLevel, iScore) {
        var iLv = iLevel;
        if (iLv < BRICKS_LEVEL_POSITION.length) {
            _oFade = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
            _oFade.alpha = 0;
            s_oStage.addChild(_oFade);
            s_oStage.setChildIndex(_oFade, s_oStage.numChildren - 1);
            _oButPause.block(true);

            _oTextLevelComplete = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-300, - 150, 600, 300, 
                    100, "center", "#ffff00", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LEVEL + " " + iLv + " " + TEXT_COMPLETE,
                    true, true, true,
                    false );
                    
           

            _oTextScoreLevelComplete = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-300, CANVAS_HEIGHT / 2 - 150, 600, 300, 
                    100, "center", "#ffff00", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE + "\n\n" + iScore,
                    true, true, true,
                    false );
                    
          

            createjs.Tween.get(_oFade).to({alpha: 1}, 1000, createjs.Ease.backOut);
            createjs.Tween.get(_oTextScoreLevelComplete.getText()).to({alpha: 1}, 1000, createjs.Ease.bounceOut).call(function () {
                var oSpriteButNext = s_oSpriteLibrary.getSprite("but_continue");
                _oButNextLevel = new CGfxButton((CANVAS_WIDTH / 2), CANVAS_HEIGHT / 2 + 300, oSpriteButNext,s_oStage);
                _oButNextLevel.addEventListener(ON_MOUSE_UP, s_oInterface._onButNextLevelRelease, this);
            });
            createjs.Tween.get(_oTextLevelComplete.getText()).to({y: CANVAS_HEIGHT / 2 - 300}, 1000, createjs.Ease.bounceOut);
        }
        else
        {
            this.finishGame(iScore);
        }
    };

    this.finishGame = function (iScore) {
        s_oGame.setPause(true);

        _oButPause.block(true);

        _oFade = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
        _oFade.alpha = 0;
        s_oStage.addChild(_oFade);
        s_oStage.setChildIndex(_oFade, s_oStage.numChildren - 1);

        _oTextCongrat = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-300, -170, 600, 200, 
                    100, "center", "#ffff00", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_CONGRATULATIONS,
                    true, true, true,
                    false );
                    
        

        _oTextGameOver = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-300,CANVAS_HEIGHT / 2 - 100, 600, 250, 
                    100, "center", "#ffff00", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE_GAMEOVER + "\n\n" + iScore,
                    true, true, true,
                    false );
                    
       

        createjs.Tween.get(_oFade).to({alpha: 1}, 1000, createjs.Ease.backOut);
        createjs.Tween.get(_oTextCongrat.getText()).to({y: CANVAS_HEIGHT / 2 - 370}, 1200, createjs.Ease.bounceOut);
        createjs.Tween.get(_oTextGameOver.getText()).to({alpha: 1}, 1000, createjs.Ease.bounceOut).call(function () {
            var oSpriteRestart = s_oSpriteLibrary.getSprite("but_restart");
            _oButReturnToMenu = new CGfxButton((CANVAS_WIDTH / 2), CANVAS_HEIGHT / 2 + 300, oSpriteRestart,s_oStage);
            _oButReturnToMenu.addEventListener(ON_MOUSE_UP, s_oInterface._onButReturnToMenuRelease, this);
        });
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oGameCompleted = playSound("game_completed",1,false);//insert an appropriate sound
            setVolume("soundtrack",0);
            oGameCompleted.on("end", function () {
                setVolume("soundtrack",1);
                oGameCompleted = null;
            });
        }
        $(s_oMain).trigger("save_score", iScore);
        $(s_oMain).trigger("share_event", iScore);
    };

    this._onButNextLevelRelease = function () {
        _oTextScoreLevelComplete.unload();
        _oTextLevelComplete.unload();
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
        _oScoreText.refreshText("SCORE\n" + iScore);
    };

    this._onButPauseRelease = function () {
        playSound("click", 1, false);

        s_oGame.setPause(true);

        _oTransBg = new createjs.Shape();
        _oTransBg.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oTransBg.alpha = 0.5;
        s_oStage.addChild(_oTransBg);

        _oPauseText = new createjs.Text("Pause", "normal " + 70 + "px " + PRIMARY_FONT, "#ffffff");
        _oPauseText.textAlign = "center";
        _oPauseText.textBaseline = "alphabetic";
        _oPauseText.x = CANVAS_WIDTH / 2;
        _oPauseText.y = CANVAS_HEIGHT / 2 - 250;
        s_oStage.addChild(_oPauseText);

        _oButPause.block(true);
        _oButExit.block(true);

        createjs.Ticker.paused = true;

        var oSpriteContinue = s_oSpriteLibrary.getSprite('but_continue');
        _oButContinue = new CGfxButton(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, oSpriteContinue,s_oStage);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onButContinueRelease, this);
    };

    this._onButContinueRelease = function () {
        playSound("click", 1, false);

        _oButContinue.unload();
        _oButContinue = null;

        s_oStage.removeChild(_oPauseText, _oTransBg);
        _oTransBg = false;
        _oPauseText = null;

        _oButPause.block(false);

        _oButExit.block(false);

        createjs.Ticker.paused = false;

        s_oGame.setPause(false);
    };

    this.help = function (iLv) {
        var iLevel = iLv;
        var oSpriteHelpBg = s_oSpriteLibrary.getSprite('msg_box');
        _oHelpPanel = createBitmap(oSpriteHelpBg);

        _oHelpPanel.on("click", function () {
            s_oInterface.unloadHelp(iLevel);
        }, null, true);

        s_oStage.addChild(_oHelpPanel);
        if (!_oHelpText) {
            _oHelpText = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-300,CANVAS_HEIGHT / 2 - 120, 600, 250, 
                    100, "center", "#ffff00", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_PAGE_1_PC,
                    true, true, true,
                    false );
                    
            
        } else if (s_bMobile === true) {
            _oHelpText.refreshText(TEXT_HELP_PAGE_1_MOBILE);
        } else {
            _oHelpText.refreshText(TEXT_HELP_PAGE_1_PC);
        }

    };

    this.unloadHelp = function (iLevel) {
        createjs.Tween.get(_oHelpPanel).to({alpha: 0}, 1000, createjs.Ease.cubicOut).call(function () {
            s_oStage.removeChild(_oHelpPanel);
        });
        createjs.Tween.get(_oHelpText.getText()).to({alpha: 0}, 1000, createjs.Ease.cubicOut).call(function () {
            _oHelpText.unload();
            s_oInterface.showNumLevel(iLevel);
        });
    };

    this.numLevel = function (iLevel) {
        var iLv = iLevel;
        _oLevelText.refreshText(TEXT_LEVEL_UPPERCASE + "\n" + iLv);
    };

    this.showNumLevel = function (iLevel) {

        var oCurLevel;
        var oCurLevelCont;
        var oCurLevelContainer;
        var iRand = Math.floor(Math.random() * 4);
        oCurLevel = new createjs.Text(TEXT_LEVEL_UPPERCASE + " " + iLevel, "normal " + 100 + "px " + PRIMARY_FONT, COLOR_TEXT_LEVEL[iRand]);
        oCurLevel.textAlign = "center";
        oCurLevel.textBaseline = "alphabetic";
        oCurLevel.x = 0;
        oCurLevel.y = 0;

        oCurLevelCont = new createjs.Text(TEXT_LEVEL_UPPERCASE + " " + iLevel, "normal " + 100 + "px " + PRIMARY_FONT, "#000000");
        oCurLevelCont.textAlign = "center";
        oCurLevelCont.textBaseline = "alphabetic";
        oCurLevelCont.x = 0;
        oCurLevelCont.y = 0;
        oCurLevelCont.outline = 5;

        oCurLevelContainer = new createjs.Container();
        oCurLevelContainer.addChild(oCurLevelCont, oCurLevel);
        oCurLevelContainer.x = -100;
        oCurLevelContainer.y = CANVAS_HEIGHT * 0.5;
        s_oStage.addChild(oCurLevelContainer);

        createjs.Tween.get(oCurLevelContainer).to({x: CANVAS_WIDTH * 0.5}, 600, createjs.Ease.cubicOut).call(function () {
            createjs.Tween.get(oCurLevelContainer).wait(500).to({x: CANVAS_WIDTH + 100}, 600, createjs.Ease.cubicIn).call(function () {
                s_oStage.removeChild(oCurLevelContainer);
                s_oGame.setPause(false);
            });
        });

    };

    this.unload = function () {
        if(_oTextGameOver){
            _oTextGameOver.unload();
        }
        
        s_oStage.removeChild( _oButReturnToMenu, _oFade);
        _oTextGameOver = null;
        _oButReturnToMenu = null;
        _oFade = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
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

    this._init(iScore);

    return this;
}

var s_oInterface = null;