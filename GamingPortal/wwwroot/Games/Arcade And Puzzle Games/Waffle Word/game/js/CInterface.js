function CInterface(){
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    
    var _aWordComposing;
    var _oButExit;
    var _oScoreText;
    var _oPointsText;
    var _oWordWrittenText;
    var _oWordWrittenScoreText;
    var _oTimeBar;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){
        
	_oScoreText = new createjs.Text(TEXT_SCORE,"30px "+FONT_GAME, "#000");
        _oScoreText.x = 1080;
        _oScoreText.y = 652; 
        _oScoreText.rotation = -6;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "alphabetic";
        s_oStage.addChild(_oScoreText);
        
        _oPointsText = new createjs.Text("0","60px "+FONT_GAME, "#000");
        _oPointsText.x = 1194;
        _oPointsText.y = 700; 
        _oPointsText.textAlign = "center";
        _oPointsText.textBaseline = "alphabetic";
        s_oStage.addChild(_oPointsText);

        _aWordComposing = new Array();
        var iX = 1023;
        for(var i=0;i<MAX_WORD_LENGTH;i++){
            var oText = new createjs.Text("","36px "+FONT_GAME, "#000");
            oText.x = iX;
            oText.y = 99; 
            oText.textAlign = "center";
            oText.textBaseline = "alphabetic";
            s_oStage.addChild(oText);
            
            iX += 41;
            
            _aWordComposing.push(oText);
        }
        
        _oWordWrittenText = new createjs.Text("","20px "+FONT_GAME, "#000");
        _oWordWrittenText.x = 1050;
        _oWordWrittenText.y = 200; 
        _oWordWrittenText.textAlign = "left";
        _oWordWrittenText.textBaseline = "alphabetic";
        _oWordWrittenText.lineHeight = 20;
        s_oStage.addChild(_oWordWrittenText);
        
        _oWordWrittenScoreText = new createjs.Text("","20px "+FONT_GAME, "#000");
        _oWordWrittenScoreText.x = 1200;
        _oWordWrittenScoreText.y = 200; 
        _oWordWrittenScoreText.textAlign = "left";
        _oWordWrittenScoreText.textBaseline = "alphabetic";
        _oWordWrittenScoreText.lineHeight = 20;
        s_oStage.addChild(_oWordWrittenScoreText);

        _oTimeBar = new CTimeBar(998,135);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.height/2) - 6,y:4 + (oSprite.height/2)};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);      
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio ={x:_pStartPosExit.x - (oSprite.width/2) - 10,y:_pStartPosExit.y};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x:_pStartPosAudio.x - oSprite.width/2 - 10,y:_pStartPosAudio.y};
        }else{
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x: _pStartPosExit.x - (oSprite.width/2)- 10, y: (oSprite.height/2) + 4};   
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
            

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,_pStartPosExit.y+iNewY);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,_pStartPosAudio.y+iNewY);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
    };

    this.refreshScore = function(iScore){
        _oPointsText.text = ""+iScore;
    };
    
    this.clearWordComposing = function(){
        for(var i=0;i<_aWordComposing.length;i++){
            _aWordComposing[i].text = "";
        }
    };
    
    this.setWordComposing = function(szText){
        for(var i=0;i<szText.length;i++){
            _aWordComposing[i].text = szText.charAt(i);
        }
    };
    
    this.displayAnswer = function(iScore){
        this.refreshScore(iScore);

        for(var i=0;i<MAX_WORD_LENGTH;i++){
            _aWordComposing[i].text="";
        }
    };
    
    this.refreshWordWritten = function(aWords){
        _oWordWrittenText.text="";
        _oWordWrittenScoreText.text="";

        var aTmp = new Array();


        var iNumSlice = (aWords.length - MAX_WORDS_WRITTEN_VIEWABLE);

        if(iNumSlice>0){
            aTmp = aWords.slice( iNumSlice,aWords.length);
        }else{
            aTmp=aWords;	
        }

        for(var i=0;i<aTmp.length;i++){
            _oWordWrittenText.text += aTmp[i].word +"\n";
            _oWordWrittenScoreText.text += "+"+aTmp[i].score+"\n";
        }
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
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
    
    this._onExit = function(){
        s_oGame.onExit();  
    };
    
    this.updateTime = function(iTime){
        _oTimeBar.refreshTime(iTime);
    };
    
    s_oInterface = this;
    this._init();
    
    return this;
}

var s_oInterface = null;