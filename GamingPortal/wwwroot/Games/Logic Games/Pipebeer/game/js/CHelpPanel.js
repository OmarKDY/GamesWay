function CHelpPanel() {
    var _oFade;
    var _oBg;
    var _oGroup;
    var _oSkipBut;
    var _pStartPosSkip;

    this._init = function () {
        var iTextY1 = CANVAS_HEIGHT_HALF - 70;
        var iTextY2 = CANVAS_HEIGHT_HALF +5;
        var iTextY3 = CANVAS_HEIGHT_HALF + 70;
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_help');
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5 + 20;
        _oBg.regY = oSpriteBg.height * 0.5;

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        _oFade.on("mousedown", function () {
        });

        _oGroup = new createjs.Container();
        _oGroup.addChild(_oFade, _oBg);
        s_oStage.addChild(_oGroup);

        var iWidth = oSpriteBg.width-150;
        var iHeight = 80;
        var iX = CANVAS_WIDTH/2 -20;
        var iY = iTextY1;
        var oTextStroke1 = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    16, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP1,
                    true, true, true,
                    false );
        oTextStroke1.setOutline(3);           
        var oText1 = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    16, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP1,
                    true, true, true,
                    false );
                    
        var iHeight = 60;
        var iY = iTextY2;
        var oTextStroke2 = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    16, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        oTextStroke2.setOutline(3);           
        var oText2 = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    16, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        
        
        var iY = iTextY3;
        var oTextStroke3 = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    16, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP3,
                    true, true, true,
                    false );
        oTextStroke3.setOutline(3);           
        var oText3 = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    16, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP3,
                    true, true, true,
                    false );


        var oSpriteSkip = s_oSpriteLibrary.getSprite('but_continue');
        _pStartPosSkip = {x: CANVAS_WIDTH_HALF - 20, y: CANVAS_HEIGHT_HALF + 180};
        _oSkipBut = new CGfxButton(_pStartPosSkip.x, _pStartPosSkip.y, oSpriteSkip, s_oStage);
        _oSkipBut.addEventListener(ON_MOUSE_UP, this._onExitHelp, this);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });
    };

    this.unload = function () {
        s_oStage.removeChild(_oGroup);
        _oSkipBut.unload();

        _oGroup.removeAllEventListeners();
    };

    this._onExitHelp = function () {
        this.unload();
        setTimeout(s_oGame._onExitHelp, 200);
    };

    this._init();

}