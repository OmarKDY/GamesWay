function CMsgBox(szMsg, oParentContainer) {
    var _oFade;
    var _oBg;
    var _oMsgStroke;
    var _oMsg;
    var _oGroup;
    var _oSkipBut;
    var _pStartPosSkip;

    this._init = function (szMsg, oParentContainer) {
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
        var iHeight = 200;
        var iX = CANVAS_WIDTH/2 -20;
        var iY = CANVAS_HEIGHT/2;
        _oMsgStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    30, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    szMsg,
                    true, true, true,
                    false );
        _oMsgStroke.setOutline(3);           
        _oMsg = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    30, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    szMsg,
                    true, true, true,
                    false );



        var oSpriteSkip = s_oSpriteLibrary.getSprite('but_yes');
        _pStartPosSkip = {x: CANVAS_WIDTH_HALF - 20, y: CANVAS_HEIGHT_HALF + 180};
        _oSkipBut = new CGfxButton(_pStartPosSkip.x, _pStartPosSkip.y, oSpriteSkip, s_oStage);
        _oSkipBut.addEventListener(ON_MOUSE_UP, this.unload, this);

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

    this._init(szMsg, oParentContainer);

}