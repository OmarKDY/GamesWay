function CSelectPlayers() {
    var _oBg;
    var _oContainer;
    var _oTextTitle;
    var _oBut2Players;
    var _oBut3Players;
    var _oBut4Players;
    var _oFade;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
   
    var _pStartPosAudio;
    var _pStartPosFullscreen;

    this._init = function () {
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_end_panel'));
        _oContainer.addChild(_oBg);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box2');
        var _oMessageBox = createBitmap(oSprite);  
        _oMessageBox.regX = oSprite.width/2;
        _oMessageBox.regY = oSprite.height/2;
        _oMessageBox.x = CANVAS_WIDTH_HALF;
        _oMessageBox.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oMessageBox);

        _oTextTitle = new CTLText(_oContainer, 
                    CANVAS_WIDTH_HALF-260, CANVAS_HEIGHT_HALF - 150, 520, 40, 
                    40, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SELECT,
                    true, true, false,
                    false );
                    
 
        
        var iPositionY = CANVAS_HEIGHT_HALF + 30;
        
        var oSprite2Players = s_oSpriteLibrary.getSprite('but_2players');
        _oBut2Players = new CGfxButton(CANVAS_WIDTH_HALF - 180, iPositionY, oSprite2Players, _oContainer);
        _oBut2Players.addEventListenerWithParams(ON_MOUSE_UP, this._onButPlayRelease, this, 2);
        
        var oSprite3Players = s_oSpriteLibrary.getSprite('but_3players');
        _oBut3Players = new CGfxButton(CANVAS_WIDTH_HALF, iPositionY, oSprite3Players, _oContainer);
        _oBut3Players.addEventListenerWithParams(ON_MOUSE_UP, this._onButPlayRelease, this, 3);

        var oSprite4Players = s_oSpriteLibrary.getSprite('but_4players');
        _oBut4Players = new CGfxButton(CANVAS_WIDTH_HALF + 180, iPositionY, oSprite4Players, _oContainer);
        _oBut4Players.addEventListenerWithParams(ON_MOUSE_UP, this._onButPlayRelease, this, 4);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - oSprite.width/4 -20, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
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
            _pStartPosFullscreen = {x:20 + oSprite.width/4,y:(oSprite.height / 2) + 10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            s_oStage.removeChild(_oFade);
        });
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.unload = function () {
        _oContainer.removeAllChildren();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        s_oSelectPlayers = null;
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
    };
    
    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onButPlayRelease = function (iMode) {
        this.unload();

        
        playSound("click", 1, 0);
        

        s_oMain.gotoSelectGoal(iMode);
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
    
    s_oSelectPlayers = this;

    this._init();
}

var s_oSelectPlayers = null;