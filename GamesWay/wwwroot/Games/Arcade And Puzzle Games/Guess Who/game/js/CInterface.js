function CInterface(){
    var _iCurQuestion;
    var _iQuestionIndex;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosFullscreen;
    var _oButExit;
    var _oScoreText;
    var _oPointsText;
    var _oQuestionAnim;
    var _oLeftBut;
    var _oRightBut;
    var _oOkBut;
    var _oPlayerCharacterToGuess = null;
    var _oCpuCharacterToGuess = null;
    var _oPlayerNameToGuess;
    var _oCpuNameToGuess;
    var _oMsgBox;
    var _oCpuPanel;
    var _oEncouragment;
    var _oBlinkQuestion;
    var _oAudioToggle;
    var _oButFullscreen;
    var _oAreYouSurePanel;
    var _oGUIExpandible;
    
    this._init = function(){
        _iCurQuestion = 0;
        _iQuestionIndex = 0;
        
        
        var iWidth = 110;
        var iHeight = 60;
        _oScoreText = new CTLText(s_oStage, 
                    1150 -iWidth/2, 152 - iHeight/2, iWidth, iHeight, 
                    50, "center", "#FF6699", FONT_GAME, 1,
                    2, 2,
                    TEXT_SCORE,
                    true, true, true,
                    false );

        _oPointsText = new createjs.Text("0","54px "+FONT_GAME, "#FFCC00");
        _oPointsText.x = 1218;
        _oPointsText.y = 166; 
        _oPointsText.textAlign = "left";
        _oPointsText.textBaseline = "alphabetic";
        s_oStage.addChild(_oPointsText);
        
        _oQuestionAnim = new CQuestionAnim(628,CANVAS_HEIGHT- 58,s_oGuessSettings.getQuestion(0).question,s_oGuessSettings.getQuestion(1).question);
        
        _oLeftBut = new CGfxSpriteButton(322,CANVAS_HEIGHT-40,s_oSpriteLibrary.getSprite('left_but'));
        _oLeftBut.addEventListener(ON_MOUSE_UP, this._onLeftRelease, this);
        
        _oRightBut = new CGfxSpriteButton(938,CANVAS_HEIGHT-40,s_oSpriteLibrary.getSprite('right_but'));
        _oRightBut.addEventListener(ON_MOUSE_UP, this._onRightRelease, this);
        
        _oOkBut = new CGfxSpriteButton(1026,CANVAS_HEIGHT-40,s_oSpriteLibrary.getSprite('but_ok'));
        _oOkBut.addEventListener(ON_MOUSE_UP, this._onOkRelease, this);

        _oPlayerCharacterToGuess = new createjs.Container();
        _oPlayerCharacterToGuess.x = 1092;
        _oPlayerCharacterToGuess.y = 184;
        s_oStage.addChild(_oPlayerCharacterToGuess);
        
        _oCpuCharacterToGuess = new createjs.Container();
        _oCpuCharacterToGuess.x = 1096;
        _oCpuCharacterToGuess.y = 426;
        s_oStage.addChild(_oCpuCharacterToGuess);
       
        var iWidth = 150;
        var iHeight = 40;
        _oPlayerNameToGuess = new CTLText(s_oStage, 
                    _oPlayerCharacterToGuess.x + 80 -iWidth/2, _oPlayerCharacterToGuess.y + 178 - iHeight/2, iWidth, iHeight, 
                    37, "center", "#fff", FONT_GAME, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
        
        _oCpuNameToGuess = new createjs.Text("","37px "+FONT_GAME, "#fff");
        _oCpuNameToGuess.x = _oCpuCharacterToGuess.x + 76;
        _oCpuNameToGuess.y = _oCpuCharacterToGuess.y + 180;
        _oCpuNameToGuess.textAlign = "center";
        _oCpuNameToGuess.textBaseline = "alphabetic";
         s_oStage.addChild(_oCpuNameToGuess);
        
        var oPlayerIcon = createBitmap(s_oSpriteLibrary.getSprite('player_icon'));
        oPlayerIcon.x = 1073;
        oPlayerIcon.y = 168;
        s_oStage.addChild(oPlayerIcon);
        
        var oCpuIcon = createBitmap(s_oSpriteLibrary.getSprite('cpu_icon'));
        oCpuIcon.x = 1073;
        oCpuIcon.y = 402;
        s_oStage.addChild(oCpuIcon);
        
        
        var oSprite = s_oSpriteLibrary.getSprite('blink_question');
        var oData = {   
                        framerate:3,
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width, height: oSprite.height/2}, 
                        animations: {  idle: [0],blink: [0,1]}
                   };
        
        var oObjSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oBlinkQuestion = createSprite(oObjSpriteSheet, "idle",0,0,oSprite.width,oSprite.height/2);
        _oBlinkQuestion.x = 362;
        _oBlinkQuestion.y = 694;
        s_oStage.addChild(_oBlinkQuestion);
        
        _oEncouragment = new CEncouragement(292,-200);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) - 10,y:(oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        var oExitX = _pStartPosExit.x;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:_oButExit.getX() - oSprite.width - 10,y:(oSprite.height/2) + 10};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,s_oSpriteLibrary.getSprite('audio_icon'), s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            oExitX = _pStartPosAudio.x;
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:oExitX - oSprite.width/2 - 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_config');
        _oGUIExpandible = new CGUIExpandible(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oGUIExpandible.addButton(_oButExit);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oGUIExpandible.addButton(_oAudioToggle);
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oGUIExpandible.addButton(_oButFullscreen);
        }
        
        _oCpuPanel = new CCpuPanel();
        
        _oMsgBox = new CMsgBox();
        _oMsgBox.show(TEXT_CHOOSE_CHARACTER);
        
        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN, this._onConfirmExit, this);
        
        this.disableQuestionGUI();
        
        this.refreshButtonPos (s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        _oGUIExpandible.unload();
        
        _oButExit.unload();
        _oButExit = null;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.enabled){
                _oButFullscreen.unload();
        }
        _oAreYouSurePanel.unload();
        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oGUIExpandible.refreshPos();
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

    this.refreshScore = function(iScore){
        _oPointsText.text = ""+iScore;
    };
    
    this.disableQuestionGUI = function(){
        _oLeftBut.disable();
        _oRightBut.disable();
        _oOkBut.disable();
    };
    
    this.enableQuestionGUI = function(){
        _oLeftBut.enable();
        _oRightBut.enable();
        _oOkBut.enable();
        _oQuestionAnim.showQuestion(s_oGame.getPlayerQuestions(0).question);
        
        this.blinkQuestion(true);
    };
    
    this.blinkQuestion = function(bBlink){
        if(bBlink){
            _oBlinkQuestion.gotoAndPlay("blink");
        }else{
            _oBlinkQuestion.gotoAndStop("idle");
        }
        
    };
    
    this.setCharacters = function(iPlayer){
        if(_oPlayerCharacterToGuess.numChildren >0){
            _oPlayerCharacterToGuess.removeAllChildren();
            _oPlayerNameToGuess.refreshText( "" );
        }
        
        if(_oCpuCharacterToGuess.numChildren >0){
            _oCpuCharacterToGuess.removeAllChildren();
            _oCpuNameToGuess.text = "";
        }

        var oBmp = createBitmap(s_oSpriteLibrary.getSprite('character_'+iPlayer));
        oBmp.scaleX = oBmp.scaleY = 1.2;
        _oPlayerCharacterToGuess.addChild(oBmp);
        
        _oPlayerNameToGuess.refreshText( s_oGuessSettings.getCharacterName(iPlayer) );
        
        oBmp = createBitmap(s_oSpriteLibrary.getSprite('character_hidden'));
        _oCpuCharacterToGuess.addChild(oBmp);
        
        _oCpuNameToGuess.text = "?????";
    };
    
    this.showMsgBox = function(szText){
        _oMsgBox.show(szText);
    };
    
    this.showCpuPanel = function(szText){
        _oCpuPanel.show(szText);
    };
    
    this.hideCpuPanel = function(){
        _oCpuPanel.hide();
    };
    
    this.showWrongReply = function(){
        _oCpuPanel.showWrongReply();
    };
    
    this.showEncouragement = function(szText){
        _oEncouragment.show(szText);
    };
    
    this._onRightRelease = function(){
        if(!_oQuestionAnim.isAvailable()){
            return;
        }
        
        this.blinkQuestion(false);
        if(_iCurQuestion === (s_oGame.getNumPlayerQuestions()-1)){
            _oQuestionAnim.moveLeft(s_oGame.getPlayerQuestions(_iCurQuestion).question,s_oGame.getPlayerQuestions(0).question);
        
            _iQuestionIndex = s_oGame.getPlayerQuestions(0).index;
            _iCurQuestion = 0;
        }else{
            _oQuestionAnim.moveLeft(s_oGame.getPlayerQuestions(_iCurQuestion).question,s_oGame.getPlayerQuestions(_iCurQuestion+1).question);
        
            _iQuestionIndex = s_oGame.getPlayerQuestions(_iCurQuestion+1).index;
            _iCurQuestion++; 
        }
    };
    
    this._onLeftRelease = function(){
        if(!_oQuestionAnim.isAvailable()){
            return;
        }
        
        this.blinkQuestion(false);
        if(_iCurQuestion === 0){
             _oQuestionAnim.moveRight(s_oGame.getPlayerQuestions(s_oGame.getNumPlayerQuestions()-1).question,s_oGame.getPlayerQuestions(_iCurQuestion).question);
        
            _iQuestionIndex = s_oGame.getPlayerQuestions(s_oGame.getNumPlayerQuestions()-1).index;
            _iCurQuestion = s_oGame.getNumPlayerQuestions()-1;
        }else{
            _oQuestionAnim.moveRight(s_oGame.getPlayerQuestions(_iCurQuestion-1).question,s_oGame.getPlayerQuestions(_iCurQuestion).question);
        
            _iQuestionIndex = s_oGame.getPlayerQuestions(_iCurQuestion-1).index;
            _iCurQuestion--;
        }
    };
    
    this._onOkRelease = function(){
        this.blinkQuestion(false);
        this.disableQuestionGUI();
        
        _oQuestionAnim.hideQuestion();
        
        s_oGame.playerAskQuestion(_iCurQuestion,_iQuestionIndex);
        
        _iCurQuestion = 0;
        _iQuestionIndex = s_oGame.getPlayerQuestions(_iCurQuestion).index;;
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        _oAreYouSurePanel.show(TEXT_ARE_SURE, 64);
    };
    
    this._onConfirmExit = function(){
        s_oGame.onExit();
    };
    
    s_oInterface = this;
     
    this._init();
    
    return this;
}

var s_oInterface = null;