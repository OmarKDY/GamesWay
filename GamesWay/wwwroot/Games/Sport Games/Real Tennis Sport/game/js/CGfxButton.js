function CGfxButton(iXPos, iYPos, oSprite, oParentContainer) {

    var _bDisabled;
    var _bCached = true;

    var _iScaleFactor;

    var _aCbCompleted;
    var _aCbOwner;

    var _oButton;
    var _oTween;
    var _oParent;

    this._init = function (iXPos, iYPos, oSprite, oParentContainer) {
        _bDisabled = false;

        _iScaleFactor = 1;

        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        _oButton = createBitmap(oSprite);
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.scaleX = _oButton.scaleY = _iScaleFactor;
        _oButton.regX = oSprite.width / 2;
        _oButton.regY = oSprite.height / 2;
        _oButton.cache(0, 0, _oButton.regX * 2, _oButton.regY * 2);

        oParentContainer.addChild(_oButton);

        this._initListener();
    };

    this.unload = function () {
        if (s_bMobile) {
            _oButton.off("mousedown", this.buttonDown);
            _oButton.off("pressup", this.buttonRelease);
        } else {
            _oButton.off("mousedown", this.buttonDown);
            _oButton.off("mouseover", this.buttonOver);
            _oButton.off("pressup", this.buttonRelease);
        }

        oParentContainer.removeChild(_oButton);
    };

    this.setVisible = function (bVisible) {
        _oButton.visible = bVisible;
    };

    this.setClickable = function (bVal) {
        _bDisabled = !bVal;
    };

    this._initListener = function () {
        if (s_bMobile) {
            _oButton.on("mousedown", this.buttonDown);
            _oButton.on("pressup", this.buttonRelease);
        } else {
            _oButton.on("mousedown", this.buttonDown);
            _oButton.on("mouseover", this.buttonOver);
            _oButton.on("pressup", this.buttonRelease);
        }
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.buttonRelease = function () {
        if (_bDisabled) {
            return;
        }
        _oButton.scaleX = _iScaleFactor;
        _oButton.scaleY = _iScaleFactor;

        if (_bCached) {
            _oButton.updateCache();
        }

        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };

    this.buttonDown = function () {
        if (_bDisabled) {
            return;
        }
        _oButton.scaleX = _iScaleFactor * 0.9;
        _oButton.scaleY = _iScaleFactor * 0.9;

        if (_bCached) {
            _oButton.updateCache();
        }

        playSound("click", 1, false);

        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
        }
    };

    this.buttonOver = function (evt) {
        if (!s_bMobile) {
            if (_bDisabled) {
                return;
            }
            evt.target.cursor = "pointer";
        }
    };

    this.pulseAnimation = function () {
        _oTween = createjs.Tween.get(_oButton).to({scaleX: _iScaleFactor * 1.1, scaleY: _iScaleFactor * 1.1}, 850, createjs.Ease.quadOut).to({scaleX: _iScaleFactor, scaleY: _iScaleFactor}, 650, createjs.Ease.quadIn).call(function () {
            _oParent.pulseAnimation();
        });
        this.uncache();
    };

    this.trembleAnimation = function () {
        _oTween = createjs.Tween.get(_oButton).to({rotation: 5}, 75, createjs.Ease.quadOut).to({rotation: -5}, 140, createjs.Ease.quadIn).to({rotation: 0}, 75, createjs.Ease.quadIn).wait(750).call(function () {
            _oParent.trebleAnimation();
        });
        this.uncache();
    };

    this.uncache = function () {
        _oButton.uncache();
        _bCached = false;
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

    _oParent = this;
    this._init(iXPos, iYPos, oSprite, oParentContainer);

    return this;
}