function CGfxButton(iXPos,iYPos,oSprite, oParentContainer){
    var _bDisable;
    
    var _iScaleFactor;
    var _iWidth;
    var _iHeight;
    
    var _aParams;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerOver;
    var _oListenerRelease;
    
    var _oButton;
    var _oTween;
    var _oParent;
    
    this._init =function(iXPos,iYPos,oSprite, oParentContainer){
        _bDisable = false;
        
        _iScaleFactor = 1;
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oButton = createBitmap( oSprite);
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oButton.scaleX =   _oButton.scaleY = _iScaleFactor;                         
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
       
        oParentContainer.addChild(_oButton);        
        
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;
        
        this._initListener();
    };
    
    this.unload = function(){
        createjs.Tween.removeTweens(_oButton);
        if(s_bMobile){
            _oButton.off("mousedown", _oListenerDown);
            _oButton.off("pressup" , _oListenerRelease);
        } else {
            _oButton.off("mousedown", _oListenerDown);
            _oButton.off("mouseover",_oListenerOver);
            _oButton.off("pressup" , _oListenerRelease);
        }
        
       oParentContainer.removeChild(_oButton);
    };
    
    this.enable = function(){
        _bDisable = false;
        
        _oButton.filters = [];

        _oButton.cache(0,0,_iWidth,_iHeight);
    };
    
    this.disable = function(){
        _bDisable = true;
        
        var matrix = new createjs.ColorMatrix().adjustSaturation(-100);
        _oButton.filters = [
                 new createjs.ColorMatrixFilter(matrix)
        ];
        _oButton.cache(0,0,_iWidth,_iHeight);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){
        _oListenerDown = _oButton.on("mousedown", this.buttonDown);
        _oListenerRelease = _oButton.on("pressup" , this.buttonRelease);
        if(!s_bMobile){
            _oListenerOver = _oButton.on("mouseover", this.buttonOver);
        }     
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
        if(_bDisable){
            return;
        }
        _oButton.scaleX = _iScaleFactor;
        _oButton.scaleY = _iScaleFactor;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        _oButton.scaleX = _iScaleFactor*0.9;
        _oButton.scaleY = _iScaleFactor*0.9;

        playSound("click",1,false);

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };
    
    this.buttonOver = function(evt){
        if(!s_bMobile){
            if(_bDisable){
                return;
            }
            evt.target.cursor = "pointer";
        }  
    };
    
    this.inversePulse = function(){
        _oTween = createjs.Tween.get(_oButton).to({scaleX: _iScaleFactor*1.1, scaleY: _iScaleFactor*1.1}, 1050, createjs.Ease.quadOut).to({scaleX: _iScaleFactor, scaleY: _iScaleFactor}, 850, createjs.Ease.quadIn).call(function () {
            _oParent.inversePulse();
        });
    };
    
    this.pulseAnimation = function () {
        _oTween = createjs.Tween.get(_oButton,{loop:-1}).to({scaleX: _iScaleFactor*0.9, scaleY: _iScaleFactor*0.9}, 850, createjs.Ease.quadOut).to({scaleX: _iScaleFactor, scaleY: _iScaleFactor}, 650, createjs.Ease.quadIn);
    };

    this.trembleAnimation = function () {
        _oTween = createjs.Tween.get(_oButton).to({rotation: 5}, 75, createjs.Ease.quadOut).to({rotation: -5}, 140, createjs.Ease.quadIn).to({rotation: 0}, 75, createjs.Ease.quadIn).wait(750).call(function () {
            _oParent.trebleAnimation();
        });
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
    
    this.isDisabled = function(){
        return _bDisable;
    };
    
    _oParent = this;
    this._init(iXPos,iYPos,oSprite, oParentContainer);
    
    return this;
}