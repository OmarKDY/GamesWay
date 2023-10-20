function CMenu() {
    var _oBg;
    var _oTitle;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oCharContainer;
    var _oButInfo;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosInfo;

    this._init = function () {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        var oSpritePlay = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((CANVAS_WIDTH / 2), CANVAS_HEIGHT / 2 + 150, oSpritePlay);
        _oButPlay.setScale(0.8);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

        var oSpriteTitle = s_oSpriteLibrary.getSprite('title');
        _oTitle = createBitmap(oSpriteTitle);
        _oTitle.x = CANVAS_WIDTH / 2;
        _oTitle.y = CANVAS_HEIGHT / 2 - 120;
        _oTitle.regX = oSpriteTitle.width / 2;
        _oTitle.regY = oSpriteTitle.height / 2;
        s_oStage.addChild(_oTitle);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('icon_audio');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height / 2) - 10, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosInfo = {x: (oSprite.width/2) + 10, y: (oSprite.height/2) + 10}; 
        _oButInfo = new CGfxButton(_pStartPosInfo.x,_pStartPosInfo.y,oSprite,s_oStage);
        _oButInfo.addEventListener(ON_MOUSE_UP, this._onCredits, this);


        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            var oSpriteFullscreen = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosInfo.x + oSpriteFullscreen.width/2 + 10,y:(oSpriteFullscreen.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSpriteFullscreen,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        this.createSleepChar(CANVAS_WIDTH / 2 + 325, CANVAS_HEIGHT / 2 + 100);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.unload = function () {
        _oButPlay.unload();
        _oButPlay = null;
        _oFade.visible = false;

        s_oStage.removeChild(_oBg, _oTitle, _oCharContainer);
        _oBg = null;
        _oTitle = null;
        _oCharContainer = null;

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
        
        _oButInfo.setPosition(_pStartPosInfo.x + iNewX,iNewY + _pStartPosInfo.y);
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this.createSleepChar = function (iXPos, iYPos) {
        var oCharacter;
        var oSnot;

        var oSpriteSleep = s_oSpriteLibrary.getSprite("sleep");
        var oData = {
            images: [oSpriteSleep],
            // width, height & registration point of each sprite
            frames: {width: oSpriteSleep.width / 2, height: oSpriteSleep.height, regX: (oSpriteSleep.width / 2) / 2, regY: oSpriteSleep.height / 2},
            animations: {sleep: [0, 1, "sleep", 0.05]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        oCharacter = createSprite(oSpriteSheet, "sleep", (oSpriteSleep.width / 2) / 2, oSpriteSleep.height / 2, oSpriteSleep.width / 2, oSpriteSleep.height);

        oCharacter.x = 0;
        oCharacter.y = 0;

        var oSpriteSnot = s_oSpriteLibrary.getSprite("snot");
        oData = {
            images: [oSpriteSnot],
            // width, height & registration point of each sprite
            frames: {width: oSpriteSnot.width / 8, height: oSpriteSnot.height / 2, regX: (oSpriteSnot.width / 2) / 8, regY: (oSpriteSnot.height / 2) / 2},
            animations: {normal: [0, 14, "normal", 0.2]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        oSnot = createSprite(oSpriteSheet, "normal", (oSpriteSnot.width / 2) / 8, (oSpriteSnot.height / 2) / 2, oSpriteSnot.width / 8, oSpriteSnot.height / 2);

        oSnot.x = 36;
        oSnot.y = 0;

        _oCharContainer = new createjs.Container();
        _oCharContainer.addChild(oCharacter, oSnot);

        _oCharContainer.x = iXPos;
        _oCharContainer.y = iYPos;

        s_oStage.addChild(_oCharContainer);

    };

    this._onButPlayRelease = function () {
        this.unload();
        
        
        s_oSoundTrack = playSound("soundtrack",1,true);
        
        $(s_oMain).trigger("start_session");
        s_oMain.gotoGame();
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
    
    this._onCredits = function(){
        new CCreditsPanel();
    };
    
    s_oMenu = this;

    this._init();
}

var s_oMenu = null;