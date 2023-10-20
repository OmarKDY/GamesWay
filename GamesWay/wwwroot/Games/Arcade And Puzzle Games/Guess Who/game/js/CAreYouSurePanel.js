function CAreYouSurePanel(oParentContainer) {
    var _iStartY;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oBg;
    var _oTitleText;
    var _oMsgText;
    var _oButYes;
    var _oButNo;
    var _oContainer;
    var _oParentContainer;
    var _oPanelContainer;
    
    var _oThis = this;

    this._init = function () {
        _aCbCompleted = new Array();
        _aCbOwner = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);
        
        _oPanelContainer = new createjs.Container(); 
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(_oPanelContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oListener = _oBg.on("click", function () {});
        _oPanelContainer.addChild(_oBg);

        var iWidth = 500;
        var iHeight = 70;
        _oTitleText = new CTLText(_oPanelContainer, 
                    -iWidth/2, -CANVAS_HEIGHT/2 + 280 - iHeight/2, iWidth, iHeight, 
                    60, "center", "#FF6699", FONT_GAME, 1,
                    2, 2,
                    TEXT_WARNING,
                    true, true, true,
                    false );

        var iWidth = 500;
        var iHeight = 140;
        _oMsgText = new CTLText(_oPanelContainer, 
                    -iWidth/2, -CANVAS_HEIGHT/2 + 390 - iHeight/2, iWidth, iHeight, 
                    50, "center", "#fff", FONT_GAME, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
        
        _oButYes = new CGfxSpriteButton(210,124,s_oSpriteLibrary.getSprite('but_ok'),false);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        _oPanelContainer.addChild(_oButYes.getSprite());
        
        _oButNo = new CGfxSpriteButton(130,124,s_oSpriteLibrary.getSprite('but_no'),false);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
        _oPanelContainer.addChild(_oButNo.getSprite());
        
    };
    
    this.addEventListener = function (iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };
    
    this.show = function (szText,iSize) {
        _oMsgText.refreshText( szText );
        _oMsgText.font = iSize+"px " + FONT_GAME;
        _oPanelContainer.alpha = 0;
        
        _oContainer.visible = true;
        createjs.Tween.get(_oPanelContainer).to({alpha: 1}, 400);
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();
        _oBg.off("click",_oListener);
    };

    this._onButYes = function () {
        _oThis.hide();
        
        if (_aCbCompleted[ON_BUT_YES_DOWN]) {
            _aCbCompleted[ON_BUT_YES_DOWN].call(_aCbOwner[ON_BUT_YES_DOWN]);
        }
    };

    this._onButNo = function () {
        
        _oThis.hide();
    };

    _oParentContainer = oParentContainer;

    this._init();
}