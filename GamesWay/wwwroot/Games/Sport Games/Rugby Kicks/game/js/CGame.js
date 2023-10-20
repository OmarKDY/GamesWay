function CGame(oData){
    var _bTouchActive;
    var _bInitGame;
    
    var _iScore;
    var _iStage;
    var _iCurShot;
    var _iCurTargetAreaHit;
    var _iXRelativePos;
    var _iYRelativePos;

    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _oGoalArea;
    var _oBall;
    var _oFade;
    var _oCameraContainer;
    var _oBg;
    var _oPlayer;
    var _oHelpPanel;
    
    
    this._init = function(){
        
        _bTouchActive=false;
        _bInitGame=true;
        
        _iScore=0;
        _iStage = 1;
        _iCurShot = 1;
        
        playSound("crowd",1,true);
        
        _oCameraContainer = new createjs.Container();
        _oCameraContainer.x = CANVAS_WIDTH/2;
        _oCameraContainer.y = CANVAS_HEIGHT/2;
        _oCameraContainer.scaleX = _oCameraContainer.scaleY = 0.5;
        s_oStage.addChild(_oCameraContainer);

        var oSprite = s_oSpriteLibrary.getSprite('bg_game_'+_iStage);
        _oBg = createBitmap(oSprite);
        _oBg.regX = oSprite.width/2;
        _oBg.regY = oSprite.height/2;
        _oCameraContainer.addChild(_oBg); 

        _oGoalArea = new CGoalArea(_iStage-1, _oCameraContainer);

        var oSprite = s_oSpriteLibrary.getSprite('ball_holder');
        var _oBallHolder = createBitmap(oSprite);
        _oBallHolder.regX = oSprite.width/2;
        _oBallHolder.regY = oSprite.height/2;
        _oBallHolder.x = 78;
        _oBallHolder.y = 764;
        _oCameraContainer.addChild(_oBallHolder);

        _oBall = new CBall(0, 600, _oCameraContainer);

        _oPlayer = new CPlayer(s_oStage);

        _oInterface = new CInterface();
        _oInterface.setControlPos(_iStage-1);

        _oEndPanel = CEndPanel();
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("Black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        s_oStage.addChild(_oFade);
        _oFade.on("mousedown", function(){});

        _oHelpPanel = new CHelpPanel();

    };

    this._calculateScore = function(iX, iY, iAreaHit){
        
        var iAreaScore = 0;
        switch(iAreaHit){
            case GREEN_TARGET:{
                    iAreaScore = GREEN_AREA_POINTS;
                    break;
            }
            case YELLOW_TARGET:{
                    iAreaScore = YELLOW_AREA_POINTS;
                    break;
            }
            case RED_TARGET:{
                    iAreaScore = RED_AREA_POINTS;
                    break;
            }
        }
        _iCurTargetAreaHit = iAreaHit;
        
        
        _iScore += iAreaScore;
        if(iAreaScore > 0){
            setTimeout(function(){
                new CScoreText(iAreaScore, iX, iY, _oCameraContainer);
            }, 500);
        }

        _oInterface.refreshScore(_iScore);
        
    };
    
    this._shiftCamera = function(iX){
        var iLimitX = 320;
        if(Math.abs(iX) > iLimitX){
            if(iX>0){
                iX = iLimitX;
            } else {
                iX = -iLimitX;
            }
        }
        new createjs.Tween.get(_oCameraContainer).wait(500).to({scaleX:1, scaleY:1, regX: iX}, 2000, createjs.Ease.cubicOut);
        
        new createjs.Tween.get(_oCameraContainer).wait(500).to({regY: -200}, 1300, createjs.Ease.cubicOut).to({regY: -150}, 1600, createjs.Ease.cubicIn);
    };
   
    this.playerShot = function(iXRelativePos, iYRelativePos){
        _iXRelativePos = iXRelativePos;
        _iYRelativePos = iYRelativePos;
        _oPlayer.startPlay();
    };
   
    this.launchBall = function(){ 
        _iCurShot++;
        
        _oInterface.refreshShot(_iCurShot);
        
        var oResult = _oGoalArea.getAreaHit(_iXRelativePos, _iYRelativePos);

        this._shiftCamera(oResult.x);

        _oBall.launch(oResult.x, oResult.y, oResult.areahit, _iXRelativePos, oResult.stakehit);

    };
   
    this.ballTouchTheTarget = function(iX, iY, iAreaHit){
        _oGoalArea.showArea(iAreaHit);
        
        this._calculateScore(iX, iY, iAreaHit);

        switch(iAreaHit){
            case GREEN_TARGET:{
                    playSound("goal",1,false);
                    playSound("green_area",1,false);
                    new CScoreText(TEXT_CENTER_GREEN, iX, iY, _oCameraContainer, "#17294d");
                    break;
            }
            case YELLOW_TARGET:{
                    playSound("yellow_area",1,false);
                    new CScoreText(TEXT_CENTER_YELLOW, iX, iY, _oCameraContainer, "#17294d");
                    break;
            }
            case RED_TARGET:{
                    playSound("red_area",1,false);
                    new CScoreText(TEXT_CENTER_RED, iX, iY, _oCameraContainer, "#17294d");
                    break;
            }
            case NULL_TARGET_POLE:{
                    playSound("miss_goal",1,false);
                    new CScoreText(TEXT_CENTER_NULL, iX, iY, _oCameraContainer, "#ff0000");
                    break;
            }
            case NULL_TARGET_LEFT:{
                    playSound("miss_goal",1,false);
                    new CScoreText(TEXT_WIDE_LEFT, iX, iY, _oCameraContainer, "#ff0000");
                    break;
            }
            case NULL_TARGET_RIGHT:{
                    playSound("miss_goal",1,false);
                    new CScoreText(TEXT_WIDE_RIGHT, iX, iY, _oCameraContainer, "#ff0000");
                    break;
            }
        }

        if(iAreaHit !== NULL_TARGET_POLE){
            _oCameraContainer.swapChildren(_oBall.getContainer(), _oGoalArea.getContainer());
        }
        
        
    };
    
    this.ballArrived = function(bStakeHit){
        _oBall.reset();
        
        if(_iCurShot > SHOTS_PER_STAGE){
            $(s_oMain).trigger("end_level",_iStage);
            _iCurShot = 1;
            _iStage++;
            if(_iStage > NUM_STAGES){
                _oParent.gameOver();
            } else {
                this._changeStage();
            }
        } else {
            _oParent._resetShot();
        }
        
        if(!bStakeHit){
            _oCameraContainer.swapChildren( _oGoalArea.getContainer(), _oBall.getContainer());
        }
        
    };
    
    this._changeStage = function(){
        playSound("game_over",1,false);
        
        $(s_oMain).trigger("start_level",_iStage);
        new createjs.Tween.get(_oFade).to({alpha: 1}, 1000).call(function(){
            _oGoalArea.setGoalArea(_iStage-1);
            _oGoalArea.setAreaSprite(_iStage-1);

            _oParent._levelSet();
            _oInterface.resetShotsIndicator();
            _oInterface.stopControl();
            _oInterface.setControlPos(_iStage-1);
            _oBg.image = s_oSpriteLibrary.getSprite('bg_game_'+_iStage);
            
            new createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function(){
                _oInterface.resetControl(SHOT_INDICATOR_SPEED);
            });
        });
        
    };
    
    this._resetShot = function(){
        _oGoalArea.stopAnim();
        new createjs.Tween.get(_oCameraContainer).to({scaleX:0.5, scaleY:0.5, regX: 0, regY:0}, 1000, createjs.Ease.cubicOut).call(function(){
            _oParent._levelSet();
        });
    };
    
    this._levelSet = function(){
        
        //_oBall.reset();
        
        _oCameraContainer.scaleX = _oCameraContainer.scaleY = 0.5;
        _oCameraContainer.regX = _oCameraContainer.regY = 0;
        
        var iNewSpeed = SHOT_INDICATOR_SPEED - _iCurShot*DECREASE_SHOT_INDICATOR_SPEED
        if(iNewSpeed < DECREASE_SHOT_INDICATOR_SPEED){
            iNewSpeed = DECREASE_SHOT_INDICATOR_SPEED;
        }

        _oInterface.refreshStage(_iStage);

        _oInterface.resetControl(iNewSpeed);
    };
    
    this.getStage = function(){
        return _iStage;
    };
    
    this.endGoalAnim = function(){
        _oGoalArea.stopAnim();
    };        
    
    this.unload = function(){
        _bInitGame = false;
        
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

        _oFade.off("mousedown");   
    };
 
    this.onExit = function(){
        stopSound("crowd");
        
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
        this.unload();
        s_oMain.gotoMenu(); 
    };
    
    this._onExitHelp = function () {
        setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);  
        $(s_oMain).trigger("start_level",1);
        
        _oInterface.controlState();
    };
    
    this.gameOver = function(){  
        if(_iScore > s_iBestScore){
            s_iBestScore = _iScore;
            
            _oInterface.refreshBestScore();
            
            saveItem(PREFIX_LOCAL_STORAGE+"_best_score",s_iBestScore);
        }
        
        
        _oEndPanel.show(_iScore);
    };

    this.restartGame = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        
        _oParent.unload();
        _oParent._init();
    };
    
    this.update = function(){
        _oPlayer.update();
    };

    s_oGame=this;
    
    SHOT_INDICATOR_SPEED = oData.shot_indicator_spd;
    DECREASE_SHOT_INDICATOR_SPEED = oData.decrease_shot_indicator_spd;

    SHOTS_PER_STAGE = oData.shots_per_stage;

    RED_AREA_POINTS = oData.red_area_points;
    YELLOW_AREA_POINTS = oData.yellow_area_points;
    GREEN_AREA_POINTS = oData.green_area_points;
    
    
    
    AD_SHOW_COUNTER = oData.ad_show_counter;
    
    _oParent=this;
    this._init();
}

var s_oGame;
