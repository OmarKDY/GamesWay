function CMsgBox(oParentContainer){
    var _oMsgStroke;
    var _oMsg;
    var _oButOk;
    var _oThis;
    var _oContainer;
    var _oParentContainer;

    this._init = function () {
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

        oBg.x = CANVAS_WIDTH * 0.5;
        oBg.y = CANVAS_HEIGHT * 0.5;
        oBg.regX = oSpriteBg.width * 0.5;
        oBg.regY = oSpriteBg.height * 0.5;
        _oContainer.addChild(oBg);
        
        var iWidth = 800;
        var iHeight = 500;
        var iX = CANVAS_WIDTH/2;
        var iY = 540;
        _oMsgStroke = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    60, "center", "#600101", FONT, 1.2,
                    2, 2,
                    " ",
                    true, true, true,
                    false );
        _oMsgStroke.setOutline(8);
        _oMsg = new CTLText(_oContainer, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    60, "center", "#fff", FONT, 1.2,
                    2, 2,
                    " ",
                    true, true, true,
                    false );

        _oButOk = new CGfxButton(CANVAS_WIDTH / 2 + 470, 270, s_oSpriteLibrary.getSprite('but_exit'), _oContainer);
        _oButOk.addEventListener(ON_MOUSE_UP, this._onButOk, this);
    };

    this._onButOk = function () {
        _oThis.unload();
    };

    this.show = function(szMsg){
        _oMsgStroke.refreshText( szMsg );
        _oMsg.refreshText( szMsg );
    };

    this.unload = function () {
        _oButOk.unload();
        _oParentContainer.removeChild(_oContainer);
    };
    
    _oThis = this;
    _oParentContainer = oParentContainer;

    this._init();
}