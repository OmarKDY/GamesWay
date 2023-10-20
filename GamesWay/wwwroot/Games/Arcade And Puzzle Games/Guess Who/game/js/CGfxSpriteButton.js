function CGfxSpriteButton(iXPos,iYPos,oSprite,bAttach){
    var _bDisable = false;
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    var _oListenerMouseOver;
    var _oListenerMouseOut;
    
    this._init =function(iXPos,iYPos,oSprite,bAttach){
        var iWidth = oSprite.width/4;
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: oSprite.height, regX: iWidth/2, regY: oSprite.height/2}, 
                        animations: {  start: [0],over: [1],press: [2],disable: [3]}
                   };
        
        var oObjSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oButton = createSprite(oObjSpriteSheet, "start",iWidth/2,oSprite.height/2,iWidth,oSprite.height);
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oButton.stop();
        _oButton.cursor = "pointer";
        
        if(bAttach !== false){
            s_oStage.addChild(_oButton);
        }

        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerMouseDown);
       _oButton.off("pressup" , _oListenerMouseUp); 
       
       if(s_bMobile === false){
           _oButton.off("rollover",_oListenerMouseOver);
           _oButton.off("rollout",_oListenerMouseOut);
       }
       
       s_oStage.removeChild(_oButton);
    };
    
    this._initListener = function(){
       _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
       _oListenerMouseUp = _oButton.on("pressup" , this.buttonRelease);  
       
       if(s_bMobile === false){
           _oListenerMouseOver = _oButton.on("rollover",this.mouseOver);
           _oListenerMouseOut = _oButton.on("rollout",this.mouseOut);
       }
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.disable = function(){
        _bDisable = true;
        _oButton.gotoAndStop("disable");
    };
    
    this.enable = function(){
        _bDisable = false;
        _oButton.gotoAndStop("start");
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        playSound("click",1,false);
        
        _oButton.gotoAndStop("start");
        
        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        
        _oButton.gotoAndStop("press");
        
       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.mouseOver = function(){
        if(_bDisable){
            return;
        }
        
        _oButton.gotoAndStop("over");
        
        if(_aCbCompleted[ON_MOUSE_OVER]){
             _aCbCompleted[ON_MOUSE_OVER].call(_aCbOwner[ON_MOUSE_OVER],_oParams);
       }
    };
    
    this.mouseOut = function(){
        if(_bDisable){
            return;
        }
        
        _oButton.gotoAndStop("start");
        
        if(_aCbCompleted[ON_MOUSE_OUT]){
            _aCbCompleted[ON_MOUSE_OUT].call(_aCbOwner[ON_MOUSE_OUT],_oParams);
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
    
    this.getButtonImage = function(){
        return _oButton;
    };
    
    this.getSprite = function(){
        return _oButton;
    };
    
    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };

    this._init(iXPos,iYPos,oSprite,bAttach);
    
    return this;
}