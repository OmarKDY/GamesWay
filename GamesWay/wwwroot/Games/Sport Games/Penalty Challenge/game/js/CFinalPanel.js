function CFinalPanel(iLevel,oParentContainer){
    var _oListener;
    var _oButNext;
    var _oButPlayAgain;
    var _oButHome;
    var _oResultText;
    var _oTextWinLose;
    var _oLevelScoreText;
    var _oTotScoreText;
    var _oFlagPlayer;
    var _oFlagOpponent;
    
    var _oFade;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(iLevel){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oListener = _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;
        _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSpriteBg);
        oBg.x = CANVAS_WIDTH_HALF;
        oBg.y = CANVAS_HEIGHT_HALF;
        oBg.regX = oSpriteBg.width/2;
        oBg.regY = oSpriteBg.height/2;
        _oContainer.addChild(oBg);

        var iWidth = 700;
        var iHeight = 120;
        _oTextWinLose = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2 -iWidth/2, - iHeight/2 +130, iWidth, iHeight, 
                    130, "center", TEXT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_WIN,
                    true, true, true,
                    false );
        
        _oResultText = new createjs.Text("YOU 3-2 CPU", "80px " + PRIMARY_FONT, "#fff");
        _oResultText.x = CANVAS_WIDTH_HALF;
        _oResultText.y = 260;
        _oResultText.textAlign = "center";
        _oResultText.textBaseline = "alphabetic";
        _oContainer.addChild(_oResultText);
        
        var oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_iTeamSelected]);
        _oFlagPlayer = createBitmap(oSpriteFlag);
        _oFlagPlayer.x = CANVAS_WIDTH_HALF - 120;
        _oFlagPlayer.y = _oResultText.y-22;
        _oFlagPlayer.regX = oSpriteFlag.width/2;
        _oFlagPlayer.regY = oSpriteFlag.height/2;
        _oContainer.addChild(_oFlagPlayer);
        

        oSpriteFlag = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_aMatches[iLevel-1]]);
        _oFlagOpponent = createBitmap(oSpriteFlag);
        _oFlagOpponent.x = CANVAS_WIDTH_HALF + 120;
        _oFlagOpponent.y = _oResultText.y-22;
        _oFlagOpponent.regX = oSpriteFlag.width/2;
        _oFlagOpponent.regY = oSpriteFlag.height/2;
        _oContainer.addChild(_oFlagOpponent);

        var iWidth = 500;
        var iHeight = 48;
        _oLevelScoreText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2 -iWidth/2, CANVAS_HEIGHT/2 - iHeight/2 +30, iWidth, iHeight, 
                    48, "center", "#fff", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_LEVEL_SCORE + " 9999",
                    true, true, true,
                    false );
       
        var iWidth = 550;
        var iHeight = 58;
        _oTotScoreText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2 -iWidth/2, CANVAS_HEIGHT/2 - iHeight/2 +80, iWidth, iHeight, 
                    58, "center", "#fff", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_TOTAL+" 999999",
                    true, true, true,
                    false );

        _oButHome = new CGfxButton(CANVAS_WIDTH_HALF -130,CANVAS_HEIGHT_HALF + 190,s_oSpriteLibrary.getSprite("but_home"),_oContainer);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButPlayAgain = new CGfxButton(CANVAS_WIDTH_HALF,CANVAS_HEIGHT_HALF + 190,s_oSpriteLibrary.getSprite("but_restart"),_oContainer);
        _oButPlayAgain.addEventListener(ON_MOUSE_UP,this._onRetry,this);
        
        _oButNext = new CGfxButton(CANVAS_WIDTH_HALF + 130,CANVAS_HEIGHT_HALF + 190,s_oSpriteLibrary.getSprite("but_next"),_oContainer);
        _oButNext.addEventListener(ON_MOUSE_UP,this._onNext,this);
    };
    
    this.unload = function(){
        _oButNext.unload();
        _oButHome.unload();
        _oButPlayAgain.unload();
        _oFade.off("click",_oListener);
        
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.show = function(szResult,iTotScore,iLevelScore,bLose,bLastLevel,iCurLevel){
        setVolume("soundtrack",1);
        _oResultText.text = szResult;
        
        if(bLose){
            _oTextWinLose.refreshText( TEXT_LOSE );
            _oButNext.setVisible(false);
            
            _oButHome.setX(CANVAS_WIDTH_HALF - 100);
            _oButPlayAgain.setX(CANVAS_WIDTH_HALF + 100);
        }else{
            _oTextWinLose.refreshText( TEXT_WIN );
            _oButNext.setVisible(true);
            if(bLastLevel){
                _oButNext.setVisible(false);
                _oButHome.setX(CANVAS_WIDTH_HALF - 80);
                _oButPlayAgain.setX(CANVAS_WIDTH_HALF + 80);
            }else{
                _oButHome.setX(CANVAS_WIDTH_HALF - 130);
                _oButPlayAgain.setX(CANVAS_WIDTH_HALF );
                _oButNext.setX(CANVAS_WIDTH_HALF + 130);
            }
            
        }
        
        trace("TEAM_LABEL[s_aMatches["+(iCurLevel-1)+"]] "+TEAM_LABEL[s_aMatches[iCurLevel-1]])
        _oFlagOpponent.image = s_oSpriteLibrary.getSprite("flag_"+TEAM_LABEL[s_aMatches[iCurLevel-1]]);
        _oLevelScoreText.refreshText( TEXT_LEVEL_SCORE+ " " + iLevelScore );
        _oTotScoreText.refreshText( TEXT_TOTAL + " " + iTotScore );
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 500, createjs.Ease.quartOut);
        
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("save_score", iTotScore);
        $(s_oMain).trigger("share_event", iTotScore);
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha: 0}, 500, createjs.Ease.quartOut).call(function(){
                                                                                _oContainer.visible = false;
                                                                            });
    };
    
    this.hideScoreBoards = function(){
        for(var i=0;i<_aScoreBoards.length;i++){
            _aScoreBoards[i].hide();
        }
    };

    
    this._onConfirmExit = function(){
        s_oGame.onExit();
    };
    
    this._onNext = function(){
        _oThis.hide();
        s_oGame.nextRound();
    };
    
    this._onRetry = function(){
        _oThis.hide();
        s_oGame.retryLevel();
    };

    
    this._onHome = function(){
        s_oGame.onExit();
    };

    
    this._init(iLevel);
}