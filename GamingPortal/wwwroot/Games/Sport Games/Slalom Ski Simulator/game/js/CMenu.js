 function CMenu(){
    var _bGUITweening;
    var _pStartPosAudio;
    var _pStartPosMusic;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    var _pStartPosClearSavings;
	
    var _oBg;
    var _oButPlay;
    var _oButContinue = null;
    var _oAudioToggle;
    var _oMusicToggle;
    var _oButCredits;
    var _oButClearSavings;
    var _oFade;
    var _oButFullscreen;
    var _oAreYouSurePanel;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    
    
    this._init = function(){
        _bGUITweening = true;
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
	s_oStage.addChild(_oBg);

        _oButPlay = new CGfxButton((CANVAS_WIDTH/2)+350,CANVAS_HEIGHT/2+200,s_oSpriteLibrary.getSprite('but_play'),s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlaySingle, this);
        
        
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
		
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x:0,y:(oSprite.height/2) + 10};
        _oButCredits = new CSideGfxButton(true,_pStartPosCredits.x+s_iOffsetX,_pStartPosCredits.y+s_iOffsetY,oSprite,s_oStage);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onButCreditsRelease, this);
        _oButCredits.addEventListener(ON_BUT_END_TWEEN_X, this._onButEndTween, this);
	
        _pStartPosClearSavings = {x:0,y:CANVAS_HEIGHT- oSprite.height/2 -10};
        _oButClearSavings = new CSideGfxButton(true,_pStartPosClearSavings.x+s_iOffsetX,_pStartPosClearSavings.y-s_iOffsetY,s_oSpriteLibrary.getSprite("but_clear_save"),s_oStage);
        _oButClearSavings.addEventListener(ON_MOUSE_UP, this._onButClearRelease, this);
        
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
        
        var oSpriteLogo = s_oSpriteLibrary.getSprite("logo_menu");
        var oLogo = createBitmap(oSpriteLogo);
        oLogo.regX = oSpriteLogo.width/2;
        oLogo.x = CANVAS_WIDTH/2;
        oLogo.y = 40;
        s_oStage.addChild(oLogo);
        
        _oAreYouSurePanel = new CAreYouSurePanel();
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this._onConfirmClear,this);
        
        if(!s_bStorageAvailable){
            new CAlertSavingBox(TEXT_ERR_LS,s_oStage);
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 400).call(function(){_oFade.visible = false;}); 
        
        _oButCredits.tweenFinalX();
        _oButClearSavings.tweenFinalX();
        

        setMusicVolume("soundtrack",1);
    };
    
    this.unload = function(){
        _oButPlay.unload(); 
        _oButCredits.unload();
        _oButClearSavings.unload();
        
        if(_oButContinue !== null){
            _oButContinue.unload();
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
            _oMusicToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        s_oStage.removeAllChildren();
	s_oMenu = null;
    };
	
    this.refreshButtonPos = function(){
        if(_bGUITweening){
            return;
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
                _oMusicToggle.setPosition(_pStartPosMusic.x - s_iOffsetX,s_iOffsetY + _pStartPosMusic.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
	_oButCredits.setPosition(_pStartPosCredits.x + s_iOffsetX,_pStartPosCredits.y + s_iOffsetY);
        _oButClearSavings.setPosition(_pStartPosClearSavings.x + s_iOffsetX,_pStartPosClearSavings.y - s_iOffsetY);
    };
    
    this._onButPlaySingle = function(){
        s_oMenu.unload();

        s_oMain.gotoSelectPlayer();

        $(s_oMain).trigger("start_session");
    };
	
    this._onButCreditsRelease = function(){
        new CCreditsPanel();
    };
    
    this._onButClearRelease = function(){
        _oAreYouSurePanel.show(TEXT_CONFIRM_CLEAR_SAVINGS);
    };
    
    this._onButEndTween = function(){
        _bGUITweening = false;
        
    };

    this._onAudioToggle = function(){
        muteAllSfx(s_bAudioActive);
	s_bAudioActive = !s_bAudioActive;
    };
    
    this._onMusicToggle = function(){
        muteAllMusic(s_bMusicActive);
        s_bMusicActive = !s_bMusicActive;
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
    
    this._onConfirmClear = function(){
        s_oMain.clearLocalStorage();
    };
    
    s_oMenu = this;
	
    this._init();
}

var s_oMenu = null;