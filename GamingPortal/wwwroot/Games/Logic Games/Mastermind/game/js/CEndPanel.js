function CEndPanel(){
    
    var _oBg;
    var _oGroup;

    var _oMsgText;
    var _oScoreText;
    var _oButExit;
    var _oButRestart;
    var _oButNext;
    
    this._init = function(){
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0.7;
        shape.on("mousedown",this.onOver,this);
        _oGroup.addChild(shape);
        
        var oSprite = s_oSpriteLibrary.getSprite("credits_panel");
        _oBg = createBitmap(oSprite);
        _oBg.regX = 569/2;
        _oBg.regY = 395/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oGroup.addChild(_oBg);
        
        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, (CANVAS_HEIGHT/2)-150, 500, 100, 
                    50, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );

        _oScoreText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, (CANVAS_HEIGHT/2) , 500, 40, 
                    40, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );


       
        
         oSprite = s_oSpriteLibrary.getSprite("but_home");
        _oButExit = new CGfxButton((CANVAS_WIDTH/2)-120,(CANVAS_HEIGHT/2)+150,oSprite,_oGroup);
         oSprite = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton((CANVAS_WIDTH/2),(CANVAS_HEIGHT/2)+150,oSprite,_oGroup);
         oSprite = s_oSpriteLibrary.getSprite("but_next");
        _oButNext = new CGfxButton((CANVAS_WIDTH/2+120),(CANVAS_HEIGHT/2)+150,oSprite,_oGroup);

        
    };
    
    this.unload = function(){
        _oButExit.removeEventListener(ON_MOUSE_DOWN,this._onExit,this);
        _oButRestart.removeEventListener(ON_MOUSE_DOWN,this._onRestart,this);
        _oButNext.removeEventListener(ON_MOUSE_DOWN,this._onNextLevel,this);
    };
    
    this._initListener = function(){
       _oButExit.addEventListener(ON_MOUSE_DOWN,this._onExit,this);
       _oButRestart.addEventListener(ON_MOUSE_DOWN,this._onRestart,this);
       _oButNext.addEventListener(ON_MOUSE_DOWN,this._onNextLevel,this);
    };
    
    this.show = function(szType,iScore){
	playSound("game_over",1,false);
        
        
        if (szType==="win"){
            _oMsgText.refreshText(TEXT_GAMEOVER);
        }else{
            _oButNext.setVisible(false);
            _oButExit.getButtonImage().x = (CANVAS_WIDTH/2)-76;
            _oButRestart.getButtonImage().x = (CANVAS_WIDTH/2)+76;
            _oMsgText.refreshText(TEXT_GAMEOVER_LOSE);
        }
        

        _oScoreText.refreshText(TEXT_SCORE +": "+iScore);
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        var iGlobalScore = 0;
        for (var i=0;i<s_oLevelSettings.getNumLevel();i++){
            if (getItem("score_level_"+i)){
                iGlobalScore+=parseFloat(getItem("score_level_"+i));
            }
        }
        $(s_oMain).trigger("save_score",iGlobalScore, "DON'T FORGET TO SET THE MODE");
        
        var szImg = "200x200.jpg";
        var szTitle = "Congratulations!";
        var szMsg = "You collected <strong>" + iGlobalScore + " points</strong>!<br><br>Share your score with your friends!";
        var szMsgShare = "My score is " + iScore + " points! Can you do better?";        
        $(s_oMain).trigger("share_event",iGlobalScore, szImg, szTitle, szMsg, szMsgShare);
    };
    
    this._onExit = function(){
        
        $(s_oMain).trigger("show_interlevel_ad");
        
        
        s_oStage.removeChild(_oGroup);
        
        s_oGame.unload();
        s_oMain.gotoMenu();
    };
    
    this._onRestart = function(){
       s_oStage.removeChild(_oGroup);
       s_oGame.unload();
       s_oMain.gotoGame();
    };
    
    this._onNextLevel = function(){
        s_oStage.removeChild(_oGroup);
        s_oGame.unload();
        s_oLevelSettings.nextLevel();
        s_oMain.gotoGame();
    };
    
    this.onOver = function(){
        
    };
    
    this._init();
    
    return this;
}
