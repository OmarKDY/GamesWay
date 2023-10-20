function CAlertLocalStorage(){
    var _oListenerBlock;
    var _oFade;
    var _oContainerPanel;
    var _oButExit;
    var _oPanel;
    var _oContainer;
    var _pStartPanelPos;
    
    this._init = function(){
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oListenerBlock = _oFade.on("click",function(){});
        _oFade.alpha = 0;
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oContainer.addChild(_oFade);
        
        _oContainerPanel = new createjs.Container();
        _oContainerPanel.visible = false;
        _oContainer.addChild(_oContainerPanel);
        
        var oSpritePanel = s_oSpriteLibrary.getSprite('msg_box');
        _oPanel = createBitmap(oSpritePanel);        
        _oContainerPanel.addChild(_oPanel);
        
        _oContainerPanel.x = CANVAS_WIDTH/2;
        _oContainerPanel.y = CANVAS_HEIGHT/2;  
        _oContainerPanel.regX = oSpritePanel.width/2;
        _oContainerPanel.regY = oSpritePanel.height/2;

        var oText =  new CTLText(_oContainerPanel, 
            oSpritePanel.width/2-(oSpritePanel.width/2+200)/2, oSpritePanel.height/2-150, oSpritePanel.width/2+200, oSpritePanel.height/2+50, 
            80, "center", COLOR_1, FONT, 1,
            0, 0,
            TEXT_ERR_LS,
            true, true, true,
            false );
      
            var oSprite = s_oSpriteLibrary.getSprite('but_exit');
            _oButExit = new CGfxButton(oSpritePanel.width-oSprite.width/2-30, oSprite.height/2+30, oSprite, _oContainerPanel);
            _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        
        _oFade.alpha = 0;
        createjs.Tween.get(_oFade).to({alpha:0.7}, 500).call(function(){
                                                    _oContainerPanel.alpha = 0;
                                                    _oContainerPanel.visible = true;
                                                    createjs.Tween.get(_oContainerPanel).to({alpha:1}, 700);
                                            }); 
    };
    
    this.unload = function(){
        createjs.Tween.get(_oContainer).to({alpha:0},500).call(function(){
            s_oStage.removeChild(_oContainer);

            _oButExit.unload();
        }); 
        
        _oFade.off("click",_oListenerBlock);
    };
    
    this._init();   
};


