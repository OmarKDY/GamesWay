function CModeMenu(){
    
    var _bNumActive;
    
    var _iModeSelected;
    
    var _oDifficultyText;
    var _oMode3;
    var _oMode4;
    var _oMode5;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _oChooseText;
    var _oImage1;
    var _oImage2;
    var _oImage3;
    
    var _oBg;
    var _oAudioToggle;
    
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    
    this._init = function(){
        
        _bNumActive = false;
        
        _iModeSelected = NORMAL_MODE;
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_mode'));
        s_oStage.addChild(_oBg);
        
        _oDifficultyText = new createjs.Text(TEXT_DIFFICULTY," 100px "+PRIMARY_FONT, "#ff8814");
        _oDifficultyText.x = CANVAS_WIDTH/2;
        _oDifficultyText.y = 230;
        _oDifficultyText.textAlign = "center";
        _oDifficultyText.textBaseline = "alphabetic";
        _oDifficultyText.lineWidth = 1000;
        s_oStage.addChild(_oDifficultyText);
        
        var oModePos = {x: CANVAS_WIDTH/2, y: 400};
        
        var oSprite = s_oSpriteLibrary.getSprite('layout_3x3');
        _oMode3 = new CToggle(oModePos.x - 300,oModePos.y,oSprite,false,s_oStage);
        _oMode3.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, EASY_MODE);
        
        var oSprite = s_oSpriteLibrary.getSprite('layout_4x4');
        _oMode4 = new CToggle(oModePos.x,oModePos.y,oSprite,true,s_oStage);
        _oMode4.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, NORMAL_MODE);
        
        var oSprite = s_oSpriteLibrary.getSprite('layout_5x5');
        _oMode5 = new CToggle(oModePos.x + 300,oModePos.y,oSprite,false,s_oStage);
        _oMode5.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, HARD_MODE);
        
        _oChooseText = new createjs.Text(TEXT_IMAGE," 100px "+PRIMARY_FONT, "#ff8814");
        _oChooseText.x = CANVAS_WIDTH/2;
        _oChooseText.y = 690;
        _oChooseText.textAlign = "center";
        _oChooseText.textBaseline = "alphabetic";
        _oChooseText.lineWidth = 1000;
        s_oStage.addChild(_oChooseText);
        
        var oImagePos = {x: CANVAS_WIDTH/2, y: 841};
        
        var oSprite = s_oSpriteLibrary.getSprite('image_1');
        _oImage1 = new CGfxButton( oImagePos.x - 470, oImagePos.y,oSprite,s_oStage);
        _oImage1.addEventListenerWithParams(ON_MOUSE_UP, this._onButImageRelease, this, 'image_1');
        _oImage1.setScale(0.24);
        
        var oSprite = s_oSpriteLibrary.getSprite('image_2');
        _oImage2 = new CGfxButton( oImagePos.x -3, oImagePos.y,oSprite,s_oStage);
        _oImage2.addEventListenerWithParams(ON_MOUSE_UP, this._onButImageRelease, this, 'image_2');
        _oImage2.setScale(0.24);
        
        var oSprite = s_oSpriteLibrary.getSprite('image_3');
        _oImage3 = new CGfxButton(oImagePos.x + 465, oImagePos.y,oSprite,s_oStage);
        _oImage3.addEventListenerWithParams(ON_MOUSE_UP, this._onButImageRelease, this, 'image_3');
        _oImage3.setScale(0.24);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);      
            
             oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: _pStartPosAudio.x - (oSprite.width/2)- 10, y: (oSprite.height/2) + 10};          
        }else{
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width/2 - 10, y: _pStartPosAudio.y};         
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
           
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };  
    
    this.unload = function(){
        _oMode3.unload();
        _oMode4.unload();  
        _oMode5.unload();
        _oImage1.unload();
        _oImage2.unload();
        _oImage3.unload();
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oModeMenu = null;
        s_oStage.removeAllChildren();        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }        
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this._onModeToggle = function(iData){
        switch(iData){
            
            case 0: {
                    _oMode3.setActive(true);
                    _oMode4.setActive(false);
                    _oMode5.setActive(false);
                    _iModeSelected = EASY_MODE;
                    break;
            }
            case 1: {
                    _oMode3.setActive(false);
                    _oMode4.setActive(true);
                    _oMode5.setActive(false);
                    _iModeSelected = NORMAL_MODE;
                    break;                    
            }
            case 2: {
                    _oMode3.setActive(false);
                    _oMode4.setActive(false);
                    _oMode5.setActive(true);
                    _iModeSelected = HARD_MODE;
                    break;
            }            
        }
    };
      
    this._onButImageRelease = function(szData){
        this.unload();
        s_oMain.gotoGame(_iModeSelected, szData, _bNumActive);
        $(s_oMain).trigger("start_level",1);
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
    
    s_oModeMenu = this;        
    this._init();
    
    
};

var s_oModeMenu = null;