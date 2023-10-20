function CEndPanel(){
    var _iEventToLaunch;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oFade;
    var _oTitleText;
    var _oTextWinner;
    var _oTotScoreText;
    var _oButHome;
    var _oButRestart;
    var _oContainer;
    var _oContainerPanel;
    
    var _oThis = this;

    
    this._init = function(){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oListener = _oFade.on("click", function () {});
        _oContainer.addChild(_oFade);
        
       
       
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainerPanel.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSpriteBg);
        _oContainerPanel.addChild(oBg);
        
        _oTitleText = new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2-250, oSpriteBg.height/2-250, 500, 80, 
                    36, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
                    

        
        _oTextWinner = new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2-250, oSpriteBg.height/2-100, 500, 80, 
                    36, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
                    

        
        _oTotScoreText = new CTLText(_oContainerPanel, 
                    oSpriteBg.width/2-250, oSpriteBg.height/2+50, 500, 36, 
                    36, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    

        
        _oButHome = new CGfxButton(oSpriteBg.width/2 - 200,oSpriteBg.height/2 + 210,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButRestart = new CGfxButton(oSpriteBg.width/2 + 200,oSpriteBg.height/2+210,s_oSpriteLibrary.getSprite("but_restart"),_oContainerPanel);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        _oContainerPanel.regX = oSpriteBg.width/2;
        _oContainerPanel.regY = oSpriteBg.height/2;
    };
    
    this.unload = function(){
        _oButHome.unload();
        _oButRestart.unload();
        
        _oFade.off("click", _oListener);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(iTotScore,iWinner){

        if(s_iMode === MODE_HUMANS || (s_iMode === MODE_CPU && iWinner === WHITE_PLAYER)){
            playSound("game_win",1,false);
        }else{
            playSound("game_over",1,false);
        }

        _oTitleText.refreshText(TEXT_GAME_OVER);
        _oTextWinner.refreshText(iWinner===WHITE_PLAYER?TEXT_WHITE_WINS:TEXT_BLACK_WINS);

        _oTotScoreText.refreshText(TEXT_SCORE+": "+iTotScore);
        
        
        _oFade.alpha=0;
        _oContainer.alpha=1;
        _oContainerPanel.scaleX = _oContainerPanel.scaleY = 0.1;
        _oContainerPanel.alpha = 0;
        _oContainer.visible = true;
        
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500);
        createjs.Tween.get(_oContainerPanel).wait(400).to({scaleX:1,scaleY:1,alpha:1}, 500,createjs.Ease.quartOut).call(function(){_oThis.enableButtons();});;
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0}, 500,createjs.Ease.quartOut).call(function(){
                                                                                    _oContainer.visible = false;

                                                                                    if(_aCbCompleted[_iEventToLaunch]){
                                                                                        _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
                                                                                    }
                                                                })
    };
    
    this.enableButtons = function(){
        _oButHome.enable();
        _oButRestart.enable();
    };
    
    this.disableButtons = function(){
        _oButHome.disable();
        _oButRestart.disable();
    };
    
    this._onHome = function(){
        _oThis.disableButtons();
        
        _iEventToLaunch = ON_BACK_MENU;
        
        _oThis.hide();
    };
    
    this._onRestart = function(){
        _oThis.disableButtons();
        
        $(s_oMain).trigger("show_interlevel_ad");
        
        _iEventToLaunch = ON_RESTART;
        
        _oThis.hide();
    };
    
    this._init();
}
