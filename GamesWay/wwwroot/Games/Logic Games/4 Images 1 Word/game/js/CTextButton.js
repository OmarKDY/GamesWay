function CTextButton(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize, iCenterX,oParentContainer) {

    var _bBlock;

    var _iScale;
    var _cParam;
    var _cParam2;
    var _iParam;
    var _iParam2;
    var _iParam3;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerUp;
    
    var _oButton;
    var _oText;
    var _oTextBack;
    var _bUsed;

    var _oExtraData = {};
    var _oParentContainer = oParentContainer;

    this._init = function (iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize) {

        _bBlock = false;

        _iScale = 1;

        _bUsed = false;

        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        var oButtonBg = createBitmap(oSprite);

        var iStepShadow = Math.ceil(iFontSize / 20);

        _oTextBack = new createjs.Text(szText, "bold " + iFontSize + "px " + szFont, "#000000");
        _oTextBack.textAlign = "center";
        _oTextBack.textBaseline = "alphabetic";
        var oBounds = _oTextBack.getBounds();
        _oTextBack.x = oSprite.width / 2 + iStepShadow;
        _oTextBack.y = Math.floor(((oSprite.height) / 2) + (oBounds.height / 3) + iStepShadow) + iCenterX;
        _oTextBack.alpha = 0.5;

        _oText = new createjs.Text(szText, "bold " + iFontSize + "px " + szFont, szColor);
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";
        var oBounds = _oText.getBounds();
        _oText.x = oSprite.width / 2;
        _oText.y = Math.floor(((oSprite.height) / 2) + (oBounds.height / 3)) + iCenterX;

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width / 2;
        _oButton.regY = oSprite.height / 2;
        _oButton.addChild(oButtonBg, _oTextBack, _oText);

        _oParentContainer.addChild(_oButton);
		_oButton.cursor = "pointer";
		
        this._initListener();
    };

    this.setExtraData = function (szKey, oValue) {
        _oExtraData[szKey] = oValue;
    };

    this.getExtraData = function (szKey) {
        return _oExtraData[szKey];
    };

    this.unload = function () {
        _oButton.off("mousedown", _oListenerDown);
        _oButton.off("pressup",_oListenerUp);
        _oParentContainer.removeChild(_oButton);
    };

    this.setUsed = function (bVal) {
        _bUsed = bVal;
    };

    this.getUsed = function () {
        return _bUsed;
    };

    this.getID = function () {
        return _iParam3;
    };

    this.setCursorType = function (szValue) {
        _oButton.cursor = szValue;
    };

    this.setTextCenterX = function (iXPos) {
        _oText += iXPos;
        _oText += iXPos;
    };

    this.changeChildIndex = function (index) {
        s_oStage.setChildIndex(_oButton, index);
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

        _oButton.scaleX = 0.9 * _iScale;
        _oButton.scaleY = 0.9 * _iScale;

        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _cParam, _iParam, _iParam2, _cParam2, _iParam3);
        }
    };


    this.setTextPosition = function (iY) {
        _oText.y = iY;
        _oTextBack.y = iY + 2;
    };

    this.getText = function () {
        return _oText.text;
    };

    this.setText = function (szText) {
        _oText.text = szText;
        _oTextBack.text = szText;
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

    this._init(iXPos, iYPos, oSprite, szText, szFont, szColor, iFontSize);

    return this;

}
