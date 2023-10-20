function CInterface(szLevel){
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _oAudioToggle;
    var _oButFullscreen;
    var _oButExit;
    var _oButRestart;
    var _oGUIExpandible;
    var _oAreYouSurePanel;

    var _oLifeController;
    var _oSwitch;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosRestart;
    var _pStartPosLife;
    var _pStartPosSwitch;

    this._init = function(szLevel){    
        _pStartPosLife = {x:CANVAS_WIDTH/2,y:20};
        _oLifeController = new CLifeController(s_oStage, _pStartPosLife.x, _pStartPosLife.y, TEXT_CURRENT_LEVEL+szLevel);

        _pStartPosSwitch = {x:CANVAS_WIDTH/2,y:CANVAS_HEIGHT-20};
        _oSwitch = new CSwitch(s_oStage, _pStartPosSwitch.x, _pStartPosSwitch.y);
                
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	    _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) -10,y:(oSprite.height/2) +10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:_pStartPosExit.x - oSprite.width,y:_pStartPosExit.y}
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width/2,y:_pStartPosAudio.y};
        }else{
            _pStartPosFullscreen = {x:_pStartPosExit.x - oSprite.width,y:_pStartPosExit.y}
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
            

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        
        _pStartPosRestart = {x:CANVAS_WIDTH - (oSprite.width/2) -10,y:_pStartPosExit.y};
        _oButRestart = new CGfxButton(_pStartPosRestart.x,_pStartPosRestart.y,s_oSpriteLibrary.getSprite("but_restart"),s_oStage);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_settings');
        _oGUIExpandible = new CGUIExpandible(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oGUIExpandible.addButton(_oButExit);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oGUIExpandible.addButton(_oAudioToggle);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oGUIExpandible.addButton(_oButFullscreen);
        }

        _oGUIExpandible.addButton(_oButRestart);
        
        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
    };
    
    this.unload = function(){
        _oGUIExpandible.unload();
        _oAreYouSurePanel.unload();
        _oSwitch.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        _oButRestart.unload();

        s_oInterface = null;
    };
        
    this.refreshButtonPos = function(){
        _oGUIExpandible.refreshPos();
        _oLifeController.setX(_pStartPosLife.x);
        _oLifeController.setY(_pStartPosLife.y + s_iOffsetY);

        _oSwitch.setX(_pStartPosSwitch.x);
        _oSwitch.setY(_pStartPosSwitch.y - s_iOffsetY);

        _oLifeController.refreshScale();
        _oSwitch.refreshScale();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        s_oGame.stopUpdate();
        s_oGame.hideGrid();
        _oAreYouSurePanel.show(TEXT_ARE_YOU_SURE);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,s_oGame.onExit,s_oGame);
        _oAreYouSurePanel.addEventListener(ON_BUT_NO_DOWN,s_oGame.onExitNullify,s_oGame);
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
    
    this._onRestart = function(){
        s_oGame.stopUpdate();
        s_oGame.hideGrid();

        _oAreYouSurePanel.show(TEXT_ARE_YOU_SURE_RESTART);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,s_oGame.restart,s_oGame);
        _oAreYouSurePanel.addEventListener(ON_BUT_NO_DOWN,s_oGame.restartNullify,s_oGame);
    };

    this.reset = function(szLevel){
        _oLifeController.reset();
        _oLifeController.refreshText(TEXT_CURRENT_LEVEL+szLevel);
        _oSwitch.reset();
    }
    
    this._onConfirm = function(){
        
    };

    this.decreaseLives = function(iLives){
        _oLifeController.decrease(iLives);
    };

    s_oInterface = this;
    
    this._init(szLevel);
    
    return this;
}

var s_oInterface = null;