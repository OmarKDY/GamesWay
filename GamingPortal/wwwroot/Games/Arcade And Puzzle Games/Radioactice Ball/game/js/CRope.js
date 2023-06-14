function CRope(iXPos, iYPos, oSprite, iSpeed) {

    var _oRope;
    var _oInfoData = {};
    var _iSpeed;
    var _iSpeedRate;
    var _iSpeedDown;
    var _bAncorate;
    var _iOffsetWallUp;
    var _bAggance;
    var _iTime;
    this._init = function () {

        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 2, height: oSprite.height, regX: (oSprite.width / 2) / 2, regY: 0},
            animations: {move: [0], ancorate: [1]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oRope = createSprite(oSpriteSheet, "move", (oSprite.width / 2) / 2, 0, oSprite.width / 2, oSprite.height);

        _oRope.x = iXPos;
        _oRope.y = iYPos;

        _iSpeedDown = 0;

        _iTime = TIME_ROPE;

        _iSpeedRate = iSpeed;

        _bAggance = false;

        _oInfoData["Unloaded"] = true;

        _bAncorate = false;

        _iSpeed = ROPE_SPEED * _iSpeedRate;

        //console.log(_iSpeed);

        _iOffsetWallUp = EDGEBOARD_X + 1;

        s_oStage.addChild(_oRope);

        s_oStage.setChildIndex(_oRope, 5);

        
        playSound("rope_launch",1,false);
        
    };

    this.getX = function () {
        return _oRope.x;
    };

    this.getY = function () {
        return _oRope.y;
    };

    this.setPosition = function (iXPos, iYPos) {
        if (iXPos === null) {

        } else {
            _oRope.x = iXPos;
        }
        if (iYPos === null) {

        } else {
            _oRope.y = iYPos;
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
        s_oStage.removeChild(_oRope);
        s_oRope = null;
    };

    this.setVelocityRate = function (iValue) {
        _iSpeedRate = iValue;
        _iSpeed = BALL_SPEED * _iSpeedRate;
    };

    this.aggance = function (bVal) {
        _bAggance = bVal;
        _iTime += 300;
    };

    this.isAgganced = function () {
        return _bAggance;
    };

    this.update = function () {
        if (_oRope.y > _iOffsetWallUp && _bAggance === false) {
            _oRope.y -= _iSpeed;
        }
        else {
            if (_bAncorate === false) {
                _oRope.gotoAndStop("ancorate");
                _bAncorate = true;
                
                playSound("rope_hoocked",1,false);
                
                createjs.Tween.get(_oRope).to({alpha: 0}, _iTime).call(function () {
                    if (_oInfoData["Unloaded"] === true) {
                        s_oGame.unloadRope(_oInfoData["ID"]);
                        s_oGame.combo(0, 0, false);
                    }
                });
            }
        }
    };

    s_oRope = this;

    this._init();
}

var s_oRope;



