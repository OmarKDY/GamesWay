function CWinPanel(iLevelStars, iLevelScore, oContainer) {
    var _iLevel;
    var _iLevelScore;
    var _iLevelStars;
    var _aStars;
    var _oMessageBoxGroup;
    var _oContent1;
    var _oBg;    
    var _oLevelScorePointsTextStroke;
    var _oLevelScorePointsText;
    var _oGroup;
    var _oBar;
    var _oButMenu;
    var _oButContinue;
    var _oButRetry;
    var _oButNextPage;
    var _oFade;
    var _oContainer = oContainer;

    this._init = function () {
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        
        $("#canvas").trigger("share_event", s_iTotalScore);
        $("#canvas").trigger("save_score", s_iTotalScore);
        _iLevel = s_oGame.getLevel();
        _iLevelStars = iLevelStars;
        _iLevelScore = iLevelScore;

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.01;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 1;
        _oGroup.visible = false;

        _oMessageBoxGroup = new createjs.Container();
        _oMessageBoxGroup.y = CANVAS_HEIGHT;
        _oGroup.addChild(_oMessageBoxGroup);

        _oContent1 = new createjs.Container();

        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oMessageBoxGroup.addChild(_oBg);
        
        var iWidth = 500;
        var iHeight = FONT_SIZE_WIN_PANEL_TITLE*2;
        var iTextX = CANVAS_WIDTH_HALF-10;
        var iTextY = 190;
        var oTitleBack = new CTLText(_oMessageBoxGroup, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_WIN_PANEL_TITLE, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_WIN,
                    true, true, true,
                    false );
        oTitleBack.setOutline(5);
        var oTitle = new CTLText(_oMessageBoxGroup, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_WIN_PANEL_TITLE, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_WIN,
                    true, true, true,
                    false );


        this._addScoreSummary();
        
        _oContainer.addChild(_oFade, _oGroup, _oMessageBoxGroup);
        
        
        _oMessageBoxGroup.addChild(_oContent1);
        
        var oSpriteButContinue = s_oSpriteLibrary.getSprite("but_continue");
        _oButNextPage = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF+100, oSpriteButContinue, _oMessageBoxGroup);
        _oButNextPage.addEventListener(ON_MOUSE_UP, this._onNextPage, this);        
        _oButNextPage.setScaleX(0.7);
        _oButNextPage.setScaleY(0.7);
        _oButNextPage.pulseAnimation();  
    };
    
    this._addScoreSummary = function(){
        var iFirstRowX = CANVAS_WIDTH_HALF - 240;
        var iSecondRowX = CANVAS_WIDTH_HALF + 220;
        
        //////// ROW 1
        var iWidth = 250;
        var iHeight = FONT_SIZE_MESSAGE_BOX+10;
        var iTextX = iFirstRowX;
        var iTextY = 255;
        var oScoreTextStroke = new CTLText(_oContent1, 
                    iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "left", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_END_LEVEL,
                    true, true, true,
                    false );
        oScoreTextStroke.setOutline(5);
        var oScoreText = new CTLText(_oContent1, 
                    iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "left", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_END_LEVEL,
                    true, true, true,
                    false );

       
        var iWidth = 200;
        var iHeight = FONT_SIZE_MESSAGE_BOX+10;
        var iTextX = iSecondRowX;
        var oScorePointsTextStroke = new CTLText(_oContent1, 
                    iTextX-iWidth, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "right", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    LEVEL_POINTS + " " + TEXT_PTS + " +",
                    true, true, true,
                    false );
        oScorePointsTextStroke.setOutline(5);
        var oScorePointsText = new CTLText(_oContent1, 
                    iTextX-iWidth, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "right", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    LEVEL_POINTS + " " + TEXT_PTS + " +",
                    true, true, true,
                    false );

       
        //////// ROW 2
        var iWidth = 250;
        var iHeight = FONT_SIZE_MESSAGE_BOX+10;
        var iTextX = iFirstRowX;
        var iTextY = iTextY + 30;
        var oCoinsTextStroke = new CTLText(_oContent1, 
                    iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "left", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_BONUS_SCORE,
                    true, true, true,
                    false );
        oCoinsTextStroke.setOutline(5);
        var oCoinsText = new CTLText(_oContent1, 
                    iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "left", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_BONUS_SCORE,
                    true, true, true,
                    false );

       
        var iWidth = 200;
        var iHeight = FONT_SIZE_MESSAGE_BOX+10;
        var iTextX = iSecondRowX;
        var oCoinsNumberTextStroke = new CTLText(_oContent1, 
                    iTextX-iWidth, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "right", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    LEVEL_POINTS + " " + TEXT_PTS + " x" + _iLevelStars,
                    true, true, true,
                    false );
        oCoinsNumberTextStroke.setOutline(5);
        var oCoinsNumberText = new CTLText(_oContent1, 
                    iTextX-iWidth, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "right", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    LEVEL_POINTS + " " + TEXT_PTS + " x" + _iLevelStars,
                    true, true, true,
                    false );

       
        var oSprite = s_oSpriteLibrary.getSprite("coin_score");
        var oCoinsIcon = createBitmap(oSprite);
        oCoinsIcon.regX = oSprite.width * 0.5;
        oCoinsIcon.regY = oSprite.height * 0.5;
        oCoinsIcon.x = iSecondRowX + 17;
        oCoinsIcon.y = iTextY - 2;
        oCoinsIcon.scaleX = oCoinsIcon.scaleY = 0.5;
        _oContent1.addChild(oCoinsIcon);

        var oSprite = s_oSpriteLibrary.getSprite('progress_bar');
        _oBar = createBitmap(oSprite);
        _oBar.regX = oSprite.width * 0.5;
        _oBar.regY = oSprite.height * 0.5;
        _oBar.x = CANVAS_WIDTH_HALF - 10;
        _oBar.y = iTextY + 25;
        _oMessageBoxGroup.addChild(_oBar);
        
       
        //////// ROW 3
        var iWidth = 250;
        var iHeight = FONT_SIZE_MESSAGE_BOX+10;
        var iTextX = iFirstRowX;
        var iTextY = _oBar.y + 25;
        var oLevelScoreTextStroke = new CTLText(_oContent1, 
                    iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "left", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_LEVEL_SCORE,
                    true, true, true,
                    false );
        oLevelScoreTextStroke.setOutline(5);
        var oLevelScoreText = new CTLText(_oContent1, 
                    iTextX, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "left", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_LEVEL_SCORE,
                    true, true, true,
                    false );

       
        var iWidth = 200;
        var iHeight = FONT_SIZE_MESSAGE_BOX+10;
        var iTextX = iSecondRowX;
        _oLevelScorePointsTextStroke = new CTLText(_oContent1, 
                    iTextX-iWidth, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "right", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    0 + " " + TEXT_PTS,
                    true, true, true,
                    false );
        _oLevelScorePointsTextStroke.setOutline(5);
        _oLevelScorePointsText = new CTLText(_oContent1, 
                    iTextX-iWidth, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "right", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    0 + " " + TEXT_PTS,
                    true, true, true,
                    false );
       
    };
    
    this._onNextPage = function(){
        _oButNextPage.setVisible(false);
        
        _oContent1.visible = false;
        
        this._initStars();
        this._showStars();
        
        var iWidth = 500;
        var iHeight = FONT_SIZE_MESSAGE_BOX*2;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = 340;
        var oRecordTextStroke = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_TOTAL_SCORE + s_iTotalScore,
                    true, true, true,
                    false );
        oRecordTextStroke.setOutline(5);
        var oRecordText = new CTLText(_oContainer, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_MESSAGE_BOX, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_TOTAL_SCORE + s_iTotalScore,
                    true, true, true,
                    false );

        this._initSecondPageButtons();        
    };
    
    this._initSecondPageButtons = function(){
        var iButtonsOffsetX = 120;
        var iButtonsY = CANVAS_HEIGHT_HALF + 100;
        var iButtonsScale = 0.7;

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH_HALF - iButtonsOffsetX, iButtonsY, oSpriteButHome, _oMessageBoxGroup);
        _oButMenu.setScaleX(iButtonsScale);
        _oButMenu.setScaleY(iButtonsScale);
        _oButMenu.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oSpriteButRetry = s_oSpriteLibrary.getSprite("but_restart");
        _oButRetry = new CGfxButton(CANVAS_WIDTH_HALF, iButtonsY, oSpriteButRetry, _oMessageBoxGroup);
        _oButRetry.setScaleX(iButtonsScale);
        _oButRetry.setScaleY(iButtonsScale);
        _oButRetry.addEventListener(ON_MOUSE_UP, this._onRetry, this);

        var oSpriteButContinue = s_oSpriteLibrary.getSprite("but_continue");
        _oButContinue = new CGfxButton(CANVAS_WIDTH_HALF + iButtonsOffsetX, iButtonsY, oSpriteButContinue, _oMessageBoxGroup);
        _oButContinue.setScaleX(iButtonsScale);
        _oButContinue.setScaleY(iButtonsScale);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onContinue, this);        
        _oButContinue.pulseAnimation();   
    };
    
    this._initStars = function(){
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
        
        oStar1.x = oFullStar1.x = CANVAS_WIDTH_HALF - 10 - 70;        
        oStar2.x = oFullStar2.x = CANVAS_WIDTH_HALF - 10;
        oStar3.x = oFullStar3.x = CANVAS_WIDTH_HALF - 10 + 70;
        oStar1.y = oStar2.y = oStar3.y = oFullStar1.y = oFullStar2.y = oFullStar3.y = 270;
        
        _oMessageBoxGroup.addChild(oStar1, oStar2, oStar3);
        _oMessageBoxGroup.addChild(oFullStar1, oFullStar2, oFullStar3);
    };
    
    this._showStars = function(){
        for (var i = 0; i < _iLevelStars; i++) {            
            createjs.Tween.get(_aStars[i])
                .wait(300*i)
                .call( function(){ playSound("strawberry", 1, false); })
                .to({scaleX: 1, scaleY: 1}, 1500, createjs.Ease.elasticOut);                
        };
    };

    this.unload = function () {
        createjs.Tween.get(_oMessageBoxGroup)
            .to({alpha: 0}, 500, createjs.Ease.cubicOut)
            .call(function() {                
                for (var i = 0; i < _aStars.length; i++) {
                    createjs.Tween.removeTweens(_aStars[i]);
                };                
                createjs.Tween.removeTweens(_oMessageBoxGroup);
                createjs.Tween.removeTweens(_oFade);
                _oContainer.removeChild(_oMessageBoxGroup);
                _oContainer.removeChild(_oFade);
            });
        
        createjs.Tween.get(_oGroup).to({alpha: 0}, 500, createjs.Ease.cubicOut).call(function () {            
            _oFade.removeAllEventListeners();
            _oButMenu.unload();
            _oButMenu = null;
            _oButRetry.unload();
            _oButRetry = null;
            _oButContinue.unload();            
            _oButContinue = null;
            _oButNextPage.unload();            
            _oButNextPage = null;
            createjs.Tween.removeTweens(_oGroup);
            _oContainer.removeChild(_oGroup);
        });
    };

    this.show = function () {
        _oGroup.visible = true;

        createjs.Tween.get(_oMessageBoxGroup)
            .wait(CHECK_LEVEL_DELAY)
            .to({y: 0}, 1000, createjs.Ease.elasticOut)
            .call(function(){
                s_oRollingTextManager.add(0,_oLevelScorePointsText.getText(),_oLevelScorePointsTextStroke.getText(),_iLevelScore,1000,EASE_CUBIC_IN,null,null,null,TEXT_PTS);
            });

        createjs.Tween.get(_oFade)
            .wait(CHECK_LEVEL_DELAY)
            .to({alpha: 0.7}, 500, createjs.Ease.cubicOut)
            .call(function () {
                $("#canvas").trigger("show_interlevel_ad");
            });

        _oFade.on("click", function () {});
    };
    
    this._onContinue = function () {
        this.unload();

        createjs.Tween.get(_oFade)
            .to({alpha: 0}, 400, createjs.Ease.cubicOut)
            .call(function () {
                _oContainer.removeChild(_oFade);
            });
        
        if (_iLevel < LEVELS_NUMBER) {
            s_oGame.onNextLevel();
        } else {
            s_oGame.unload();
            s_oMain.gotoLevelChoose();
        }
    };
    
    this._onRetry = function () {
        this.unload();
        s_oMain.gotoGame(_iLevel);        
    };

    this._onExit = function () {
        this.unload();
        s_oGame.onExit();
    };

    this._init();

    return this;
}