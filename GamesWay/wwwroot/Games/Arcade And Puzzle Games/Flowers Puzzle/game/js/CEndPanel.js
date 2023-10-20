function CEndPanel(oSpriteBg, iLevel, iScore){
    
    var _oBg;
    var _oGroup;
    var _oLevelContainer;
    var _oEndContainer;
    
    var _oMsgTextStroke;
    var _oMsgText;
    var _oMsgScoreStroke;
    var _oMsgScore;
    var _oLevelSprite;
    var _oEndSprite;
    
    this._init = function(oSpriteBg, iLevel, iScore){
        _oGroup = new createjs.Container();
        if(!s_bMobile || s_bIsIphone){
            _oGroup.alpha = 0;
            _oGroup.visible=false;
        }
        s_oStage.addChild(_oGroup);
        
        $(s_oMain).trigger("end_level",[iLevel]);
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;
        _oGroup.addChild(_oBg);
        
        
        _oLevelContainer = new createjs.Container();
        _oEndContainer = new createjs.Container();

       
        var iSize = 40;        
        var iWidth = 400;
        var iHeight = 80;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2)-120;
        _oMsgTextStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "center", "#730358", FONT, 1.1,
                    2, 2,
                    " ",
                    true, true, true,
                    false );
        _oMsgTextStroke.setOutline(4);            
       
        _oMsgText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "center", "#fff", FONT, 1.1,
                    2, 2,
                    " ",
                    true, true, true,
                    false ); 

       
        var iSize = 40;        
        var iWidth = 300;
        var iHeight = 50;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2)-50;
        _oMsgScoreStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "center", "#730358", FONT, 1.1,
                    2, 2,
                    " ",
                    true, true, false,
                    false );
        _oMsgScoreStroke.setOutline(4);            
       
        _oMsgScore = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "center", "#fff", FONT, 1.1,
                    2, 2,
                    " ",
                    true, true, false,
                    false );
        
        _oLevelSprite = createBitmap(s_oSpriteLibrary.getSprite('but_next'));
        _oLevelSprite.x = CANVAS_WIDTH/2+30;
        _oLevelSprite.y = CANVAS_HEIGHT/2;
        _oLevelContainer.addChild(_oLevelSprite);
        
        _oEndSprite = createBitmap(s_oSpriteLibrary.getSprite('but_restart_big'));
        _oEndSprite.x = CANVAS_WIDTH/2-140;
        _oEndSprite.y = CANVAS_HEIGHT/2;
        _oEndContainer.addChild(_oEndSprite);
        
        _oEndContainer.on("mousedown", this._onExit, this);
        
        _oGroup.addChild(_oEndContainer);
        
        //_oGroup.addChild(_oBg, _oMsgTextStroke, _oMsgText, _oMsgScoreStroke, _oMsgScore, _oEndContainer);

        
    };
    
    this._onNextLevel = function(event){
        s_oStage.removeChild(_oGroup);
        $(s_oMain).trigger("show_interlevel_ad");
        _oLevelContainer.removeAllEventListeners();
        s_oGame.nextLevel();
        
    };
    
    this.nextLevel = function(){
        playSound("next_level", 1, false);
        
        _oMsgTextStroke.refreshText( TEXT_LEVEL_COMPLETED );
        _oMsgText.refreshText( TEXT_LEVEL_COMPLETED );
        
        _oMsgScoreStroke.refreshText( sprintf(TEXT_SCORE,iScore) );
        _oMsgScore.refreshText( sprintf(TEXT_SCORE,iScore) );
        
        _oGroup.addChild(_oLevelContainer);
        _oLevelContainer.on("mousedown", this._onNextLevel, this);
        
        _oGroup.visible = true;
        
        if(!s_bMobile || s_bIsIphone){
            createjs.Tween.get(_oGroup).wait(400).to({alpha:1 }, 500).call(function() {});
        }
        
        $(s_oMain).trigger("save_score",[iScore]);
        $(s_oMain).trigger("share_event",[iScore]);
	if(s_bMobile && !s_bIsIphone){
            s_oStage.update();
        }
    };
    
    this.lastLevelCompleted = function(){
        playSound("all_level_completed", 1, false);

        _oMsgTextStroke.refreshText( TEXT_WIN );
        _oMsgText.refreshText( TEXT_WIN );
        
        _oMsgScoreStroke.refreshText( sprintf(TEXT_SCORE,iScore) );
        _oMsgScore.refreshText( sprintf(TEXT_SCORE,iScore) );
        
        _oEndSprite.x = CANVAS_WIDTH/2-50;
        _oEndSprite.y = CANVAS_HEIGHT/2+20;
        
        _oGroup.visible = true;
        
        if(!s_bMobile || s_bIsIphone){
            createjs.Tween.get(_oGroup).wait(400).to({alpha:1 }, 500).call(function() {});
        }
        
        $(s_oMain).trigger("save_score",[iScore]);
        $(s_oMain).trigger("share_event",[iScore]);
	if(s_bMobile && !s_bIsIphone){
            s_oStage.update();
        }
    };
    
    this._onExit = function(){
        _oGroup.removeAllEventListeners();
        s_oStage.removeChild(_oGroup);
        
        //s_oGame.onExit();
        s_oGame.onRestart();
        
        $(s_oMain).trigger("end_level");
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };
    
    this._init(oSpriteBg, iLevel, iScore);
    
    return this;
}
