function CHand(oParentContainer){

    var _oParentContainer = oParentContainer;
    var _oSprite;
    var _bVisible;
    var _szState;

    this._init = function(){
        _bVisible = true;
        _szState = "up";

        var oSprite = s_oSpriteLibrary.getSprite("touch_hand");
        var oData = {   
            images: [oSprite], 
            framerate:2,
            frames: {width:oSprite.width/2, height:oSprite.height, regX:25, regY:0}, 
            animations: {up:0,down:1,anim:[0,1]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oSprite = createSprite(oSpriteSheet,_szState,25,0,oSprite.width/2,oSprite.height);
        _oParentContainer.addChild(_oSprite);
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oSprite);
    };

    this.setVisible = function(bVisible){
        _bVisible = bVisible;
        _oSprite.visible = _bVisible;

        if(bVisible){
            _oSprite.gotoAndPlay("anim");
        }else{
            _oSprite.stop();
        }
    };

    this.setX = function(iX){
        _oSprite.x = iX;
    };

    this.setY = function(iY){
        _oSprite.y = iY;
    };

    this.setScale = function(iScale){
        _oSprite.scale = iScale;
    };

    this.setChildIndex = function(iChildIndex){
        _oParentContainer.setChildIndex(_oSprite, iChildIndex);
    };

    this.getWidth = function(){
        return _oSprite.width;
    };

    this.getHeight = function(){
        return _oSprite.height;
    };

    this._init();
}