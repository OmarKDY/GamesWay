function CSponsor(iX,iY,bLeft,oParentContainer){
    var _bReadyForRemoval;
    var _bLeft = bLeft;
    var _iStartX;
    var _iStartY;
    var _iArrivalX;
    var _iArrivalY;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(iX,iY){
        _bReadyForRemoval = false;
        _iStartX = iX;
        _iStartY = iY;
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.scaleX = _oContainer.scaleY = 0.1;
        _oParentContainer.addChild(_oContainer);
        
        var oSpriteSponsor = s_oSpriteLibrary.getSprite("sponsor");
        var oSponsor = createBitmap(oSpriteSponsor);
        oSponsor.regX = oSpriteSponsor.width/2;
        oSponsor.regY = oSpriteSponsor.height/2;
        
        _oContainer.addChild(oSponsor);
        
        if(_bLeft){
            oSponsor.rotation = 5;
            _iArrivalX = -oSpriteSponsor.width/2; 
        }else{
            oSponsor.rotation = -5;
            _iArrivalX = CANVAS_WIDTH+oSpriteSponsor.width/2; 
        }
        
        _iArrivalY = iY-40;
    };
    
    this.reset = function(){
        _oContainer.visible = false;
        this._resetAnim();
    };
    
    this.startAnim = function(){
        
        _oContainer.visible = true;
        _oContainer.alpha = 0;
        new createjs.Tween.get(_oContainer).to({alpha:1}, 1000)
        new createjs.Tween.get(_oContainer).to({x:_iArrivalX,y:_iArrivalY}, TIME_OPPONENT_RUN, createjs.Ease.quintIn).call(function(){
                                                                                                if(_bReadyForRemoval){
                                                                                                    _oContainer.visible = false;
                                                                                                }else{
                                                                                                    _oThis._resetAnim();
                                                                                                    _oThis.startAnim();
                                                                                                }
                                                                                              
                                                                                });
                                                                                

        
        new createjs.Tween.get(_oContainer).to({scaleX:1,scaleY:1},TIME_OPPONENT_RUN,createjs.Ease.quartIn);
    };
    
    this._resetAnim = function(){
        _bReadyForRemoval = false;
        _oContainer.x = _iStartX;
        _oContainer.y = _iStartY;
        _oContainer.scaleX = _oContainer.scaleY = 0.1;
    };
    
    this.readyForRemoval = function(){
        _bReadyForRemoval = true;
    };
    
    this.stopTween = function(){
        createjs.Tween.removeTweens(_oContainer);
    };
    
    this._init(iX,iY);
}