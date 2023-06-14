function CHelpPanel(){
    
    var _oListener;
    
    var _oFade;
    var _oKey0;
    var _oKey1;
    var _oSprite;
    var _oButStart;
    var _oContainer;
    
    var _oThis = this;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oListener = _oFade.on("click",this._onStart,this);
        _oContainer.addChild(_oFade);
        
        var oSprite = s_oSpriteLibrary.getSprite("msg_box");
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width/2;
        oBg.regY = oSprite.height/2;
        oBg.x = CANVAS_WIDTH/2;
        oBg.y = CANVAS_HEIGHT/2; 
        _oContainer.addChild(oBg);
        

        var oTextTitle = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2-250, 500, 40, 
                    40, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_HOWTO,
                    true, true, false,
                    false );

        
        var iY = CANVAS_HEIGHT/2 - 150;
        for(var i=0;i<4;i++){
            var oTextDesc = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, iY, 500, 75, 
                    24, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_HELP[i],
                    true, true, true,
                    false );

            
            iY += 100;
        }
        
    };
    
    this.unload = function(){
        _oFade.off("click",_oListener);
    };
    
    this.show = function(){
       
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha:1},500);
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0} , 500,createjs.Ease.cubicOut).call(function(){
                                                                                    _oContainer.visible = false;
                                                                                });
    };

    this._onStart = function(){
        _oThis.hide();
        s_oGame.onExitFromHelp();
    };
    
    this._init();
}