function CCharacter(iX,iY,iIndex,szName){
    var _bDisable = false;
    var _iCurIndex;
    var _iWidth;
    var _iHeight;
    var _oUnselectSprite;
    var _oSprite;
    var _oNameText;
    var _oOver;
    var _oContainer;
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    var _oListenerMouseOver;
    var _oListenerMouseOut;
    
    var _aCbCompleted;
    var _aCbOwner;
    
    this._init = function(iX,iY,iIndex,szName){
        _iCurIndex = iIndex;
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        s_oStage.addChild(_oContainer);
        
        var oBmp = s_oSpriteLibrary.getSprite('character_'+iIndex);
        _oSprite = createBitmap(oBmp);
        _oContainer.addChild(_oSprite);
        
        _iWidth = oBmp.width;
        _iHeight = oBmp.height;

        var iWidth = 120;
        var iHeight = 40;
        _oNameText = new CTLText(_oContainer, 
                    oBmp.width/2-iWidth/2, oBmp.height + 20 - iHeight/2, iWidth, iHeight, 
                    37, "center", "#fff", FONT_GAME, 1,
                    2, 2,
                    szName,
                    true, true, true,
                    false );
                    
        
        _oUnselectSprite = createBitmap(s_oSpriteLibrary.getSprite('disable_character'));
        _oUnselectSprite.visible = false;
        _oContainer.addChild(_oUnselectSprite);
        
        _oOver = createBitmap(s_oSpriteLibrary.getSprite('character_over'));
        _oOver.visible = false;
        _oContainer.addChild(_oOver);
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oSprite.off("mousedown", _oListenerMouseDown);
       _oSprite.off("pressup" , _oListenerMouseUp); 
       
       if(s_bMobile === false){
           _oSprite.off("rollover",_oListenerMouseOver);
           _oSprite.off("rollout",_oListenerMouseOut);
       }
       
    };
    
    this.enable = function(){
        _bDisable = false;
    };
    
    this.disable = function(){
        _bDisable = true;
        _oOver.visible = false;
    };
    
    this.unselect = function(){
        _bDisable = true;
        
        try{
            var matrix = new createjs.ColorMatrix().adjustBrightness(-40);
            _oSprite.filters = [
                     new createjs.ColorMatrixFilter(matrix)
            ];
            _oSprite.cache(0,0,_iWidth,_iHeight);
        }catch(e){
            //trace(e)
        }
        
        _oUnselectSprite.visible = true;
    };
    
    this.restore = function(){
        _bDisable = false;
        
        try{
            var matrix = new createjs.ColorMatrix().adjustBrightness(0);
            _oSprite.filters = [
                     new createjs.ColorMatrixFilter(matrix)
            ];
            _oSprite.cache(0,0,_iWidth,_iHeight);
        }catch(e){
            //trace(e)
        }
        
        
        _oUnselectSprite.visible = false;
    };
    
    this._initListener = function(){
       _oListenerMouseDown = _oSprite.on("mousedown", this.buttonDown);
       _oListenerMouseUp = _oSprite.on("pressup" , this.buttonRelease);  
       
       if(s_bMobile === false){
           _oListenerMouseOver = _oSprite.on("rollover",this.mouseOver);
           _oListenerMouseOut = _oSprite.on("rollout",this.mouseOut);
       }
       
       _oSprite.cursor = "pointer";
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        playSound("select_character",1,false);
        
        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_iCurIndex);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        
       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.mouseOver = function(){
        if(_bDisable){
            return;
        }
        
        _oOver.visible = true;
        
        if(_aCbCompleted[ON_MOUSE_OVER]){
             _aCbCompleted[ON_MOUSE_OVER].call(_aCbOwner[ON_MOUSE_OVER],_oParams);
       }
    };
    
    this.mouseOut = function(){
        if(_bDisable){
            return;
        }
        
        _oOver.visible = false;
        
        if(_aCbCompleted[ON_MOUSE_OUT]){
            _aCbCompleted[ON_MOUSE_OUT].call(_aCbOwner[ON_MOUSE_OUT],_oParams);
       }
    };
    
    this.isUnselectable = function(){
        return _oUnselectSprite.visible;
    };
    
    this._init(iX,iY,iIndex,szName);
}