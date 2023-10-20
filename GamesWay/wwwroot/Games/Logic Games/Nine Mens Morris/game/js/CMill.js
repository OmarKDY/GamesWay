function CMill(oInfos,aListPoints,oParentContainer){
    var _aListPoints = aListPoints;
    var _oSprite;
    var _oParentContainer = oParentContainer;
    
    this._init = function(oInfos){
        _oSprite = createBitmap(s_oSpriteLibrary.getSprite("mill"+oInfos.type));
        _oSprite.visible = false;
        _oSprite.x = oInfos.x;
        _oSprite.y = oInfos.y;
        _oSprite.rotation = oInfos.rot;
        _oParentContainer.addChild(_oSprite);
    };
    
    this.show = function(){
        
        _oSprite.visible = true;
    };
    
    this.hide = function(){
        _oSprite.visible = false;
    };

    
    this.getPointList = function(){
        return _aListPoints;
    };
    
    this._init(oInfos);
}