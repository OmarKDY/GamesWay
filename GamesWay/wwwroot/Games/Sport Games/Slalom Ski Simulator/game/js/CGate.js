function CGate(bLast,iX,iY,iFinalX,iType,oParentContainer){
    var _bUpdate = false;
    var _bLast = bLast;
    var _iCurAnim;
    var _iFlip;
    var _iWidthRect;
    var _iHeightRect;
    var _iFinalX = iFinalX;
    var _aCbCompleted;
    var _aCbOwner;
    var _oSpriteTween;
    
    var _pStartPos;
    var _oSprite;
    var _oThis = this;
    
    var _oContainer;
    var _oParentContainer;
    
    var _oThis = this;
    
    this._init = function(iX,iY,iType){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        _pStartPos = {x:iX,y:iY};
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.scaleX = _oContainer.scaleY = 0.05;
        _oParentContainer.addChild(_oContainer);
        

        _iWidthRect = 135;
        _iHeightRect = 366;
        
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite("gate_"+iType+"-0"),
                                 s_oSpriteLibrary.getSprite("gate_"+iType+"-1")], 
                        // width, height & registration point of each sprite
                        "frames": [
                                    [1, 1, 542, 366, 0, 0, 0],
                                    [545, 1, 542, 366, 0, 0, 0],
                                    [1089, 1, 542, 366, 0, 0, 0],
                                    [1, 369, 542, 366, 0, 0, 0],
                                    [545, 369, 542, 366, 0, 0, 0],
                                    [1089, 369, 542, 366, 0, 0, 0],
                                    [1, 737, 542, 366, 0, 0, 0],
                                    [545, 737, 542, 366, 0, 0, 0],
                                    [1089, 737, 542, 366, 0, 0, 0],
                                    [1, 1105, 542, 366, 0, 0, 0],
                                    [545, 1105, 542, 366, 0, 0, 0],
                                    [1089, 1105, 542, 366, 0, 0, 0],
                                    [1, 1473, 542, 366, 0, 0, 0],
                                    [545, 1473, 542, 366, 0, 0, 0],
                                    [1089, 1473, 542, 366, 0, 0, 0],
                                    [1, 1, 542, 366, 1, 0, 0],
                                    [545, 1, 542, 366, 1, 0, 0],
                                    [1089, 1, 542, 366, 1, 0, 0],
                                    [1, 369, 542, 366, 1, 0, 0],
                                    [545, 369, 542, 366, 1, 0, 0],
                                    [1089, 369, 542, 366, 1, 0, 0],
                                    [1, 737, 542, 366, 1, 0, 0],
                                    [545, 737, 542, 366, 1, 0, 0],
                                    [1089, 737, 542, 366, 1, 0, 0],
                                    [1, 1105, 542, 366, 1, 0, 0],
                                    [545, 1105, 542, 366, 1, 0, 0],
                                    [1089, 1105, 542, 366, 1, 0, 0]
                                ],
                        animations: {start:0,anim_right:[0,13,"start"],anim_left:[14,26,"start"]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oSprite = new createjs.Sprite(oSpriteSheet,"start");
        _oContainer.addChild(_oSprite);
        
        _oContainer.regX = 271;
        _oContainer.regY = _iHeightRect;
        
        this.show();
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.reset = function(){
        _oContainer.x = _pStartPos.x;
        _oContainer.y = _pStartPos.y;
        _oContainer.scaleX = _oContainer.scaleY = 0.05;
        
        _oSprite.visible = false;
        
        _iCurAnim = PLAYER_ANIM_RUN;
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.show = function(){
        _bUpdate = false;
        _iFlip = 1;
	this.reset();

        _oThis._startRun();
    };
    
    this._startRun = function(){
        
        _oSprite.visible = true;
        _oContainer.alpha = 0;
        _oContainer.visible = true;

        
        new createjs.Tween.get(_oContainer).to({alpha:1},1200);
        

        _oSpriteTween = new createjs.Tween.get(_oContainer).to({x:_iFinalX},TIME_GATE_RUN,createjs.Ease.quintIn);
        
        new createjs.Tween.get(_oContainer).to({y:GATE_FINAL_Y},TIME_GATE_RUN,createjs.Ease.quintIn);
        new createjs.Tween.get(_oContainer).to({scaleX:1.4,scaleY:1.4},TIME_GATE_RUN,createjs.Ease.quartIn).call(function(){
                                                                                                                                    _oThis.hide();
                                                                                                                        });
        
        _bUpdate = true;
    };
    
    this.hide = function(){
        _bUpdate = false;
        _oContainer.visible = false;

        if(_aCbCompleted[ON_GATE_HIDE]){
            _aCbCompleted[ON_GATE_HIDE].call(_aCbOwner[ON_GATE_HIDE],_bLast);
        }
    };
    
    this.stopUpdate = function(){
        createjs.Tween.removeTweens(_oContainer);
        _bUpdate = false;
    };
    
    this.playAnim = function(szSide){
        _oSprite.gotoAndPlay("anim_"+szSide);
        playSfxSound("hit_gate",1,false);
    };
    
    this.getContainer = function(){
        return _oContainer;
    };

    this.update = function(){
        if(_bUpdate && _oSpriteTween.position > TIME_GATE_RUN*0.79){
            _bUpdate = false;

            if(_aCbCompleted[ON_GATE_CHECK_COLLISION]){
                var oRect = new createjs.Rectangle( _oContainer.x-(_iWidthRect*_oContainer.scaleX)/2,
                                                    _oContainer.y-(_iHeightRect*_oContainer.scaleY),
                                                    (_iWidthRect*_oContainer.scaleX),
                                                    _iHeightRect*_oContainer.scaleY);
/*
                var oShapeRect = new createjs.Shape();
                oShapeRect.graphics.beginFill("red").drawRect(oRect.x, oRect.y, oRect.width,oRect.height);
                oShapeRect.alpha = 0.5;
                _oParentContainer.addChild(oShapeRect);
  */
                _aCbCompleted[ON_GATE_CHECK_COLLISION].call(_aCbOwner[ON_GATE_CHECK_COLLISION],oRect,this);
            }
        }
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY,iType);
}