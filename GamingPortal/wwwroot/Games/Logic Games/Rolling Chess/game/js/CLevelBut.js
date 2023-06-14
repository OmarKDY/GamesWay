function CLevelBut(iXPos, iYPos, iIndex,oSprite,bActive,oParentContainer) {
    var _bActive;
    var _aCbCompleted;
    var _aCbOwner;    
    var _aButton = [];
    var _aParams = [];
    var _aStarsBoxes;
    var _aStars;
    
    var _oTextContainer;
    var _oButton;
    var _oContainer;
    var _oParentContainer;
    
    var _mousedown;
    var _pressup;

    this._init = function (iXPos, iYPos, iIndex, oSprite, bActive) {        
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        var oData = {
            images: [oSprite],
            frames: {width: oSprite.width / 2, height: oSprite.height, regX: (oSprite.width / 2) / 2, regY: oSprite.height / 2},
            animations: {state_true: [0], state_false: [1]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _bActive = bActive;
        _oButton = createSprite(oSpriteSheet, "state_" + _bActive, (oSprite.width / 2) / 2, oSprite.height / 2, oSprite.width / 2, oSprite.height);

        _oButton.mouseEnabled = bActive;
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.stop();
		
        if (!s_bMobile && _bActive){
            _oContainer.cursor = "pointer";
        }
        
        _oContainer.addChild(_oButton);
        _aButton.push(_oButton);
        
        _oTextContainer = new createjs.Container();
        _oTextContainer.x = _oButton.x;
        _oTextContainer.y = _oButton.y;
        _oContainer.addChild(_oTextContainer);
        
        var oTextBack = new createjs.Text(iIndex+1, FONT_SIZE_LEVEL_BUTTON + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        oTextBack.textAlign = "center";
        oTextBack.x = 2;
        oTextBack.y = - 25;
        oTextBack.outline = 5;
        _oTextContainer.addChild(oTextBack);

        var oText = new createjs.Text(iIndex+1, FONT_SIZE_LEVEL_BUTTON + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        oText.textAlign = oTextBack.textAlign;
        oText.x = oTextBack.x;
        oText.y = oTextBack.y;
        _oTextContainer.addChild(oText);
        
        if(!_bActive){
            oText.color = "#999";
        }
        
        _aStarsBoxes = new Array();
        _aStars = new Array();
        var oSprite;

        for (var i = 0; i < 3; i++){
            if (s_aStars[iIndex] && s_aStars[iIndex] > i){
                oSprite = s_oSpriteLibrary.getSprite("star");
            } else {
                oSprite = s_oSpriteLibrary.getSprite("starbox");
            }
            _aStarsBoxes.push(createBitmap(oSprite,oSprite.width,oSprite.height));
            _aStarsBoxes[i].regX = oSprite.width * 0.5;
            _aStarsBoxes[i].regY = oSprite.height * 0.5;
            _aStarsBoxes[i].scaleX = 0.7;
            _aStarsBoxes[i].scaleY = _aStarsBoxes[i].scaleX;
            _oContainer.addChild(_aStarsBoxes[i]);
        }
        
        _aStarsBoxes[0].x = iXPos-40;
        _aStarsBoxes[0].y = iYPos-40;
        _aStarsBoxes[1].x = iXPos;
        _aStarsBoxes[1].y = iYPos-55;
        _aStarsBoxes[2].x = iXPos+40;
        _aStarsBoxes[2].y = iYPos-40;
        
        this._initListener();
    };

    this.unload = function () {
        _oContainer.off("mousedown", _mousedown);
        _oContainer.off("pressup", _pressup);
        _oContainer.removeChild(_oButton);
    };

    this._initListener = function () {
        _mousedown = _oContainer.on("mousedown", this.buttonDown);
        _pressup = _oContainer.on("pressup", this.buttonRelease);
    };

    this.viewBut = function (oButton) {
        _oContainer.addChild(oButton);
    };

    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.addEventListenerWithParams = function (iEvent, cbCompleted, cbOwner, aParams) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };

    this.ifClickable = function () {
        if (_oContainer.mouseEnabled === true) {
            return 1;
        }
        return 0;
    };

    this.setActive = function (iLevel, bActive) {
        _bActive = bActive;
        _aButton[iLevel].gotoAndStop("state_" + _bActive);
        _aButton[iLevel].mouseEnabled = true;
    };

    this.buttonRelease = function () {
        if(!_bActive){
            return;
        }
        
        playSound("click", 1, 0);

        if (_aCbCompleted[ON_MOUSE_UP]) {
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP], _aParams);
        }
    };

    this.buttonDown = function () {
        if (_bActive) {
            _oButton.scaleX = _oButton.scaleY = 0.9;
            _oTextContainer.scaleX = _oTextContainer.scaleY = 0.9;
            for (var i = 0; i < _aStarsBoxes.length; i++){
                _aStarsBoxes[i].scaleX = _aStarsBoxes[i].scaleY = 0.7;
            }
        }
        if (_aCbCompleted[ON_MOUSE_DOWN]) {
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN], _aParams);                                
        }
    };
    
    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };

    this.setVisible = function (bVisible) {
        _oContainer.visible = bVisible;
    };
    
    _oParentContainer = oParentContainer;
    this._init(iXPos, iYPos, iIndex,oSprite, bActive,oParentContainer);
}