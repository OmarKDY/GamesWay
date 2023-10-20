function CCharacter(iXPos, oSprite, iSpeed) {

    var _oCharacter;
    var _oInfoData = {};
    var _iOffsetWallRight;
    var _iOffsetWallLeft;
    var _iOffsetCharacterWidth;
    var _iOffsetCharacterHeight;
    var _iSpeed;
    var _iSpeedRate;
    var _iSpeedDown;

    this._init = function () {

        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 6, height: oSprite.height, regX: (oSprite.width / 2) / 6, regY: oSprite.height / 2},
            animations: {run: [0, 3, "run", 0.5], shoot: [4], death: [5], idle: [0]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCharacter = createSprite(oSpriteSheet, "idle", (oSprite.width / 2) / 6, oSprite.height / 2, oSprite.width / 2, oSprite.height);
        
        var iOffsetHeightCharacter = CANVAS_HEIGHT - EDGEBOARD_X - oSprite.height/2 - 4;
        
        _oCharacter.x = iXPos;
        _oCharacter.y = iOffsetHeightCharacter;

        _iOffsetCharacterHeight = oSprite.height / 2;
        _iOffsetCharacterWidth = oSprite.width / 6;

        _iSpeedDown = 0;

        var iEdgeRightWidth = -(EDGEBOARD_Y+ _iOffsetCharacterWidth);
        var iEdgeLeftWidth =EDGEBOARD_Y + _iOffsetCharacterWidth;
        _iOffsetWallRight = CANVAS_WIDTH + iEdgeRightWidth;
        _iOffsetWallLeft = iEdgeLeftWidth;

        _iSpeedRate = iSpeed;
        
        _iSpeed = CHARACTER_SPEED * _iSpeedRate;

        s_oStage.addChild(_oCharacter);

        s_oStage.setChildIndex(_oCharacter, 4);
    };

    this.getX = function () {
        return _oCharacter.x;
    };

    this.getY = function () {
        return _oCharacter.y;
    };

    this.setPosition = function (iXPos, iYPos) {
        if (iXPos === null) {

        } else {
            _oCharacter.x = iXPos;
        }
        if (iYPos === null) {

        } else {
            _oCharacter.y = iYPos;
        }
    };
    
    this.rotate=function(iValue){
        _oCharacter.scaleX=iValue;
    };
    
    this.changeState=function(szState){
        if(szState==="run"){
            _oCharacter.gotoAndPlay(szState);
        }else{
            _oCharacter.gotoAndStop(szState);
        }
    };
    
    this.setInfoData = function (szKey, oValue) {
        _oInfoData[szKey] = oValue;
    };

    this.getInfoData = function (szKey) {
        return _oInfoData[szKey];
    };

    this.unload = function () {
        s_oStage.removeChild(_oCharacter);
        s_oCharacter = null;
    };

    this.update = function (iDir) {

        _oCharacter.x += (_iSpeed * iDir);

        if (_oCharacter.x >= _iOffsetWallRight) {
            _oCharacter.x = _iOffsetWallRight;
        } else if (_oCharacter.x <= _iOffsetWallLeft) {
             _oCharacter.x = _iOffsetWallLeft;
        }
    };

    s_oCharacter = this;

    this._init();
}

var s_oCharacter;

