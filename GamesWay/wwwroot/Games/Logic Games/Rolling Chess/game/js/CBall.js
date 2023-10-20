function CBall(oPhysic, oParentContainer) {
    var _oPhysic;
    var _oParentContainer;    
    var _oBallSprite;
    
    var _bActive;

    this._init = function () {
        _bActive = true;
        
        var oSprite = s_oSpriteLibrary.getSprite('ball');
        _oBallSprite = createBitmap(oSprite);  
        _oBallSprite.regX = oSprite.width * 0.5;
        _oBallSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oBallSprite);
    };
    
    this.unload = function(){
        _bActive = false;
        s_oPhysicsController.destroyBodyVector(_oPhysic);
        createjs.Tween.removeTweens(_oBallSprite);        
        _oParentContainer.removeChild(_oBallSprite);        
    };
    
    this.setActive = function(bValue){
        _bActive = bValue;
    };
    
    this.getPhysic = function(){
        return _oPhysic;
    };
    
    this.getSprite = function(){
        return _oBallSprite;
    };
    
    this._moveSpritePosOnPhysicPos = function(){
        var oInfos = s_oPhysicsController.getBodyPosition(_oPhysic);
        _oBallSprite.x = oInfos.x;
        _oBallSprite.y = oInfos.y;
        _oBallSprite.rotation = oInfos.angle;
        
        if (oInfos.x > CANVAS_WIDTH-100 || oInfos.x < 0+100) {
            s_oGame.onBallOutOfScreen();
        }        
    };

    this.update = function () {
        if (!_bActive) {
            return;
        }
        
        //  CHECK IF THE BALL HAS STOPPED AND IS BLOCKED
        if ( _oPhysic.GetLinearVelocity().Length() < BALL_STOP_VELOCITY_LIMIT || _oPhysic.IsAwake() === false) {
            s_oGame.onBallStopped();
        }        
        
        this._moveSpritePosOnPhysicPos();
    };

    _oPhysic = oPhysic;
    _oParentContainer = oParentContainer;

    this._init();
}