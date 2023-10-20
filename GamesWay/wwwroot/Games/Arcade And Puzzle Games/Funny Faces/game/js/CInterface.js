function CInterface(iLevel,iLives){
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _oButExit;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oScoreTextBack;
    var _oScoreText;
    var _oEndPanel;
    var _oLifeSprite;
    var _oLifeTextBack;
    var _oLifeText;
    var _oLevelTextBack;
    var _oLevelText;
    
    this._init = function(iLevel,iLives){
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2), y: (oSprite.height/2)};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        

        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x: _pStartPosExit.x-oSprite.width-10, y: (oSprite.height/2) };
            
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);   
            
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
             _pStartPosFullscreen = {x: _pStartPosExit.x-oSprite.width-10, y: (oSprite.height/2) };
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        _oScoreTextBack = new createjs.Text(TEXT_SCORE+": 0","40px "+FONT_GAME, "#000000");
        _oScoreTextBack.x = (CANVAS_WIDTH - 22);
        _oScoreTextBack.y = BOARD_OFFSET_Y + (BOARD_ROWS*ELEM_SIZE) + 32;
        _oScoreTextBack.textAlign = "right";
        s_oStage.addChild(_oScoreTextBack);
        
        _oScoreText = new createjs.Text(TEXT_SCORE+": 0","40px "+FONT_GAME, "#ffffff");
        _oScoreText.x = (CANVAS_WIDTH - 20);
        _oScoreText.y = BOARD_OFFSET_Y + (BOARD_ROWS*ELEM_SIZE) + 30;
        _oScoreText.textAlign = "right";
        s_oStage.addChild(_oScoreText);
        
        var oSpriteLife = s_oSpriteLibrary.getSprite("life");
        _oLifeSprite = createBitmap(oSpriteLife);
        _oLifeSprite.x = BOARD_OFFSET_X;
        _oLifeSprite.y = BOARD_OFFSET_Y + (BOARD_ROWS*ELEM_SIZE) + 20;
        s_oStage.addChild(_oLifeSprite);
        
        _oLifeTextBack = new createjs.Text("X"+iLives,"40px "+FONT_GAME, "#000000");
        _oLifeTextBack.x = _oLifeSprite.x + oSpriteLife.width + 7;
        _oLifeTextBack.y = _oLifeSprite.y + 12;
        s_oStage.addChild(_oLifeTextBack);
        
        _oLifeText = new createjs.Text("X"+iLives,"40px "+FONT_GAME, "#ffffff");
        _oLifeText.x = _oLifeSprite.x + oSpriteLife.width + 5;
        _oLifeText.y = _oLifeSprite.y + 10;
        s_oStage.addChild(_oLifeText);
        
        _oLevelTextBack = new createjs.Text(TEXT_LEVEL+" "+iLevel,"40px "+FONT_GAME, "#000000");
        _oLevelTextBack.x = 122;
        _oLevelTextBack.y = BOARD_OFFSET_Y - 40;
        _oLevelTextBack.textAlign = "center";
        s_oStage.addChild(_oLevelTextBack);
        
        _oLevelText = new createjs.Text(TEXT_LEVEL+" "+iLevel,"40px "+FONT_GAME, "#ffffff");
        _oLevelText.x = 120;
        _oLevelText.y = BOARD_OFFSET_Y - 42;
        _oLevelText.textAlign = "center";
        s_oStage.addChild(_oLevelText);
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
		
		this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        
        s_oStage.removeChild(_oLevelText);   
        s_oStage.removeChild(_oLifeTextBack);
        s_oStage.removeChild(_oLifeText);
        s_oStage.removeChild(_oLifeSprite);
        s_oStage.removeChild(_oScoreText);
        s_oStage.removeChild(_oScoreTextBack);
		s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }    
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX, _pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this.refreshScore = function(iScore){
      _oScoreText.text = TEXT_SCORE +": "+ iScore;
      _oScoreTextBack.text = TEXT_SCORE +": "+ iScore;
    };
    
    this.refreshLives = function(iLives){
        _oLifeText.text = "X"+iLives;
        _oLifeTextBack.text = "X"+iLives;
    };
    
    this.refreshLevel = function(iLevel){
        _oLevelText.text = TEXT_LEVEL+" "+iLevel;
        _oLevelTextBack.text = TEXT_LEVEL+" "+iLevel;
    };
    
    this.gameOver = function(iScore){
        _oEndPanel.show(iScore);
    };
    
    this._onExit = function(){
      s_oGame.onExit();  
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
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
	
    this._init(iLevel,iLives);
    
    return this;
}

var s_oInterface = null;