function CHandCursor(){
    var _oTween;
    
    var _oHandRight;
    var _oHandLeft;
    var _oText;
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = 100;
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oText = new CTLText(_oContainer, 
                    -250,  0, 200, 40, 
                    50, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        _oText.setShadow("#000",2,2,2);
        
        _oHandRight = createBitmap(s_oSpriteLibrary.getSprite("hand_direction"));
        _oHandRight.y = 50;
        _oContainer.addChild(_oHandRight);
        
        _oHandLeft = createBitmap(s_oSpriteLibrary.getSprite("hand_direction"));
        _oHandLeft.y = 50;
        _oHandLeft.scaleX *= -1;
        _oContainer.addChild(_oHandLeft);
    };
    
    this.reset = function(){
        _oHandRight.x = 0;
        _oHandLeft.x = 0;
    };
    
    this.show = function(bRight){
        if(bRight){
            _oText.setX(150);
            _oHandLeft.visible = false;
            _oHandRight.visible = true;
            _oText.refreshText(TEXT_GO_RIGHT);
            _oHandRight.x = 0;
            _oTween = createjs.Tween.get(_oHandRight,{loop:-1}).to({x:80}, 500, createjs.Ease.cubicOut).to({x:0}, 500, createjs.Ease.cubicIn);
        }else{
             _oText.setX(-150);
            _oHandLeft.visible = true;
            _oHandRight.visible = false;
            _oText.refreshText(TEXT_GO_LEFT);
            _oHandLeft.x = 0;
            _oTween = createjs.Tween.get(_oHandLeft,{loop:-1}).to({x:-80}, 500, createjs.Ease.cubicOut).to({x:0}, 500, createjs.Ease.cubicIn);
        }
        
        _oContainer.visible = true;
    };
    
    this.hide = function(){
        createjs.Tween.removeTweens(_oHandRight);
        createjs.Tween.removeTweens(_oHandLeft);
        _oContainer.visible = false;
        
        this.reset();
    };
    
    this._init();
}