function CGfxButton(iXPos,iYPos,oSprite){
    
    var _iScale;
    var _oListenerDown;
    var _oListenerRelease;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oButton;
    
    this._init =function(iXPos,iYPos,oSprite){
        
        _iScale = 1;
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oButton = createBitmap( oSprite);
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
                                   
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
       
        _oButton.cursor = "pointer";
        s_oStage.addChild(_oButton);
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerDown);
       _oButton.off("pressup" , _oListenerRelease); 
       
       s_oStage.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){
       _oListenerDown = _oButton.on("mousedown", this.buttonDown);
       _oListenerRelease = _oButton.on("pressup" , this.buttonRelease);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.buttonRelease = function(){
        _oButton.scaleX = _iScale;
        _oButton.scaleY = _iScale;
        
        playSound("click",1,false);
        
        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        _oButton.scaleX = _iScale*0.9;
        _oButton.scaleY = _iScale*0.9;
        
        
        
        if(_aCbCompleted[ON_MOUSE_DOWN]){
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
        }
    };
    
    this.setScale = function(iValue){
        _iScale = iValue;
        _oButton.scaleX = iValue;
        _oButton.scaleY = iValue;
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };
    
    
    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };

    this._init(iXPos,iYPos,oSprite);
    
    return this;
}