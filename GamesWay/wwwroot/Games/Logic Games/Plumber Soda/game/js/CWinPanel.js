function CWinPanel(oContainer, iLevel, iTotalScore, iLevelScore, iLevelStars) {
    var _iLevel;
    var _iLevelScore;
    var _iLevelStars;
    var _iTotalScore;
    
    var _aStars;
    
    var _oMessageBoxGroup;
    var _oBg;    
    var _oTitleText;
    var _oLevelScoreText;
    var _oTotalScoreText;
    var _oGroup;
    var _oButMenu;
    var _oButRetry;
    var _oButContinue;
    var _oFade;
    var _oMascotte;
    var _oContainer = oContainer;

    this._init = function () {
        _iLevel = iLevel;
        _iLevelScore = iLevelScore;
        _iLevelStars = iLevelStars;
        _iTotalScore = iTotalScore;
        var oSpriteBg = s_oSpriteLibrary.getSprite("bg_help");
        
        $(s_oMain).trigger("share_event", _iTotalScore);
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

        _oTitleText = new CTLText(_oMessageBoxGroup, 
                    CANVAS_WIDTH_HALF - 250, 170, 500, 36, 
                    36, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_WIN,
                    true, true, false,
                    false );


        _oLevelScoreText = new CTLText(_oMessageBoxGroup, 
                    CANVAS_WIDTH_HALF - 250, CANVAS_HEIGHT_HALF - 40, 500, 28, 
                    28, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LEVEL_SCORE + _iLevelScore,
                    true, true, false,
                    false );

    
        _oTotalScoreText = new CTLText(_oMessageBoxGroup, 
                    CANVAS_WIDTH_HALF - 250, CANVAS_HEIGHT_HALF -5, 500, 28, 
                    28, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_TOTAL_SCORE + _iTotalScore,
                    true, true, false,
                    false );

        
        _oContainer.addChild(_oFade, _oGroup, _oMessageBoxGroup);
        
        this.initStars();
        
        var iButtonsOffsetX = 180;
        var iButtonsY = CANVAS_HEIGHT_HALF + 90;

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH_HALF - iButtonsOffsetX, iButtonsY, oSpriteButHome, _oMessageBoxGroup);
        _oButMenu.addEventListener(ON_MOUSE_DOWN, this._onExit, this);

        var oSpriteButRetry = s_oSpriteLibrary.getSprite("but_restart");
        _oButRetry = new CGfxButton(CANVAS_WIDTH_HALF, iButtonsY, oSpriteButRetry, _oMessageBoxGroup);
        _oButRetry.addEventListener(ON_MOUSE_DOWN, this._onTryAgain, this);

        var oSpriteButContinue = s_oSpriteLibrary.getSprite("but_continue");
        _oButContinue = new CGfxButton(CANVAS_WIDTH_HALF + iButtonsOffsetX, iButtonsY, oSpriteButContinue, _oMessageBoxGroup);
        _oButContinue.addEventListener(ON_MOUSE_DOWN, this._onContinue, this);
        _oButContinue.pulseAnimation();
    };
    
    this.initStars = function(){
        _aStars = [];
        
        var oSprite = s_oSpriteLibrary.getSprite("starbox");
        var oStar1 = createBitmap(oSprite);
        var oStar2 = createBitmap(oSprite);
        var oStar3 = createBitmap(oSprite);
        oStar1.regX = oStar2.regX = oStar3.regX = oSprite.width * 0.5;
        oStar1.regY = oStar2.regY = oStar3.regY = oSprite.height * 0.5;
        
        var oSprite = s_oSpriteLibrary.getSprite("star");
        var oFullStar1 = createBitmap(oSprite);
        _aStars.push(oFullStar1);
        var oFullStar2 = createBitmap(oSprite);
        _aStars.push(oFullStar2);
        var oFullStar3 = createBitmap(oSprite);
        _aStars.push(oFullStar3);
        oFullStar1.regX = oFullStar2.regX = oFullStar3.regX = oSprite.width * 0.5;
        oFullStar1.regY = oFullStar2.regY = oFullStar3.regY = oSprite.height * 0.5;
        
        oFullStar1.scaleX = oFullStar1.scaleY = oFullStar2.scaleX = 
            oFullStar2.scaleY = oFullStar3.scaleX = oFullStar3.scaleY = 0;
        
        oStar1.x = oFullStar1.x = CANVAS_WIDTH_HALF - 70;        
        oStar2.x = oFullStar2.x = CANVAS_WIDTH_HALF;
        oStar3.x = oFullStar3.x = CANVAS_WIDTH_HALF + 70;
        oStar1.y = oStar2.y = oStar3.y = oFullStar1.y = oFullStar2.y = oFullStar3.y = 240;
        
        _oMessageBoxGroup.addChild(oStar1, oStar2, oStar3);
        _oMessageBoxGroup.addChild(oFullStar1, oFullStar2, oFullStar3);
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

    this.showStars = function(){
        for (var i = 0; i < _iLevelStars; i++) {
            createjs.Tween.get(_aStars[i])
                .wait(300*i)
                .to({scaleX: 1, scaleY: 1}, 1500, createjs.Ease.elasticOut);
        };
    };

    this.show = function (oMascotte) {
        _oMascotte = oMascotte;
        
        _oGroup.visible = true;

        createjs.Tween.get(_oMessageBoxGroup)
            .wait(CHECK_LEVEL_DELAY)
            .to({y: 0}, 1000, createjs.Ease.elasticOut)
            .wait(100)
            .call(this.showStars);

        createjs.Tween.get(_oFade)
            .wait(CHECK_LEVEL_DELAY)
            .to({alpha: 0.8}, 500, createjs.Ease.cubicOut)
            .call(function () {
                $(s_oMain).trigger("show_interlevel_ad");        
            });

        _oFade.on("click", function () {});
    };
    
    this.bounceContainerOffScreen = function(){
        var oParent = this;
        
        createjs.Tween.get(_oMessageBoxGroup)
            .to({y: CANVAS_HEIGHT},400, createjs.Ease.backIn)
            .call(function(){
                oParent.unload();
            });
    };
    
    this.getContainer = function(){
        return _oGroup;
    };
    
    this._onTryAgain = function(){
        this.bounceContainerOffScreen();
        s_oGame.removeLastScore();
        s_oGame.restartGame();
        
        createjs.Tween.get(_oFade)
            .to({alpha: 0},500)
            .call(function () {
                _oContainer.removeChild(_oFade);
            });
    };

    this._onContinue = function () {
        if (_iLevel+1 < NUM_LEVELS) {
            s_oGame.onNextLevel();
        } else {
            s_oMain.gotoLevelMenu();
        }
        
        this.bounceContainerOffScreen();
        
        createjs.Tween.get(_oFade)
            .to({alpha:0},500)
            .call(function () {
                _oContainer.removeChild(_oFade);                                
            });        
    };

    this._onExit = function () {
        this.unload();
        s_oGame.onExit();
    };

    this._init();

    return this;
}