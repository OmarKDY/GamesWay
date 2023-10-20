function CLosePanel(oContainer) {
    var _oMessageBoxGroup;
    var _oBg;
    var _oGroup;
    var _oButMenu;
    var _oButRestart;
    var _oFade;
    var _oContainer = oContainer;

    this._init = function () {
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        
        $("#canvas").trigger("save_score", s_iTotalScore);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.01;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 1;
        _oGroup.visible = false;

        _oMessageBoxGroup = new createjs.Container();
        _oMessageBoxGroup.y = CANVAS_HEIGHT;
        _oGroup.addChild(_oMessageBoxGroup);

        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oMessageBoxGroup.addChild(_oBg);

        var iWidth = 500;
        var iHeight = FONT_SIZE_LOSE_PANEL_TITLE*3;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = CANVAS_HEIGHT_HALF - 120;
        var oTitleBack = new CTLText(_oMessageBoxGroup, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_LOSE_PANEL_TITLE, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_LOSE,
                    true, true, true,
                    false );
        oTitleBack.setOutline(5);
        var oTitle = new CTLText(_oMessageBoxGroup, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_LOSE_PANEL_TITLE, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_LOSE,
                    true, true, true,
                    false );

        
        var iWidth = 500;
        var iHeight = FONT_SIZE_MESSAGE_BOX*2;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = CANVAS_HEIGHT_HALF - 30;
        var oRecordTextStroke = new CTLText(_oMessageBoxGroup, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_TOTAL_SCORE + s_iTotalScore,
                    true, true, true,
                    false );
        oRecordTextStroke.setOutline(5);
        var oRecordText = new CTLText(_oMessageBoxGroup, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_TOTAL_SCORE + s_iTotalScore,
                    true, true, true,
                    false );

        
        _oContainer.addChild(_oFade, _oGroup, _oMessageBoxGroup);

        var iButtonsOffsetX = 100;
        var iButtonsY = CANVAS_HEIGHT_HALF + 80;

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH_HALF - 10 - iButtonsOffsetX, iButtonsY, oSpriteButHome, _oMessageBoxGroup);
        _oButMenu.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oSpriteButRestart = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(CANVAS_WIDTH_HALF - 10 + iButtonsOffsetX, iButtonsY, oSpriteButRestart, _oMessageBoxGroup);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        _oButRestart.pulseAnimation();
    };

    this.unload = function () {
        createjs.Tween.get(_oMessageBoxGroup)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function() {
                createjs.Tween.removeTweens(_oFade);
                createjs.Tween.removeTweens(_oMessageBoxGroup);
                _oContainer.removeChild(_oFade);
                _oContainer.removeChild(_oMessageBoxGroup);
            });
        
        createjs.Tween.get(_oGroup).to({alpha: 0}, 500, createjs.Ease.cubicOut).call(function () {
            _oFade.removeAllEventListeners();
            _oButMenu.unload();
            _oButMenu = null;
            _oButRestart.unload();
            _oButRestart = null;
            createjs.Tween.removeTweens(_oGroup);
            _oContainer.removeChild(_oGroup);            
        });
    };

    this.show = function () {
        _oGroup.visible = true;

        createjs.Tween.get(_oMessageBoxGroup)
            .wait(GAMEOVER_DELAY)
            .to({y: 0}, 1000, createjs.Ease.elasticOut);

        createjs.Tween.get(_oFade)
            .wait(GAMEOVER_DELAY)
            .to({alpha: 0.7}, 500, createjs.Ease.cubicOut)
            .call(function () {
                $("#canvas").trigger("show_interlevel_ad");
            });

        _oFade.on("click", function () {});
    };

    this._onRestart = function () {
        this.unload();

        createjs.Tween.get(_oFade).to({alpha: 0}, 400, createjs.Ease.cubicOut).call(function () {
            _oContainer.removeChild(_oFade);
        });

        s_oGame.restartGame();
    };

    this._onExit = function () {
        this.unload();
        s_oGame.onExit();
    };

    this._init();

    return this;
}