function CLevelButton(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,oParentContainer){
    var _bUnlocked;
    var _iCurScale;

    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerUp;
    var _oParams;
    
    var _oButton;

    var _oScoreIcon;
    var _oText;
    var _oScore;
    var _oButtonBg;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize){
        _bUnlocked = false;
        _iCurScale = 1;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        var oData = {   
                    images: [oSprite], 
                    // width, height & registration point of each sprite
                    frames: {width: oSprite.width/2, height: oSprite.height, regX: oSprite.width/4, regY: oSprite.height/2}, 
                    animations: {state_true:0,state_false:1}
            };
            
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oParentContainer.addChild(_oButton);


        _oButtonBg = createSprite(oSpriteSheet, "state_"+_bUnlocked,oSprite.width/4,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oButtonBg.stop();
        _oButton.mouseEnabled = true;
        
        _oButton.cursor = "pointer";

	if (!s_bMobile){
            _oButton.cursor = "pointer";
	}
        _oButton.addChild(_oButtonBg,_oText);

        _oParentContainer.addChild(_oButton);
        
        _oText = new CTLText(_oButton, 
                    -oSprite.width/4+15, -oSprite.height/4+15, oSprite.width/2-30, oSprite.height/2-30, 
                    iFontSize, "center", szColor, szFont, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false 
        );

        _oScore = new CTLText(_oButton, 
            -oSprite.width/4+50, oSprite.height/4, oSprite.width/2-100, 30, 
            30, "center", szColor, szFont, 1,
            0, 0,
            "",
            true, true, false,
            false 
        );

        _oScoreIcon = createBitmap(s_oSpriteLibrary.getSprite("score_icon"));
        _oScoreIcon.x = -oSprite.width/4+15;
        _oScoreIcon.y = oSprite.height/4-2;
        _oButton.addChild(_oScoreIcon);

        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerDown);
       _oButton.off("pressup" , _oListenerUp); 
       
       _oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.setTextX = function(iX){
        _oText.x = iX;
    };
    
    this.setScale = function(iScale){
        _oButton.scaleX = _oButton.scaleY = iScale;
        _iCurScale = iScale;
    };
    
    this.enable = function(){
        _bUnlocked = true;
        _oButtonBg.gotoAndStop("state_true");
    };
    
    this.disable = function(){
        _bUnlocked = false;
        _oButtonBg.gotoAndStop("state_false");
    };
    
    this._initListener = function(){
       _oListenerDown = _oButton.on("mousedown", this.buttonDown);
       _oListenerUp = _oButton.on("pressup" , this.buttonRelease);      
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
        if(!_bUnlocked){
            return;
        }
        
        playSound("click",1,false);
        
        _oButton.scaleX = _iCurScale;
        _oButton.scaleY = _iCurScale;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],parseInt(_oText.getMsg()));
        }
    };
    
    this.buttonDown = function(){
        if(!_bUnlocked){
            return;
        }
        _oButton.scaleX = _iCurScale*0.9;
        _oButton.scaleY = _iCurScale*0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.tweenPosition = function(iXPos,iYPos,iTime,iDelay,oEase,oCallback,oCallOwner){
        createjs.Tween.get(_oButton).wait(iDelay).to({x:iXPos,y:iYPos}, iTime,oEase).call(function(){
            if(oCallback !== undefined){
                oCallback.call(oCallOwner);
            }
        }); 
    };
    
    this.changeText = function(szText){
        _oText.refreshText(szText);
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };

    this.setScore = function(iScore){
        _oScore.refreshText(iScore.toString());
        if(iScore != ""){
            _oScoreIcon.visible = true;
        }else{
            _oScoreIcon.visible = false;
        }
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
        return _oButtonBg;
    };
    
    this.getScale = function(){
        return _oButton.scaleX;
    };

    this.getText = function(){
        return _oText._szText;
    }

    this.isUnlocked = function(){
        return _bUnlocked;
    }
    
    this._init(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize);
}