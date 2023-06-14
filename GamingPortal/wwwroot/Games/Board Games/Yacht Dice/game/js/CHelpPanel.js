function CHelpPanel(){
    var _oText1;
    var _oText2;
    var _oText3;
    var _oFade;
    var _oShadow;
    var _oBg;
    var _oGroup;
    var _oContinueBut;
    var _oBackBut;
    var _oSkipBut;
    var _pStartPosSkip;
    var _pStartPosContinue;
    var _pStartPosBack;
    
    var _aPageTexts = [];

    var _iPageN;

    this._init = function(){
        _iPageN = 1;        
    
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_help');
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF + 5;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.85;
        _oFade.on("mousedown",function(){});

        _oGroup = new createjs.Container();
        _oGroup.addChild(_oFade, _oBg);
        s_oStage.addChild(_oGroup);

        this.initHelpPage1();

        var iArrowOffset = 200;
        var iButtonsY = CANVAS_HEIGHT_HALF + 130;

        var oSpriteBack = s_oSpriteLibrary.getSprite('but_back_small');        
        _pStartPosBack = {x: CANVAS_WIDTH_HALF - oSpriteBack.width/2 - iArrowOffset, y: iButtonsY-5};
        _oBackBut = new CGfxButton(_pStartPosBack.x, _pStartPosBack.y, oSpriteBack, s_oStage);
        _oBackBut.addEventListener(ON_MOUSE_UP, this._onBack, this);

        var oSpriteContinue = s_oSpriteLibrary.getSprite('but_continue_small');        
        _pStartPosContinue = {x: CANVAS_WIDTH_HALF + oSpriteContinue.width/2 + iArrowOffset, y: iButtonsY-5};
        _oContinueBut = new CGfxButton(_pStartPosContinue.x, _pStartPosContinue.y, oSpriteContinue, s_oStage);
        _oContinueBut.addEventListener(ON_MOUSE_UP, this._onContinue, this);

        var oSpriteSkip = s_oSpriteLibrary.getSprite('but_continue');        
        _pStartPosSkip = {x: CANVAS_WIDTH_HALF, y: iButtonsY};
        _oSkipBut = new CGfxButton(_pStartPosSkip.x, _pStartPosSkip.y, oSpriteSkip, s_oStage);
        _oSkipBut.addEventListener(ON_MOUSE_UP, this._onExitHelp, this);
  
        _oShadow = new createjs.Shape();
        _oShadow.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oShadow);

        createjs.Tween.get(_oShadow).to({alpha: 0}, 1000).call(function () {
            _oShadow.visible = false;
        });
    };

    this.initHelpPage1 = function() {
        var iFirstRow = CANVAS_HEIGHT_HALF - 160;
        
        _oText1 = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, iFirstRow, 500, 50, 
                    32, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP1 + DICES_LAUNCH_POSSIBILITIES + TEXT_HELP2,
                    true, true, true,
                    false );
                    

        
        _oText2 = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, iFirstRow + 70, 500, 50, 
                    32, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP3,
                    true, true, true,
                    false );
                    
   
  
        _oText3 = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, iFirstRow + 140, 500, 50, 
                    32, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP4,
                    true, true, true,
                    false );

    };

    this.initNewText = function(szText, i) {
        var oText = new CTLText(_oGroup, 
                    CANVAS_WIDTH_HALF - 240, CANVAS_HEIGHT_HALF - 170 + (32*i), 500, 30, 
                    18, "left", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1,
                    0, 0,
                    szText,
                    true, true, true,
                    false );

        
        return oText;
    };
    
    this.initHelpPage2 = function() {
        var aCombinations = ["- " + TEXT_COMBINATION_0 + ": " + TEXT_HELP_COMBINATION_0,
                             "- " + TEXT_COMBINATION_1 + ": " + TEXT_HELP_COMBINATION_1,
                             "- " + TEXT_COMBINATION_2 + ": " + TEXT_HELP_COMBINATION_2,
                             "- " + TEXT_COMBINATION_3 + ": " + TEXT_HELP_COMBINATION_3,
                             "- " + TEXT_COMBINATION_4 + ": " + TEXT_HELP_COMBINATION_4,
                             "- " + TEXT_COMBINATION_5 + ": " + TEXT_HELP_COMBINATION_5,
                             "- " + TEXT_BONUS + ": " + TEXT_HELP_TOPBONUS_1 + TOP_BONUS_LIMIT + TEXT_HELP_TOPBONUS_2 ];
        
        for (var i = 0; i < aCombinations.length; i++) {
            var oText = this.initNewText(aCombinations[i], i);
            _aPageTexts.push(oText);
        };
    };

    this.initHelpPage3 = function() {
        var aCombinations = ["- " + TEXT_COMBINATION_6 + ": " + TEXT_HELP_COMBINATION_6,
                             "- " + TEXT_COMBINATION_7 + ": " + TEXT_HELP_COMBINATION_7,
                             "- " + TEXT_COMBINATION_8 + ": " + TEXT_HELP_COMBINATION_8,
                             "- " + TEXT_COMBINATION_9 + ": " + TEXT_HELP_COMBINATION_9,
                             "- " + TEXT_COMBINATION_10 + ": " + TEXT_HELP_COMBINATION_10,
                             "- " + TEXT_COMBINATION_11 + ": " + TEXT_HELP_COMBINATION_11,
                             "- " + TEXT_COMBINATION_12 + ": " + TEXT_HELP_COMBINATION_12 ];
                  
        for (var i = 0; i < aCombinations.length; i++) {
            var oText = this.initNewText(aCombinations[i], i);
            _aPageTexts.push(oText);
        };
    };
    

    // BACK TO FIRST HELP PAGE
    this._onBack = function() {
        switch (_iPageN) {
            case 1: {
                _iPageN = 3;
                this.removePage1();
                this.initHelpPage3();
                break;
            }
            case 2: {
                _iPageN = 1;
                this.removePageTexts();
                this.initHelpPage1();
                break;
            }
            case 3: {
                _iPageN = 2;
                this.removePageTexts();
                this.initHelpPage2();
                break;
            }            
        };
    };
    
    this.removePage1 = function() {
        _oText1.unload();
        _oText2.unload();
        _oText3.unload();
    };
    
    this.removePageTexts = function() {
        for (var i = 0; i < _aPageTexts.length; i++) {
            _aPageTexts[i].unload();
        };
    };
    
    // CREATE A SECOND HELP PAGE
    this._onContinue = function() {
        switch (_iPageN) {
            case 1: {
                _iPageN = 2;
                this.removePage1();            
                this.initHelpPage2();
                break;
            }
            case 2: {
                _iPageN = 3;
                this.removePageTexts();
                this.initHelpPage3();
                break;
            }
            case 3: {
                _iPageN = 1;
                this.removePageTexts();
                this.initHelpPage1();
                break;
            }            
        };
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);
        _oContinueBut.unload();
        _oBackBut.unload();
        _oSkipBut.unload();

        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp();});
    };

    this._onExitHelp = function(){
        this.unload();
        setTimeout( s_oGame._onExitHelp, 200);
    };

    this._init();

}