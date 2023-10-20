function CEncouragement(iX,iY){
    var _oMsgText;
    var _oMsgTextBack;
    var _oContainer;
    
    this._init = function(iX,iY){
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        s_oStage.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('encouragment');
        var oBg = createBitmap(oSprite);
        _oContainer.addChild(oBg);

        var iWidth = 750;
        var iHeight = 80;
        _oMsgTextBack = new CTLText(_oContainer, 
                    oSprite.width/2 -iWidth/2 +2, 55 - iHeight/2, iWidth, iHeight, 
                    70, "center", "#000", FONT_GAME, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );

        _oMsgText = new CTLText(_oContainer, 
                    oSprite.width/2-iWidth/2, 53 - iHeight/2, iWidth, iHeight, 
                    70, "center", "#FFCC00", FONT_GAME, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
        
    };
    
    this.show = function(szText){
        _oMsgTextBack.refreshText( szText );
        _oMsgText.refreshText( szText );
        
        var oParent = this;
        createjs.Tween.get(_oContainer).to({y:50}, 500,createjs.Ease.quartOut).call(function(){setTimeout(function(){oParent.hide();},1000 )}); 
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({y:-200}, 1000,createjs.Ease.quartOut);
    };
    
    this._init(iX,iY);
}