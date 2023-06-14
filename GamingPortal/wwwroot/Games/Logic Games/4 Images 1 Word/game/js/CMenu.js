function CMenu() {
    var _oBg;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oButCredits;
    var _oCreditsPanel = null;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosCredits;

    this._init = function () {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        var oSpritePlay = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton(s_oStage,(CANVAS_WIDTH / 2), CANVAS_HEIGHT / 2 + 560, oSpritePlay);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

	var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height / 2) - PADDING, y: (oSprite.height / 2) + PADDING};
            _oAudioToggle = new CToggle(s_oStage, _pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosCredits = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
            _pStartPosCredits = {x: CANVAS_WIDTH - (oSprite.height / 2) - PADDING, y: (oSprite.height / 2) + PADDING};
        }

        if(SHOW_CREDITS){
                _oButCredits = new CGfxButton(s_oStage,_pStartPosCredits.x, _pStartPosCredits.y, s_oSpriteLibrary.getSprite('but_credits'), true);
                _oButCredits.addEventListener(ON_MOUSE_UP, this._onCredits, this);
        }

        if (s_bMobile === false) {
            _oAudioToggle.setCursorType("pointer");
            _oButPlay.setCursorType("pointer");
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
            _pStartPosFullscreen = {x:oSprite.width/4 + 10,y:_pStartPosCredits.y};

            _oButFullscreen = new CToggle(s_oStage, _pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            s_oStage.removeChild(_oFade);
            _oFade = null;
        });
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

    };

    this.unload = function () {
        _oButPlay.unload();
        _oButPlay = null;
		
        if(SHOW_CREDITS){
                _oButCredits.unload();
        }
        s_oStage.removeChild(_oBg);
        _oBg = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        s_oMenu = null;
    };
	
	this.exitFromCredits = function(){
		_oCreditsPanel = null;
	};

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }

        if(SHOW_CREDITS){
                _oButCredits.setPosition(_pStartPosCredits.x - iNewX, iNewY + _pStartPosCredits.y);
        }

        if(_oCreditsPanel !== null){
                _oCreditsPanel.refreshButtonPos(iNewX, iNewY);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
	
	this._onCredits = function(){
		_oCreditsPanel = new CCreditsPanel();
	};

    this._onButPlayRelease = function () {
        this.unload();

        
        if (GAME_LANGUAGE < 0) {
            s_oMain.gotoLanguage();
        }else{
            s_oMain.gotoGame(GAME_LANGUAGE);
        }
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
    
    s_oMenu = this;

    this._init();
}

var s_oMenu = null;