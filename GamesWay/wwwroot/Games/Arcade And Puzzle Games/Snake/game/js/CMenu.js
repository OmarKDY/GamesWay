function CMenu(){
    var _oModeSurvival;
    var _oModeAdventure;
    
    var _oBg;
    var _oAudioToggle;
    var _oButInfo;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosAudio;
    var _pStartPosInfo;
    var _pStartPosFullscreen;
    
    this._init = function(){
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
        
        var iWidth = 400;
        var iHeight = 70;
        var iX = CANVAS_WIDTH/2;
        var iY = 820;
        var oChooseTextStroke = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    70, "center", "#600101", FONT, 1,
                    2, 2,
                    TEXT_DIFFICULTY,
                    true, true, false,
                    false );
        oChooseTextStroke.setOutline(8);
        var oChooseText = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    70, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_DIFFICULTY,
                    true, true, false,
                    false );
        
        var oModePos = {x: CANVAS_WIDTH/2, y: 825};
        
        var oSpriteSurvival = s_oSpriteLibrary.getSprite('survival');
        _oModeSurvival = new CToggle(oModePos.x - 400,oModePos.y,oSpriteSurvival,true);
        _oModeSurvival.addEventListener(ON_MOUSE_UP, this._onModeSurvival, this, 0);
        
        var iWidth = oSpriteSurvival.width/2;
        var iHeight = 70;
        var iX = oModePos.x - 400;
        var iY = oModePos.y + 120;
        var oTextSurvivalStroke = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#600101", FONT, 1,
                    2, 2,
                    TEXT_SURVIVAL,
                    true, true, false,
                    false );
        oTextSurvivalStroke.setOutline(8);
        var oTextSurvival = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_SURVIVAL,
                    true, true, false,
                    false );

       
        var oSpriteAdventure = s_oSpriteLibrary.getSprite('adventure');
        _oModeAdventure = new CToggle(oModePos.x + 400,oModePos.y,oSpriteAdventure,true);
        _oModeAdventure.addEventListener(ON_MOUSE_UP, this._onModeAdventure, this);
        
        var iWidth = oSpriteAdventure.width/2;
        var iHeight = 70;
        var iX = oModePos.x + 400;
        var iY = oModePos.y + 120;
        var oTextSurvivalStroke = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#600101", FONT, 1,
                    2, 2,
                    TEXT_ADVENTURE,
                    true, true, false,
                    false );
        oTextSurvivalStroke.setOutline(8);
        var oTextSurvival = new CTLText(s_oStage, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    50, "center", "#fff", FONT, 1,
                    2, 2,
                    TEXT_ADVENTURE,
                    true, true, false,
                    false );

        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - oSprite.height/2 - 10, y: (oSprite.height/2) + 10};
            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);    
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosInfo = {x: (oSprite.width/2)+ 10, y: (oSprite.height/2) + 10}; 
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
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
             _pStartPosFullscreen = {x:_pStartPosInfo.x + oSprite.width/2 + 10,y:_pStartPosInfo.y};
             
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        if(!s_bStorageAvailable){
            var oMsgBox = new CMsgBox(s_oStage);
            oMsgBox.show(TEXT_ERR_LS);
        }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);        
    };  
    
    this.unload = function(){
        _oModeSurvival.unload();
        _oModeAdventure.unload();
        
        _oButInfo.unload();
        _oButInfo = null;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        s_oMenu = null;
        s_oStage.removeAllChildren();    
        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }   
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        _oButInfo.setPosition(_pStartPosInfo.x + iNewX,iNewY + _pStartPosInfo.y);
    };

    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onModeSurvival = function( level ){

        s_oMenu.unload();
        s_oMain.gotoGame(SURVIVAL_MODE, 0);
        $(s_oMain).trigger("start_session");
    };
    
    this._onModeAdventure = function(){

        s_oMenu.unload();

        s_oMain.gotoLevelMenu();
        $(s_oMain).trigger("start_session");
    };
    
    this._onCredits = function(){
        new CCreditsPanel();
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
    
    
};

var s_oMenu = null;