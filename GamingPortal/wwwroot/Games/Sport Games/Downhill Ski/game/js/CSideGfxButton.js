function CSideGfxButton(bLeft,iXPos,iYPos,oSprite,oParentContainer){
    var _bDisable;
    var _bLeft = bLeft;
    var _iFinalX = iXPos;
    var _iStartX;
    var _iWidth;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oListenerDown;
    var _oListenerRelease;
    
    var _oButton;
    var _oParentContainer = oParentContainer;
    
    this._init =function(bLeft,iXPos,iYPos,oSprite){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oButton = createBitmap( oSprite);
        
        _oButton.y = iYPos; 
        
        _iWidth = oSprite.width;
        if(bLeft){
            _oButton.x = -oSprite.width;
            _oButton.regX = 0;
        }else{
            _oButton.x = CANVAS_WIDTH+oSprite.width;
            _oButton.regX = oSprite.width; 
        }
        
        _iStartX = _oButton.x;
        _oButton.regY = oSprite.height/2;
        _oButton.cursor = "pointer";
        _oParentContainer.addChild(_oButton);
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerDown);
       _oButton.off("pressup" , _oListenerRelease); 
       
       _oParentContainer.removeChild(_oButton);
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
    
    this.enable = function(){
        _bDisable = false;
    };
    
    this.disable = function(){
        _bDisable = true;
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        playSound("click",1,false);
        
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
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
    
    this.resetX = function(){
        if(_bLeft){
            _oButton.x = -_iWidth;
        }else{
            _oButton.x = CANVAS_WIDTH+_iWidth;
        }
        
    };
    
    this.setFinalX = function(iNewFinalX){
        _iFinalX = iNewFinalX;
        
        if(_bLeft){
            _iStartX = _iFinalX-_iWidth;
        }else{
            _iStartX = _iFinalX+_iWidth;
        }
    };
    
    this.tweenFinalX = function(){
        createjs.Tween.get(_oButton).to({x: _iFinalX}, 300, createjs.Ease.quartOut).call(function(){
                                                                                        if(_aCbCompleted[ON_BUT_END_TWEEN_X]){
                                                                                            _aCbCompleted[ON_BUT_END_TWEEN_X].call(_aCbOwner[ON_BUT_END_TWEEN_X]);
                                                                                        }
                                                                                });
    };
    
    this.tweenStartX = function(iDelay){
        createjs.Tween.get(_oButton).wait(iDelay).to({x: _iStartX}, 300, createjs.Ease.quartOut);
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

    this._init(bLeft,iXPos,iYPos,oSprite);
    
    return this;
}