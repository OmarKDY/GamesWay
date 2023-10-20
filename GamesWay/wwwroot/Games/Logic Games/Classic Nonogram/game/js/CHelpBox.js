function CHelpBox(oParentContainer, iX, iY){

    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerUp;
    var _bActive;

    var _oParentContainer = oParentContainer;
    var _oContainer;
    var _iWidth;
    var _iHeight;


    var _oBg;
    var _oText;

    this._init = function(iX, iY){
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        _bActive = true;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        var oSprite = s_oSpriteLibrary.getSprite("help_box");
        _oBg = createBitmap(oSprite);
        _oContainer.addChild(_oBg);

        _iWidth = oSprite.width;
        _iHeight = oSprite.height;

        _oText = new CTLText(_oContainer, 
                25, 25, _iWidth-50, _iHeight-60, 
                60, "center", COLOR_1, FONT, 1,
                50, 10,
                TEXT_TUTORIAL[0],
                true, true, true,
                false 
        );

        _oContainer.x = iX;
        _oContainer.y = iY;
        _oContainer.cursor = "pointer";
        _oContainer.regX = _iWidth/2;

        this._initListener();
    };

    this.unload = function(){
        _oContainer.off("mousedown", _oListenerDown);
        _oContainer.off("pressup" , _oListenerUp); 
        _oParentContainer.removeChild(_oContainer);
    };

    this._initListener = function(){
        _oListenerDown = _oContainer.on("mousedown", this.buttonDown);
        _oListenerUp = _oContainer.on("pressup" , this.buttonRelease);      
    };

    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };

    this.buttonRelease = function(){
        if(_bActive === false){
            return;
        }

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };
    
    this.buttonDown = function(){
        if(_bActive === false){
            return;
        }

        playSound("click",1,false);
       
        if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
        }
    };

    this.activate = function(){
        _bActive = true;
        _oContainer.cursor = "pointer";
    };
    
    this.deactivate = function(){
        _bActive = false;
        _oContainer.cursor = "default";
    };

    this.setX = function(iX){
        _oContainer.x = iX;
    };

    this.setY = function(iY){
        _oContainer.y = iY;
    };

    this.setRegX = function(iRegX){
        _oContainer.regX = iRegX;
    };

    this.setRegY = function(iRegY){
        _oContainer.regY = iRegY;
    };

    this.setText = function(szText){
        _oText.refreshText(szText);
    };

    this.setVisible = function(bVisible){
        _oContainer.visible = bVisible;
    };

    this.refreshScale = function(){
        _oContainer.scale = CUR_INTERFACE_SCALE;
    };

    this.getWidth = function(){
        return _iWidth;
    };

    this.getHeight = function(){
        return _iHeight;
    };

    this._init(iX, iY);
}