function CEndPanel(){
    
    var _oFade;
    var _oPanelContainer;
    var _oBestText;
    var _oScoreText;
    var _oExitBut;
    var _oRestartBut;
    var _oParent;
    
    var _pStartPanelPos;
    this._init = function(){
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        
        
        _oPanelContainer = new createjs.Container();
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;   
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        

        var oTitle = new CTLText(_oPanelContainer, 
                    -200,-oSprite.height/2 + 16, 400, 42, 
                    42, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_GAMEOVER,
                    true, true, false,
                    false );
                    

        _oScoreText = new CTLText(_oPanelContainer, 
                    -200,oTitle.getY() + 60, 400, 25, 
                    25, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_GAMEOVER,
                    true, true, false,
                    false );
                    

        
        _oBestText = new CTLText(_oPanelContainer, 
                    -200,_oScoreText.getY() + 35, 400, 25, 
                    25, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );

        
        var oSprite = s_oSpriteLibrary.getSprite('but_home');
        _oExitBut = new CGfxButton(-140, 60, oSprite,_oPanelContainer);
        _oExitBut.addEventListener(ON_MOUSE_UP, this._onExit, this);

        
        var oSprite = s_oSpriteLibrary.getSprite('but_restart');
        _oRestartBut = new CGfxButton(140, 60, oSprite,_oPanelContainer);
        _oRestartBut.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        _oRestartBut.pulseAnimation();
        
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oPanelContainer);
        _oFade.off("mousedown",function(){});
        
        _oExitBut.unload();
        _oRestartBut.unload();
    };

    
    this.show = function(iScore){
        _oScoreText.refreshText(TEXT_SCORE + " " +iScore);
        _oBestText.refreshText(TEXT_BEST_SCORE+": "+s_iBestScore);
        
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2},500, createjs.Ease.quartIn);
        
        playSound("game_over",1,false);
        
        $(s_oMain).trigger("save_score",iScore);                
        $(s_oMain).trigger("share_event",iScore);
    };
    
    this._onExit = function(){
        _oFade.off("mousedown",function(){});
        s_oStage.removeChild(_oPanelContainer);
        
        s_oGame.onExit();
    };
    
    this._onRestart = function(){
        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
            _oParent.unload();
            s_oGame.restartGame();
        }); 
    };
    
    _oParent = this;
    this._init();
    
    return this;
}
