function CMsgBox(szText,oParentContainer){
    var _oButOk;
    var _oThis;
    var _oContainer;
    var _oParentContainer;

    this._init = function (szText) {
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        var oFade;

        oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.5;

        oFade.on("click", function () {});

        _oContainer.addChild(oFade);

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        var oBg = createBitmap(oSpriteBg);

        oBg.x = CANVAS_WIDTH_HALF;
        oBg.y = CANVAS_HEIGHT_HALF;
        oBg.regX = oSpriteBg.width * 0.5;
        oBg.regY = oSpriteBg.height * 0.5;
        _oContainer.addChild(oBg);
        
        var iWidth = 500;
        var iHeight = 180;
        var iTextX = CANVAS_WIDTH_HALF-10;
        var iTextY = CANVAS_HEIGHT_HALF - 80;
        var oTitleBack = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_CREDITS, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_ERR_LS,
                    true, true, true,
                    false );
        oTitleBack.setOutline(5);
        var oTitle = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_CREDITS, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_ERR_LS,
                    true, true, true,
                    false );

        _oButOk = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 100, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButOk.addEventListener(ON_MOUSE_UP, this._onButOk, this);
    };

    this._onButOk = function () {
        _oThis.unload();
    };

    this.unload = function () {
        _oButOk.unload();
        _oParentContainer.removeChild(_oContainer);
    };
    
    _oThis = this;
    _oParentContainer = oParentContainer;

    this._init(szText);
}