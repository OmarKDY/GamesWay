function CSideToggle(bLeft,iDelaySpawn,iXPos,iYPos,oSprite,bActive,oParentContainer){
    var _bActive;
    var _iDelaySpawn = iDelaySpawn;
    var _iFinalX = iXPos;
    var _iStartX;
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    var _oParentContainer = oParentContainer;
    
    this._init = function(bLeft,iXPos,iYPos,oSprite,bActive){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        var iRegX = 0;
        if(bLeft === false){
            iRegX = oSprite.width/2; 
        }
        
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: iRegX, regY: oSprite.height/2}, 
                        animations: {state_true:[0],state_false:[1]}
                   };
                   
         var oSpriteSheet = new createjs.SpriteSheet(oData);
         
         _bActive = bActive;
	_oButton = createSprite(oSpriteSheet, "state_"+_bActive,iRegX,oSprite.height/2,oSprite.width/2,oSprite.height);
        
        if(bLeft){
            _oButton.x = -oSprite.width/2;
        }else{
            _oButton.x = CANVAS_WIDTH+oSprite.width/2;
        }
        
        _iStartX = _oButton.x;
        _oButton.y = iYPos; 
        _oButton.stop();
        _oButton.cursor = "pointer";
        _oParentContainer.addChild(_oButton);
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", this.buttonDown);
       _oButton.off("pressup" , this.buttonRelease);
	   
       _oParentContainer.removeChild(_oButton);
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.setActive = function(bActive){
        _bActive = bActive;
        _oButton.gotoAndStop("state_"+_bActive);
    };
    
    this.buttonRelease = function(){
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;
        
        playSound("click",1,false);
        
        _bActive = !_bActive;
        _oButton.gotoAndStop("state_"+_bActive);

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_bActive);
        }
    };
    
    this.buttonDown = function(){
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setY = function(iYPos){
        _oButton.y = iYPos;
    };
    
    this.setFinalX = function(iNewFinalX){
        _iFinalX = iNewFinalX;
    };
    
    this.tweenFinalX = function(){
        createjs.Tween.get(_oButton).wait(_iDelaySpawn).to({x: _iFinalX}, 300, createjs.Ease.quartOut).call(function(){
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
    
    this._init(bLeft,iXPos,iYPos,oSprite,bActive);
}