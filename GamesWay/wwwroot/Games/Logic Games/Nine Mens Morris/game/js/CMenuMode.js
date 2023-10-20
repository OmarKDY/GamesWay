function CMenuMode(){
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _oContainer;
    var _oButHuman;
    var _oButCpu;
    var _oAudioToggle;
    var _oButFullscreen;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_end_panel'));
        s_oStage.addChild(oBg);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2) - 10, y: (oSprite.height/2) + 10};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);    
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:oSprite.width/4 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        var oText = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-240, CANVAS_HEIGHT/2 - 320, 480, 80, 
                    40, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_CHOOSE_MODE,
                    true, true, true,
                    false );
                    

        
        _oButHuman = new CGfxButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 - 120,s_oSpriteLibrary.getSprite("vs_man_panel"),s_oStage);
        _oButHuman.addEventListener(ON_MOUSE_UP,this._onHuman,this);
        
        _oButCpu = new CGfxButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2 + 120,s_oSpriteLibrary.getSprite("vs_pc_panel"),s_oStage);
        _oButCpu.addEventListener(ON_MOUSE_UP,this._onCpu,this);
        
        this.refreshButtonPos();
    };
    
    this.unload = function(){
        _oButCpu.unload();
        _oButHuman.unload();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        
        s_oStage.removeAllChildren();
        
        s_oModeMenu = null;
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }

    };
    
    this._onHuman = function(){
        s_oModeMenu.unload();
        
        s_iMode = MODE_HUMANS;
        s_oMain.gotoGame();
    };
    
    this._onCpu = function(){
        s_oModeMenu.unload();
        
        s_iMode = MODE_CPU;
        
        s_oMain.gotoGame();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
        if (_fRequestFullScreen && screenfull.enabled){
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

    s_oModeMenu = this;
    
    this._init();
}

var s_oModeMenu = null;