function CMap(iX,iY,oParentContainer){
    var _iHeight;
    var _iOffsetY;
    var _iNewY;
    var _pStartPos;
    
    var _oPlayer;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY){
        _pStartPos = {x:iX,y:iY};
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("map_bg");
        var oBg = createBitmap(oSpriteBg);
        oBg.regX = oSpriteBg.width/2;
        _oContainer.addChild(oBg);
        
        var oSpritePlayer = s_oSpriteLibrary.getSprite("map_player");
        _oPlayer = createBitmap(oSpritePlayer);
        _oPlayer.regX = oSpritePlayer.width/2;
        _oPlayer.regY = oSpritePlayer.height/2;
        _oContainer.addChild(_oPlayer);
        
        _iHeight = oSpriteBg.height;
        
        this.refreshButtonPos();
    };
    
    this.refreshButtonPos = function(){
        _oContainer.x = _pStartPos.x - s_iOffsetX;
        _oContainer.y = _pStartPos.y + s_iOffsetY;
    };
    
    this.reset = function(iNumGate){
        _oPlayer.y = _iHeight-30;
        _iOffsetY = Math.floor(_oPlayer.y /(iNumGate+1));
        _iNewY = _oPlayer.y;
    };
    
    this.refreshPlayerPos = function(iTime,bEnd){
        _iNewY -=  _iOffsetY;

        createjs.Tween.removeTweens(_oPlayer);
        createjs.Tween.get(_oPlayer).to({y:_iNewY}, iTime).call(function(){
            if(bEnd){
                createjs.Tween.get(_oPlayer).to({y:10}, 6000);
            }
        });
    };
    
    this._init(iX,iY);
}