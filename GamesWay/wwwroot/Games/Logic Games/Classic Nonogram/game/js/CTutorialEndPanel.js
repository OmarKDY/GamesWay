function CTutorialEndPanel(){
    var _oListener;
    
    var _oButHome;
    var _oFade;
    var _oContainer;
    var _oContainerPanel;
    
    var _oThis = this;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oListener = _oFade.on("click", function(){});
        _oContainer.addChild(_oFade);
        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainerPanel.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSpriteBg);
        _oContainerPanel.addChild(oBg);
        
        var oText =  new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2-300, 30, 600, 430, 
                    70, "center", COLOR_1, FONT, 1,
                    0, 0,
                    TEXT_TUTORIAL[7],
                    true, true, true,
                    false 
        );
                    
        _oButHome = new CGfxButton(oSpriteBg.width/2,550,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);

        _oContainerPanel.regX = oSpriteBg.width/2;
        _oContainerPanel.regY = oSpriteBg.height/2;
    };
    
    this.unload = function(){
        _oFade.off("click", _oListener);
        _oButHome.unload();
    };

    this.show = function(){
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
        createjs.Tween.get(_oContainerPanel).wait(1000).to({scaleX: 1,scaleY:1,alpha:1}, 1000, createjs.Ease.elasticOut);
    };

    this._onHome = function(){
        s_oTutorial.unload();
        s_oMain.gotoLevelMenu();

        if(s_bFirstGame){
            s_bFirstGame = false;
            setLocalStorageFirstGame(false);
        }
    };

    this._init();
}