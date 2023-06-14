function CInterface(iLevel, iMoves, iMaxMoves){
    var _oAudioToggle;
    var _oButExit;
    var _oButRestart;
    var _oTextLevelStroke;
    var _oTextLevel;
    var _oTextMovesStroke;
    var _oTextMoves;
    
    var _oHelpPanel=null;
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosRestart;
    var _pStartPosTextLevel;
    var _pStartPosTextMoves;
    this._init = function(iLevel, iMoves, iMaxMoves){                
        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2) - 5, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2)- 72;
        
        _pStartPosRestart = {x: oExitX, y: (oSprite.height/2) + 10};
        
        var oSprite = s_oSpriteLibrary.getSprite('but_restart');
        _oButRestart = new CGfxButton(_pStartPosRestart.x, _pStartPosRestart.y, oSprite, s_oStage);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        
        _pStartPosAudio = {x: _pStartPosRestart.x-65, y: (oSprite.height/2) + 10};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        _pStartPosTextLevel = {x: 20, y: 40};
        
        var iSize = 50;        
        var iWidth = 300;
        var iHeight = 50;
        var iX = _pStartPosTextLevel.x;
        var iY = _pStartPosTextLevel.y;
        var szText = sprintf(TEXT_LEVEL, iLevel+1);
        _oTextLevelStroke = new CTLText(s_oStage, 
                    iX, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "left", "#730358", FONT, 1.1,
                    2, 2,
                    szText,
                    true, true, false,
                    false );
        _oTextLevelStroke.setOutline(4);            
       
        _oTextLevel = new CTLText(s_oStage, 
                    iX, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "left", "#fff", FONT, 1.1,
                    2, 2,
                    szText,
                    true, true, false,
                    false ); 
       
        _pStartPosTextMoves = {x: CANVAS_WIDTH-20, y: CANVAS_HEIGHT-40};

        var iSize = 50;        
        var iWidth = 300;
        var iHeight = 50;
        var iX = _pStartPosTextMoves.x;
        var iY = _pStartPosTextMoves.y;
        var szText = sprintf(TEXT_MOVES, iMoves, iMaxMoves);
        _oTextMovesStroke = new CTLText(s_oStage, 
                    iX-iWidth, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "right", "#730358", FONT, 1.1,
                    2, 2,
                    szText,
                    true, true, false,
                    false );
        _oTextMovesStroke.setOutline(4);            
       
        _oTextMoves = new CTLText(s_oStage, 
                    iX-iWidth, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "right", "#fff", FONT, 1.1,
                    2, 2,
                    szText,
                    true, true, false,
                    false ); 
       
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        _oButExit.unload();
        
        if(_oHelpPanel!==null){
            _oHelpPanel.unload();
        }
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        _oButRestart.setPosition(_pStartPosRestart.x - iNewX,iNewY + _pStartPosRestart.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }        
        
        _oTextLevel.setX( _pStartPosTextLevel.x+iNewX );
        _oTextLevelStroke.setX( _pStartPosTextLevel.x+iNewX );
        _oTextLevel.setY( _pStartPosTextLevel.y+iNewY );
        _oTextLevelStroke.setY( _pStartPosTextLevel.y+iNewY );
        
        _oTextMoves.setX( _pStartPosTextMoves.x-iNewX );
        _oTextMovesStroke.setX( _pStartPosTextMoves.x-iNewX );
        _oTextMoves.setY( _pStartPosTextMoves.y-iNewY );
        _oTextMovesStroke.setY( _pStartPosTextMoves.y-iNewY );
        
        s_oGame.refreshGridScale();
        
    };
    
    this.refreshScore = function(iMoves){
        var szText = sprintf(TEXT_MOVES, iMoves, iMaxMoves);
        _oTextMoves.refreshText( szText );
        _oTextMovesStroke.refreshText( szText );
        
        _oTextMoves.setX( _pStartPosTextMoves.x-s_iOffsetX );
        _oTextMovesStroke.setX( _pStartPosTextMoves.x-s_iOffsetX );
        _oTextMoves.setY( _pStartPosTextMoves.y-s_iOffsetY );
        _oTextMovesStroke.setY( _pStartPosTextMoves.y-s_iOffsetY );
    };
    
    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
        if(s_bMobile && !s_bIsIphone){
            s_oStage.update();
        }
    };
    
    this._onExit = function(){
        s_oGame.onExit();  
      
        $(s_oMain).trigger("end_level");
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };
    
    this._onRestart = function(){
        s_oGame.onRestart();  
    };
    
    s_oInterface = this;
    
    this._init(iLevel, iMoves, iMaxMoves);
    
    return this;
}

var s_oInterface = null;