function CLaunchBoard(oParentContainer) {

    var _pContainerPos;
    var _oLaunchText;
    var _oLaunchTextStroke;
    var _oLaunch;
    var _oParentContainer = oParentContainer;
    var _oContainer;
    var _oBounds;

    this._init = function () {

        _pContainerPos = {x: CANVAS_WIDTH_HALF + 660, y: CANVAS_HEIGHT - 60};
        _oContainer = new createjs.Container();
        _oContainer.x = _pContainerPos.x;
        _oContainer.y = _pContainerPos.y;
        _oParentContainer.addChild(_oContainer);

        _oLaunchText = new createjs.Text("0" + TEXT_OF + NUM_OF_PENALTY, "70px " + FONT_GAME, TEXT_COLOR);
        _oLaunchText.textAlign = "right";
        _oLaunchText.y = -14;
        _oContainer.addChild(_oLaunchText);

        _oContainer.y = _pContainerPos.y;
        _oParentContainer.addChild(_oContainer);

        _oLaunchTextStroke = new createjs.Text("0" + TEXT_OF + NUM_OF_PENALTY, "70px " + FONT_GAME, TEXT_COLOR_STROKE);
        _oLaunchTextStroke.textAlign = "right";
        _oLaunchTextStroke.y = _oLaunchText.y;
        _oLaunchTextStroke.outline = OUTLINE_WIDTH;
        _oContainer.addChild(_oLaunchTextStroke);

        var oSprite = s_oSpriteLibrary.getSprite("shot_left");
        _oLaunch = createBitmap(oSprite);
        _oLaunch.x = -_oLaunchText.getBounds().width * 1.4;
        _oLaunch.regX = oSprite.width * 0.5;
        _oLaunch.regY = 10;

        _oContainer.addChild(_oLaunch);

        _oBounds = _oContainer.getBounds();
    };

    this.getStartPos = function () {
        return _pContainerPos;
    };

    this.setPos = function (iX, iY) {
        _oContainer.x = iX;
        _oContainer.y = iY;
    };

    this.refreshTextLaunch = function (iLaunch, iNumLaunch) {
        _oLaunchText.text = iLaunch + TEXT_OF + iNumLaunch;
        _oLaunchTextStroke.text = _oLaunchText.text;
        _oLaunch.x = -_oLaunchText.getBounds().width * 1.4;
    };
    this._init();

    return this;
}