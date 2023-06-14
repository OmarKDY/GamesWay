function CChooseMenu(){
    
    var _aFlags;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _pStartPosExit;
    
    var _oContainerFlags;
    var _oButExit;
    var _oText;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oLoaderController;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_choose_team'));
        s_oStage.addChild(oBg);
        
        _oText = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-250,200, 500, 44, 
                    44, "center","#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SELECT_TEAM,
                    true, true, false,
                    false );

        _oContainerFlags = new createjs.Container();
        _oContainerFlags.x = CANVAS_WIDTH/2 + 80;
        _oContainerFlags.y = CANVAS_HEIGHT/2 + 80;
        s_oStage.addChild(_oContainerFlags);
        
        
        
        _aFlags = new Array();
        var iX  = 0;
        var iY = 50;
        for(var i=0;i<NUM_TEAMS;i++){
            var oFlag = new CButFlag(iX,iY,i,TEAM_NAMES[i],PRIMARY_FONT,"#fff",46,_oContainerFlags);
            oFlag.setScale(0.4);
            oFlag.addEventListener(ON_END_SELECT_ANIM,this.exitFromPanel,this);
            oFlag.addEventListenerWithParams(ON_MOUSE_UP,this._onFlagSelected,this,i);
            
            iX += 161;
            if(i%4 === 3){
                iX = 0;
                iY += 200;
            }
            
            _aFlags.push(oFlag);
        }
        
        
        _oContainerFlags.regX = _oContainerFlags.getBounds().width/2;
        _oContainerFlags.regY = _oContainerFlags.getBounds().height/2;
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.width/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosExit.x - (oSprite.width/2)- 10, y: _pStartPosExit.y};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
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
            _pStartPosFullscreen = {x: oSprite.width/4 + 10,y:(oSprite.height/2) + 10};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        _oLoaderController = new CLoaderResourcesPanel(s_oStage);
        _oLoaderController.addEventListener(ON_END_LOADING,this._onEndLoading,this);
        
        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(oFade);
        
        createjs.Tween.get(oFade).to({alpha:0}, 500).call(function(){oFade.visible = false;});  
        
        this.refreshButtonPos();
    };
    
    this.unload = function(){
        createjs.Tween.removeAllTweens();
        
        for(var i=0;i<_aFlags.length;i++){
            _aFlags[i].unload();
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        _oLoaderController.unload();
        
        s_oStage.removeAllChildren();
        s_oChooseMenu = null;
    };
    
    this.refreshButtonPos = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
    };
    
    this.exitFromPanel = function(){
        if(s_aTeamLoaded[s_iTeamSelected]){
            s_oChooseMenu.unload();
        
            s_oMain.gotoGame();
        }else{
            var aResources = new Array();
            for(var k=0;k<38;k++){
                aResources.push({name:"p"+s_iTeamSelected+"_"+k,path:"./sprites/player_"+s_iTeamSelected+"/p"+s_iTeamSelected+"_"+k+".png"});
            }

            _oLoaderController.start(aResources);
        }
        
        
    };
    
    this._onFlagSelected = function(iFlag){
        s_iTeamSelected = iFlag;
        
        for(var i=0;i<NUM_TEAMS;i++){
            if(i === iFlag){
                _aFlags[i].playSelectedAnim(_oContainerFlags.regX-80,_oContainerFlags.regY-80);
            }else{
                _aFlags[i].playFadeOutAnim();
            }
        }
        
        new createjs.Tween.get(_oText.getText()).to({alpha:0},800);
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onEndLoading = function(){
        s_aTeamLoaded[s_iTeamSelected] = true;
        
        s_oChooseMenu.unload();
        s_oMain.gotoGame();
    };
    
    this._onExit = function(){
        s_oChooseMenu.unload();
        
        s_oMain.gotoMenu();
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
    
    s_oChooseMenu = this;
    
    this._init();
}

var s_oChooseMenu = null;