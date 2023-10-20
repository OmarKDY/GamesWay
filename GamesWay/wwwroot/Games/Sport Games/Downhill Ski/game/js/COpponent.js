function COpponent(bLast,iX,iY,iFinalX,iType,oParentContainer){
    var _bUpdate = false;
    var _bLast = bLast;
    var _iCurAnim;
    var _iFlip;
    var _iWidth;
    var _iHeight;
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
        
        var oSpriteItem = s_oSpriteLibrary.getSprite("item_"+iType);
        _iWidth = oSpriteItem.width;
        _iHeight = oSpriteItem.height;
        
        _oSprite = createBitmap(oSpriteItem);
        _oContainer.addChild(_oSprite);
        
        _oContainer.regX = _iWidth/2;
        _oContainer.regY = _iHeight;
        
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
        

         _oSpriteTween = new createjs.Tween.get(_oContainer).to({x:_iFinalX},TIME_OPPONENT_RUN,createjs.Ease.quintIn);
        
        new createjs.Tween.get(_oContainer).to({y:OPPONENT_FINAL_Y},TIME_OPPONENT_RUN,createjs.Ease.quintIn);
        new createjs.Tween.get(_oContainer).to({scaleX:1.2,scaleY:1.2},TIME_OPPONENT_RUN,createjs.Ease.quartIn).call(function(){
                                                                                                                                    _oThis.hide();
                                                                                                                        });
        
        _bUpdate = true;
    };
    
    this.hide = function(){
        _bUpdate = false;
        _oContainer.visible = false;

        if(_aCbCompleted[ON_OPPONENT_HIDE]){
            _aCbCompleted[ON_OPPONENT_HIDE].call(_aCbOwner[ON_OPPONENT_HIDE],_bLast);
        }
    };
    
    this.stopUpdate = function(){
        createjs.Tween.removeTweens(_oContainer);
        _bUpdate = false;
    };

    this.update = function(){
        if(_bUpdate && _oSpriteTween.position > TIME_OPPONENT_RUN*0.8){
            _bUpdate = false;

            if(_aCbCompleted[ON_OPPONENT_CHECK_COLLISION]){
                var oRect = new createjs.Rectangle(_oContainer.x -(_iWidth*_oContainer.scaleX)/2,_oContainer.y-(_iHeight*_oContainer.scaleY),
                                                                                (_iWidth*_oContainer.scaleX),_iHeight*_oContainer.scaleY);
                /*
                var oShapeRect = new createjs.Shape();
                oShapeRect.graphics.beginFill("red").drawRect(oRect.x, oRect.y, oRect.width,oRect.height);
                oShapeRect.alpha = 0.5;
                _oParentContainer.addChild(oShapeRect);
        */
                _aCbCompleted[ON_OPPONENT_CHECK_COLLISION].call(_aCbOwner[ON_OPPONENT_CHECK_COLLISION],oRect,_oContainer);
            }
        }
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY,iType);
}