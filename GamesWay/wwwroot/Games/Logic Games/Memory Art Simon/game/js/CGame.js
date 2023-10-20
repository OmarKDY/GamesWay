function CGame(oData){
    var _bButtonLight;
    var _iSeqEndIndex;
    var _iLightTime;
    var _iDarkenTime;
    var _iCurIndexLighting;
    var _iCurIndexToGuess;
    var _iCurSequence;
    var _iMaxSequence;
    var _iLivesText;
    var _iLivesBackText;
    var _iCurState;
    var _iLives;
    var _aSequence;
    var _aButtons;
    var _oLifeSprites;
    var _oEndPanel;
    var _oIconRight;
    var _oHurt;
    var _oHelpBg;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosLife;
    var _pStartPosTextMaxSeq;
    var _pStartPosTextCurSeq;
    
    
    var _oBg;
    var _oButExit;  
    var _oAudioToggle;
    
    var _oMsgTextAhead;
    var _oMaxSeqText;
    var _oCurSeqText;
    var _oRectBg;
    var _oRectBg2;

    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);
        
	_oRectBg = new createjs.Shape();
        _oRectBg.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0,0,CANVAS_WIDTH,124);
        s_oStage.addChild(_oRectBg);
		
	_oRectBg2 = new createjs.Shape();
        _oRectBg2.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0,CANVAS_HEIGHT - 50,CANVAS_WIDTH,50);
        s_oStage.addChild(_oRectBg2);
		
        _oMsgTextAhead = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-300, 930, 600, 68, 
                    34, "center", "#fff", GAME_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
        _oMsgTextAhead.setShadow("#000",2,2,2);            
        
        _pStartPosTextMaxSeq = {x:CANVAS_WIDTH-9,y:CANVAS_HEIGHT-22};
 
        _oMaxSeqText = new CTLText(s_oStage, 
                    _pStartPosTextMaxSeq.x, _pStartPosTextMaxSeq.y, 400, 24, 
                    24, "right", "#fff", GAME_FONT, 1,
                    0, 0,
                    TEXT_MAX_SEQ+": 0",
                    true, true, false,
                    false );
        _oMaxSeqText.setShadow("#000",2,2,2);           
        
        _pStartPosTextCurSeq = {x:10,y:CANVAS_HEIGHT-22};

		
        _oCurSeqText = new CTLText(s_oStage, 
                    _pStartPosTextCurSeq.x, _pStartPosTextCurSeq.y, 400, 24, 
                    24, "left", "#fff", GAME_FONT, 1,
                    0, 0,
                    TEXT_CUR_SEQ+": 0",
                    true, true, false,
                    false );
        _oCurSeqText.setShadow("#000",2,2,2);  
        
        this.initButtons();

        _iMaxSequence = 0;
        
        _iLives = NUM_LIVES;
        
        _pStartPosLife = {x:10,y:25};
        _oLifeSprites = createBitmap(s_oSpriteLibrary.getSprite('life'));
        _oLifeSprites.x = _pStartPosLife.x;
        _oLifeSprites.y = _pStartPosLife.y;
        s_oStage.addChild(_oLifeSprites);

        _iLivesBackText = new createjs.Text("X"+_iLives,"50px "+GAME_FONT, "#000000");
        _iLivesBackText.x = _oLifeSprites.x + 82;
        _iLivesBackText.y = _oLifeSprites.y + 12;
        _iLivesBackText.textAlign = "left";
        s_oStage.addChild(_iLivesBackText);
		
        _iLivesText = new createjs.Text("X"+_iLives,"50px "+GAME_FONT, "#fff");
        _iLivesText.x = _oLifeSprites.x + 80;
        _iLivesText.y = _oLifeSprites.y + 10;
        _iLivesText.textAlign = "left";
        s_oStage.addChild(_iLivesText);
        
        var oSpriteRight = s_oSpriteLibrary.getSprite('ico_right');
        _oIconRight = createBitmap(oSpriteRight);
        _oIconRight.x = CANVAS_WIDTH/2;
        _oIconRight.y = CANVAS_HEIGHT/2;
        _oIconRight.scaleX = _oIconRight.scaleY = 0.1;
        _oIconRight.visible = false;
        s_oStage.addChild(_oIconRight);
        
        _oIconRight.regX = oSpriteRight.width/2;
        _oIconRight.regY = oSpriteRight.height/2;
        
        _oHurt = new createjs.Shape();
        _oHurt.graphics.beginFill("red").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oHurt.alpha = 0.1;
        _oHurt.visible = false;
        s_oStage.addChild(_oHurt);
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2)-10,y:10+ (oSprite.height/2)};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
	if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _pStartPosAudio = {x:CANVAS_WIDTH - oSprite.width - 70,y:10+ (oSprite.height/2)};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,s_oSpriteLibrary.getSprite('audio_icon'),s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }
		
        _oHelpBg = new CHelp(s_oSpriteLibrary.getSprite('bg_help')); 
        
        this.changeState(STATE_GAME_SHOW_SEQUENCE);
        this._createSequence();   
        
        this.refreshButtonPos();
    };
    
    this.refreshButtonPos = function(){
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX,_pStartPosExit.y + s_iOffsetY);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX,s_iOffsetY + _pStartPosAudio.y);
        }
        
        _oLifeSprites.x = _pStartPosLife.x + s_iOffsetX;
        _oLifeSprites.y = _pStartPosLife.y + s_iOffsetY;
        
        _iLivesBackText.x = _oLifeSprites.x + 82;
        _iLivesBackText.y = _oLifeSprites.y + 12;
        
        _iLivesText.x = _oLifeSprites.x + 80;
        _iLivesText.y = _oLifeSprites.y + 10;
        
        _oMaxSeqText.setX(_pStartPosTextMaxSeq.x - s_iOffsetX);
        _oMaxSeqText.setY(_pStartPosTextMaxSeq.y - s_iOffsetY);

        
        _oCurSeqText.setX(_pStartPosTextCurSeq.x + s_iOffsetX);
        _oCurSeqText.setY(_pStartPosTextCurSeq.y - s_iOffsetY);
        
        _oRectBg.graphics.clear();
        _oRectBg.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0,s_iOffsetY,CANVAS_WIDTH,124);
        
        _oRectBg2.graphics.clear();
        _oRectBg2.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0,CANVAS_HEIGHT - 50 - s_iOffsetY,CANVAS_WIDTH,50);
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.unload();
                _oAudioToggle = null;
        }

        _oButExit.unload();        
        _oButExit = null;
        
	_oEndPanel.unload();
		
        for(var i=0;i<_aButtons.length;i++){
            _aButtons[i].unload();
        }
        
        s_oStage.removeAllChildren();
        s_oGame = null;
    };

    this.initButtons = function(){
        _aButtons = new Array();
        
        var aPos = new Array({x:280,y:394},
                             {x:521,y:321},
                             {x:381,y:633},
                             {x:601,y:565});
                             
        for(var i=0;i<NUM_BUTTONS;i++){
            var oBut = new CSeqButton(i,aPos[i].x,aPos[i].y,s_oSpriteLibrary.getSprite("button_"+i+"_on"));
                                                                
            oBut.addEventListener(ON_MOUSE_UP, this._onButtonReleased, this);
            _aButtons.push(oBut);                                                  
        }
    };
    
    this._createSequence = function(){   
        _iSeqEndIndex = 1;
        _iCurIndexLighting = 0;
        _iCurSequence = 0;
        
        _aSequence = new Array();
        
        for(var i=0;i<200;i++){
            var iRand = Math.floor(Math.random()* (NUM_BUTTONS));
            _aSequence.push(iRand);

        }
    };
    
    this.changeState = function(iState){
        _iCurState = iState;
        
        switch(iState){
            case STATE_GAME_SHOW_SEQUENCE:{
                _oMsgTextAhead.refreshText(TEXT_MEM_SEQ); 
                break;
            }
            case STATE_GAME_INSERT_SEQUENCE:{
                _oMsgTextAhead.refreshText(TEXT_REP_SEQ);      
                break;
            }
        }
    };
    
    this.lightButtonInSeq = function(){
        
        if(_iCurIndexLighting>0){
                _aButtons[_aSequence[_iCurIndexLighting-1]].darken();
        }

        
        playSound("note_"+(_aSequence[_iCurIndexLighting]+1),1,0);
        
            
        _aButtons[_aSequence[_iCurIndexLighting]].enlight();
        
        if(s_oGame !== null){
            var oParent = this;
            setTimeout(function(){oParent.darkenButtonInSeq();},_iLightTime);
        }
        
    };
    
    this.darkenButtonInSeq = function(){
         _aButtons[_aSequence[_iCurIndexLighting]].darken();
        _iCurIndexLighting++;
        
         if(_iCurIndexLighting < _iSeqEndIndex){
            if(s_oGame !== null){
                var oParent = this;
                setTimeout(function(){oParent.lightButtonInSeq();},_iDarkenTime);
            }
            
         }else{
             _aButtons[_aSequence[_iCurIndexLighting-1]].darken();
             
            _iCurIndexToGuess=0;
             this.changeState(STATE_GAME_INSERT_SEQUENCE);
         }
    };
    
    this.darkenButton = function(iIndex){
        _aButtons[iIndex].darken();
        _bButtonLight = false;
    };
    
    this._onButtonReleased = function(iIndex){
        if(_iCurState !== STATE_GAME_INSERT_SEQUENCE || _bButtonLight){
            return;
        }

        
        playSound("note_"+(iIndex+1),1,0);
        
        _bButtonLight = true;
        _aButtons[iIndex].enlight();
        

        if(_aSequence[_iCurIndexToGuess] === iIndex){
            //GUESSED
            var oParent = this;
            setTimeout(function(){oParent.darkenButton(iIndex);},_iLightTime);
            
            _iCurSequence++;
            _oCurSeqText.refreshText(TEXT_CUR_SEQ+": "+_iCurSequence);
            if(_iCurSequence>_iMaxSequence){
                _iMaxSequence++;
                _oMaxSeqText.refreshText(TEXT_MAX_SEQ+": "+_iMaxSequence);               
            }
            
            _iCurIndexToGuess++;

            if(_iCurIndexToGuess === _iSeqEndIndex){
                this._showRightPanel();
                
                _iSeqEndIndex++;
                _iCurIndexLighting = 0;
                _iCurSequence = 0;
                _oCurSeqText.refreshText(TEXT_CUR_SEQ+": "+_iCurSequence);
                
                var oParent = this;
                setTimeout(function(){_bButtonLight = false;oParent.changeState(STATE_GAME_SHOW_SEQUENCE);oParent.lightButtonInSeq();},2000);
            }            
        }else{
            //NOT GUESSED
            this._lostLife(iIndex); 
        }
    };
    
    this._lostLife = function(iIndex){
        this._createSequence();
        
        _iLives--;
        _iLivesText.text = "X"+_iLives;
		_iLivesBackText.text = "X"+_iLives;

         if(_iLives === 0){
            this._gameOver();
        }else{  
            this.showWrongPanel();
            _aButtons[iIndex].darken();
        
            var oParent = this;
            setTimeout(function(){_bButtonLight = false;oParent.changeState(STATE_GAME_SHOW_SEQUENCE);oParent.lightButtonInSeq();},2000);
        }
    };
    
    this._showRightPanel = function(){
        _oIconRight.visible = true;
        
        createjs.Tween.get(_oIconRight).to({scaleX:1,scaleY:1 }, 500).call(function() {
                                     createjs.Tween.get(_oIconRight).to({scaleX:0.01,scaleY:0.01 }, 500).call(function() {_oIconRight.visible = false;});
                                  });
    };
    
    this.showWrongPanel = function(){
       _oHurt.visible = true;
       createjs.Tween.get(_oHurt).to({alpha:0.6 }, 400).call(function() {_oHurt.visible = false;_oHurt.alpha = 0.5;});
    };
    
    this._gameOver = function(){
        $(s_oMain).trigger("end_level");
        
        _oEndPanel.show(_iMaxSequence);
    };
    
    this._onExit = function(){
        this.unload();
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("share_event",_iCurSequence);
        s_oMain.gotoMenu();
    };
	
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.onExitHelp = function(){
        var oParent = this;
        setTimeout(function(){oParent.lightButtonInSeq();},2000);
        
        $(s_oMain).trigger("start_level");
    };
    
    this.update = function(){
        
    };
    
    s_oGame=this;
    
    NUM_LIVES = oData.num_lives;
    _iDarkenTime = oData.time_darken;
    _iLightTime = oData.time_light;
                                            
	
    this._init();
}

var s_oGame = null;
