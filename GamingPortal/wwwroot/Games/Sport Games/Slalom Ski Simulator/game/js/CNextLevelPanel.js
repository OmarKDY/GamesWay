function CNextLevelPanel(){
    var _iStartY;
    var _iEventToLaunch;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oFade;
    var _oLevelScoreText;
    var _oLevelClearedText;
    var _oTotScoreText;
    var _oTimeText;
    var _oBestText;
    var _oButHome;
    var _oButRestart;
    var _oButNext;
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
        _oContainer.addChild(_oContainerPanel);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_wide");
        var oBg = createBitmap(oSpriteBg);
        _oContainerPanel.addChild(oBg);

        _oLevelClearedText = new CTLText(_oContainerPanel, 
                     oSpriteBg.width/2- 350,  oSpriteBg.height/2-240, 700, 80, 
                    80, "center", "#ff7800", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    

        
        _oTimeText = new CTLText(_oContainerPanel, 
                     oSpriteBg.width/2- 350,  oSpriteBg.height/2 -115, 700, 50, 
                    50, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    

        _oBestText = new CTLText(_oContainerPanel, 
                     oSpriteBg.width/2- 350,  oSpriteBg.height/2 - 60, 700, 50, 
                    50, "center", "#ff7800", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    

        
        _oLevelScoreText = new CTLText(_oContainerPanel, 
                     oSpriteBg.width/2- 350,   oSpriteBg.height/2+10, 700, 40, 
                    40, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    

        
        _oTotScoreText = new CTLText(_oContainerPanel, 
                     oSpriteBg.width/2- 350,   oSpriteBg.height/2+50, 700, 40, 
                    40, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
                    

        
        _oButHome = new CGfxButton(oSpriteBg.width/2 - 250,oSpriteBg.height/2 + 190,s_oSpriteLibrary.getSprite("but_home"),_oContainerPanel);
        _oButHome.addEventListener(ON_MOUSE_UP,this._onHome,this);
        
        _oButRestart = new CGfxButton(oSpriteBg.width/2,oSpriteBg.height/2+190,s_oSpriteLibrary.getSprite("but_restart"),_oContainerPanel);
        _oButRestart.addEventListener(ON_MOUSE_UP,this._onRestart,this);
        
        _oButNext = new CGfxButton(oSpriteBg.width/2 + 250,oSpriteBg.height/2+190,s_oSpriteLibrary.getSprite("but_next"),_oContainerPanel);
        _oButNext.addEventListener(ON_MOUSE_UP,this._onNext,this);
        
        
        _iStartY = -oSpriteBg.height/2;
        
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
    
    this.show = function(iTime,szBest,iLevelScore,iTotScore,iLevel){
        setMusicVolume("soundtrack",0);
        
        var oSound = playMusicSound("level_win",1,false);
        oSound.on('end', function(){
            setMusicVolume("soundtrack",1);
        });

        _oTimeText.refreshText(TEXT_TIME_TRACK + " " + formatTime(iTime,false,3));
        _oBestText.refreshText(TEXT_BEST_TIME + " " + szBest);
        _oLevelClearedText.refreshText(TEXT_LEVEL + " " + iLevel +" " + TEXT_CLEARED);
        _oLevelScoreText.refreshText(TEXT_LEVEL_SCORE+": "+iLevelScore);
        _oTotScoreText.refreshText(TEXT_TOT_SCORE+": "+iTotScore);
        
        _oFade.alpha=0;
        _oContainerPanel.y = _iStartY;
        _oContainer.visible = true;
        
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500);
        createjs.Tween.get(_oContainerPanel).wait(400).to({y:CANVAS_HEIGHT/2}, 500,createjs.Ease.quartOut).call(function(){_oThis.enableButtons();});
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainerPanel).to({y:_iStartY}, 500,createjs.Ease.quartOut).call(function(){
                                                                                                        _oContainer.visible = false;
                                                                    
                                                                                                        if(_aCbCompleted[_iEventToLaunch]){
                                                                                                            _aCbCompleted[_iEventToLaunch].call(_aCbOwner[_iEventToLaunch]);
                                                                                                        }
                                                                });
    };
    
    this.enableButtons = function(){
        _oButHome.enable();
        _oButNext.enable();
        _oButRestart.enable();
    };
    
    this.disableButtons = function(){
        _oButHome.disable();
        _oButNext.disable();
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
    
    this._onNext = function(){
        _oThis.disableButtons();
        
        $(s_oMain).trigger("show_interlevel_ad");
        
        _iEventToLaunch = ON_NEXT_LEVEL;
        
        _oThis.hide();
    };
    
    this._init();
}