function CMenuSelect(){
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosMusic;
    
    var _oButFullscreen;
    var _oAudioToggle;
    var _oMusicToggle;
    var _oButMale;
    var _oButFemale;
    var _oFade;
    var _oContainer;
  
    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        var oMainBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        _oContainer.addChild(oMainBg);
        
        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.7;
        _oContainer.addChild(oFade);
        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH, y: (oSprite.height/2)+10};      
            _oAudioToggle = new CSideToggle(false,0,_pStartPosAudio.x-s_iOffsetX,_pStartPosAudio.y+s_iOffsetY,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosMusic = {x:CANVAS_WIDTH,y:_pStartPosAudio.y + oSprite.height +10};
            _oMusicToggle = new CSideToggle(false,0,_pStartPosMusic.x-s_iOffsetX,_pStartPosMusic.y+s_iOffsetY,s_oSpriteLibrary.getSprite("music_icon"),s_bMusicActive,s_oStage);
            _oMusicToggle.addEventListener(ON_MOUSE_UP,this._onMusicToggle,this);
            
            _pStartPosFullscreen = {x: CANVAS_WIDTH,y:_pStartPosMusic.y + oSprite.height +10};
            
            _oAudioToggle.tweenFinalX();
            _oMusicToggle.tweenFinalX();
        }else{
            _pStartPosFullscreen ={x: CANVAS_WIDTH, y: (oSprite.height/2)+10};      
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
            

            _oButFullscreen = new CSideToggle(false,200,_pStartPosFullscreen.x-s_iOffsetX,_pStartPosFullscreen.y+s_iOffsetY,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
            
            _oButFullscreen.tweenFinalX();
        }
        
        _oButMale = new CButSelectPlayer(CANVAS_WIDTH/2+200,CANVAS_HEIGHT/2,s_oSpriteLibrary.getSprite("but_male"),s_oStage);
        _oButMale.addEventListener(ON_MOUSE_UP,this._onMaleSelected,this);
        
        _oButFemale = new CButSelectPlayer(CANVAS_WIDTH/2-200,CANVAS_HEIGHT/2,s_oSpriteLibrary.getSprite("but_female"),s_oStage);
        _oButFemale.addEventListener(ON_MOUSE_UP,this._onFemaleSelected,this);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 400).call(function(){_oFade.visible = false;}); 
    };
    
    this.unload = function(){
        _oButFemale.unload();
        _oButMale.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
            _oMusicToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        s_oStage.removeAllChildren();
        
        s_oMenuSelect = null;
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
                _oMusicToggle.setPosition(_pStartPosMusic.x - s_iOffsetX,s_iOffsetY + _pStartPosMusic.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this._onMaleSelected = function(){
        s_oMenuSelect.unload();
        
        s_szPlayerType = PLAYER_MALE;
        s_oMain.setLocalStoragePlayer(PLAYER_MALE);
        
        s_oMain.gotoLevelMenu();
    };
    
    this._onFemaleSelected = function(){
        s_oMenuSelect.unload();
        
        s_szPlayerType = PLAYER_FEMALE;
        s_oMain.setLocalStoragePlayer(PLAYER_FEMALE);
        
        s_oMain.gotoLevelMenu();
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
    
    this._onAudioToggle = function(){
        muteAllSfx(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this._onMusicToggle = function(){
        muteAllMusic(s_bMusicActive);
        s_bMusicActive = !s_bMusicActive;
    };
    
    s_oMenuSelect = this;
    
    this._init();
}

var s_oMenuSelect = null;