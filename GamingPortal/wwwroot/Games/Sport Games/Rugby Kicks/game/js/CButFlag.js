function CButFlag(iXPos,iYPos,iFlag,szText,szFont,szColor,iFontSize,oParentContainer){
    var _bDisable;
    var _iScale;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerRelease;
    var _oListenerOver;
    var _oListenerOut;
	
    var _oParams;
    var _oButton;
    var _oText;
    var _oButtonBg;
    var _oParentContainer = oParentContainer;
    
    this._init =function(iXPos,iYPos,iFlag,szText,szFont,szColor,iFontSize){
        _bDisable = false;
        _iScale =1;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.cursor = "pointer";
        _oParentContainer.addChild(_oButton);
        
        
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite("team_"+iFlag)],
                        // width, height & registration point of each sprite
                        frames: {width: 402, height: 500, regX: 201, regY: 250}, 
                        animations: {idle:0,over:1}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        _oButtonBg = createSprite(oSpriteSheet, "idle",201,250,402,500);
        _oButton.addChild(_oButtonBg);
        
        _oText = new CTLText(_oButton, 
                    -120,200, 240, iFontSize, 
                    iFontSize, "center",szColor, PRIMARY_FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );


        
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerDown);
       _oButton.off("pressup" , _oListenerRelease); 
       
       if(!s_bMobile){
           _oButton.off("mouseover",_oListenerOver);
           _oButton.off("mouseout",_oListenerOut);
       }
       _oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };


    this.setScale = function(iScale){
        _iScale = iScale;
        _oButton.scaleX = _oButton.scaleY = iScale;
    };
    
    this._initListener = function(){
        _oListenerDown = _oButton.on("mousedown", this.buttonDown);
        _oListenerRelease = _oButton.on("pressup" , this.buttonRelease); 
        
        if(!s_bMobile){
           _oListenerOver = _oButton.on("mouseover",this.buttonOver);
           _oListenerOut = _oButton.on("mouseout",this.buttonOut);
        }
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,oParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        
        _oParams = oParams;
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        _bDisable = true;
        
        playSound("click",1,false);
        
        _oButton.scaleX = _iScale;
        _oButton.scaleY = _iScale;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_oParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        _oButton.scaleX = 0.9*_iScale;
        _oButton.scaleY = 0.9*_iScale;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.buttonOver = function(){
        if(_bDisable){
            return;
        }
        _oButtonBg.gotoAndStop("over");
    };
    
    this.buttonOut = function(){
        if(_bDisable){
            return;
        }
        _oButtonBg.gotoAndStop("idle");
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.changeText = function(szText){
        _oText.refreshText(szText);
    };
    
    this.playSelectedAnim = function(iX,iY){
        _bDisable = true;
        _oButtonBg.gotoAndStop("idle");
        
        new createjs.Tween.get(_oButton).wait(500).to({x:iX,y:iY,scaleX:1,scaleY:1},1500,createjs.Ease.cubicOut).wait(500).call(function(){
                                                            
                                                                                if(_aCbCompleted[ON_END_SELECT_ANIM]){
                                                                                    _aCbCompleted[ON_END_SELECT_ANIM].call(_aCbOwner[ON_END_SELECT_ANIM]);
                                                                                }
                                                                        });
    };
    
    this.playFadeOutAnim = function(){
        _bDisable = true;
        new createjs.Tween.get(_oButton).to({alpha:0},800);
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
    
    this.getSprite = function(){
        return _oButton;
    };

    this._init(iXPos,iYPos,iFlag,szText,szFont,szColor,iFontSize);
}