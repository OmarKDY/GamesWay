function CRestartMenu(iPlayers, iGoal){
    var _oBg;
    var _oMessageBg;
    var _oButResetGame;
    var _oButContinue;
    var _oMsgText;
    var _oScoreText;
    var _oThis;    
    var _oFade;
    var _oContainer;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
   
    var _pStartPosAudio;
    var _pStartPosFullscreen;

    var _iMode;
    var _iGoal;
    var _aScore;
    
    this._init = function(){
        _iMode = iPlayers;
        _iGoal = iGoal;
        
        switch (_iMode) {
            case 2:
                _aScore = s_aPlayersScore2;
                break;
            case 3:
                _aScore = s_aPlayersScore3;
                break;
            case 4:
                _aScore = s_aPlayersScore4;
                break;
        };

        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_end_panel"));
        _oContainer.addChild(_oBg);
        
        _oMessageBg = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
        _oMessageBg.regX = 616/2;
        _oMessageBg.regY = 617/2;
        _oMessageBg.x = CANVAS_WIDTH_HALF;
        _oMessageBg.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oMessageBg);

        _oMsgText = new CTLText(_oContainer, 
                    CANVAS_WIDTH_HALF-260, CANVAS_HEIGHT_HALF - 200, 520, 150, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_RESTART,
                    true, true, true,
                    false );
                    
       
        
        _oScoreText = new CTLText(_oContainer, 
                    CANVAS_WIDTH_HALF-260, CANVAS_HEIGHT_HALF +50, 520, 30, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE + ": " + _aScore[0],
                    true, true, false,
                    false );
                    
     

        var iButtonY = CANVAS_HEIGHT_HALF + 200;
        
        _oButResetGame = new CGfxButton(CANVAS_WIDTH/2 - 170, iButtonY, s_oSpriteLibrary.getSprite('but_resetgame'), _oContainer);
        _oButResetGame.addEventListener(ON_MOUSE_UP, this._onRestart, this);
                
        _oButContinue = new CGfxButton(CANVAS_WIDTH/2 + 170, iButtonY, s_oSpriteLibrary.getSprite('but_continue'), _oContainer);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onContinue, this);

        _oContainer.alpha = 0;

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

        var _bShowInterlevel = false;
        new createjs.Tween.get(_oContainer).to({alpha:1},500).call(function(){$(s_oMain).trigger("show_interlevel_ad");});
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oContainer);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        s_oRestartPanel = null;
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
    
    this._onRestart = function(){
        _oThis.unload();
        
        // RESTART THE GAME
        switch (_iMode) {
            case 2:
                s_aPlayersScore2 = new Array();
                s_aPlayersScore2 = [0,0];
                setItemJson("classicdomino_scores2", s_aPlayersScore2);
                s_oMain.gotoGame(_iMode, _iGoal);
                break;
            case 3:
                s_aPlayersScore3 = new Array();
                s_aPlayersScore3 = [0,0,0];
                setItemJson("classicdomino_scores3", s_aPlayersScore3);
                s_oMain.gotoGame(_iMode, _iGoal);
                break;
            case 4:
                s_aPlayersScore4 = new Array();
                s_aPlayersScore4 = [0,0,0,0];
                setItemJson("classicdomino_scores4", s_aPlayersScore4);
                s_oMain.gotoGame(_iMode, _iGoal);
                break;
        };
    };
    
    this._onContinue = function(){
        _oThis.unload();
        s_oMain.gotoGame(_iMode, _iGoal);
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

    _oThis = this;
    s_oRestartPanel = this;
    this._init();    
}

var s_oRestartPanel = null;