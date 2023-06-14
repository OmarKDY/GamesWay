function CBoardPoint(iX,iY,iIndex,oParentContainer){
    var _bClickable;
    var _iMill;
    var _iIndex = iIndex;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    var _oPiecePointer;
    
    var _oHighlight;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    var _oThis = this;
    
    this._init = function(iX,iY){
        this.reset();
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oListener = _oContainer.on("click",this._onClickPoint,this);
        _oParentContainer.addChild(_oContainer);
        
        _oHighlight = createBitmap(s_oSpriteLibrary.getSprite("highlight"));
        _oContainer.addChild(_oHighlight);
        
        _oContainer.regX = _oContainer.getBounds().width/2;
        _oContainer.regY = _oContainer.getBounds().height/2;
    };
    
    this.unload = function(){
        _oContainer.off("click",_oListener);
        createjs.Tween.removeTweens(_oContainer);
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.reset = function(){
        _iMill = -1;
        _oPiecePointer = null;
        _bClickable = false;
    };
    
    this.highlight = function(){
        _bClickable = true;
        
        _oContainer.scaleX = _oContainer.scaleY = 0.1;
        _oContainer.visible = true;
        _oContainer.alpha = 0;
        createjs.Tween.get(_oContainer,{loop:true}).to({alpha: 1,scaleX:0.3,scaleY:0.3}, 1000, createjs.Ease.quartOut).to({alpha: 0,scaleX:0.1,scaleY:0.1}, 1000, createjs.Ease.quartOut)
    };
    
    this.disable = function(){
        _bClickable = false;
        createjs.Tween.removeTweens(_oContainer);
        _oContainer.visible = false;
        _oContainer.alpha = 0;
    };
    
    this.enable = function(){
        _bClickable = true;
    };
    
    this._onClickPoint = function(){
        if(!_bClickable){
            return;
        }
        
        _oThis.disable();
        
        
        if(_aCbCompleted[ON_SELECT_POINT]){
           _aCbCompleted[ON_SELECT_POINT].call(_aCbOwner[ON_SELECT_POINT],_iIndex);
       }
    };
    
    this.setState = function(oPiece){
        _oPiecePointer = oPiece;
    };
    
    this.setMill = function(iMill){
        _iMill = iMill;
    };
    
    this.getMill = function(){
        return _iMill;
    };
    
    this.isInMill = function(){
        return _iMill===-1?false:true;
    };
    
    this.getState = function(){
        if(_oPiecePointer === null){
            return -1;
        }
        
        return _oPiecePointer.getType();
    };
    
    this.getPiece = function(){
        return _oPiecePointer;
    };
    
    this._init(iX,iY);
}