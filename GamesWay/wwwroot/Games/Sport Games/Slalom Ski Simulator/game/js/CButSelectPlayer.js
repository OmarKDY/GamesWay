function CButSelectPlayer(iXPos,iYPos,oSprite,oParentContainer){
    var _bDisable;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _oListenerDown;
    var _oListenerRelease;
    
    var _oButtonStart;
    var _oButtonSelect;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init =function(iXPos,iYPos,oSprite){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos; 
        _oParentContainer.addChild(_oContainer);
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {state_start:[0],state_select:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
         
        _oButtonStart = createSprite( oSpriteSheet,"state_start",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oContainer.addChild(_oButtonStart);
                                   
        _oButtonSelect = createSprite( oSpriteSheet,"state_select",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oButtonSelect.alpha = 0;
        _oContainer.addChild(_oButtonSelect);
        _oContainer.cursor = "pointer";
        _oParentContainer.addChild(_oContainer);
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oContainer.off("mousedown", _oListenerDown);
       _oContainer.off("pressup" , _oListenerRelease); 
       
       _oParentContainer.removeChild(_oContainer);
    };
    
    this.setVisible = function(bVisible){
        _oContainer.visible = bVisible;
    };
    
    this._initListener = function(){
       _oListenerDown = _oContainer.on("mousedown", this.buttonDown);
       _oListenerRelease = _oContainer.on("pressup" , this.buttonRelease);      
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
        
        _bDisable = true;
        playSfxSound("click",1,false);
       
       createjs.Tween.get(_oButtonSelect).to({alpha:1}, 500).wait(500).call(function(){
                                                                if(_aCbCompleted[ON_MOUSE_UP]){
                                                                    _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
                                                                }
       });
        
        
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }


       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oContainer.x = iXPos;
    };
    
    this.setY = function(iYPos){
        _oContainer.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oContainer;
    };
    
    
    this.getX = function(){
        return _oContainer.x;
    };
    
    this.getY = function(){
        return _oContainer.y;
    };

    this._init(iXPos,iYPos,oSprite);
}