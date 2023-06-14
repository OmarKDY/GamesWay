function CInterface(iGoal, iLevel, iScore){
    var _oAudioToggle;
    var _oButExit;
    var _oButRestart;
    var _oButFullscreen;
    var _oAreYouSurePanel;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _oHelpPanel=null;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosRestart;
    var _pStartPosFullscreen;
    
    var _oMovesText;
    var _oMovesTextStroke;
    var _oMovesPos          = {x: CANVAS_WIDTH/2+340, y: 460};
    var _oScoreText;
    var _oScoreTextStroke;
    var _oScorePos          = {x: CANVAS_WIDTH/2, y: 460};
    
    var _oLevelTextStroke;
    var _oLevelText;
    var _oLevelPos          = {x: CANVAS_WIDTH/2-350, y: 460};
    
    this._init = function(iGoal, iLevel, iScore){                
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2) - 10, y: (oSprite.height/2) + 16};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_restart');
        _pStartPosRestart = {x: _pStartPosExit.x-(oSprite.width) - 10 , y: (oSprite.height/2) + 16};
        _oButRestart = new CGfxButton(_pStartPosRestart.x, _pStartPosRestart.y, oSprite, s_oStage);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosRestart.x - oSprite.width/2 - 10 , y: (oSprite.height/2) + 16};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);     
            
            _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:oSprite.height/2 + 16};
        }else{
            _pStartPosFullscreen = {x: _pStartPosRestart.x - oSprite.width/2 - 10, y: (oSprite.height/2) + 16};
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
               
        
        var oSprite = s_oSpriteLibrary.getSprite('level_display');
        var oLevelPanel = createBitmap(oSprite);
        oLevelPanel.x = 500;
        oLevelPanel.y = 420;
        s_oStage.addChild(oLevelPanel);
        
        var oSprite = s_oSpriteLibrary.getSprite('score_display');
        var oScorePanel = createBitmap(oSprite);
        oScorePanel.regX = oSprite.width/2;
        oScorePanel.x = CANVAS_WIDTH/2;
        oScorePanel.y = oLevelPanel.y;
        s_oStage.addChild(oScorePanel);
        
        var oSprite = s_oSpriteLibrary.getSprite('moves_display');
        var oMovesPanel = createBitmap(oSprite);
        oMovesPanel.x = 1190;
        oMovesPanel.y = oLevelPanel.y;
        s_oStage.addChild(oMovesPanel);

        _oMovesTextStroke = new CTLText(s_oStage, 
                    _oMovesPos.x-90, _oMovesPos.y-24, 180, 28, 
                    28, "center", "#0075b8", FONT, 1,
                    0, 0,
                    TEXT_MOVES+": 0/"+iGoal,
                    true, true, false,
                    false );
        _oMovesTextStroke.setOutline(4);           


        _oMovesText = new CTLText(s_oStage, 
                    _oMovesPos.x-90, _oMovesPos.y-24, 180, 28, 
                    28, "center", "#fff", FONT, 1,
                    0, 0,
                    TEXT_MOVES+": 0/"+iGoal,
                    true, true, false,
                    false );
        
        _oScoreTextStroke = new CTLText(s_oStage, 
                    _oScorePos.x-180, _oScorePos.y-24, 360, 30, 
                    30, "center", "#0075b8", FONT, 1,
                    0, 0,
                    TEXT_SCORE+": "+iScore,
                    true, true, false,
                    false );
                    
        _oScoreTextStroke.setOutline(4);

        _oScoreText = new CTLText(s_oStage, 
                     _oScorePos.x-180, _oScorePos.y-24, 360, 30, 
                    30, "center", "#fff", FONT, 1,
                    0, 0,
                    TEXT_SCORE+": "+iScore,
                    true, true, false,
                    false );
        
        
        
        _oLevelTextStroke = new CTLText(s_oStage, 
                    _oLevelPos.x-90, _oLevelPos.y-24, 180, 28, 
                    28, "center", "#0075b8", FONT, 1,
                    0, 0,
                   TEXT_LEVEL+": "+iLevel,
                    true, true, false,
                    false );
        _oLevelTextStroke.setOutline(4);
        

        _oLevelText = new CTLText(s_oStage, 
                    _oLevelPos.x-90, _oLevelPos.y-24, 180, 28, 
                    28, "center", "#fff", FONT, 1,
                    0, 0,
                   TEXT_LEVEL+": "+iLevel,
                    true, true, false,
                    false );
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
        _oAreYouSurePanel = new CAreYouSurePanel(this._onConfirmExit);
    };
    
    this.refreshMoves = function(iMoves, iGoal){
        _oMovesTextStroke.refreshText(TEXT_MOVES+": "+iMoves+"/"+iGoal);
        _oMovesText.refreshText(TEXT_MOVES+": "+iMoves+"/"+iGoal);
    };
    
    this.refreshScore = function(iScore){
        _oScoreTextStroke.refreshText(TEXT_SCORE+": "+iScore);
        _oScoreText.refreshText(TEXT_SCORE+": "+iScore);
    }
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        
        _oButExit.unload();
        _oButRestart.unload();
        
        if(_oHelpPanel!==null){
            _oHelpPanel.unload();
        }
        
        _oAreYouSurePanel.unload();
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }   
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
        
        _oButRestart.setPosition(_pStartPosRestart.x - iNewX,iNewY + _pStartPosRestart.y);

      
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        _oAreYouSurePanel.show();
    };
    
    this._onConfirmExit = function(){
        s_oGame.onExit();  
    };
    
    this._onRestart = function(){
        s_oGame.onRestart();  
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
    
    this._init(iGoal, iLevel, iScore);
    
    return this;
}

var s_oInterface = null;