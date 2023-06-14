function CInterface(iLevel, oParentContainer){
    var _oContainer;    
    var _oParentContainer;
    var _oPauseContainer;
    var _oHelpPanel = null;
    var _oPause;
    var _oAudioToggle;
    var _oButSettings;
    var _oButExit;
    var _oButFullscreen;
    var _oButHelp;  
    var _oCoinsIcon;
    var _oScoreText;
    var _oScoreTextStroke;
    var _oScorePos;    
    var _oCoinsPos;
    var _oLevelText;
    var _oLevelTextStroke;
    var _oLevelPos;
    var _oCoinsTextStroke;
    var _oCoinsText;
    var _oButRestart;
    
    var _bMobileInitialized;
    var _bOnSettings;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosRestart;
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;    
    var _pStartPosButHelp;
    var _pStartButSettings;
    
    var _iLevel = iLevel;
    
    this._init = function(){  
        _bMobileInitialized = false;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        _oScorePos = {x: CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT - 20};
        _oCoinsPos = {x: CANVAS_WIDTH_HALF, y: 60};
        _oLevelPos = {x: 20, y: 60};
        
        _oScoreTextStroke = new createjs.Text(TEXT_SCORE + " " + s_iTotalScore,FONT_SIZE_INTERFACE+PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oScoreTextStroke.x = _oScorePos.x;
        _oScoreTextStroke.y = _oScorePos.y;
        _oScoreTextStroke.textAlign = "center";
        _oScoreTextStroke.textBaseline = "alphabetic";
        _oScoreTextStroke.outline = 4;
        _oContainer.addChild(_oScoreTextStroke);
        
        _oScoreText = new createjs.Text(TEXT_SCORE + " " + s_iTotalScore,FONT_SIZE_INTERFACE+PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oScoreText.x = _oScorePos.x;
        _oScoreText.y = _oScorePos.y;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "alphabetic";
        _oContainer.addChild(_oScoreText);
        
        _oLevelTextStroke = new createjs.Text(TEXT_LEVEL + " " + _iLevel,FONT_SIZE_INTERFACE+PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oLevelTextStroke.x = _oLevelPos.x;
        _oLevelTextStroke.y = _oLevelPos.y;
        _oLevelTextStroke.textAlign = "left";
        _oLevelTextStroke.textBaseline = "alphabetic";
        _oLevelTextStroke.outline = 4;
        _oContainer.addChild(_oLevelTextStroke);
        
        _oLevelText = new createjs.Text(TEXT_LEVEL + " " + _iLevel,FONT_SIZE_INTERFACE+PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oLevelText.x = _oLevelPos.x;
        _oLevelText.y = _oLevelPos.y;
        _oLevelText.textAlign = "left";
        _oLevelText.textBaseline = "alphabetic";
        _oContainer.addChild(_oLevelText);
        
        var oSprite = s_oSpriteLibrary.getSprite("coin_score");
        _oCoinsIcon = createBitmap(oSprite);
        _oCoinsIcon.regX = oSprite.width * 0.5;
        _oCoinsIcon.regY = oSprite.height * 0.5;
        _oCoinsIcon.x = _oCoinsPos.x - 30;
        _oCoinsIcon.y = _oCoinsPos.y - 10;
        _oCoinsIcon.scaleX = _oCoinsIcon.scaleY = 0.7;
        
        _oContainer.addChild(_oCoinsIcon);
        _oCoinsTextStroke = new createjs.Text("X" + 0,FONT_SIZE_INTERFACE+PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oCoinsTextStroke.x = _oCoinsPos.x;
        _oCoinsTextStroke.y = _oCoinsPos.y;
        _oCoinsTextStroke.textAlign = "left";
        _oCoinsTextStroke.textBaseline = "alphabetic";
        _oCoinsTextStroke.outline = 4;
        _oContainer.addChild(_oCoinsTextStroke);
        
        _oCoinsText = new createjs.Text("X" + 0,FONT_SIZE_INTERFACE+PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oCoinsText.x = _oCoinsPos.x;
        _oCoinsText.y = _oCoinsPos.y;
        _oCoinsText.textAlign = "left";
        _oCoinsText.textBaseline = "alphabetic";
        _oContainer.addChild(_oCoinsText);
        
        _oPauseContainer = new createjs.Container();
        _oContainer.addChild(_oPauseContainer);

        var oSprite = s_oSpriteLibrary.getSprite("but_settings");
        _pStartButSettings = {x: CANVAS_WIDTH-(oSprite.width/2)-10,y: (oSprite.height/2)+10};

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:_pStartButSettings.x, y: _pStartButSettings.y+oSprite.height+10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        _oButExit.setVisible(false);
        
        oSprite = s_oSpriteLibrary.getSprite("but_help");
        _pStartPosButHelp = {x:_pStartButSettings.x,y:_pStartPosExit.y+oSprite.height+10};
        _oButHelp = new CGfxButton(_pStartPosButHelp.x,_pStartPosButHelp.y,oSprite,_oContainer);
        _oButHelp.addEventListener(ON_MOUSE_UP,function(){new CHelpPanel();},this);
        _oButHelp.setVisible(false);
        
        _pStartPosAudio = {x: _pStartPosButHelp.x,y: _pStartPosButHelp.y+oSprite.height+10};
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, _oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _oAudioToggle.setVisible(false);
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            if (_oAudioToggle){
                _pStartPosFullscreen = {x:_pStartPosAudio.x,y:_pStartPosAudio.y+oSprite.height+10};
            }else{
                _pStartPosFullscreen = {x:_pStartPosAudio.x,y:_pStartPosAudio.y};
            }
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
            _oButFullscreen.setVisible(false);
        };

        oSprite = s_oSpriteLibrary.getSprite("but_settings");

        _oButSettings = new CGfxButton(_pStartButSettings.x,_pStartButSettings.y,oSprite,_oContainer);
        _oButSettings.addEventListener(ON_MOUSE_UP,this.onSettings);
        _bOnSettings = false;
        
        _pStartPosRestart = {x:_pStartButSettings.x - oSprite.width - 10,y:_pStartButSettings.y};
        _oButRestart = new CGfxButton(_pStartPosRestart.x,_pStartPosRestart.y,s_oSpriteLibrary.getSprite("but_restart_small"),_oContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.pulseScoreIcon = function(){
        if ( createjs.Tween.hasActiveTweens(_oCoinsIcon) ) {
            return;
        }
        
        createjs.Tween.get(_oCoinsIcon)
            .to({scaleX: 0.9, scaleY: 0.9}, 200, createjs.Ease.cubicOut)
            .to({scaleX: 0.7, scaleY: 0.7}, 200, createjs.Ease.cubicIn)
            .call(function(){
                createjs.Tween.removeTweens(_oCoinsIcon);
            });        
    };
    
    this.onSettings = function(){
       if (!_bOnSettings){
            _oPause = new CPause(_oPauseContainer);
            _bOnSettings = true;
            _oButExit.setX(_oButSettings.getX());
            _oButExit.setY(_oButSettings.getY());
            _oButExit.setVisible(true);
            _oButHelp.setX(_oButSettings.getX());
            _oButHelp.setY(_oButSettings.getY());
            _oButHelp.setVisible(true);
            
            if (_oAudioToggle){
               _oAudioToggle.setPosition(_oButSettings.getX(), _oButSettings.getY());
               _oAudioToggle.setVisible(true);
            
                new createjs.Tween.get(_oAudioToggle.getButtonImage())
                    .to({x:_pStartPosAudio.x-s_iOffsetX, y: _pStartPosAudio.y},300,createjs.Ease.cubicOut); 
            }

            if (_oButFullscreen){
               _oButFullscreen.setPosition(_oButSettings.getX(), _oButSettings.getY());
               _oButFullscreen.setVisible(true);

                new createjs.Tween.get(_oButFullscreen.getButtonImage())
                    .to({x:_pStartPosFullscreen.x-s_iOffsetX, y: _pStartPosFullscreen.y},300,createjs.Ease.cubicOut);
            }

            new createjs.Tween.get(_oButExit.getButtonImage())
                .to({x:_pStartPosExit.x-s_iOffsetX, y: _pStartPosExit.y},300,createjs.Ease.cubicOut);
            new createjs.Tween.get(_oButHelp.getButtonImage())
                .to({x:_pStartPosButHelp.x-s_iOffsetX, y: _pStartPosButHelp.y},300,createjs.Ease.cubicOut);       
        } else {
            s_oInterface.closePanel();
        }
    };
    
    this.updateCoinsTaken = function(iValue){
        _oCoinsTextStroke.text = _oCoinsText.text = "X" + iValue;
    };
   
    this.refreshScore = function(iStart,iScore){
        s_oRollingTextManager.add(iStart,_oScoreText,_oScoreTextStroke,iScore,1000,EASE_CUBIC_IN,null,null,TEXT_SCORE,null);
    };
    
    this.closePanel = function(){
        _oPause.onExit();
        _bOnSettings = false;
        
        new createjs.Tween.get(_oButExit.getButtonImage())
            .to({x:_oButSettings.getX(), y:_oButSettings.getY()},300,createjs.Ease.cubicIn)
            .call(function(){
                _oButExit.setVisible(false);
                _oButHelp.setVisible(false);
                if (_oAudioToggle){
                    _oAudioToggle.setVisible(false);
                }
                if (_oButFullscreen){
                    _oButFullscreen.setVisible(false);
                }
            });

        new createjs.Tween.get(_oButHelp.getButtonImage())
            .to({x:_oButSettings.getX(), y: _oButSettings.getY()},300,createjs.Ease.cubicIn);

        if (_oAudioToggle){
            new createjs.Tween.get(_oAudioToggle.getButtonImage())
            .to({x:_oButSettings.getX(), y: _oButSettings.getY()},300,createjs.Ease.cubicIn);
        }

        if (_oButFullscreen){
            new createjs.Tween.get(_oButFullscreen.getButtonImage())
            .to({x:_oButSettings.getX(), y: _oButSettings.getY()},300,createjs.Ease.cubicIn);
        }
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        _oButExit.unload();
        _oButExit = null;
        _oButSettings.unload();
        _oButSettings = null;
        _oButHelp.unload();
        _oButHelp = null;
        _oButRestart.unload();
        
        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.unload();
            _oButFullscreen = null;
        }        

        _oParentContainer.removeChild(_oContainer);        
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButSettings.setPosition(_pStartButSettings.x-iNewX,iNewY + _pStartButSettings.y);
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        _oButHelp.setPosition(_pStartPosButHelp.x- iNewX,iNewY + _pStartPosButHelp.y);
        _oButRestart.setPosition(_pStartPosRestart.x- iNewX,iNewY + _pStartPosRestart.y);
        _oLevelTextStroke.x = _oLevelText.x = _oLevelPos.x + iNewX;
        _oLevelTextStroke.y = _oLevelText.y = _oLevelPos.y + iNewY;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,_pStartPosAudio.y);
        }

        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y);
        }
    };

    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
        $("#canvas").trigger("restart_level", 1);
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onExit = function(){
        new CAreYouSurePanel(s_oGame.onExit);
    };
    
    this.gameOver = function(iScore){
        new CEndPanel(iScore);
    };
    
    this.showWin = function(){
        new CWinPanel();
    };
    
    this.isAreYouSurePanel = function() {
        if (_oAreYouSurePanel === null) {
            return false;
        } else {
            return true;
        }
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onRestart = function(){
        s_oGame.restartGame();
    };

    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };

    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setActive(s_bFullscreen);
	};
    };

    s_oInterface = this;    
    _oParentContainer = oParentContainer;
    
    this._init();
    
    return this;
}

var s_oInterface = null;