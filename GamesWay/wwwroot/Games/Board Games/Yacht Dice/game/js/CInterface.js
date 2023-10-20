function CInterface(oParentContainer){
    var _oParentContainer;
    var _oContainer;    
    var _oPauseContainer;
    var _oHelpPanel = null;
    var _oPause;
    var _oAudioToggle;
    var _oButSettings;
    var _oButExit;
    var _oButFullscreen;
    var _oButHelp; 
    var _oButRoll;
    
    var _bMobileInitialized;
    var _bOnSettings;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;    
    var _pStartPosButHelp;
    var _oStartPosButRoll;
    var _pStartButSettings;
    
    this._init = function(){  
        _bMobileInitialized = false;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("but_roll");
        _oStartPosButRoll = {x: CANVAS_WIDTH_HALF + 280, y: CANVAS_HEIGHT - 70};
        _oButRoll = new CGfxButton(_oStartPosButRoll.x, _oStartPosButRoll.y, oSprite, _oContainer);
        _oButRoll.addEventListener(ON_MOUSE_UP, this._onRoll, this);
        
        _oPauseContainer = new createjs.Container();
        _oContainer.addChild(_oPauseContainer);

        var oSprite = s_oSpriteLibrary.getSprite("but_settings");
        _pStartButSettings = {x: CANVAS_WIDTH-(oSprite.width * 0.5)-10,y: (oSprite.height * 0.5)+10};

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
        _oButSettings.addEventListener(ON_MOUSE_UP, this.onSettings);
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
        
        _oParentContainer.removeChild(_oContainer);
        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.unload();
        }        

        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButSettings.setPosition(_pStartButSettings.x-iNewX,iNewY + _pStartButSettings.y);
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        _oButHelp.setPosition(_pStartPosButHelp.x - iNewX, iNewY + _pStartPosButHelp.y);
        //_oButRoll.setPosition(_oStartPosButRoll.x - iNewX, _oStartPosButRoll.y - iNewY);
        
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
        $(s_oMain).trigger("restart_level");
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
        _oHelpPanel = null;
    };
    
    this._onExit = function(){
        new CAreYouSurePanel(s_oGame.onExit);
    };
    
    this._onRoll = function(){
        _oButRoll.setVisible(false);
        s_oGame.onRollDices();
    };
    
    this.setRollButtonActive = function(bValue){
        _oButRoll.setVisible(bValue);
    };
    
    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onFullscreenRelease = function(){
	if (s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
	} else {
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
    
    _oParentContainer = oParentContainer;
    
    this._init();
    
    return this;
}

var s_oInterface = null;