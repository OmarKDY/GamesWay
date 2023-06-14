function CInterface(iLevel){
    var _oContainer;    
    var _oPauseContainer;
    var _oHelpPanel = null;
    var _oPause;
    var _oAudioToggle;
    var _oButSettings;
    var _oButExit;
    var _oButFullscreen;
    var _oButSkip;
    var _oButHelp;    
    var _oTimeSprite;
    var _oTimeSpritePos     = {x: CANVAS_WIDTH_HALF-310, y: 40};
    var _oTimeText;
    var _oTimeTextStroke;
    var _oTimePos           = {x: CANVAS_WIDTH_HALF-240, y: 45};
    var _oGoalSprite;
    var _oGoalSpritePos     = {x: CANVAS_WIDTH_HALF+230, y: _oTimeSpritePos.y};
    var _oGoalPos           = {x: CANVAS_WIDTH_HALF+285, y: _oTimePos.y};
    var _oGoalText;
    var _oGoalTextStroke;
    var _oScoreText;
    var _oScoreTextStroke;
    var _oScorePos          = {x: CANVAS_WIDTH_HALF + 150, y: CANVAS_HEIGHT-30};
    var _oLevelText;
    var _oLevelTextStroke;
    var _oLevelPos          = {x: CANVAS_WIDTH_HALF - 200, y: CANVAS_HEIGHT-30};
    
    var _bMobileInitialized;
    var _bOnSettings;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;    
    var _pStartPosButHelp;
    var _pStartButSettings;
    var _pStartPosSkip;
    
    var _iLevel = iLevel;
    
    this._init = function(){  
        _bMobileInitialized = false;
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("goal_icon");
        _oGoalSprite = createBitmap(oSprite);
        _oGoalSprite.regX = oSprite.width/2;
        _oGoalSprite.regY = oSprite.height/2;
        _oGoalSprite.x = _oGoalSpritePos.x;
        _oGoalSprite.y = _oGoalSpritePos.y;
        _oContainer.addChild(_oGoalSprite);
        
        var iWidth = oSprite.width-6;
        var iHeight = 30;
        var iX = _oGoalPos.x+6;
        var iY = _oGoalPos.y;
        _oGoalTextStroke = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    24, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    "0/"+LEVEL_GOAL[_iLevel],
                    true, true, false,
                    false );
        _oGoalTextStroke.setOutline(4);           
        _oGoalText = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    24, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    "0/"+LEVEL_GOAL[_iLevel],
                    true, true, false,
                    false );
                    

        var iWidth = 250;
        var iHeight = 30;
        var iX = _oScorePos.x;
        var iY = _oScorePos.y;
        _oScoreTextStroke = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    24, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_SCORE, 0),
                    true, true, false,
                    false );
        _oScoreTextStroke.setOutline(4);           
        _oScoreText = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    24, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_SCORE, 0),
                    true, true, false,
                    false );
        
        var iX = _oLevelPos.x;
        var iY = _oLevelPos.y;
        _oLevelTextStroke = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    24, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_LEVEL, _iLevel),
                    true, true, false,
                    false );
        _oLevelTextStroke.setOutline(4);           
        _oLevelText = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    24, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_LEVEL, _iLevel),
                    true, true, false,
                    false );
       
        var iWidth = 95;
        var iX = _oTimePos.x;
        var iY = _oTimePos.y;
        _oTimeTextStroke = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    24, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    "00:00",
                    true, true, false,
                    false );
        _oTimeTextStroke.setOutline(4);           
        _oTimeText = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    24, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    "00:00",
                    true, true, false,
                    false );

        
        
        var oSprite = s_oSpriteLibrary.getSprite("time");
        _oTimeSprite = createBitmap(oSprite);
        _oTimeSprite.regX = oSprite.width/2;
        _oTimeSprite.regY = oSprite.height/2;
        _oTimeSprite.x = _oTimeSpritePos.x;
        _oTimeSprite.y = _oTimeSpritePos.y;
        _oContainer.addChild(_oTimeSprite);
        
        
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
        
        _pStartPosSkip = {x: 1090, y: 560};
        oSprite = s_oSpriteLibrary.getSprite("but_continue");
        _oButSkip = new CGfxButton(_pStartPosSkip.x, _pStartPosSkip.y, oSprite, _oContainer);
        _oButSkip.setVisible(false);
        
        _pStartPosAudio = {x: _pStartPosButHelp.x,y: _pStartPosButHelp.y+oSprite.height/2+20};
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
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
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
    
    this.updateLevelGoal = function(iValue){
        _oGoalTextStroke.refreshText( iValue+"/"+LEVEL_GOAL[_iLevel-1] );
        _oGoalText.refreshText( iValue+"/"+LEVEL_GOAL[_iLevel-1] );
        
        if (iValue === LEVEL_GOAL[_iLevel-1]) {
            new createjs.Tween.get(_oGoalSprite)
                .to({scaleX: 1.5, scaleY: 1.5}, 500, createjs.Ease.cubicOut)
                .to({scaleX: 1, scaleY: 1}, 500, createjs.Ease.cubicIn);
        };
    };
    
    this.refreshTime = function(iValue){                
        _oTimeTextStroke.refreshText( iValue );
        _oTimeText.refreshText( iValue );
        
        if (iValue === "00:00"){
            new createjs.Tween.get(_oTimeSprite)
                .to({scaleX: 1.5, scaleY: 1.5}, 500, createjs.Ease.cubicOut)
                .to({scaleX: 1, scaleY: 1}, 500, createjs.Ease.cubicIn);
        
            this.activateButSkip();            
        };
    };
    
    this.activateButSkip = function(bValue){
        if (bValue === false) {
            _oButSkip.setVisible(false);            
        } else {
            _oButSkip.setVisible(true);
            _oButSkip.addEventListener(ON_MOUSE_UP, this._onSkip, this);
        }
    };
    
    this.refreshScore = function(iScore){
        _oScoreTextStroke.refreshText( sprintf(TEXT_SCORE, iScore) );
        _oScoreText.refreshText( sprintf(TEXT_SCORE, iScore) );
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
    
    this.unloadPause = function(){
        
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        _oButExit.unload();
        
        s_oStage.removeChild(_oContainer);
        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.unload();
        }        

        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButSettings.setPosition(_pStartButSettings.x-iNewX,iNewY + _pStartButSettings.y);
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        _oButHelp.setPosition(_pStartPosButHelp.x- iNewX,iNewY + _pStartPosButHelp.y);
        
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
        $(s_oMain).trigger("restart_level", 1);
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onExit = function(){
        new CAreYouSurePanel(s_oGame.onExit);
    };
    
    this._onSkip = function(){
        s_oGame.skipToLevelEnd();
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


    this._onRestart = function(){
        s_oGame.onRestart();  
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;