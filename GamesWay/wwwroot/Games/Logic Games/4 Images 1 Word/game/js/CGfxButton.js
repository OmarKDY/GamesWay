function CGfxButton(oParentContainer, iXPos, iYPos, oSprite) {

    var _oParentContainer = oParentContainer;
    var _bBlock;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerUp;
    
    var _oButton;
    var _cParam;
    var _cParam2;
    var _iParam;
    var _iParam2;
    var _iParam3;
    var _iScale;


    this._init = function (iXPos, iYPos, oSprite) {

        _bBlock = false;

        _iScale = 1;

        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        _oButton = createBitmap(oSprite);
        _oButton.x = iXPos;
        _oButton.y = iYPos;

        _oButton.regX = oSprite.width / 2;
        _oButton.regY = oSprite.height / 2;

        _oParentContainer.addChild(_oButton);
        _oButton.cursor = "pointer";

        this._initListener();
    };

    this.changeChildIndex = function (index) {
        _oParentContainer.setChildIndex(_oButton, index);
    };

    this.unload = function () {
        _oButton.off("mousedown", _oListenerDown);
        _oButton.off("pressup",_oListenerUp);
        _oParentContainer.removeChild(_oButton);
    };

    this.setVisible = function (bVisible) {
        _oButton.visible = bVisible;
    };

    this.getVisible = function () {
        return  _oButton.visible;
    };

    this._initListener = function () {
        _oListenerDown = _oButton.on("mousedown", this.buttonDown);
        _oListenerUp = _oButton.on("pressup", this.buttonRelease);
    };

    this.setCursorType = function (szValue) {
        _oButton.cursor = szValue;
    };
	
	this.setAlpha = function(iAlpha){
		_oButton.alpha = iAlpha;
	};

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.addEventListenerWithParams = function (iEvent, cbCompleted, cbOwner, cParam, iParam, iParam2, cParam2, iParam3) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _cParam = cParam;
        _cParam2 = cParam2;
        _iParam = iParam;
        _iParam2 = iParam2;
        _iParam3 = iParam3;
    };

    this.buttonRelease = function () {

        if (_bBlock) {
            return;
        }
        _oButton.scaleX = 1 * _iScale;
        _oButton.scaleY = 1 * _iScale;
        playSound("click",1,false);
        
        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _cParam, _iParam, _iParam2, _cParam2, _iParam3);
        }
    };

    this.buttonDown = function () {

        if (_bBlock) {
            return;
        }
        _oButton.scaleX = 0.95 * _iScale;
        _oButton.scaleY = 0.95 * _iScale;

        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _cParam, _iParam, _iParam2, _cParam2, _iParam3);
        }
    };


    this.getScale = function () {
        return _iScale;
    };

    this.setPosition = function (iXPos, iYPos) {
        _oButton.x = iXPos;
        _oButton.y = iYPos;
    };

    this.setX = function (iXPos) {
        _oButton.x = iXPos;
    };

    this.setY = function (iYPos) {
        _oButton.y = iYPos;
    };

    this.getButtonImage = function () {
        return _oButton;
    };


    this.getX = function () {
        return _oButton.x;
    };

    this.getY = function () {
        return _oButton.y;
    };

    this.block = function (bVal) {
        _bBlock = bVal;
    };

    this.setScale = function (iVal) {
        _iScale = iVal;
        _oButton.scaleX = iVal;
        _oButton.scaleY = iVal;
    };

    this._init(iXPos, iYPos, oSprite);

    return this;
}