function CMenu() {
    var _oMenuContainer;
    var _oGameLogo;
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
    var _oTotalScoreTextBack;
    var _oTotalScoreText;
    var _oDiver;
    
    var _iRandomN;
    
    this._init = function () {
        //localStorage.clear();            // TO DELETE EVERYTHING SAVED IN LOCALSTORAGE
        
        _oMenuContainer = new createjs.Container();
        s_oStage.addChild(_oMenuContainer);
        
        _iRandomN = Math.floor(Math.random()*2) + 0;
        if (_iRandomN !== 0) {
            _iRandomN = 3;
        }
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'+_iRandomN));
        var oRock = createBitmap(s_oSpriteLibrary.getSprite('rock_'+_iRandomN));
        oRock.x = -70;
        _oMenuContainer.addChild(oBg, oRock);
        
        this.startDiveAnimation();
        
        s_bFirstTimePlaying = true;
        
        var oGameLogo = s_oSpriteLibrary.getSprite('logo_menu');
        _oGameLogo = createBitmap(oGameLogo);
        _oGameLogo.regX = oGameLogo.width/2;
        _oGameLogo.regY = oGameLogo.height/2;
        _oGameLogo.x = CANVAS_WIDTH / 2;
        _oGameLogo.y = -250;        
        _oMenuContainer.addChild(_oGameLogo);

        _oTotalScoreTextBack = new createjs.Text(TEXT_SCORE + ": " + 0, FONT_SIZE_MENU_BEST_SCORE + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oTotalScoreTextBack.textAlign = "center";
        _oTotalScoreTextBack.textBaseline = "alphabetic";
	_oTotalScoreTextBack.x = CANVAS_WIDTH_HALF;
        _oTotalScoreTextBack.y = CANVAS_HEIGHT_HALF + 150;
        _oTotalScoreTextBack.lineWidth = 450;
        _oTotalScoreTextBack.visible = false;
        _oTotalScoreTextBack.outline = 5;
        _oMenuContainer.addChild(_oTotalScoreTextBack);

        _oTotalScoreText = new createjs.Text(TEXT_SCORE + ": " + 0, FONT_SIZE_MENU_BEST_SCORE + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oTotalScoreText.textAlign = "center";
        _oTotalScoreText.textBaseline = "alphabetic";
	_oTotalScoreText.x = CANVAS_WIDTH_HALF;
        _oTotalScoreText.y = CANVAS_HEIGHT_HALF + 150;
        _oTotalScoreText.lineWidth = 450;
        _oTotalScoreText.visible = false;
	_oMenuContainer.addChild(_oTotalScoreText);
        
        var oSpritePlay = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((CANVAS_WIDTH_HALF), CANVAS_HEIGHT + 200, oSpritePlay, _oMenuContainer);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x:20 + oSprite.width/2,y:(oSprite.height / 2) + 10};
        _oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSprite, _oMenuContainer);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onCredits, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - oSprite.width/4 -20, y: (oSprite.height / 2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,_oMenuContainer);
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
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oMenuContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oMenuContainer.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oMenuContainer.removeChild(_oFade);
        });
        
        if(!s_bStorageAvailable){
            new CMsgBox(TEXT_ERR_LS,_oMenuContainer);
        }else{
            var iTotalScore = getItem("cliff_diving_total_score");
            if (iTotalScore !== null && iTotalScore !== undefined) {
                s_iTotalScore = Number(iTotalScore);
                _oTotalScoreTextBack.visible = _oTotalScoreText.visible = true;
                _oTotalScoreTextBack.text = _oTotalScoreText.text = TEXT_SCORE + ": " + s_iTotalScore;
            } else {
                _oTotalScoreTextBack.visible = _oTotalScoreText.visible = false;
                s_iTotalScore = 0;
            };
            
            var iLastLevel = getItem("cliff_diving_last_level");
            if (iLastLevel !== null & iLastLevel !== undefined){
                s_iLastLevel = Number(iLastLevel);
            }
            
            if (s_aStars === undefined || s_aStars === null) {
                s_aStars = new Array;                
                for (var i = 0; i < LEVELS_NUMBER; i++) {
                    s_aStars.push(0);
                };                
            };
            
            var aLevelStars = getItemJson("cliff_diving_stars");
            if (aLevelStars !== null && s_aStars !== undefined) {
                s_aStars = aLevelStars;
            };
        }
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.startDiveAnimation = function(){
        var oSprite = s_oSpriteLibrary.getSprite('menu_diver');
        _oDiver = createBitmap(oSprite);
        _oDiver.regX = oSprite.width * 0.5;
        _oDiver.regY = oSprite.height * 0.5;
        _oDiver.x = CANVAS_WIDTH_HALF;
        _oDiver.y = -300;
        _oMenuContainer.addChild(_oDiver);
        
        // ADD "WATER" MASK TO THE PLAYER
        var oWaterMask = new createjs.Shape();
        oWaterMask.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0, 0, CANVAS_WIDTH, 1000);
        _oMenuContainer.addChild(oWaterMask);        
        _oDiver.mask = oWaterMask;
        
        var iDiverDest = CANVAS_HEIGHT - 300;
        createjs.Tween.get(_oDiver, {loop: false})
            .to({y: iDiverDest-100}, 1000, createjs.Ease.linear)
            .call(function(){ s_oMenu.onDiveEnd(iDiverDest); });
    };
    
    this.onDiveEnd = function(iDiverDest){
        createjs.Tween.get(_oDiver, {loop: false})
            .to({y: iDiverDest+100}, 100, createjs.Ease.linear);
    
        if (soundPlaying("water") === false) {
            playSound("water", 1, false);
        }
        
        var iSize = 384;
        var oData = {
            images: [s_oSpriteLibrary.getSprite('watersplash0')], 
            framerate: 10,
            frames: {width: iSize, height: iSize, regX: 0, regY: 0}, 
            animations: {idle:[0, 9, false]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var oWaterSplash = createSprite(oSpriteSheet, "idle", 0, 0, iSize, iSize);
        oWaterSplash.regX = iSize * 0.5;
        oWaterSplash.regY = iSize + 50;
        oWaterSplash.x = CANVAS_WIDTH_HALF;
        oWaterSplash.y = iDiverDest;        
        _oMenuContainer.addChild(oWaterSplash);
        
        // RESET Z POSITION OF THESE ELEMENTS
        _oMenuContainer.addChild(_oGameLogo,_oButPlay.getSprite());
        
        createjs.Tween.get(oWaterSplash, {loop: false}).to({alpha: 0}, 2000, createjs.Ease.cubicOut);
        createjs.Tween.get(_oGameLogo, {loop: false}).to({y: CANVAS_HEIGHT_HALF - 150}, 1000, createjs.Ease.cubicOut);
        createjs.Tween.get(_oButPlay.getSprite(), {loop: false}).to({y: CANVAS_HEIGHT_HALF + 350}, 1000, createjs.Ease.cubicOut);
    };

    this.unload = function () {
        _oButPlay.unload();
        _oButPlay = null;

        _oButCredits.unload();
        
        _oMenuContainer.removeAllChildren();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        s_oMenu = null;
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }

        _oButCredits.setPosition(_pStartPosCredits.x + iNewX,_pStartPosCredits.y + iNewY);
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(s_bFullscreen);
	}
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
        s_oMain.gotoLevelSelection(_iRandomN);
    };
    
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
	}else{
            _fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this.update = function () {
        
    };
    
    s_oMenu = this;

    this._init();
}

var s_oMenu = null;