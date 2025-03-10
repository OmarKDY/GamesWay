function CButTeam(iXPos, iYPos, iIndex, oParentContainer){
    var _iIndex;
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oButton;
    var _oText;
    var _oContainer;
    var _aParams;
    var _fScaleX;
    var _fScaleY;
    var _oParent;
    var _aListener;
    var _bBlock = false;

    var _oParentContainer = oParentContainer;

    this._init = function (iXPos, iYPos, iIndex) {
        _iIndex = iIndex;
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        _aParams = new Array();
        
        _fScaleX = 1;
        _fScaleY = 1;
        
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("flag_"+iIndex);
        _oContainer.regX = oSprite.width / 2;
        _oContainer.regY = oSprite.height / 2;
        _oContainer.scaleX = _fScaleX;
        _oContainer.scaleY = _fScaleY;
        _oContainer.cursor = "pointer";
        
        _oButton = createBitmap(oSprite);
        _oContainer.addChild(_oButton);

        var iWidth = 100;
        var iHeight = 22;
        _oText = new CTLText(_oContainer, 
                    oSprite.width/2-iWidth/2, oSprite.height/2 - iHeight/2 +44, iWidth, iHeight, 
                    20, "center", "#fff", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_TEAM[_iIndex],
                    true, true, true,
                    false );
       
        this._initListener();
    };

    this.unload = function () {
        _oContainer.off("mousedown", _aListener[0]);
        _oContainer.off("pressup", _aListener[1]);
        
        if(s_bMobile === false){
            _oContainer.off("mouseover", _aListener[2]);
            _oContainer.off("mouseout", _aListener[3]);
        }

        _oParentContainer.removeChild(_oContainer);
    };

    this.setVisible = function (bVisible) {
        _oContainer.visible = bVisible;
    };

    this._initListener = function () {
        _aListener = new Array();
        _aListener[0] = _oContainer.on("mousedown", this.buttonDown);
        _aListener[1] = _oContainer.on("pressup", this.buttonRelease);
        
        if(s_bMobile === false){
            _aListener[2] = _oContainer.on("mouseover", this.buttonOver);
            _aListener[3] = _oContainer.on("mouseout", this.buttonOut);
        }
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.buttonRelease = function () {

        if (_bBlock) {
            return;
        }

        playSound("click", 1, false);
    
        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_iIndex);
        }
    };

    this.buttonDown = function () {
        if (_bBlock) {
            return;
        }

        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _aParams[ON_MOUSE_DOWN]);
        }
    };
    
    this.buttonOver = function(){
        createjs.Tween.get(_oContainer).to({scaleX: 1.1,scaleY:1.1}, 300, createjs.Ease.quartOut);
    };
    
    this.buttonOut = function(){
        createjs.Tween.get(_oContainer).to({scaleX: _fScaleX,scaleY:_fScaleY}, 300, createjs.Ease.quartOut);
    };

    this.block = function (bVal) {
        _bBlock = bVal;
        _oContainer.scaleX = _fScaleX;
        _oContainer.scaleY = _fScaleY;
    };

    this._init(iXPos, iYPos, iIndex);

    _oParent = this;
}