function CSeqButton(i,iXPos,iYPos,oSpriteOn){
    var _iIndex;
    
    var _oSpriteOn;
    var _oHitArea;
    
    var _aCbCompleted;
    var _aCbOwner;
    
    this._init = function(i,iXPos,iYPos,oSpriteOn){
        _iIndex = i;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oSpriteOn = createBitmap(oSpriteOn);
        _oSpriteOn.x = iXPos;
        _oSpriteOn.y = iYPos;
        _oSpriteOn.visible = false;
        s_oStage.addChild(_oSpriteOn);   
                                
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("yellow").drawRect(0,0,oSpriteOn.width,oSpriteOn.height);
        _oHitArea.x = iXPos;
        _oHitArea.y = iYPos;
        _oHitArea.alpha = 0.01;
        s_oStage.addChild(_oHitArea);                      
         
         this._initListener();
    };
    
    this.unload = function(){
        _oHitArea.off("pressup",this.buttonRelease);
    };
    
    this._initListener = function(){
         _oHitArea.on("pressup",this.buttonRelease);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent]     = cbOwner; 
    };
    
    this.buttonRelease = function(){
        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_iIndex);
        }
    };
    
    this.darken = function(){
        _oSpriteOn.visible = false;
    };
    
    this.enlight = function(){
        _oSpriteOn.visible = true;
    };
    
    this._init(i,iXPos,iYPos,oSpriteOn);
}