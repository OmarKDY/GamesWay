function CVictory(){
    var _oListener;
    
    var _oTextScore;
    var _oTextTotalScore;
    var _oButNextLevel;
    var _oButHome;
    var _oFade;
    var _oContainer;
    var _oContainerPanel;
    //var _oRollingScore;
    
    var _oThis = this;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oListener = _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainerPanel.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSpriteBg);
        _oContainerPanel.addChild(oBg);
        
        
        var oText =  new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2-300, 60, 600, 150, 
                    80, "center", COLOR_1, FONT, 1,
                    0, 0,
                    TEXT_VICTORY,
                    true, true, false,
                    false
        );

        _oTextScore = new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2 - 300, oSpriteBg.height/2 - 60, 600, 40, 
                    40, "center", COLOR_1, FONT, 1,
                    0, 0,
                    TEXT_SCORE + "0",
                    true, true, false,
                    false);

        _oTextTotalScore = new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2 - 300, oSpriteBg.height/2, 600, 46, 
                    46, "center", COLOR_1, FONT, 1,
                    0, 0,
                    TEXT_TOTAL_SCORE + s_iTotalScore,
                    true, true, false,
                    false);
        
        
        _oButHome = new CGfxButton(oSpriteBg.width/2 - 150,oSpriteBg.height - 130,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);

        _oButNextLevel = new CGfxButton(oSpriteBg.width/2 + 150,oSpriteBg.height - 130,s_oSpriteLibrary.getSprite("but_next_level"),_oContainerPanel);
        _oButNextLevel.addEventListener(ON_MOUSE_UP,this._onNextLevel,this);
        
        _oContainerPanel.regX = oSpriteBg.width/2;
        _oContainerPanel.regY = oSpriteBg.height/2;
    };
    
    this.unload = function(){
        _oFade.off("click", _oListener);
        _oButHome.unload();
        if(_oButNextLevel){
            _oButNextLevel.unload();
        }
    };
    
    this.show = function(iScore,bShowNextLvlBut){
        _oTextTotalScore.refreshText(TEXT_TOTAL_SCORE + s_iTotalScore);
        _oTextScore.refreshText(TEXT_SCORE + iScore);
        
        if(bShowNextLvlBut){
            this.showNextLvlBut();
        }
        else{
            this.hideNextLvlBut();
        }

        _oContainer.visible = true;
        
        _oFade.alpha = 0;
        createjs.Tween.get(_oFade)
        .to({alpha:0.7}, 400, createjs.Ease.cubicOut)
        .call(function(){
            setVolume("soundtrack",0); 
            playSound("game_win",1,false);
        });
        
        _oContainerPanel.scaleX = _oContainerPanel.scaleY = 0.01;
        _oContainerPanel.alpha = 0;
        createjs.Tween.get(_oContainerPanel)
        .wait(1000)
        .to({scaleX: 1,scaleY:1,alpha:1}, 1000, createjs.Ease.elasticOut).call(function(){
            $(s_oMain).trigger("share_event",iScore);
        });
    };
    
    this.hide = function(){
        createjs.Tween.get(_oFade).to({alpha:0}, 400, createjs.Ease.cubicOut);
        createjs.Tween.get(_oContainerPanel)
        .to({scaleX: 0.1,scaleY:0.1,alpha:0.5}, 400, createjs.Ease.backIn)
        .call(function(){
            setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME); 
            _oContainer.visible = false;
        });
    };
    
    this.hideNextLvlBut = function(){
        _oButHome.setX(_oContainerPanel.regX);
        _oButNextLevel.deactivate();
        _oButNextLevel.setVisible(false);
    }

    this.showNextLvlBut = function(){
        _oButHome.setX(_oContainerPanel.regX-150);
        _oButNextLevel.activate();
        _oButNextLevel.setVisible(true);
    }
    

    this._onHome = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        
        s_oGame.unload();
        s_oMain.gotoMenu();
    };
    
    this._onNextLevel = function(){
        $(s_oMain).trigger("show_interlevel_ad");

        _oThis.hide();
        setTimeout(function(){s_oGame.nextLevel()},400);
    };
    
    this._init();
}