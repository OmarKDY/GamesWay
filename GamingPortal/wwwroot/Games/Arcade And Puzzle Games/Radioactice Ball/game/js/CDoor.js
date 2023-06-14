function CDoor(iXPos, iYPos, oSprite) {

    var _oDoor;
    var _oInfoData = {};

    this._init = function () {

        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 3, height: oSprite.height, regX: (oSprite.width / 2) / 3, regY: oSprite.height / 2},
            animations: {open: [0, 2, "open", 0.2], close: [2, 0, "close", 0.2]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oDoor = createSprite(oSpriteSheet, "open", (oSprite.width / 2) / 2, oSprite.height / 2, oSprite.width / 3, oSprite.height);

        _oDoor.x = iXPos;
        _oDoor.y = iYPos;

        s_oStage.addChild(_oDoor);

        s_oStage.setChildIndex(_oDoor, 1);
    };

    this.getX = function () {
        return _oDoor.x;
    };

    this.getY = function () {
        return _oDoor.y;
    };

    this.childIndex = function (iVal) {
        s_oStage.setChildIndex(_oDoor, iVal);
    };

    this.setPosition = function (iXPos, iYPos) {
        if (iXPos === null) {

        } else {
            _oDoor.x = iXPos;
        }
        if (iYPos === null) {

        } else {
            _oDoor.y = iYPos;
        }
    };

    this.setInfoData = function (szKey, oValue) {
        _oInfoData[szKey] = oValue;
    };

    this.getInfoData = function (szKey) {
        return _oInfoData[szKey];
    };

    this.resetTheIndex = function (iValue) {
        _oInfoData["ID"] = iValue;
    };

    this.unload = function () {
        s_oStage.removeChild(_oDoor);
        s_oDoor = null;
    };

    this.changeState = function (szState, bVal) {
        if (bVal === true)
            _oDoor.gotoAndPlay(szState);
        else
            _oDoor.gotoAndStop(szState);
    };

    this.openDoorAndRemain = function () {
        _oDoor.gotoAndPlay("open");
        _oDoor.on("animationend", function () {
            _oDoor.gotoAndStop(2);
        });
    };

    this.update = function () {

    };

    s_oDoor = this;

    this._init();
}

var s_oDoor;



