function CInterface(){
    var _oAudioToggle;
    var _oButExit;
    var _oPauseToggle;
    var _oTextScore;    
    var _oNumScore;

    var _oTextHealth;
    var _oMask;
    var _oParent;
    var _oScoreContainer;
    var _oHealthContainer;
    var _oButFullscreen;
    
    var _iScale;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosPause;
    var _pStartPosScore;
    var _pStartPosHealth;
    var _pStartPosFullscreen;
    
    this._init = function(){
        
        _iScale=1;
       
        var oExitX;
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 80;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 10};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);  
            
            oExitX = CANVAS_WIDTH - (oSprite.width/2) - 130;
            _pStartPosPause = {x: oExitX, y: (oSprite.height/2) + 10};

        }else {
            
            _pStartPosPause = {x: oExitX, y: (oSprite.height/2) + 10};

        }

        var oSprite = s_oSpriteLibrary.getSprite('pause_icon');
        _oPauseToggle = new CToggle(_pStartPosPause.x,_pStartPosPause.y,oSprite,true, s_oStage);
        _oPauseToggle.addEventListener(ON_MOUSE_UP, this._onPauseToggle, this); 
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            _pStartPosFullscreen = {x:_pStartPosPause.x - oSprite.width/2 - 28,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        _pStartPosScore = {x:30, y:800};
        _oScoreContainer = new createjs.Container();
        _oScoreContainer.x = _pStartPosScore.x;
        _oScoreContainer.y = _pStartPosScore.y;
        s_oStage.addChild(_oScoreContainer);
        
        _oTextScore = new createjs.Text(TEXT_SCORE,"45px "+PRIMARY_FONT, "#fff2af");
        _oTextScore.textBaseline = "textBaseline";
        _oScoreContainer.addChild(_oTextScore);
        
        _oNumScore = new createjs.Text("0","45px "+PRIMARY_FONT, "#fff2af");
        _oNumScore.x = 170;
        _oNumScore.textBaseline = "textBaseline";
        _oScoreContainer.addChild(_oNumScore);
        
        
        _pStartPosHealth = {x: 750, y:800};
        _oHealthContainer = new createjs.Container();
        _oHealthContainer.x = _pStartPosHealth.x;
        _oHealthContainer.y = _pStartPosHealth.y;
        s_oStage.addChild(_oHealthContainer);
        
        
        _oTextHealth = new createjs.Text(TEXT_HEALTH,"40px "+PRIMARY_FONT, "#fff2af");
        _oTextHealth.x = 360;
        _oTextHealth.textAlign = "right";
        _oTextHealth.textBaseline = "textBaseline";
        _oHealthContainer.addChild(_oTextHealth);

        oSprite = s_oSpriteLibrary.getSprite('energy_bar_fill');
        var oEnergyBarFill = createBitmap(oSprite);
        oEnergyBarFill.x= 5;
        oEnergyBarFill.y= 5;
        _oHealthContainer.addChild(oEnergyBarFill);
        
        oSprite = s_oSpriteLibrary.getSprite('energy_bar_bg');
        var oEnergyBarBg = createBitmap(oSprite);
        _oHealthContainer.addChild(oEnergyBarBg);
        
        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(0, 0, oSprite.width,oSprite.height);
        _oMask.x= 5;
        _oMask.y= 5;
        _oHealthContainer.addChild(_oMask);

        oEnergyBarFill.mask = _oMask;
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        _oPauseToggle.setPosition(_pStartPosPause.x - iNewX,iNewY + _pStartPosPause.y);
        
        _oScoreContainer.x = _pStartPosScore.x + iNewX;
        _oScoreContainer.y = _pStartPosScore.y - iNewY;
        
        _oHealthContainer.x = _pStartPosHealth.x - iNewX;
        _oHealthContainer.y = _pStartPosHealth.y - iNewY;
        
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
        
    };
    
    this.refreshBar = function(iValue){
        createjs.Tween.get(_oMask, {override:true}).to({scaleX:iValue}, 250, createjs.Ease.linear);//.call(function(){_oParent._removeTween()});
    };
    
    this.refreshScore = function(iValue){
        _oNumScore.text=iValue;
    };
 
    this.unload = function(){
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        s_oInterface = null;

        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        
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
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onPauseToggle = function(){
        s_oGame.pauseGame();
    };
    
    this.pressPauseButton = function(){
        _oPauseToggle.buttonRelease();
    };
    
    this._onExit = function(){
      s_oGame.onExit();  
    };
    s_oInterface = this;
    _oParent=this;
    this._init();
    
    return this;
}

var s_oInterface = null;