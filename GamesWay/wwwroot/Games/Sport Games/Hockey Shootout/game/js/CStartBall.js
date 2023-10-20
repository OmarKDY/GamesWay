function CStartBall(iX, iY, oParetContainer) {

    var _oParentContainer = oParetContainer;
    var _oStartBall;

    this._init = function () {
        var oSprite = s_oSpriteLibrary.getSprite("disc");

        var iWidth = oSprite.width / 3;
        var iHeight = oSprite.height / 3;

        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: iWidth, height: iHeight, regX: iWidth / 2, regY: iHeight / 2}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oStartBall = createSprite(oSpriteSheet, 0, iWidth/2, iHeight / 2, iWidth, iHeight);
        _oStartBall.gotoAndStop(0);
        this.setPosition(iX, iY);

        _oParentContainer.addChild(_oStartBall);
    };

    this.setPosition = function (iX, iY) {
        _oStartBall.x = iX;
        _oStartBall.y = iY;
    };

    this.fadeAnim = function (fVal, iTime, iWait) {
        createjs.Tween.get(_oStartBall, {override: true}).wait(iWait).to({alpha: fVal}, iTime);
    };

    this.setAlpha = function (fVal) {
        _oStartBall.alpha = fVal;
    };

    this.setVisible = function (bVal) {
        _oStartBall.visible = bVal;
    };

    this._init();
    return this;
}