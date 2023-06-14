function CLevelBut(iXPos,iYPos,oSprite,bActive, Level){
    var _bActive;
    var _aCbCompleted;
    var _aCbOwner;
    var _oBg;
    var _aParams = [];
    var _oButton;
    
    this._init = function(iXPos,iYPos,oSprite,bActive){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oButton.mouseEnabled = bActive;
        s_oStage.addChild(_oButton);
        if (!s_bMobile){
            _oButton.cursor = "pointer";
        }
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {state_true:[0],state_false:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
         
        _bActive = bActive;
        _oBg = createSprite(oSpriteSheet, "state_"+_bActive,(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oBg.stop();
        _oButton.addChild(_oBg);

       
        var iWidth = oSprite.width/2-30;
        var iHeight = 50;
        var iX = 4;
        var iY = 0;
        var oLevelStroke = new CTLText(_oButton, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    40, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    Level,
                    true, true, false,
                    false );
        oLevelStroke.setOutline(5);           
       
        var szColor = PRIMARY_FONT_COLOR;
        if(!bActive){
            szColor = DISABLED_COLOR;
        }
        
        var oLevel = new CTLText(_oButton, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    40, "center", szColor, PRIMARY_FONT, 1,
                    2, 2,
                    Level,
                    true, true, false,
                    false );

        this._initListener();
    };
    
    this.unload = function(){
       _oButton.removeAllEventListeners();
	   
       s_oStage.removeChild(_oButton);
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
    };
    
    this.viewBut = function(oButton){
        s_oStage.addChild(oButton);
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
        if(_oButton.mouseEnabled === true){
            return 1;
        }
        return 0;
    };
    
    this.setActive = function(iLevel, bActive){
        _bActive = bActive;
        _oBg.gotoAndStop("state_"+_bActive);
        _oButton.mouseEnabled = true;
    };
    
    this.buttonRelease = function(){
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;
        
        playSound("click", 1, false);
        
        _bActive = !_bActive;
        _oBg.gotoAndStop("state_"+_bActive);

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.buttonDown = function(){
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
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._init(iXPos,iYPos,oSprite,bActive);
}