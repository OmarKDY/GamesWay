function CCreditsPanel() {
    var _oListener;
    var _oBg;
    var _oFade;
    var _oButLogo;
    var _oButExit;
    var _oMsgText;
    var _oHitArea;
    var _oLink;
    var _oContainer;
    
    var _pStartPosExit;
    var _pStartPosYContainer;

    this._init = function () {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        
         
        s_oStage.addChild(_oFade);
        
        var oSpriteMsgBox = s_oSpriteLibrary.getSprite('msg_box_small');
        _pStartPosYContainer = CANVAS_HEIGHT + oSpriteMsgBox.height * 0.5;
        _oContainer = new createjs.Container();
        _oContainer.y = _pStartPosYContainer; 
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(oSpriteMsgBox);
        _oBg.regX = oSpriteMsgBox.width * 0.5;
        _oBg.regY = oSpriteMsgBox.height * 0.5;        
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oBg);

        _oMsgText = new createjs.Text(TEXT_CREDITS_DEVELOPED, "42px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
	_oMsgText.x = CANVAS_WIDTH_HALF;
        _oMsgText.y = CANVAS_HEIGHT_HALF - 70;
	_oContainer.addChild(_oMsgText);

        oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width * 0.5;
        _oButLogo.regY = oSprite.height * 0.5;
        _oButLogo.x = CANVAS_WIDTH_HALF;
        _oButLogo.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oButLogo);

        _oLink = new createjs.Text(TEXT_LINK, "32px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oLink.textAlign = "center";
        _oLink.textBaseline = "alphabetic";
	_oLink.x = CANVAS_WIDTH_HALF;
        _oLink.y = CANVAS_HEIGHT_HALF + 90;
        _oContainer.addChild(_oLink);
        
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oListener = _oHitArea.on("click", this._onLogoButRelease);
        _oContainer.addChild(_oHitArea);

        if (!s_bMobile) {
            _oHitArea.cursor = "pointer";
        };
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH_HALF + 235, y: CANVAS_HEIGHT_HALF - 125};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

        new createjs.Tween.get(_oContainer).to({y:0},1000, createjs.Ease.backOut);
    };

    this.unload = function () {
        createjs.Tween.get(_oFade).to({alpha:0},500);
        
        createjs.Tween.get(_oContainer).to({y:_pStartPosYContainer},400, createjs.Ease.backIn).call(function(){
            _oHitArea.off("click", _oListener);

            _oButExit.unload();
            _oButExit = null;

            s_oStage.removeChild(_oContainer, _oFade);
        });
    };

    this._onLogoButRelease = function () {
        window.open("http://www.codethislab.com", "_blank");
    };

    this._init();
}