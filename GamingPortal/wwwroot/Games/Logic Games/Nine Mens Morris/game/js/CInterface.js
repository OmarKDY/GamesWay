function CInterface(){
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosRestart;
    var _pStartPosFullscreen;


    var _oButExit;
    var _oButRestart;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oTextHelp;

    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _oAreYouSurePanel;
    var _oTurnWhite;
    var _oTurnBlack;
    var _oContainerTurn;

    
    this._init = function(){ 
        var oSprite = s_oSpriteLibrary.getSprite("player_turn_panel");
        _oContainerTurn = new createjs.Container();
        _oContainerTurn.x = CANVAS_WIDTH/2;
        _oContainerTurn.regX = oSprite.width/2;
        _oContainerTurn.y = 1000;
        s_oStage.addChild(_oContainerTurn);
        
        
        var oBgTurn = createBitmap(oSprite);
        _oContainerTurn.addChild(oBgTurn);
        
        var oTextTurn = new CTLText(_oContainerTurn, 
                    0, 0, 350, 130, 
                    36, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_PLAYER_TURN,
                    true, true, false,
                    false );
                    

        
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite("piece0")], 
                        framerate:6,
                        // width, height & registration point of each sprite
                        frames: {width: PIECE_WIDTH, height: PIECE_HEIGHT, regX: PIECE_WIDTH/2, regY: PIECE_HEIGHT/2}, 
                        animations: {start:0,anim:[0,4]}
                   };
                   
        var oSpriteSheetWhite = new createjs.SpriteSheet(oData);
	_oTurnWhite = createSprite(oSpriteSheetWhite, "anim",PIECE_WIDTH/2,PIECE_HEIGHT/2,PIECE_WIDTH,PIECE_HEIGHT);
        _oTurnWhite.visible = false;
        _oTurnWhite.x = 420;
        _oTurnWhite.y = 70;
        _oTurnWhite.scaleX = _oTurnWhite.scaleY = 0.8;
        _oContainerTurn.addChild(_oTurnWhite);
        
        
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite("piece1")], 
                        framerate:6,
                        // width, height & registration point of each sprite
                        frames: {width: PIECE_WIDTH, height: PIECE_HEIGHT, regX: PIECE_WIDTH/2, regY: PIECE_HEIGHT/2}, 
                        animations: {start:0,anim:[0,4]}
                   };
                   
        var oSpriteSheetBlack = new createjs.SpriteSheet(oData);
	_oTurnBlack = createSprite(oSpriteSheetBlack, "anim",PIECE_WIDTH/2,PIECE_HEIGHT/2,PIECE_WIDTH,PIECE_HEIGHT);
        _oTurnBlack.visible = false;
        _oTurnBlack.x = 420;
        _oTurnBlack.y = 70;
        _oTurnBlack.scaleX = _oTurnBlack.scaleY = 0.8;
        _oContainerTurn.addChild(_oTurnBlack);
        
        
        /////////////////////////////GUI/////////////////////////////
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	_pStartPosExit = {x:CANVAS_WIDTH-oSprite.width/2 - 10,y:  oSprite.height/2 + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x-s_iOffsetX,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
       _pStartPosRestart = {x:_pStartPosExit.x - oSprite.width - 10,y:_pStartPosExit.y};
       _oButRestart = new CGfxButton(_pStartPosRestart.x,_pStartPosRestart.y,s_oSpriteLibrary.getSprite("but_restart_small"),s_oStage);
       _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
       
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x:_pStartPosRestart.x- oSprite.width/2 - 10,y:_pStartPosRestart.y};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
            _pStartPosFullscreen = {x:_pStartPosExit.x- oSprite.width/2 - 10,y:_pStartPosExit.y};
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
            

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oTextHelp = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-240, CANVAS_HEIGHT/2 - 310, 480, 64, 
                    32, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_STATE0,
                    true, true, true,
                    false );
                    

        
        _oAreYouSurePanel = new CAreYouSurePanel();
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,this._onExitYes,this);
       
        this.refreshButtonPos();
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButRestart.unload();
        
        _oAreYouSurePanel.unload();
        
        if(DISABLE_SOUND_MOBILE === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
       
        s_oStage.removeAllChildren();
	s_oInterface = null;
    };
   
	
    this.refreshButtonPos = function(){

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }

        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
        _oButRestart.setPosition(_pStartPosRestart.x - s_iOffsetX,_pStartPosRestart.y + s_iOffsetY);
    };

    
    this.changeTurn = function(iTurn){
        if(iTurn === 0){
            _oTurnBlack.visible = false;
            _oTurnWhite.visible = true;
        }else{
            _oTurnBlack.visible = true;
            _oTurnWhite.visible = false;
        }
    };

   this.refreshTextHelp = function(szText){
       _oTextHelp.refreshText(szText);
   };
   
    this._onExit = function(){
        _oAreYouSurePanel.show(TEXT_ARE_SURE);
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
   
    this._onExitYes = function(){
        s_oGame.onExit();  
    };
    
    this._onRestart = function(){
        s_oGame.restart();
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;