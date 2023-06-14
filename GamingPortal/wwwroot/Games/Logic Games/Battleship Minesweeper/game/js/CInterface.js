function CInterface(){
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFlag;
    var _pStartPosFullscreen;
    
    var _oButExit;
    var _oAudioToggle;
    var _oToggleFlag;
    var _oTimeTextBack;
    var _oTimeText;
    var _oMineTextBack;
    var _oMineText;
    var _oMineSprite;
    var _oScoreTextBack;
    var _oScoreText;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) -10,y:10+ (oSprite.height/2)};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        _oTimeTextBack = new CTLText(s_oStage, 
                    (CANVAS_WIDTH - 455), CANVAS_HEIGHT - 353, 400, 40, 
                    40, "right", "#000", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    
        _oTimeTextBack.setOutline(3);
        
        _oTimeText = new CTLText(s_oStage, 
                    (CANVAS_WIDTH - 455), CANVAS_HEIGHT - 353, 400, 40, 
                    40, "right", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        
        _oScoreTextBack =  new CTLText(s_oStage, 
                    BOARD_OFFSET_X, BOARD_OFFSET_Y - 48, 400, 40, 
                    40, "left", "#000", FONT_GAME, 1,
                    0, 0,
                    TEXT_SCORE +": 0",
                    true, true, false,
                    false );
        _oScoreTextBack.setOutline(3);
		
        _oScoreText = new CTLText(s_oStage, 
                    BOARD_OFFSET_X, BOARD_OFFSET_Y - 48, 400, 40, 
                    40, "left", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_SCORE +": 0",
                    true, true, false,
                    false );
		
	if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x:_pStartPosExit.x - oSprite.width/2 - 10,y:10+ (oSprite.height/2)};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:CANVAS_WIDTH - 180,y:10+ (oSprite.height/2)};
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && inIframe() === false){
            

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        if(s_bMobile){
            _pStartPosFlag = {x:100,y:60};
            _oToggleFlag = new CToggle(_pStartPosFlag.x,_pStartPosFlag.y,s_oSpriteLibrary.getSprite('toggle_flag'),false,s_oStage);
            _oToggleFlag.addEventListener(ON_MOUSE_UP, this._onToggleFlag, this);
        }
		
        oSprite = s_oSpriteLibrary.getSprite('mine');
        _oMineSprite = createBitmap(oSprite);
        _oMineSprite.x = BOARD_OFFSET_X;
        _oMineSprite.y = CANVAS_HEIGHT-366;
        s_oStage.addChild(_oMineSprite);
        
        _oMineTextBack = new createjs.Text(NUM_MINES,"40px "+FONT_GAME, "#000000");
        _oMineTextBack.x = _oMineSprite.x + oSprite.width + 2;
        _oMineTextBack.y = CANVAS_HEIGHT-353;
        _oMineTextBack.textAlign = "left";
        s_oStage.addChild(_oMineTextBack);
        
        _oMineText = new createjs.Text(NUM_MINES,"40px "+FONT_GAME, "#ffffff");
        _oMineText.x = _oMineSprite.x + oSprite.width;
        _oMineText.y = CANVAS_HEIGHT-355;
        _oMineText.textAlign = "left";
        s_oStage.addChild(_oMineText);
		
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        
	if(s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
		
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.unload();
        }


        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        
        if (_fRequestFullScreen && inIframe() === false){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
        
        if(s_bMobile){
            _oToggleFlag.setPosition(_pStartPosFlag.x + iNewX,iNewY + _pStartPosFlag.y);
        }
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
    };

    
    this.refreshTime = function(iTime){
        var szTime = formatTime(iTime);
        _oTimeText.refreshText(TEXT_TIME + ": " + szTime);
        _oTimeTextBack.refreshText(TEXT_TIME + ": " + szTime);
    };
    
    this.refreshMines = function(iMine){
        _oMineTextBack.text = ""+iMine;
        _oMineText.text = ""+iMine;
    };
	
    this.refreshScore = function(iScore){
            _oScoreTextBack.refreshText(TEXT_SCORE +": "+iScore);
            _oScoreText.refreshText(TEXT_SCORE +": "+iScore);
    };
    
    this._onExit = function(){
      s_oGame.onExit();  
    };
    
    this._onToggleFlag = function(bActive){
        s_oGame.setFlagActive(bActive);
    };
	
    this._onAudioToggle = function(){
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
    
    s_oInterface = this;
	
    this._init();
    
    return this;
}

var s_oInterface = null;