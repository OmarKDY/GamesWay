function CLevelBut(iXPos,iYPos,oSprite,bActive, Level, oParentContainer){
    var _bActive;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];
    var _aStars;
    var _oContainer;
    var _oButton;
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    var _oTween;
    
    this._init = function(iXPos,iYPos,oSprite,bActive, Level, oParentContainer){
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        oParentContainer.addChild(_oContainer);
        
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        if(bActive){
            var iWidth = oSprite.width/2-5;
        }else{
            var iWidth = oSprite.width/2;
        }
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {state_true:[0],state_false:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
         
        _bActive = bActive;
        _oButton = createSprite(oSpriteSheet, "state_"+_bActive,(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
         
        _oContainer.mouseEnabled = bActive;

        _oButton.stop();
        if (!s_bMobile){
            _oContainer.cursor = "pointer";
	}
        _oContainer.addChild(_oButton);
        
        var _oLevelText = new createjs.Text(Level,"60px "+FONT, "#0075b8");
        _oLevelText.textAlign = "center";
        _oLevelText.textBaseline = "middle";
        _oLevelText.lineWidth = 200;
        _oLevelText.outline = 8;
        _oContainer.addChild(_oLevelText);
        
        _oLevelText = new createjs.Text(Level,"60px "+FONT, "#FFFFFF");
        _oLevelText.textAlign = "center";
        _oLevelText.textBaseline = "middle";
        _oLevelText.lineWidth = 200;
        _oContainer.addChild(_oLevelText);
        
        
        _aStars = new Array();
        var oSprite = s_oSpriteLibrary.getSprite('star_empty');
        for(var i=0; i<3; i++){
            _aStars[i] = createBitmap(oSprite);
            _aStars[i].regX = oSprite.width/2;
            _aStars[i].regY = oSprite.height/2;
            _aStars[i].scaleX = _aStars[i].scaleY =  0.5;
            _aStars[i].x = -30 + i*30;
            _aStars[i].y = -70 - (i%2 === 0 ? 0:10);
            _aStars[i].rotation = -20 +i*20;
            _aStars[i].visible = false;
            _oContainer.addChild(_aStars[i]);
        }
        
        this._initListener();
    };
    
    this.unload = function(){
       _oContainer.off("mousedown", _oListenerMouseDown);
       _oContainer.off("pressup" , _oListenerMouseUp);
	   
       oParentContainer.removeChild(_oContainer);
    };
    
    this._initListener = function(){
       _oListenerMouseDown = _oContainer.on("mousedown", this.buttonDown);
       _oListenerMouseUp = _oContainer.on("pressup" , this.buttonRelease);      
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
    
    this.ifClickable = function(){
        if(_oContainer.mouseEnabled === true){
            return 1;
        }
        return 0;
    };
    
    this.setActive = function(iLevel, bActive){
        _bActive = bActive;
        _oButton.gotoAndStop("state_"+_bActive);
        _oContainer.mouseEnabled = true;
    };
    
    this.buttonRelease = function(){
        if(_oTween){
            _oContainer.scaleX = 1;
            _oContainer.scaleY = 1;
        }

        playSound("click",1,false);
        
        _bActive = !_bActive;
        _oButton.gotoAndStop("state_"+_bActive);

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
        if(_oTween){
            _oContainer.scaleX = 0.9;
            _oContainer.scaleY = 0.9;
        }

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oContainer.x = iXPos;
         _oContainer.y = iYPos;
    };
    
    this.setVisible = function(bVisible){
        _oContainer.visible = bVisible;
    };
    
    this.setStars = function(iNumStars){
        var oSprite = s_oSpriteLibrary.getSprite('star_filled');
        for(var i=0; i<3; i++){
            _aStars[i].visible = true;
            if(i<iNumStars){
                _aStars[i].image = oSprite;
            }
        }
    };
    
    this.pulseAnimation = function () {
        var oParent = this;
        _oTween = createjs.Tween.get(_oContainer).to({scaleX: 0.9, scaleY: 0.9}, 850, createjs.Ease.quadOut).to({scaleX: 1, scaleY: 1}, 650, createjs.Ease.quadIn).call(function () {
            oParent.pulseAnimation();
        });
    };
    
    this._init(iXPos,iYPos,oSprite,bActive, Level, oParentContainer);
    
}