function CPlayersSelection() {
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    var _pStartPosSelect;
    
    var _oContainer;
    var _oFade;
    var _oAudioToggle;
    var _oButExit;
    var _oButPlayers1;
    var _oButPlayers2;
    var _oButPlayers3;
    var _oButPlayers4;
    var _oButFullscreen;
    var _oTextSelection;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function () {
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0.7;
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_players_select'));
	_oContainer.addChild(oBg);
        _oContainer.addChild(shape);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oMessageBox = createBitmap(oSprite);
        oMessageBox.regX = oSprite.width * 0.5;
        oMessageBox.regY = oSprite.height * 0.5;
        oMessageBox.x = CANVAS_WIDTH_HALF;
        oMessageBox.y = CANVAS_HEIGHT_HALF;
	_oContainer.addChild(oMessageBox);
        
        _pStartPosSelect = {x: CANVAS_WIDTH_HALF-210, y: 120};
        _oTextSelection = new CTLText(s_oStage, 
                    _pStartPosSelect.x, _pStartPosSelect.y, 420, 40, 
                    40, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SELECT_PLAYERS,
                    true, true, false,
                    false );
                    


        var iOffsetX = 90;
        var iPositionY1 = CANVAS_HEIGHT_HALF - 50 ;
        var iPositionY2 = CANVAS_HEIGHT_HALF + 130;

        var oSprite = s_oSpriteLibrary.getSprite('but_1players');
        _oButPlayers1 = new CGfxButton(CANVAS_WIDTH_HALF - iOffsetX, iPositionY1, oSprite, s_oStage);
        _oButPlayers1.addEventListenerWithParams(ON_MOUSE_UP, this._onButModeRelease, this, 1);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_2players');
        _oButPlayers2 = new CGfxButton(CANVAS_WIDTH_HALF + iOffsetX, iPositionY1, oSprite, s_oStage);
        _oButPlayers2.addEventListenerWithParams(ON_MOUSE_UP, this._onButModeRelease, this, 2);

        var oSprite = s_oSpriteLibrary.getSprite('but_3players');
        _oButPlayers3 = new CGfxButton(CANVAS_WIDTH_HALF - iOffsetX, iPositionY2, oSprite, s_oStage);
        _oButPlayers3.addEventListenerWithParams(ON_MOUSE_UP, this._onButModeRelease, this, 3);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_4players');
        _oButPlayers4 = new CGfxButton(CANVAS_WIDTH_HALF + iOffsetX, iPositionY2, oSprite, s_oStage);
        _oButPlayers4.addEventListenerWithParams(ON_MOUSE_UP, this._onButModeRelease, this, 4);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2)-10,y:(oSprite.height/2)+10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:_oButExit.getX() - oSprite.width-10,y:(oSprite.height/2)+10 }
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,s_oSpriteLibrary.getSprite('audio_icon'),s_bAudioActive,s_oStage);
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
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:(oSprite.height/2)+10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function () {
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX, _pStartPosExit.y);
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX, _pStartPosAudio.y);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
    };

    this.unload = function () {
        _oButExit.unload();
        _oButExit = null;
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }

        s_oStage.removeAllChildren();
        createjs.Tween.removeAllTweens();
        s_oPlayersSelection = null;
    };

    this._onExit = function () {
        this.unload();
        s_oMain.gotoMenu();
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onButModeRelease = function(iPlayers) {
        this.unload();
        s_iPlayersNumber = iPlayers;
        s_oMain.gotoGame();
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

    s_oPlayersSelection = this;
    
    this._init();
}

var s_oPlayersSelection = null;