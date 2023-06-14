function CHelpPanel(iGoal){
    var _oTextTitle;
    var _oText1;
    var _oText2;
    var _oText3;
    var _oHelpBg;
    var _oGroup;
    var _oFade;
    var _iGoal = WIN_SCORE[iGoal];
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oListener;
   
    var _pStartPosAudio;
    var _pStartPosFullscreen;

    this._init = function(){
        _oGroup = new createjs.Container();
        s_oStage.addChild(_oGroup);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;}); 
        
        var _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_end_panel'));
        _oGroup.addChild(_oBg);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oHelpBg = createBitmap(oSprite);
        _oHelpBg.regX = oSprite.width/2;
        _oHelpBg.regY = oSprite.height/2;
        _oHelpBg.x = CANVAS_WIDTH_HALF;
        _oHelpBg.y = CANVAS_HEIGHT_HALF;
        _oGroup.addChild(_oHelpBg);
        
        var pTextPos = {x: CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT_HALF};
        
        _oTextTitle = new CTLText(_oGroup, 
                    pTextPos.x-260, pTextPos.y - 240, 520, 40, 
                    40, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_TITLE,
                    true, true, false,
                    false );
                    
        

        _oText1 = new CTLText(_oGroup, 
                    pTextPos.x-260, pTextPos.y - 120, 520, 90, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP1,
                    true, true, true,
                    false );
                    
        

        _oText2 = new CTLText(_oGroup, 
                    pTextPos.x-260, pTextPos.y, 520, 90, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP2,
                    true, true, true,
                    false );
                    
        

        _oText3 = new CTLText(_oGroup, 
                    pTextPos.x-260, pTextPos.y +130, 520, 90, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP3 + _iGoal + TEXT_HELP4,
                    true, true, true,
                    false );
                    
        

        var oParent = this;
        _oListener = _oGroup.on("pressup",function(){oParent._onExitHelp()});
        s_oGame._bDisableEvents = true;
        
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
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
        
        if (!s_bMobile) {
            _oGroup.cursor = "pointer";
        };
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }

        s_oGame._bDisableEvents = false;
        var oParent = this;
        _oGroup.off("pressup",_oListener);
        
        s_oHelpPanel = null;
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

    this._onExitHelp = function(){
        this.unload();
        s_oGame._onExitHelp();
    };


    s_oHelpPanel = this;
    
    this._init();
}

var s_oHelpPanel = null;