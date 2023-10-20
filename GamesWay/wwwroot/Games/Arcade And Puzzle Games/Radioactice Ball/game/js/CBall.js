function CBall(iXPos, iYPos, oSprite, iXDir, iSpeed, iType, iColor, bActive) {

    var _oBall;
    var _oInfoData = {};
    var _oDirection = {};
    var _iOffsetWallRight;
    var _iOffsetWallLeft;
    var _iOffsetWallUp;
    var _iOffsetWallDown;
    var _bDownWall;
    var _iSpeed;
    var _iSpeedRate;
    var _iSpeedDown;
    var _iForceUp;

    this._init = function () {

        _oBall = createBitmap(oSprite);

        _oBall.x = iXPos;
        _oBall.y = iYPos;

        _iSpeedDown = 0;

        _bDownWall = false;

        _oInfoData["Radius"] = oSprite.height / 2;
        _oInfoData["Type"] = iType;
        _oInfoData["Score"] = BALL_SCORE[iType];
        _oInfoData["Color"] = iColor;
        _oInfoData["Active"] = bActive;

        _oDirection.x = iXDir;
        _oDirection.y = 1;

        _oBall.regX = _oInfoData["Radius"];
        _oBall.regY = _oInfoData["Radius"];

        var iEdgeRightWidth = -76 - _oInfoData["Radius"];
        var iEdgeLeftWidth = 76 + _oInfoData["Radius"];
        var iEdgeDownWidth = _oInfoData["Radius"] + EDGEBOARD_X;
        var iEdgeUpWidth = _oInfoData["Radius"] + EDGEBOARD_X;
        _iOffsetWallRight = CANVAS_WIDTH + iEdgeRightWidth;
        _iOffsetWallLeft = iEdgeLeftWidth;
        _iOffsetWallDown = CANVAS_HEIGHT - iEdgeDownWidth;
        _iOffsetWallUp = iEdgeUpWidth;

        _iSpeedRate = iSpeed;

        _iSpeed = BALL_SPEED * _iSpeedRate;

        _iForceUp = -(BALL_DOWN_ACCELLERATION * MAX_FORCE_UP_RATE) * FORCE_RATE_BALL[iType];

        s_oStage.addChild(_oBall);

        s_oStage.setChildIndex(_oBall, 5);
    };

    this.edgeOffset = function () {
        var iEdgeRightWidth = -EDGEBOARD_Y - 21 - _oInfoData["Radius"];
        var iEdgeLeftWidth = EDGEBOARD_Y + 21 + _oInfoData["Radius"];
        var iEdgeDownWidth = _oInfoData["Radius"] + EDGEBOARD_X;
        var iEdgeUpWidth = _oInfoData["Radius"] + EDGEBOARD_X;
        _iOffsetWallRight = CANVAS_WIDTH + iEdgeRightWidth;
        _iOffsetWallLeft = iEdgeLeftWidth;
        _iOffsetWallDown = CANVAS_HEIGHT - iEdgeDownWidth;
        _iOffsetWallUp = iEdgeUpWidth;
    };

    this.changeDirection = function (iXDir) {
        _oDirection.x = iXDir;
    };

    this.downFloor = function (bVal) {
        _bDownWall = bVal;
    };

    this.getDirectionY = function () {
        return _oDirection.y;
    };

    this.getX = function () {
        return _oBall.x;
    };

    this.getY = function () {
        return _oBall.y;
    };

    this.setPosition = function (iXPos, iYPos) {
        if (iXPos === null) {

        } else {
            _oBall.x = iXPos;
        }
        if (iYPos === null) {

        } else {
            _oBall.y = iYPos;
        }
    };

    this.setVisible = function (bVal) {
        _oBall.visible = bVal;
    };

    this.getActive = function () {
        return _oInfoData["Active"];
    };

    this.setActive = function (bVal) {
        _oInfoData["Active"] = bVal;
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
        s_oStage.removeChild(_oBall);
        s_oBall = null;
    };

    this.resetSpeed = function () {
        _iSpeedDown = 0;
    };

    this.setVelocityRate = function (iValue) {
        _iSpeedRate = iValue;
        _iSpeed = BALL_SPEED * _iSpeedRate;
    };

    this.bounceUp = function () {
        _iSpeedDown = _iForceUp;
    };

    this.bounceDown = function () {
        _iSpeedDown = -_iForceUp - 0.4;
    };

    this.changeType = function (iType) {
        if (_oInfoData["Type"] !== iType) {
            _oInfoData["Type"] = iType;
            _oInfoData["Score"] = BALL_SCORE[iType];
            _iForceUp = -(BALL_DOWN_ACCELLERATION * MAX_FORCE_UP_RATE) * FORCE_RATE_BALL[iType];
            var oSpriteBall = s_oSpriteLibrary.getSprite("ball" + _oInfoData["Color"] + "_" + _oInfoData["Type"]);
            _oBall.image = oSpriteBall;
            _oInfoData["Radius"] = oSpriteBall.width / 2;
            this.edgeOffset();
            _oBall.regX = _oInfoData["Radius"];
            _oBall.regY = _oInfoData["Radius"];
        }
    };

    this.addExplosion = function () {
        var oExplosion;
        var oSpriteExplosion = s_oSpriteLibrary.getSprite("explosion" + _oInfoData["Color"] + "_" + _oInfoData["Type"]);
        oExplosion = createBitmap(oSpriteExplosion);
        oExplosion.x = _oBall.x;
        oExplosion.y = _oBall.y;
        oExplosion.regX = oSpriteExplosion.width / 2;
        oExplosion.regY = oSpriteExplosion.height / 2;
        oExplosion.scaleX = 0;
        oExplosion.scaleY = 0;
        s_oStage.addChild(oExplosion);
        s_oStage.setChildIndex(oExplosion, 5);

        playSound("ball_explosion",1,false);
        

        createjs.Tween.get(oExplosion).to({scaleX: 2, scaleY: 2}, 300).call(function () {
            s_oStage.removeChild(oExplosion);
        });
    };

    this.update = function (fphysics) {

        _oBall.x += (_iSpeed * _oDirection.x);

        _iSpeedDown += BALL_DOWN_ACCELLERATION;

        _oBall.y += _iSpeedDown;

        if (_oBall.x >= _iOffsetWallRight) {
            _oDirection.x *= -1;
            playSound("boing",1,false);
        } else if (_oBall.x <= _iOffsetWallLeft) {
            _oDirection.x *= -1;
            playSound("boing",1,false);
        }
        if (_oBall.y >= _iOffsetWallDown) {
            //_oDirection.y *= -1;
            this.bounceUp();
            playSound("boing",1,false);
        } else if (_oBall.y <= _iOffsetWallUp) {
            this.bounceDown();
        }
    };

    s_oBall = this;

    this._init();
}

var s_oBall;

