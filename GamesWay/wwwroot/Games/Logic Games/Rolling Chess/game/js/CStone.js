function CStone(oPhysic, oParentContainer) {
    var _oPhysic;
    var _oParentContainer;    
    var _oStoneSprite;
    
    var _bActive;

    this._init = function () {
        _bActive = true;
        
        var oSprite = s_oSpriteLibrary.getSprite('stone_ball');
        _oStoneSprite = createBitmap(oSprite);  
        _oStoneSprite.regX = oSprite.width * 0.5;
        _oStoneSprite.regY = oSprite.height * 0.5;
        _oParentContainer.addChild(_oStoneSprite);      
    };
    
    this.unload = function(){
        _bActive = false;
        s_oPhysicsController.destroyBodyVector(_oPhysic);
        _oParentContainer.removeChild(_oStoneSprite);        
    };

    this._moveSpritePosOnPhysicPos = function(){
        var oInfos = s_oPhysicsController.getBodyPosition(_oPhysic);
        _oStoneSprite.x = oInfos.x;
        _oStoneSprite.y = oInfos.y;
        _oStoneSprite.rotation = oInfos.angle;
    };
    
    this.getPhysic = function(){
        return _oPhysic;
    };

    this.update = function () {
        if (!_bActive) {
            return;
        }
        this._moveSpritePosOnPhysicPos();
    };

    _oPhysic = oPhysic;
    _oParentContainer = oParentContainer;

    this._init();
}