function CMenu() {
    var _pStartPosAudio;
    var _pStartPosPlay;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    var _oBg;
    var _oButPlay;
    var _oButPlay;
    var _oButInfo;
    var _oGameLogo;
    var _oFade;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oMenuContainer;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    this._init = function () {
        //localStorage.clear();            // TO DELETE EVERYTHING SAVED IN LOCALSTORAGE
        _oMenuContainer = new createjs.Container();
        s_oStage.addChild(_oMenuContainer);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oBg.cache(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oMenuContainer.addChild(_oBg);

        var oGameLogo = s_oSpriteLibrary.getSprite('logo_menu');
        _oGameLogo = createBitmap(oGameLogo);
        _oGameLogo.regX = oGameLogo.width/2;
        _oGameLogo.regY = oGameLogo.height/2;
        _oGameLogo.x = CANVAS_WIDTH_HALF;
        _oGameLogo.y = -150;
        createjs.Tween.get(_oGameLogo, {loop: false})
            .to({y: CANVAS_HEIGHT_HALF - 100}, 1000, createjs.Ease.cubicOut)
            .call(this.addLogoPulse);
        _oMenuContainer.addChild(_oGameLogo);

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _pStartPosPlay = {x: CANVAS_WIDTH - 150, y: CANVAS_HEIGHT - 120};
        _oButPlay = new CGfxButton(_pStartPosPlay.x, _pStartPosPlay.y, oSprite, _oMenuContainer);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        _oButPlay.pulseAnimation();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height / 2) - 20, y: (oSprite.height / 2) + 20};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, _oMenuContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        var oSpriteInfo = s_oSpriteLibrary.getSprite("but_info");
        _pStartPosCredits = {x: (oSprite.height / 2) + 20, y: (oSprite.height / 2) + 20};
        _oButInfo = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSpriteInfo, _oMenuContainer);
        _oButInfo.addEventListener(ON_MOUSE_UP, this._onButInfoRelease, this);

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

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oMenuContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oMenuContainer.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });
        
        s_bFirstTime = true;
        s_iLastLevel = 1;
        s_iTotalScore = 0;
        
        if(!s_bStorageAvailable){
            new CMsgBox(TEXT_ERR_LS, _oMenuContainer);
        }else{
            var aScores = getItemJson("rolling_cheese_scores");
            if(aScores !== null && aScores !== undefined){
                s_aScores = aScores;
            } else {
                s_aScores = new Array();
                for(var i=0;i<LEVELS_NUMBER;i++){
                    s_aScores[i] = 0;
                }
            }

            if (s_aStars === undefined || s_aStars === null) {
                s_aStars = new Array;                
                for (var i = 0; i < LEVELS_NUMBER; i++) {
                    s_aStars.push(0);
                };                
            };
            
            var aLevelStars = getItemJson("rolling_cheese_stars");
            if (aLevelStars !== null && s_aStars !== undefined) {
                s_aStars = aLevelStars;
            };
            
            var iLastLevel = getItem("rolling_cheese_lastlevel");
            if (iLastLevel !== null){
                s_iLastLevel = Number(iLastLevel);
                s_bFirstTime = false;
            };
            
            var iTotalScore = getItem("rolling_cheese_totalscore");
            if (iTotalScore !== null){
                s_iTotalScore = Number(iTotalScore);
            };
        }
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        _oButPlay.setPosition(_pStartPosPlay.x - iNewX, _pStartPosPlay.y - iNewY);
        _oButInfo.setPosition(_pStartPosCredits.x + iNewX, _pStartPosCredits.y);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y);
        }
    };

    this.addLogoPulse = function(){
        createjs.Tween.get(_oGameLogo, {loop: false})
            .to({scaleX: 1.1, scaleY: 1.1}, 500, createjs.Ease.cubicOut)
            .to({scaleX: 1, scaleY: 1}, 500, createjs.Ease.cubicIn)
            .to({scaleX: 1.1, scaleY: 1.1}, 500, createjs.Ease.cubicOut)
            .to({scaleX: 1, scaleY: 1}, 500, createjs.Ease.cubicIn)
            .wait(1000)
            .call(function(){ s_oMenu.addLogoPulse(); });
    };

    this.unload = function () {
        _oButPlay.unload();
        _oButPlay = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
            _oButFullscreen = null;
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
        s_oMenu = null;
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onButInfoRelease = function () {
        var oCreditsPanel = new CCreditsPanel();
    };

    this._onButPlayRelease = function () {
        this.unload();
        s_oMain.gotoLevelChoose();
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


    s_oMenu = this;

    this._init();
}

var s_oMenu = null;