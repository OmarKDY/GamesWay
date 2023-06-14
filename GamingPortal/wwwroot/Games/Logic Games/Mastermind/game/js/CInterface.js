function CInterface(iBestScore) {
    var _oAudioToggle;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosRestart;
    var _pStartPosFullscreen;
    var _oScoreText;
    var _iBestScore;
    var _oBestScoreText;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oButExit;
    var _oHitArea;
    var _oEndPanel;
    var _oInfoBut;
    var _oButRestart;
    var _pStartInfoBut;
    var _oAttemptsText;
    
    this._init = function (iBestScore) {
        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');

        _iBestScore = iBestScore;
        _pStartPosExit = {x: CANVAS_WIDTH - oSpriteExit.width/2 - 10, y: (oSpriteExit.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("red").drawRect(0, 10, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        s_oStage.addChild(_oHitArea);
        

        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            
            _pStartPosAudio = {x: _pStartPosExit.x - oSpriteExit.width/2 - oSprite.width/4 - 10, y: _pStartPosExit.y};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosFullscreen = {x: oSprite.width/4  + 10,y:_pStartPosAudio.y};
        }else{
            var oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosAudio = {x: _pStartPosExit.x, y: _pStartPosExit.y};
            _pStartPosFullscreen = {x: oSprite.width/4  + 10,y:_pStartPosAudio.y};
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
        
        oSprite = s_oSpriteLibrary.getSprite("but_help");
        _pStartInfoBut = {x:_pStartPosAudio.x-(oSprite.width*2)-20,y:oSprite.height/2+10}
        _oInfoBut = new CGfxButton(_pStartInfoBut.x,_pStartInfoBut.y,oSprite,s_oStage);
        _oInfoBut.addEventListener(ON_MOUSE_UP, this._onButInfo,this);
        
        
        _oScoreText = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-300, 130, 200, 32, 
                    32, "left", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE +": 0",
                    true, true, false,
                    false);
                    

        
        _oBestScoreText = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2+50, 130, 250, 32, 
                    32, "left", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_BEST + ": "+iBestScore,
                    true, true, false,
                    false);
                    

        
        
         _oAttemptsText = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-125, CANVAS_HEIGHT/2+270, 250, 32, 
                    32, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_ATTEMPTS+"0",
                    true, true, false,
                    false);
                    

        
        
        oSprite = s_oSpriteLibrary.getSprite("but_restart_small");
        _oButRestart = new CGfxButton(_pStartInfoBut.x + oSprite.width +10, _pStartInfoBut.y, oSprite,s_oStage);
        _oButRestart.addEventListener(ON_MOUSE_UP,this.onRestart,this);
        
        
        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, _pStartPosAudio.y + iNewY);
        }
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
        _oScoreText.setY(140 + iNewY);
        _oBestScoreText.setY(140+ iNewY);

        _oButExit.setPosition(_pStartPosExit.x - iNewX, _pStartPosExit.y + iNewY);
        _oInfoBut.setPosition(_oInfoBut.getX()-iNewX, _pStartPosExit.y+iNewY);
        _oButRestart.setPosition(_oButRestart.getX()-iNewX, _pStartPosExit.y+iNewY);
        
    };

   this.refreshScore = function(iScore){
            _oScoreText.refreshText(TEXT_SCORE+": "+iScore);
            _oScoreText.setY(140 + s_iOffsetY);
    };
    
    this.refreshAttempts = function(iAttempts){
        _oAttemptsText.refreshText(TEXT_ATTEMPTS+iAttempts);
    };
    
    this.unload = function () {
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }

        _oButExit.unload();
        s_oInterface = null;
    };
    
    
    this._onExit = function () {
        //this.unload();
        //s_oMain.gotoMenu();
        new CAreYouSurePanel();
    };

    this.onRestart = function(){
        var shape = new createjs.Shape();
        var oParent = this;
        shape.graphics.beginFill("#000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0;
        s_oStage.addChild(shape);
        new createjs.Tween.get(shape).to({alpha: 1},250).wait(200).call(function(){s_oGame.restartGame(); s_oStage.addChildAt(shape,s_oStage.numChildren); new createjs.Tween.get(shape).to({alpha: 0},250);});
    };

    this._onButInfo = function(){
       new CPanelTutorial(); 
    };

    this.setVisibleButInfo = function(bVal){
       _oInfoBut.setVisible(bVal); 
    };

    this.gameOver = function ()
    {
      _oEndPanel.show();  
    };
    this._onAudioToggle = function () {
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

    this._init(iBestScore);

    return this;
}

var s_oInterface = null;