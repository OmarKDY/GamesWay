function CCoin(oPhysic, iID, oParentContainer) {
    var _oPhysic;
    var _oParentContainer;    
    var _oCoinSprite;
    
    var _iID;
    var _bActive;

    this._init = function () {
        _bActive = true;
                
        var oSprite = s_oSpriteLibrary.getSprite('coin');
        _oCoinSprite = createBitmap(oSprite);
        _oCoinSprite.regX = oSprite.width * 0.5;
        _oCoinSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oCoinSprite);        
    };

    this.calculateTweenSpeed = function(oPos){
        var iX = _oCoinSprite.x - oPos.x;
        var iY = _oCoinSprite.y - oPos.y;
        var iDistance = Math.sqrt(iX*iX + iY*iY);
        var iSpeed = (COIN_SPEED_TWEEN_MAX * iDistance) / CANVAS_WIDTH;        
        if (iSpeed < COIN_SPEED_TWEEN_MIN) {
            iSpeed = COIN_SPEED_TWEEN_MIN;
        }
        return iSpeed;
    };
    
    this.onCoinTaken = function(oPos){
        if (_bActive === false) {
            return;
        }
        _bActive = false;
        
        var oParent = this;
        var iSpeed = this.calculateTweenSpeed(oPos);
        
        createjs.Tween.get(_oCoinSprite)
            .to({x: oPos.x, y: oPos.y, scaleX: 0.7, scaleY: 0.7}, iSpeed, createjs.Ease.backIn)
            .call(function(){
                oParent.unload();
                s_oGame.onCoinTweenFinished();
            });
    };
    
    this.unload = function(){
        _bActive = false;
        s_oPhysicsController.destroyBodyVector(_oPhysic);
        createjs.Tween.removeTweens(_oCoinSprite);        
        _oParentContainer.removeChild(_oCoinSprite);        
    };

    this._moveSpritePosOnPhysicPos = function(){
        var oInfos = s_oPhysicsController.getBodyPosition(_oPhysic);
        _oCoinSprite.x = oInfos.x;
        _oCoinSprite.y = oInfos.y;
        //_oCoinSprite.rotation = oInfos.angle;
    };
    
    this.getPhysic = function(){
        return _oPhysic;
    };

    this.getID = function(){
        return _iID;
    };
    
    this.isActive = function(){
        return _bActive;
    };

    this.update = function () {
        if (!_bActive) {
            return;
        }
        this._moveSpritePosOnPhysicPos();
    };

    _oPhysic = oPhysic;
    _oParentContainer = oParentContainer;
    _iID = iID;

    this._init();
}