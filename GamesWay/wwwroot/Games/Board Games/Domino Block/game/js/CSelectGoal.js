function CSelectGoal(iMode) {
    var _iMode = iMode;

    var _oContainer;
    var _oBg;
    var _oMessageBg;
    var _oButGoal1;
    var _oButGoal2;
    var _oButGoal3;
    var _oFade;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oTextTitle;
    var _oMessageBox;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosAudio;
    var _pStartPosFullscreen;

    this._init = function () {
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_end_panel'));
        _oContainer.addChild(_oBg);
        
        _oMessageBg = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
        _oMessageBg.regX = 616/2;
        _oMessageBg.regY = 617/2;
        _oMessageBg.x = CANVAS_WIDTH_HALF;
        _oMessageBg.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oMessageBg);

        _oTextTitle = new CTLText(_oContainer, 
                    CANVAS_WIDTH_HALF-260, CANVAS_HEIGHT_HALF - 220, 520, 40, 
                    40, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_GOAL,
                    true, true, false,
                    false );
                    
     

        var oSpriteGoal1 = s_oSpriteLibrary.getSprite('but_menu_bg');
        _oButGoal1 = new CTextButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF - 60, oSpriteGoal1, WIN_SCORE[0], PRIMARY_FONT, THIRD_FONT_COLOUR, 40, s_oStage);
        _oButGoal1.addEventListenerWithParams(ON_MOUSE_UP, this._onButPlayRelease, this, 0);
        
        var oSpriteGoal2 = s_oSpriteLibrary.getSprite('but_menu_bg');
        _oButGoal2 = new CTextButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 60, oSpriteGoal2, WIN_SCORE[1], PRIMARY_FONT, THIRD_FONT_COLOUR, 40, s_oStage);
        _oButGoal2.addEventListenerWithParams(ON_MOUSE_UP, this._onButPlayRelease, this, 1);

        var oSpriteGoal3 = s_oSpriteLibrary.getSprite('but_menu_bg');
        _oButGoal3 = new CTextButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 180, oSpriteGoal3, WIN_SCORE[2], PRIMARY_FONT, THIRD_FONT_COLOUR, 40, s_oStage);
        _oButGoal3.addEventListenerWithParams(ON_MOUSE_UP, this._onButPlayRelease, this, 2);

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
        _oButGoal1.unload();
        _oButGoal2.unload();
        _oButGoal3.unload();
        _oButGoal1 = null;
        _oButGoal2 = null;
        _oButGoal3 = null;

        _oContainer.removeAllChildren();
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        s_oSelectGoal = null;
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
    
    this.checkIfArrayIsZero = function(aArray) {
        var iFlag = 0;

        for(var i = 0; i < aArray.length; ++i) {
            if(aArray[i] !== 0) {
                iFlag = 1;
                break;
            };
        };

        if (iFlag) {
            return false;
        } else {
            return true;
        };
    };
    
    this._onButPlayRelease = function (_iGoal) {

        playSound("click", 1, 0);

        // IF THERE'S A PREVIOUS MATCH SAVED SHOW A RESTART/CONTINUE MENU
        switch (_iMode) {
            case 2:
                if (s_oSelectGoal.checkIfArrayIsZero(s_aPlayersScore2) === false) {
                    this.unload();
                    _oMessageBox = new CRestartMenu(_iMode, _iGoal);
                    break;
                } else {
                    this.unload();
                    s_oMain.gotoGame(_iMode, _iGoal);
                    break;
                };
            case 3:
                if (s_oSelectGoal.checkIfArrayIsZero(s_aPlayersScore3) === false) {
                    this.unload();
                    _oMessageBox = new CRestartMenu(_iMode, _iGoal);
                    break;
                } else {
                    this.unload();
                    s_oMain.gotoGame(_iMode, _iGoal);
                    break;
                };
            case 4:
                if (s_oSelectGoal.checkIfArrayIsZero(s_aPlayersScore4) === false) {
                    this.unload();
                    _oMessageBox = new CRestartMenu(_iMode, _iGoal);
                    break;
                } else {
                    this.unload();
                    s_oMain.gotoGame(_iMode, _iGoal);
                    break;
                };
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
    
    s_oSelectGoal = this;

    this._init();
}

var s_oSelectGoal = null;