function CInterface(iScore){
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosPause;
    var _pStartPosScore;
    var _pStartPosLevel;
    var _pStartPosFullscreen;
    var _pStartPosLeft;
    var _pStartPosRight;
    var _oRollingScore;
	
    var _oAmountScoreText;
    var _oScoreText;
    var _oLevelText;
    var _oButExit;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oButPause;
    var _oButLeft;
    var _oButRight;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oGUIExpandible;
    var _oAreYouSurePanel;
    var _oScoreContainer;
    var _oLevelContainer;
    
    this._init = function(iScore){ 
        if(!s_bMobile) {
            //KEY LISTENER
            document.onkeydown   = s_oGame.onKeyDown;
            document.onkeyup   = s_oGame.onKeyUp;
        }else{
            var oSpriteLeft = s_oSpriteLibrary.getSprite("but_left");
            _pStartPosLeft = {x:oSpriteLeft.width/2 + 150,y:CANVAS_HEIGHT-oSpriteLeft.height/2 -50};
            _oButLeft = new CGfxButton(_pStartPosLeft.x,_pStartPosLeft.y,oSpriteLeft,s_oStage);
            _oButLeft.addEventListener(ON_MOUSE_DOWN,this._onLeftDown,this);
            _oButLeft.addEventListener(ON_MOUSE_UP,this._onLeftUp,this);
            
            var oSpriteRight = s_oSpriteLibrary.getSprite("but_right");
            _pStartPosRight = {x:CANVAS_WIDTH - oSpriteRight.width/2 - 150,y:CANVAS_HEIGHT-oSpriteRight.height/2 -50};
            _oButRight = new CGfxButton(_pStartPosRight.x,_pStartPosRight.y,oSpriteRight,s_oStage);
            _oButRight.addEventListener(ON_MOUSE_DOWN,this._onRightDown,this);
            _oButRight.addEventListener(ON_MOUSE_UP,this._onRightUp,this);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_settings');
        var pPos = {x:CANVAS_WIDTH,y:(oSprite.height/2) +10};
        _oGUIExpandible = new CGUIExpandible(pPos.x, pPos.y, oSprite, s_oStage);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:pPos.x,y: pPos.y + oSprite.height + 10};
        _oButExit = new CSideGfxButton(false,_pStartPosExit.x-s_iOffsetX,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        var oSprite = s_oSpriteLibrary.getSprite("but_pause");
        _pStartPosPause = {x:CANVAS_WIDTH,y:_pStartPosExit.y+oSprite.height+10};
        _oButPause = new CSideGfxButton(false,_pStartPosPause.x-s_iOffsetX,_pStartPosPause.y,oSprite,s_oStage);
        _oButPause.addEventListener(ON_MOUSE_UP, this._onPause, this);
        
        var iDelay = 100;
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x:CANVAS_WIDTH,y:_pStartPosPause.y+oSprite.height+10};
            _oAudioToggle = new CSideToggle(false,iDelay,_pStartPosAudio.x-s_iOffsetX,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x: CANVAS_WIDTH,y:_pStartPosAudio.y + oSprite.height+10};
            
            iDelay+=100;
        }else{
            _pStartPosFullscreen = {x:CANVAS_WIDTH,y:_pStartPosPause.y+oSprite.height+10};
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
            

            _oButFullscreen = new CSideToggle(false,iDelay,_pStartPosFullscreen.x-s_iOffsetX,_pStartPosFullscreen.y+s_iOffsetY,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
            
            iDelay+=100;
        }
        
        
        _oGUIExpandible.addButton(_oButExit);
        _oGUIExpandible.addButton(_oButPause);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oGUIExpandible.addButton(_oAudioToggle);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oGUIExpandible.addButton(_oButFullscreen);
        }
        
        
        var oSpriteScore = s_oSpriteLibrary.getSprite("score_panel");
        _pStartPosScore = {x:0,y:10};
        
        _oScoreContainer = new createjs.Container();
        _oScoreContainer.x = _pStartPosScore.x;
        _oScoreContainer.y = _pStartPosScore.y;
        s_oStage.addChild(_oScoreContainer);
        
        var oScoreBg = createBitmap(oSpriteScore);
        _oScoreContainer.addChild(oScoreBg);
        
        _oScoreText = new CTLText(_oScoreContainer, 
                    10, 0, oSpriteScore.width-10, oSpriteScore.height, 
                    40, "left", "#ffffff", FONT_GAME, 1.1,
                    0, 0,
                    TEXT_SCORE,
                    true, true, true,
                    false );
                    

        
        _oAmountScoreText = new CTLText(_oScoreContainer, 
                    _oScoreText.getX() +_oScoreText.getBounds().width + 20, _oScoreText.getY(), 140, oSpriteScore.height, 
                    40, "left", "#ffffff", FONT_GAME, 1.1,
                    0, 0,
                    iScore,
                    true, true, true,
                    false );


        
        
        _pStartPosLevel = {x:0,y:CANVAS_HEIGHT - oSpriteScore.height-10};
        _oLevelContainer = new createjs.Container();
        _oLevelContainer.x = _pStartPosLevel.x;
        _oLevelContainer.y = _pStartPosLevel.y;
        s_oStage.addChild(_oLevelContainer);
        
        var oLevelBg = createBitmap(oSpriteScore);
        _oLevelContainer.addChild(oLevelBg);
        
        _oLevelText = new CTLText(_oLevelContainer, 
                    10, 0, oSpriteScore.width-10, oSpriteScore.height, 
                    40, "left", "#ffffff", FONT_GAME, 1.1,
                    0, 0,
                    TEXT_LEVEL + " " + s_iLevelSelected,
                    true, true, true,
                    false );


        
        _oAreYouSurePanel = new CAreYouSurePanel();
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this._onExitYes,this);
        
        _oRollingScore = new CRollingScore();
		
        this.refreshButtonPos();
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        _oGUIExpandible.unload();
        _oAreYouSurePanel.unload();
        
        if(DISABLE_SOUND_MOBILE === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
       
        if(!s_bMobile) {
            //KEY LISTENER
            document.onkeydown   = null;
            document.onkeyup   = null;
        }else{
            _oButLeft.unload();
            _oButRight.unload();
        }
        
        
        s_oStage.removeAllChildren();
	s_oInterface = null;
    };
    
    this.reset = function(iScore,iLevel){
        _oAmountScoreText.refreshText(iScore);
        _oLevelText.refreshText(TEXT_LEVEL + " " + iLevel);
    };
	
    this.refreshButtonPos = function(){
        _oScoreContainer.x = _pStartPosScore.x + s_iOffsetX;
        _oScoreContainer.y = _pStartPosScore.y + s_iOffsetY;
        
        _oLevelContainer.x = _pStartPosLevel.x + s_iOffsetX;
        _oLevelContainer.y = _pStartPosLevel.y - s_iOffsetY;

        _oGUIExpandible.refreshPos();
        
        
        if(_oGUIExpandible.isExpanded()){
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
            }
            if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
            }

            _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
            _oButPause.setPosition(_pStartPosPause.x - s_iOffsetX,_pStartPosPause.y + s_iOffsetY);

        }else{
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.setY(s_iOffsetY + _pStartPosAudio.y);
            }
            if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.setY(_pStartPosFullscreen.y + s_iOffsetY);
            }

            _oButExit.setY(_pStartPosExit.y + s_iOffsetY);
            _oButPause.setY(_pStartPosPause.y + s_iOffsetY);

            _oButExit.resetX();
            _oButPause.resetX();
        }
        
        if(s_bMobile){
            _oButLeft.setPosition(_pStartPosLeft.x + s_iOffsetX,_pStartPosLeft.y - s_iOffsetY);
            _oButRight.setPosition(_pStartPosRight.x - s_iOffsetX,_pStartPosRight.y - s_iOffsetY);
        }
    };
    
    this.refreshScore = function(iScore){
        _oRollingScore.rolling(_oAmountScoreText, null, iScore);
    };
    
    
    this._onLeftDown = function(){
        s_oGame.moveLeft(true);
    };
    
    this._onRightDown = function(){
        s_oGame.moveRight(true);
    };

    this._onLeftUp = function(){
        s_oGame.moveLeft(false);
    };
    
    this._onRightUp = function(){
        s_oGame.moveRight(false);
    };

    
    this._onExit = function(){
        _oAreYouSurePanel.show(TEXT_ARE_SURE);
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this._onPause = function(){
        if(s_oMain.isUpdating()){
            s_oMain.stopUpdateNoBlock();
        }else{
            s_oMain.startUpdateNoBlock();
        }
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    this._onFullscreenRelease = function(){
        if(s_oMain.isUpdating() === false){
            s_oMain.startUpdateNoBlock();
        }
        
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
   
    this._onExitYes = function(){
        s_oGame.onExit();  
    };
    
    s_oInterface = this;
    
    this._init(iScore);
    
    return this;
}

var s_oInterface = null;