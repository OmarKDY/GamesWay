function CMsgBox(){
    var _oBg;
    var _oMsgText;
    var _oButOk;
    var _oContainer;
    var _oListener;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.alpha = 0;
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oListener = _oBg.on("click", function () {});
        _oContainer.addChild(_oBg);

        var iWidth = 500;
        var iHeight = 140;
        _oMsgText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-iWidth/2, 320 - iHeight/2, iWidth, iHeight, 
                    64, "center", "#FF6699", FONT_GAME, 1,
                    2, 2,
                    TEXT_SCORE,
                    true, true, true,
                    false );
       
        var oSprite = s_oSpriteLibrary.getSprite('but_confirm');
        _oButOk = new CGfxButton((CANVAS_WIDTH/2),470,oSprite,_oContainer);
        _oButOk.addEventListener(ON_MOUSE_UP, this._onOk, this);
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oContainer);
        _oBg.off("click",_oListener);
        
        _oButOk.unload();
    };
    
    this.show = function(szText){
        _oMsgText.refreshText( szText );
        
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha:1}, 400);
    };
    
    this.hide = function(){
        _oContainer.visible = false;
        _oContainer.alpha = 0;
    };
    
    this._onOk = function(){
        this.hide();
    };
    
    this._init();
}