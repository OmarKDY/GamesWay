function CInterface(){
    var _bPlayingTimeAnim;
    var _szWordComposing;
    var _aButLetters;
    var _aCharCell;
    var _aCharText;
    var _aLetterPos;
    var _aCharSelected;
    
    var _oAudioToggle;
    var _oButExit;
    var _oButRestart;
    var _oButFullscreen;
    var _oButEnter;
    var _oButShuffle;
    var _oButClear;
    var _oTimeNum;
    var _oScoreText;
    var _oScoreAmountText;
    var _oRollingScore;
    var _oTimeTween = null;
   
    var _oEndPanel = null;
    var _oAreYouSurePanel;
    
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(){  
         _bPlayingTimeAnim = false;
        _szWordComposing = "";
        _aCharSelected = new Array();
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.width/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oSpriteFullscreen = s_oSpriteLibrary.getSprite('but_fullscreen');
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:_pStartPosExit.x - oSprite.width ,y:_pStartPosExit.y }
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,s_oSpriteLibrary.getSprite('audio_icon'),s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSpriteFullscreen.width/2,y:_pStartPosAudio.y};
        }else{
            _pStartPosFullscreen = {x:_pStartPosExit.x - oSprite.width ,y:_pStartPosExit.y }
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSpriteFullscreen,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        } 


        _oTimeNum = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-100, BOARD_Y - 58, 200, 50, 
                    50, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    "00:00",
                    true, true, false,
                    false );

        
        _oScoreText = new CTLText(s_oStage, 
                    BOARD_X, BOARD_Y - 58, 200, 50, 
                    50, "left", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE+": ",
                    true, true, false,
                    false );

        
        _oScoreAmountText = new createjs.Text(0,"50px "+PRIMARY_FONT, "#ffffff");
        _oScoreAmountText.x = _oScoreText.getX() + _oScoreText.getText().getBounds().width + 10;
        _oScoreAmountText.y = BOARD_Y - 18;
        _oScoreAmountText.textAlign = "left";
        _oScoreAmountText.textBaseline = "alphabetic";
        s_oStage.addChild(_oScoreAmountText);
        
        _oRollingScore = new CRollingScore();
        
        var oSpriteLetter = s_oSpriteLibrary.getSprite("but_letter");
        var oSpriteCell = s_oSpriteLibrary.getSprite("cell_bg");
        var iOffsetX = oSpriteLetter.width;
        var iX = CANVAS_WIDTH/2 - iOffsetX*2 - oSpriteLetter.width/2;
        _aButLetters = new Array();
        _aCharCell = new Array();
        _aCharText = new Array();
        _aLetterPos = new Array();
        for(var i=0;i<WORD_LENGTH;i++){
            var oBut = new CTextButton(iX,580,oSpriteLetter,"",PRIMARY_FONT,"#015ca3",58,"center",0,s_oStage);
            oBut.addEventListenerWithParams(ON_MOUSE_UP,this._onLetterSelected,this,i);
            
            _aButLetters[i]=oBut;
            
            var oCell = createBitmap(oSpriteCell);
            oCell.regX = oSpriteCell.width/2;
            oCell.regY = oSpriteCell.height/2;
            oCell.x = iX;
            oCell.y = oBut.getY() - oSpriteCell.height/2 - oSpriteLetter.height/2;
            s_oStage.addChild(oCell);
            
            var oText = new createjs.Text("","58px "+PRIMARY_FONT, "#fff");
            oText.textAlign = "center";
            oText.textBaseline = "middle"; 
            oText.x = oCell.x;
            oText.y = oCell.y;
            s_oStage.addChild(oText);
            
            _aCharText[i] = oText;
            _aLetterPos[i] = {x:oBut.getX(),y:oBut.getY()};
            
            iX += iOffsetX;
        }
         
        _oButEnter = new CGfxButton(1170,_aButLetters[_aButLetters.length-1].getY() + 135,s_oSpriteLibrary.getSprite("but_enter"),s_oStage);
        _oButEnter.addEventListener(ON_MOUSE_UP,this._onEnterWord,this);
        
        var oSprite = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(_aButLetters[0].getX(),_oButEnter.getY(),oSprite,s_oStage);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestartRelease, this);
        
        oSprite =s_oSpriteLibrary.getSprite("but_shuffle");
        _oButShuffle = new CGfxButton(_aButLetters[1].getX(),_oButEnter.getY(),oSprite,s_oStage);
        _oButShuffle.addEventListener(ON_MOUSE_UP,this._onShuffle,this);
        
        _oButClear = new CGfxButton(_aButLetters[2].getX(),_oButEnter.getY(),s_oSpriteLibrary.getSprite("but_clear"),s_oStage);
        _oButClear.addEventListener(ON_MOUSE_UP,this._onClear,this);
        
        _oEndPanel = new CEndPanel();
        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
        
        this.blockControls(false);
        
        this.refreshButtonPos();
        

    };
    
    this.unload = function(){
        stopSound("countdown");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        _oEndPanel.unload();
        _oButExit.unload();
        _oButRestart.unload();
        
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(){
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,s_iOffsetY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }   
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
    };
    
    this.reset = function(){
        _oTimeNum.setColor("#fff");
        _oTimeTween = null;
        _bPlayingTimeAnim = false;
        _szWordComposing = "";
        for(var i=0;i<_aCharText.length;i++){
            _aCharText[i].text = "";
            _aButLetters[i].changeText("");
            _aButLetters[i].enable();
            _aButLetters[i].setVisible(true);
        }
        this.blockControls(false);
    };
    
    this.blockControls = function(bBlock){
        if(bBlock){
            for(var i=0;i<_aButLetters.length;i++){
                _aButLetters[i].disable();
            }
            
            _oButEnter.disable();
            _oButRestart.disable();
            _oButShuffle.disable();
            _oButClear.disable();
            
            if(!s_bMobile) {
                //KEY LISTENER
                document.onkeydown   = null; 
            }
        }else{
            for(var i=0;i<_aButLetters.length;i++){
                _aButLetters[i].enable();
                _aButLetters[i].setVisible(true);
            }
            
            _oButEnter.enable();
            _oButRestart.enable();
            _oButShuffle.enable();
            _oButClear.enable();
            
            if(!s_bMobile) {
                //KEY LISTENER
                document.onkeydown   = onKeyDown; 
            }
        }
    };
    
    function onKeyDown(evt) { 
        if(!evt){ 
            evt = window.event; 
        } 

        if(evt.keyCode > 64 && evt.keyCode < 91){
            var szChar = (String.fromCharCode(evt.keyCode)).toLowerCase();
            for(var i=0;i<_aButLetters.length;i++){
                if(_aButLetters[i].isDisabled() === false && _aButLetters[i].getText().toLowerCase() === szChar){
                    s_oInterface._onLetterSelected(i);
                    return false;
                }

            }
        }else if(evt.keyCode === 13 && _oButEnter.isDisabled() === false){
            //KEY ENTER
            s_oInterface._onEnterWord();
        }else if(evt.keyCode === 8 && _oButClear.isDisabled() === false){
            s_oInterface._onClear();
        }else if(evt.keyCode === 32 && _oButShuffle.isDisabled() === false){
            s_oInterface._onShuffle();
        }else if(evt.keyCode === 49){
            //RESTART
            s_oInterface._onRestartRelease();
        }else if(evt.keyCode === 50){
            //SHUFFLE
            s_oInterface._onShuffle();
        }else if(evt.keyCode === 51){
            //CANCEL
            s_oInterface._onClear();
        }

        evt.preventDefault();
        return false;
    }
    
    this.setAvailableLetters = function(aWords){
        for(var i=0;i<_aButLetters.length;i++){
            _aButLetters[i].changeText(aWords[i].toUpperCase());
        }
    };
    
    this.refreshTime = function(iTimeElaps,bPlayAnim){
        _oTimeNum.refreshText(formatTime(iTimeElaps));
        
         //CHECK IF PLAY COUNTDOWN ANIMATION
        if(iTimeElaps < 10000 && !_bPlayingTimeAnim){
            _bPlayingTimeAnim = true;
            _oTimeNum.setColor("#d60000");
            _oTimeTween = createjs.Tween.get(_oTimeNum.getText(),{loop:true}).to({scaleX: 1.2,scaleY:1.2}, 500,createjs.Ease.cubicOut).to({scaleX: 1,scaleY:1}, 500,createjs.Ease.cubicOut);
            
            playSound("countdown",1,true);
        }
    };
    
    this.stopTime = function(){
        stopSound("countdown");
        createjs.Tween.removeTweens(_oTimeNum.getText());
        _oTimeNum.setScale(1);
    };
    
    this.wordGuessed = function(iScore){
        this.refreshScore(iScore);
        for(var i=0;i<_aCharSelected.length;i++){
            _aCharSelected[i].scale(1.15);
        }
    };
    
    this.setScore = function(iScore){
        _oScoreAmountText.text = iScore;
    };
    
    this.refreshScore = function(iScore){
        _oRollingScore.rolling(_oScoreAmountText, null,iScore);
    };
    
    this.restoreLetters = function(){
        for(var i=0;i<_aButLetters.length;i++){
            _aButLetters[i].enable();
            _aButLetters[i].setVisible(true);
            _aCharText[i].text = "";
        }
        
        _szWordComposing = "";
        _aCharSelected = new Array();
    };
    
    this.playWrongWordAnim = function(){
        for(var i=0;i<_aCharSelected.length;i++){
            _aCharSelected[i].tremble();
        }
    };
            
    this.gameOver = function(iScore){
        this.blockControls(true);
        
        //SHOW GAME OVER PANEL
        setTimeout(function(){_oEndPanel.show(iScore);},3000);
    };

    this._onEnterWord = function(){
        if(_szWordComposing.length > 2){
            s_oGame.verifyWord(_szWordComposing.toLowerCase());
        }else{
            //CLEAR WORD
            this.restoreLetters();
        } 
    };
    
    this._onShuffle = function(){
        s_oInterface._onClear();
        s_oInterface.blockControls(true);
        _aLetterPos = shuffle(_aLetterPos);
        
        for(var i=0;i<_aButLetters.length;i++){
            _aButLetters[i].moveTo(_aLetterPos[i],1000);
        }
        
        playSound("shuffle",1,false);
        
        setTimeout(function(){s_oInterface.blockControls(false);},1000);
    };
    
    this._onClear = function(){
        this.restoreLetters();
    };
           
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){

        if(_oTimeTween !== null){
            stopSound("countdown");
            _oTimeTween.setPaused(true);
        }
        
        s_oGame.setUpdate(false);
        
        _oAreYouSurePanel.show(TEXT_ARE_YOU_SURE_EXIT);
        _oAreYouSurePanel.addEventListener(ON_RELEASE_YES,this._onExitYes);
        _oAreYouSurePanel.addEventListener(ON_RELEASE_NO,this._onExitNo);
    };
    
    this._onLetterSelected = function(iIndex){
        playSound("press_letter",1,false);
        
        _aButLetters[iIndex].setVisible(false);
        var szChar = _aButLetters[iIndex].getText();

        _aCharText[_szWordComposing.length].text = szChar;
        
        _szWordComposing += szChar.toLowerCase();
        
        _aCharSelected.push(_aButLetters[iIndex]);
    };
    
    this._onExitYes = function(){
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
        s_oGame.onExit();
    };
    
    this._onExitNo = function(){
        
        if(_oTimeTween !== null){
            playSound("countdown");
            _oTimeTween.setPaused(false);
        }
        s_oGame.setUpdate(true);
    };
    
    this._onRestartYes = function(){
        _oAreYouSurePanel.hide();
        s_oGame.restart();
    };
    
    this._onRestartNo = function(){
        if(_oTimeTween !== null){
            playSound("countdown");
            _oTimeTween.setPaused(false);
        }
        
        s_oGame.setUpdate(true);
    };
    
    this._onRestartRelease = function(){
        if(_oTimeTween !== null){
            stopSound("countdown");
            _oTimeTween.setPaused(true);
        }
        
        s_oGame.setUpdate(false);
        _oAreYouSurePanel.show(TEXT_ARE_YOU_SURE_RESTART);
        _oAreYouSurePanel.addEventListener(ON_RELEASE_YES,this._onRestartYes);
        _oAreYouSurePanel.addEventListener(ON_RELEASE_NO,this._onRestartNo);
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

    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;