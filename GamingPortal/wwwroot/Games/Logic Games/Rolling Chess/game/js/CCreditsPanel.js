function CCreditsPanel() {
    var _oBg;
    var _oFade;
    var _oButLogo;
    var _oButExit;
    var _oHitArea;
    var _pStartPosExit;
    var _oContainer;

    this._init = function () {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        _oFade.on("mousedown", function () {
        });
        s_oStage.addChild(_oFade);
        
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        _oContainer = new createjs.Container();
        _oContainer.y = CANVAS_HEIGHT + oSpriteMsgBox.height/2; 
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(oSpriteMsgBox);
        _oBg.regX = oSpriteMsgBox.width/2;
        _oBg.regY = oSpriteMsgBox.height/2;
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oBg);

        var iWidth = 500;
        var iHeight = FONT_SIZE_TITLES;
        var iTextX = CANVAS_WIDTH_HALF;
        var iTextY = CANVAS_HEIGHT_HALF - 65;
        var oTitleBack = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_CREDITS, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_CREDITS_DEVELOPED,
                    true, true, true,
                    false );
        oTitleBack.setOutline(5);
        var oTitle = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_CREDITS, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_CREDITS_DEVELOPED,
                    true, true, true,
                    false );

        oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width/2;
        _oButLogo.regY = oSprite.height/2;
        _oButLogo.x = CANVAS_WIDTH_HALF;
        _oButLogo.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oButLogo);
       
        var iWidth = 400;
        var iHeight = FONT_SIZE_TITLES;
        var iTextX = CANVAS_WIDTH_HALF;
        var iTextY = CANVAS_HEIGHT_HALF + 75;
        var oLinkBack = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_CREDITS_LINK, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_LINK,
                    true, true, true,
                    false );
        oLinkBack.setOutline(5);
        var oLink = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_CREDITS_LINK, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_LINK,
                    true, true, true,
                    false );
       
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oHitArea.on("click", this._onLogoButRelease);
        _oContainer.addChild(_oHitArea);

        if (!s_bMobile) {
            _oHitArea.cursor = "pointer";
        };
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH_HALF + 200, y: CANVAS_HEIGHT_HALF - 130};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

        new createjs.Tween.get(_oContainer).to({y:0},1000, createjs.Ease.backOut);
    };

    this.unload = function () {
        _oHitArea.off("click", this._onLogoButRelease);

        _oButExit.unload();
        _oButExit = null;

        s_oStage.removeChild(_oContainer, _oFade);
    };

    this._onLogoButRelease = function () {
        window.open("http://www.codethislab.com", "_blank");
    };

    this._init();
}