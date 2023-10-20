function CGameOver(){
    var _oListener;
    
    var _oButRestart;
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
                    oSpriteBg.width/2-300, 170, 600, 100, 
                    80, "center", COLOR_1, FONT, 1,
                    0, 0,
                    TEXT_GAME_OVER,
                    true, true, false,
                    false );
        
        _oButHome = new CGfxButton(oSpriteBg.width/2 - 150,oSpriteBg.height - 240,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButRestart = new CGfxButton(oSpriteBg.width/2 + 150,oSpriteBg.height - 240,s_oSpriteLibrary.getSprite("but_restart_big"),_oContainerPanel);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        _oContainerPanel.regX = oSpriteBg.width/2;
        _oContainerPanel.regY = oSpriteBg.height/2;
    };
    
    this.unload = function(){
        _oFade.off("click", _oListener);
        _oButHome.unload();
        _oButRestart.unload();
    };
    
    this.show = function(){
        _oContainer.visible = true;
        
        _oFade.alpha = 0;
        createjs.Tween.get(_oFade)
        .to({alpha:0.7}, 400, createjs.Ease.cubicOut)
        .call(function(){
            setVolume("soundtrack",0);
            playSound("game_over",1,false);
        });
        
        _oContainerPanel.scaleX = _oContainerPanel.scaleY = 0.01;
        _oContainerPanel.alpha = 0;
        createjs.Tween.get(_oContainerPanel).wait(1000).to({scaleX: 1,scaleY:1,alpha:1}, 1000, createjs.Ease.elasticOut).call(function(){

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
    
    this._onHome = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        
        s_oGame.unload();
        s_oMain.gotoMenu();
    };
    
    this._onRestart = function(){
        $(s_oMain).trigger("show_interlevel_ad");

        s_oGame.restart();
        _oThis.hide();
    };
    
    this._init();
}