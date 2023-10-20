function CLosePanel(oContainer, iTotalScore) {
    var _oMessageBoxGroup;
    var _oBg;
    var _oTitleText;
    var _oRecordText;
    var _oGroup;
    var _oButMenu;
    var _oButRestart;
    var _oFade;
    var _oMascotte;    
    var _oContainer = oContainer;
    var _iTotalScore;

    this._init = function () {
        var oSpriteBg = s_oSpriteLibrary.getSprite("bg_help");
        _iTotalScore = iTotalScore;
        
        $(s_oMain).trigger("save_score", _iTotalScore);
        
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

        _oTitleText =  new CTLText(_oMessageBoxGroup, 
                    CANVAS_WIDTH_HALF - 300, 170, 600, 80, 
                    40, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LOSE,
                    true, true, true,
                    false );

        
        _oRecordText = new CTLText(_oMessageBoxGroup, 
                    CANVAS_WIDTH_HALF - 300, 280, 600, 56, 
                    28, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_TOTAL_SCORE + _iTotalScore,
                    true, true, false,
                    false );


        _oContainer.addChild(_oFade, _oGroup, _oMessageBoxGroup);

        var iButtonsOffsetX = 200;
        var iButtonsY = CANVAS_HEIGHT_HALF + 90;

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH_HALF - iButtonsOffsetX, iButtonsY, oSpriteButHome, _oMessageBoxGroup);
        _oButMenu.addEventListener(ON_MOUSE_DOWN, this._onExit, this);

        var oSpriteButRestart = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(CANVAS_WIDTH_HALF + iButtonsOffsetX, iButtonsY, oSpriteButRestart, _oMessageBoxGroup);
        _oButRestart.addEventListener(ON_MOUSE_DOWN, this._onRestart, this);
        _oButRestart.pulseAnimation();
    };

    this.unload = function () {
        _oMascotte.changeContainer(_oContainer);
        
        createjs.Tween.get(_oMessageBoxGroup)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function() {
                _oContainer.removeChild(_oFade);
                _oContainer.removeChild(_oMessageBoxGroup);
            });
        
        createjs.Tween.get(_oGroup).to({alpha: 0}, 500, createjs.Ease.cubicOut).call(function () {
            _oContainer.removeChild(_oGroup);            
            _oButMenu.unload();
            _oButMenu = null;

            _oFade.removeAllEventListeners();

            _oButRestart.unload();
            _oButRestart = null;
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
            .to({alpha: 0.8}, 500, createjs.Ease.cubicOut)
            .call(function () {
                $(s_oMain).trigger("show_interlevel_ad");
            });

        _oFade.on("click", function () {});
    };
    
    this.getContainer = function(){
        return _oGroup;
    };
    
    this.bounceContainerOffScreen = function(){
        var oParent = this;
        
        createjs.Tween.get(_oMessageBoxGroup)
            .to({y: CANVAS_HEIGHT},400, createjs.Ease.backIn)
            .call(function(){
                oParent.unload();
            });
    };

    this._onRestart = function () {
        this.bounceContainerOffScreen();

        createjs.Tween.get(_oFade)
            .to({alpha: 0},500)
            .call(function () {
                _oContainer.removeChild(_oFade);
                s_oGame.restartGame();
            });
    };

    this._onExit = function () {
        this.bounceContainerOffScreen();

        createjs.Tween.get(_oFade)
            .to({alpha:0},500)
            .call(function () {
                _oContainer.removeChild(_oFade);
                s_oGame.onExit();
            });
    };

    this._init();

    return this;
}