function CHelpPanel() {
    var _oText1;
    var _oText2;
    var _oText3;
    var _oShadow;
    var _oFade;
    var _oBg;
    var _oGroup;
    var _oSkipBut;
    var _pStartPosSkip;

    this._init = function () {
        var iTextY1 = CANVAS_HEIGHT_HALF - 130;
        var iTextY2 = CANVAS_HEIGHT_HALF - 55;
        var iTextY3 = CANVAS_HEIGHT_HALF + 20;
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_help');
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;

        _oShadow = new createjs.Shape();
        _oShadow.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oShadow.alpha = 0.8;
        _oShadow.on("mousedown", function () {
        });
        s_oStage.addChild(_oShadow);
        
        _oGroup = new createjs.Container();        
        _oGroup.addChild(_oBg);
        _oGroup.y = CANVAS_HEIGHT;
        s_oStage.addChild(_oGroup);

        _oText1 = new CTLText(_oGroup, 
                    CANVAS_WIDTH_HALF-260, iTextY1, 520, 56, 
                    28, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP1,
                    true, true, true,
                    false );


        _oText2 = new CTLText(_oGroup, 
                    CANVAS_WIDTH_HALF-260, iTextY2, 520, 56, 
                    28, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP2,
                    true, true, true,
                    false );

        _oText3 = new CTLText(_oGroup, 
                    CANVAS_WIDTH_HALF-260, iTextY3, 520, 56, 
                    28, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP3,
                    true, true, true,
                    false );


        var oSpriteSkip = s_oSpriteLibrary.getSprite('but_continue');
        _pStartPosSkip = {x: CANVAS_WIDTH_HALF, y: CANVAS_HEIGHT_HALF + 180};
        _oSkipBut = new CGfxButton(_pStartPosSkip.x, _pStartPosSkip.y, oSpriteSkip, _oGroup);
        _oSkipBut.addEventListener(ON_MOUSE_UP, this._onExitHelp, this);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);

        new createjs.Tween.get(_oGroup).to({y:0},1000, createjs.Ease.backOut);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });
    };

    this.unload = function () {
        createjs.Tween.get(_oShadow)
            .to({alpha:0},500)
            .call(function(){
                s_oStage.removeChild(_oShadow);
            });
        
        createjs.Tween.get(_oGroup)
            .to({y:CANVAS_HEIGHT},400, createjs.Ease.backIn)
            .call(function(){
                s_oStage.removeChild(_oGroup);
                _oSkipBut.unload();
            });
    };

    this._onExitHelp = function () {
        this.unload();
        setTimeout(s_oGame._onExitHelp, 200);
    };

    this._init();

}