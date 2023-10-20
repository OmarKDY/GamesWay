function CTextButton(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,oParentContainer){
    var _bDisable;
    var _iWidth;
    var _iHeight;
    var _aCbCompleted;
    var _aCbOwner;
    var _oParams;
    var _oButton;
    var _oText;
    var _oButtonBg;
    var _oParentContainer = oParentContainer;
    
    this._init =function(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize){
        _bDisable = false;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        
	_iWidth = oSprite.width;
        _iHeight = oSprite.height;
        
        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        _oParentContainer.addChild(_oButton);
        
        
        _oButtonBg = createBitmap( oSprite);
        _oButton.addChild(_oButtonBg);
        
        var iWidth = oSprite.width-20;
        var iHeight = oSprite.height-20;
       
        var iX = oSprite.width / 2;
        var iY = oSprite.height/2;
        /*
        _oTextBack = new CTLText(_oButton, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iFontSize, "center", szColor, szFont, 1,
                    2, 2,
                    szText,
                    true, true, true,
                    false );
        _oTextBack.setOutline(4);*/
        _oText = new CTLText(_oButton, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iFontSize, "center", szColor, szFont, 1,
                    2, 2,
                    szText,
                    true, true, true,
                    false );


	if (!s_bMobile){
            _oButton.cursor = "pointer";
	}
        
        
        
       
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.removeAllEventListeners();
       createjs.Tween.removeTweens(_oButton);
       
       _oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };

    
    this.enable = function(){
        _bDisable = false;

    };
    
    this.disable = function(){
        _bDisable = true;
	
    };
    
    this._initListener = function(){
       _oButton.on("mousedown", this.buttonDown);
       _oButton.on("pressup" , this.buttonRelease);      
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
    
    this.showWithAlpha = function(){
        _oButton.alpha = 0;
        createjs.Tween.get(_oButton).to({alpha: 1}, 800, createjs.Ease.cubicOut);
    };
    
    this.setAlpha = function(iAlpha){
        _oButton.alpha = iAlpha;
    };
            
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        playSound("click",1,false);
        
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_oParams);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
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
    
     this.pulseAnimation = function () {
        createjs.Tween.get(_oButton,{loop:-1}).to({scaleX: 0.9, scaleY: 0.9}, 850, createjs.Ease.quadOut).to({scaleX: 1, scaleY: 1}, 650, createjs.Ease.quadIn);
    };
    
    this.changeText = function(szText){
        _oText.refreshText(szText);
        //_oTextBack.refreshText(szText);
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

    this._init(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize);
    
    return this;
    
}