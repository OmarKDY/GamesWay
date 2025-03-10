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
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    
    this._init = function () {
        //localStorage.clear();            // TO DELETE EVERYTHING SAVED IN LOCALSTORAGE

        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
        s_oStage.addChild(_oBg);

        var oSpritePlay = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 300, oSpritePlay);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x:20 + oSprite.width/2,y:(oSprite.height / 2) + 10};
        _oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSprite);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onCredits, this);

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
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            s_oStage.removeChild(_oFade);
        });
        
        if(!s_bStorageAvailable){
            new CMsgBox(TEXT_ERR_LS,s_oStage);
        }else{
            var aBestScore = getItemJson("classicdomino_best_score");
            if (aBestScore !== null) {
                s_aBestScore = aBestScore;
            };
            var aPlayersScores = getItemJson("classicdomino_scores2");
            if (aPlayersScores !== null) {
                s_aPlayersScore2 = new Array();
                s_aPlayersScore2 = aPlayersScores;
            };
            var aPlayersScores = getItemJson("classicdomino_scores3");
            if (aPlayersScores !== null) {
                s_aPlayersScore3 = new Array();
                s_aPlayersScore3 = aPlayersScores;
            };
            var aPlayersScores = getItemJson("classicdomino_scores4");
            if (aPlayersScores !== null) {
                s_aPlayersScore4 = new Array();
                s_aPlayersScore4 = aPlayersScores;
            };
        };

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

        FIRST_GAME = true;
    };

    this.unload = function () {
        _oButPlay.unload();
        _oButPlay = null;
        s_oStage.removeChild(_oBg);
        _oBg = null;

        _oButCredits.unload();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        s_oMenu = null;
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }

        _oButCredits.setPosition(_pStartPosCredits.x + iNewX,_pStartPosCredits.y + iNewY);
    };
    
    this.exitFromCredits = function(){
        _oCreditsPanel = null;
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
        s_oMain.gotoSelectPlayers();
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