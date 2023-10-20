function CEndPanel(){
    var _iStartY;
    var _oText;
    var _oButHome;
    var _oButRestart;
    var _oListenerDown;
    
    var _oFade;
    var _oMainContainer;
    var _oContainer;
    var _oThis = this;
    
    this._init = function(){
        _oMainContainer = new createjs.Container();    
        _oMainContainer.visible= false;
        s_oStage.addChild(_oMainContainer);

        _oFade = createBitmap(s_oSpriteLibrary.getSprite("fade_end_panel"));
        _oFade.alpha = 0;
        _oListenerDown = _oFade.on("click",function(){});
        _oMainContainer.addChild(_oFade);
        
        _oContainer = new createjs.Container();
        _oMainContainer.addChild(_oContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('end_panel_bg');
        var oBg = createBitmap(oSpriteBg);
        _oContainer.addChild(oBg);
        
        _oText = new CTLText(_oContainer, 
                    oSpriteBg.width/2-300, 38, 600, 160, 
                    80, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );

        
        _oButHome = new CGfxButton(oSpriteBg.width/2 + 170,300,s_oSpriteLibrary.getSprite("but_home"),_oContainer);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onReleaseHome,this);
        
        _oButRestart = new CGfxButton(oSpriteBg.width/2 - 170,300,s_oSpriteLibrary.getSprite("but_restart_big"),_oContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onReleaseRestart,this);
        
        _oContainer.regX = oSpriteBg.width/2;
        _oContainer.regY = oSpriteBg.height/2;
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2;
        
        _oContainer.y = _iStartY = -oSpriteBg.height;
    };

    this.unload = function(){
        _oFade.off("click",_oListenerDown);
        _oButRestart.unload();
        _oButHome.unload();
    };
    
    this.show = function(iScore){
        _oMainContainer.visible= true;
        _oText.refreshText(TEXT_YOUR_SCORE + " " + iScore);
        _oContainer.visible = true;
        
        _oContainer.y = _iStartY;
        createjs.Tween.get(_oContainer).to({y: 570}, 1000,createjs.Ease.bounceOut).call(function(){
                                                                createjs.Tween.get(_oFade).to({alpha: 1}, 500,createjs.Ease.cubicOut)
                                                });
        
        $(s_oMain).trigger("save_score",iScore);
        $(s_oMain).trigger("share_event",iScore);
    };
    
    this.hide = function(){
        _oMainContainer.visible = false;
        $(s_oMain).trigger("show_interlevel_ad");
    };

    this._onReleaseHome = function(){
        _oThis.hide();
        
        s_oMain.gotoMenu();
    };
    
    this._onReleaseRestart = function(){
        _oThis.hide();
        
        s_oInterface.blockControls(false);
        s_oGame.restart();
    };
    
    this._init();
}
