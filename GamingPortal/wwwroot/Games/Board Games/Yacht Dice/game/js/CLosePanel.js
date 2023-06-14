function CLosePanel(iWinner, iScore, aPlayersScore, oContainer) {
    var _oMessageBoxGroup;
    var _oBg;
    var _oTitleText;
    var _oGroup;
    var _oButMenu;
    var _oButRestart;
    var _oFade;
    var _oContainer = oContainer;
    var _oBestScoreText;
    
    var _iScore;
    var _iWinner;
    
    var _aPlayersScore;

    this._init = function () {
        _iWinner = iWinner + 1;
        _iScore = iScore;
        _aPlayersScore = aPlayersScore;
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box_small");
        
        $(s_oMain).trigger("save_score", _iScore);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;

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

        _oTitleText = new CTLText(_oMessageBoxGroup, 
                    CANVAS_WIDTH/2-250, 170, 500, 64, 
                    32, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LOSE_1 + _iWinner + TEXT_LOSE_2,
                    true, true, true,
                    false );

        
        for (var i = 0; i < _aPlayersScore.length; i++) {
            var iPlayerN = 1+i;
            var szText = TEXT_PLAYER + " " + iPlayerN + " " + TEXT_FINALSCORE + ": " + _aPlayersScore[i];
            var oText = new CTLText(_oMessageBoxGroup, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT_HALF - 70 + (i*30), 500, 22, 
                    22, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    szText,
                    true, true, false,
                    false );
 
        };

        // ADD A BEST SCORE TEXT
        _oBestScoreText = new CTLText(_oMessageBoxGroup, 
                    CANVAS_WIDTH/2-125, CANVAS_HEIGHT_HALF + 70, 250, 64, 
                    32, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_BEST_SCORE + ": " + s_iBestScore,
                    true, true, true,
                    false );

        
        _oContainer.addChild(_oFade, _oGroup, _oMessageBoxGroup);

        var iButtonsOffsetX = 190;
        var iButtonsY = CANVAS_HEIGHT_HALF + 110;

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH_HALF - iButtonsOffsetX, iButtonsY, oSpriteButHome, _oMessageBoxGroup);
        _oButMenu.addEventListener(ON_MOUSE_DOWN, this._onExit, this);

        var oSpriteButRestart = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(CANVAS_WIDTH_HALF + iButtonsOffsetX - 10, iButtonsY, oSpriteButRestart, _oMessageBoxGroup);
        _oButRestart.addEventListener(ON_MOUSE_DOWN, this._onRestart, this);
        _oButRestart.pulseAnimation();
    };

    this.unload = function () {
        createjs.Tween.get(_oMessageBoxGroup)
            .wait(500)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function() {
                _oContainer.removeChild(_oFade);
                _oContainer.removeChild(_oMessageBoxGroup);
            });
        
        createjs.Tween.get(_oGroup)
            .wait(500)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function () {
                _oContainer.removeChild(_oGroup);            
                _oButMenu.unload();
                _oButMenu = null;

                _oFade.removeAllEventListeners();

                _oButRestart.unload();
                _oButRestart = null;
            });
    };

    this.show = function () {
        _oGroup.visible = true;

        createjs.Tween.get(_oMessageBoxGroup)
            .wait(WIN_PANEL_POPUP_DELAY)
            .to({y: 0}, 1000, createjs.Ease.elasticOut);

        createjs.Tween.get(_oFade)
            .wait(WIN_PANEL_POPUP_DELAY)
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