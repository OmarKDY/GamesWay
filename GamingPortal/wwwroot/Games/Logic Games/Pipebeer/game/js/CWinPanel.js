function CWinPanel(oContainer) {
    var _iLevel;
    var _oMessageBoxGroup;
    var _oBg;    
    var _oGroup;
    var _oButMenu;
    var _oButContinue;
    var _oFade;
    var _oMascotte;
    var _oContainer = oContainer;

    this._init = function () {
        var oSpriteBg = s_oSpriteLibrary.getSprite("bg_help");
        
        $(s_oMain).trigger("share_event", s_iTotalScore);
        $(s_oMain).trigger("save_score", s_iTotalScore);
        _iLevel = s_oGame.getLevel();

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
        _oBg.regX = oSpriteBg.width * 0.5 + 20;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oMessageBoxGroup.addChild(_oBg);

        var iWidth = oSpriteBg.width-150;
        var iHeight = 40;
        var iX = CANVAS_WIDTH/2 -20;
        var iY = 240;
        var oTitleStroke = new CTLText(_oMessageBoxGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    30, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_WIN,
                    true, true, false,
                    false );
        oTitleStroke.setOutline(5);           
        var oTitle = new CTLText(_oMessageBoxGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    30, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_WIN,
                    true, true, false,
                    false );

        var iHeight = 30;
        var iY = 290;
        var oRecordTextStroke = new CTLText(_oMessageBoxGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    20, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_TOTAL_SCORE, s_iTotalScore),
                    true, true, false,
                    false );
        oRecordTextStroke.setOutline(4);           
        var oRecordText = new CTLText(_oMessageBoxGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    20, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_TOTAL_SCORE, s_iTotalScore),
                    true, true, false,
                    false );

        
        var iHeight = 30;
        var iY = 320;
        var oRecordCircuitTextStroke = new CTLText(_oMessageBoxGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    20, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_RECORD_LENGTH, s_iLongestCircuit),
                    true, true, false,
                    false );
        oRecordCircuitTextStroke.setOutline(4);           
        var oRecordCircuitText = new CTLText(_oMessageBoxGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    20, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_RECORD_LENGTH, s_iLongestCircuit),
                    true, true, false,
                    false );


        _oContainer.addChild(_oFade, _oGroup, _oMessageBoxGroup);
        
        var iButtonsOffsetX = 180;
        var iButtonsY = CANVAS_HEIGHT_HALF + 90;

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH_HALF - 20 - iButtonsOffsetX, iButtonsY, oSpriteButHome, _oMessageBoxGroup);
        _oButMenu.addEventListener(ON_MOUSE_DOWN, this._onExit, this);

        var oSpriteButContinue = s_oSpriteLibrary.getSprite("but_continue");
        _oButContinue = new CGfxButton(CANVAS_WIDTH_HALF + iButtonsOffsetX, iButtonsY, oSpriteButContinue, _oMessageBoxGroup);
        _oButContinue.addEventListener(ON_MOUSE_DOWN, this._onContinue, this);
        _oButContinue.pulseAnimation();
    };

    this.unload = function () {
        _oMascotte.changeContainer(_oContainer);
        
        createjs.Tween.get(_oMessageBoxGroup)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function() {
                _oContainer.removeChild(_oMessageBoxGroup);
                _oContainer.removeChild(_oFade);
            });
        
        createjs.Tween.get(_oGroup).to({alpha: 0}, 500, createjs.Ease.cubicOut).call(function () {
            _oContainer.removeChild(_oGroup);            
            _oButMenu.unload();
            _oButMenu = null;

            _oFade.removeAllEventListeners();

            _oButContinue.unload();
            _oButContinue = null;
        });
    };

    this.show = function (oMascotte) {
        _oMascotte = oMascotte;
        
        _oGroup.visible = true;

        createjs.Tween.get(_oMessageBoxGroup)
            .wait(CHECK_LEVEL_DELAY)
            .to({y: 0}, 1000, createjs.Ease.elasticOut);

        createjs.Tween.get(_oFade)
            .wait(CHECK_LEVEL_DELAY)
            .to({alpha: 0.7}, 500, createjs.Ease.cubicOut)
            .call(function () {
                $(s_oMain).trigger("show_interlevel_ad");
            });

        _oFade.on("click", function () {});
    };
    
    this.getContainer = function(){
        return _oGroup;
    };

    this._onContinue = function () {
        this.unload();

        createjs.Tween.get(_oFade)
            .to({alpha: 0}, 400, createjs.Ease.cubicOut)
            .call(function () {
                _oContainer.removeChild(_oFade);
            });
        
        if (_iLevel < 9) {
            s_oGame.onNextLevel();
        } else {
            s_oMain.gotoLevelChoose();
        }
    };

    this._onExit = function () {
        this.unload();
        s_oGame.onExit();
    };

    this._init();

    return this;
}