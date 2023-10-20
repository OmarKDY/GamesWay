function CInterface(oParentContainer) {
    var _oContainer;
    var _oAudioToggle;
    var _iBottomLinePos;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oButExit;   
    var _oScoreIcon;
    var _oScoreTextBack;
    var _oScoreText;
    var _oLevelTextBack;
    var _oLevelText;
    var _oTurnTextBack;
    var _oTurnText;
    var _oAreYouSurePanel;
    var _oParentContainer;

    this._init = function () {
        _oParentContainer = oParentContainer;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');        
        _pStartPosExit = {x: CANVAS_WIDTH - oSpriteExit.width/2 - 20, y: (oSpriteExit.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            
            _pStartPosAudio = {x: _pStartPosExit.x - oSpriteExit.width/2 - oSprite.width/4 - 10, y: _pStartPosExit.y};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,_oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSpriteExit.width/2 - oSprite.width/4 - 10,y:(oSprite.height / 2) + 10};
        }else{
            _pStartPosFullscreen = {x: _pStartPosExit.x - oSpriteExit.width - 10, y: _pStartPosExit.y};
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

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        this.initInterfaceTexts();

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.initInterfaceTexts = function(){
        _iBottomLinePos = CANVAS_HEIGHT - 250;
        
        _oTurnTextBack = new createjs.Text(TEXT_TURN + " " + 1 + "/" + LEVEL_TURNS[s_iLevel], FONT_SIZE_INTERFACE + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oTurnTextBack.textAlign = "right";
        _oTurnTextBack.textBaseline = "alphabetic";
	_oTurnTextBack.x = CANVAS_WIDTH - 60;
        _oTurnTextBack.y = _iBottomLinePos;
        _oTurnTextBack.outline = 5;
        _oContainer.addChild(_oTurnTextBack);
        
        _oTurnText = new createjs.Text(TEXT_TURN + " " + 1 + "/" + LEVEL_TURNS[s_iLevel], FONT_SIZE_INTERFACE + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oTurnText.textAlign = "right";
        _oTurnText.textBaseline = "alphabetic";
        _oTurnText.x = CANVAS_WIDTH - 60;
        _oTurnText.y = _iBottomLinePos;
	_oContainer.addChild(_oTurnText);   
        
        var iLevel = s_iLevel+1;
        _oLevelTextBack = new createjs.Text(TEXT_LEVEL + " " + iLevel, FONT_SIZE_INTERFACE + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oLevelTextBack.textAlign = "left";
        _oLevelTextBack.textBaseline = "alphabetic";
	_oLevelTextBack.x = 60;
        _oLevelTextBack.y = _iBottomLinePos;
        _oLevelTextBack.outline = 5;
        _oContainer.addChild(_oLevelTextBack);
        
        _oLevelText = new createjs.Text(TEXT_LEVEL + " " + iLevel, FONT_SIZE_INTERFACE + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oLevelText.textAlign = "left";
        _oLevelText.textBaseline = "alphabetic";
        _oLevelText.x = 60;
        _oLevelText.y = _iBottomLinePos;
	_oContainer.addChild(_oLevelText);
        
        _oScoreTextBack = new createjs.Text(/*TEXT_SCORE + " " + */s_iTotalScore, FONT_SIZE_INTERFACE + PRIMARY_FONT, SECONDARY_FONT_COLOUR);
        _oScoreTextBack.textAlign = "left";
        _oScoreTextBack.textBaseline = "alphabetic";
	_oScoreTextBack.x = 60;
        _oScoreTextBack.y = _pStartPosExit.y;
        _oScoreTextBack.outline = 5;
        _oContainer.addChild(_oScoreTextBack);
        
        _oScoreText = new createjs.Text(/*TEXT_SCORE + " " + */s_iTotalScore, FONT_SIZE_INTERFACE + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oScoreText.textAlign = "left";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.x = 60;
        _oScoreText.y = _pStartPosExit.y;
	_oContainer.addChild(_oScoreText);
        
        var oSprite = s_oSpriteLibrary.getSprite('coin');
        _oScoreIcon = createBitmap(oSprite);
        _oScoreIcon.regX = oSprite.width * 0.5;
        _oScoreIcon.regY = oSprite.height * 0.5;
        _oScoreIcon.x = _oScoreText.x - 35;
        _oScoreIcon.y = _oScoreText.y - 15;
        _oContainer.addChild(_oScoreIcon);
                
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.getScoreIconPos = function(){
        var oPos = {x: _oScoreIcon.x, y: _oScoreIcon.y};
        return oPos;
    };
    
    this.pulseScoreIcon = function(){
        if (createjs.Tween.hasActiveTweens(_oScoreIcon) === true) {
            return;
        }
        var iScaleVar = 1.2;
        createjs.Tween.get(_oScoreIcon)
            .to({scaleX: iScaleVar, scaleY: iScaleVar}, 300, createjs.Ease.quadOut)
            .to({scaleX: 1, scaleY: 1}, 300, createjs.Ease.quadIn)
            .call(function () {
                createjs.Tween.removeTweens(_oScoreIcon);
            });
    };
    
    this.refreshTurnText = function(iTurn){
        _oTurnTextBack.text = _oTurnText.text = TEXT_TURN + " " + iTurn + "/" + LEVEL_TURNS[s_iLevel];
    };
    
    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        };
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        };
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
        
        // REFRESH BOTTOM TEXTS POSITION
        _iBottomLinePos = CANVAS_HEIGHT - iNewY - 50;

        if (_oScoreText !== undefined) {
            _oScoreTextBack.x = _oScoreText.x = 80 + iNewX;
            _oScoreTextBack.y = _oScoreText.y = _pStartPosExit.y + iNewY; 
            
            _oScoreIcon.x = _oScoreText.x - 35;
            _oScoreIcon.y = _oScoreText.y - 15;            
        }
        
        if (_oTurnText !== undefined) {
            _oTurnTextBack.y = _oTurnText.y = _iBottomLinePos; 
        }
        if (_oLevelText !== undefined) {
            _oLevelTextBack.x = _oLevelText.x = 60 + iNewX;
            _oLevelTextBack.y = _oLevelText.y = _iBottomLinePos;
        };
    };
    
    this.refreshScoreText = function (iValue) {
        _oScoreTextBack.text = _oScoreText.text = /*TEXT_SCORE + " " + */iValue;
    };
    
    this.unload = function () {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        s_oInterface = null;
        s_oGame._bDisableEvents = false;
        s_oGame.setStartGame(true);
    };
    
    this._onExit = function () {
        _oAreYouSurePanel = new CAreYouSurePanel(_oContainer);
        s_oGame._bDisableEvents = true;
        s_oGame.setStartGame(false);
    };
    
    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
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
	if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    s_oInterface = this;

    this._init();

    return this;
}

var s_oInterface = null;