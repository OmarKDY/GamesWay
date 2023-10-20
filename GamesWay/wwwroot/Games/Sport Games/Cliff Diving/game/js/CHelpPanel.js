function CHelpPanel(){
    var _iPage;
    var _oContainer;
    var _oPanelContainer;
    var _oTextIntro;
    var _oFade;
    var _oArrowRight = null;
    var _oArrowLeft = null;
    var _oButNext;
    var _oPreparationSprite;
    var _oPreparationText;
    var _oJumpSprite;
    var _oJumpText;
    var _oFlipSprite;
    var _oFlipText;
    var _oReleaseSprite;
    var _oReleaseText;
    var _oDiveBestSprite;
    var _oDiveBestText;
    var _oDiveGoodSprite;
    var _oDiveGoodText;
    var _oDivePoorSprite;
    var _oDivePoorText;
    var _oHelpHandPress;
    var _oHelpHandRelease;
    
    var _pStartPanelPos;
    
    var _bFading;

    this._init = function(){
        _bFading = false;
        _iPage = 0;
        
        _oContainer = new createjs.Container();        
        s_oStage.addChild(_oContainer);

        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        _oContainer.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0.7},500);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box_big');
        var oPanel = createBitmap(oSprite);  
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        oPanel.x = CANVAS_WIDTH_HALF;
        oPanel.y = CANVAS_HEIGHT_HALF;
        _oPanelContainer.addChild(oPanel);

        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        createjs.Tween.get(_oPanelContainer).to({y:0},1000, createjs.Ease.backOut);

        this.initText();
        this.initImages();
        
        _oArrowRight = new CGfxButton(CANVAS_WIDTH_HALF + 350,CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow'),_oPanelContainer);
        _oArrowRight.getButtonImage().rotation = 90;
        _oArrowRight.addEventListener(ON_MOUSE_UP, this._onRight, this);

        _oArrowLeft = new CGfxButton(CANVAS_WIDTH_HALF - 350, CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow'),_oPanelContainer);
        _oArrowLeft.getButtonImage().rotation = -90;
        _oArrowLeft.addEventListener(ON_MOUSE_UP, this._onLeft, this);
        _oArrowLeft.setVisible(false);
        
        this.initNewPage();
        
        _oButNext = new CGfxButton(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF + 450, s_oSpriteLibrary.getSprite('but_next'), _oPanelContainer);
        _oButNext.addEventListener(ON_MOUSE_UP, this._onExitHelp, this);
        
        s_oGame._bDisableEvents = true;
    };
    
    this._onRight = function(){
        _iPage++;
        if (_iPage > 2){
            _iPage = 0;
        };
        
        _oArrowLeft.setVisible(true);        
        if (_iPage === 2) {
            _oArrowRight.setVisible(false);
        } else {
            _oArrowRight.setVisible(true);
        }
        
        this.initNewPage();
    };
    
    this._onLeft = function(){
        _iPage--;
        if (_iPage < 0){
            _iPage = 2;
        };
        
        _oArrowRight.setVisible(true);        
        if (_iPage === 0) {
            _oArrowLeft.setVisible(false);
        } else {
            _oArrowLeft.setVisible(true);
        }
                
        this.initNewPage();
    };
    
    this.initText = function(){
        _oTextIntro = new createjs.Text(TEXT_HELP1,FONT_SIZE_HELP+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oTextIntro.textAlign = "center";
        _oTextIntro.textBaseline = "middle";
        _oTextIntro.lineWidth = 550;
        _oTextIntro.x = CANVAS_WIDTH_HALF;
        _oTextIntro.y = CANVAS_HEIGHT_HALF - 200;
        _oTextIntro.visible = false;    
        
       _oPanelContainer.addChild(_oTextIntro);
    };
    
    this.initImages = function(){
        var oSprite = s_oSpriteLibrary.getSprite('help_preparation');
        _oPreparationSprite = createBitmap(oSprite);        
        _oPreparationSprite.regX = oSprite.width * 0.5;
        _oPreparationSprite.regY = oSprite.height * 0.5;
        _oPreparationSprite.x = CANVAS_WIDTH_HALF - 180;
        _oPreparationSprite.y = CANVAS_HEIGHT_HALF - 70;
        _oPreparationSprite.visible = false;
        _oPanelContainer.addChild(_oPreparationSprite);
        
        _oPreparationText = new createjs.Text(TEXT_HELP_PREPARATION,FONT_SIZE_HELP+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oPreparationText.textAlign = "left";
        _oPreparationText.textBaseline = "alphabetic";
        _oPreparationText.lineWidth = 350;
        _oPreparationText.x = _oPreparationSprite.x + 100;
        _oPreparationText.y = _oPreparationSprite.y - 10;
        _oPreparationText.visible = false;        
        _oPanelContainer.addChild(_oPreparationText);
                        
        var oSprite = s_oSpriteLibrary.getSprite('help_jump');
        _oJumpSprite = createBitmap(oSprite);        
        _oJumpSprite.regX = oSprite.width * 0.5;
        _oJumpSprite.regY = oSprite.height * 0.5;
        _oJumpSprite.x = CANVAS_WIDTH_HALF + 180;
        _oJumpSprite.y = CANVAS_HEIGHT_HALF + 90;
        _oJumpSprite.visible = false;
        _oPanelContainer.addChild(_oJumpSprite);

        _oJumpText = new createjs.Text(TEXT_HELP_JUMP,FONT_SIZE_HELP+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oJumpText.textAlign = "right";
        _oJumpText.textBaseline = "alphabetic";
        _oJumpText.lineWidth = 350;
        _oJumpText.x = _oJumpSprite.x - 100;
        _oJumpText.y = _oJumpSprite.y - 10;
        _oJumpText.visible = false;        
        _oPanelContainer.addChild(_oJumpText);
                
        var oSprite = s_oSpriteLibrary.getSprite('help_flip');
        _oFlipSprite = createBitmap(oSprite);        
        _oFlipSprite.regX = oSprite.width * 0.5;
        _oFlipSprite.regY = oSprite.height * 0.5;
        _oFlipSprite.x = CANVAS_WIDTH_HALF - 180;
        _oFlipSprite.y = CANVAS_HEIGHT_HALF - 70;
        _oFlipSprite.visible = false;
        _oPanelContainer.addChild(_oFlipSprite);
        
        _oFlipText = new createjs.Text(TEXT_HELP_FLIP,FONT_SIZE_HELP+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oFlipText.textAlign = "left";
        _oFlipText.textBaseline = "alphabetic";
        _oFlipText.lineWidth = 350;
        _oFlipText.x = _oFlipSprite.x + 100;
        _oFlipText.y = _oFlipSprite.y - 10;
        _oFlipText.visible = false;        
        _oPanelContainer.addChild(_oFlipText);
        
        var oSprite = s_oSpriteLibrary.getSprite('help_release');
        _oReleaseSprite = createBitmap(oSprite);        
        _oReleaseSprite.regX = oSprite.width * 0.5;
        _oReleaseSprite.regY = oSprite.height * 0.5;
        _oReleaseSprite.x = CANVAS_WIDTH_HALF + 180;
        _oReleaseSprite.y = CANVAS_HEIGHT_HALF + 90;
        _oReleaseSprite.visible = false;
        _oPanelContainer.addChild(_oReleaseSprite);
        
        _oReleaseText = new createjs.Text(TEXT_HELP_RELEASE,FONT_SIZE_HELP+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oReleaseText.textAlign = "right";
        _oReleaseText.textBaseline = "alphabetic";
        _oReleaseText.lineWidth = 350;
        _oReleaseText.x = _oReleaseSprite.x - 100;
        _oReleaseText.y = _oReleaseSprite.y - 10;
        _oReleaseText.visible = false;        
        _oPanelContainer.addChild(_oReleaseText);
        
        var oSprite = s_oSpriteLibrary.getSprite('help_dive_best');
        _oDiveBestSprite = createBitmap(oSprite);        
        _oDiveBestSprite.regX = oSprite.width * 0.5;
        _oDiveBestSprite.regY = oSprite.height * 0.5;
        _oDiveBestSprite.x = CANVAS_WIDTH_HALF - 180;
        _oDiveBestSprite.y = CANVAS_HEIGHT_HALF;
        _oDiveBestSprite.visible = false;
        _oPanelContainer.addChild(_oDiveBestSprite);
        
        _oDiveBestText = new createjs.Text(TEXT_ENCOURAGEMENT2,FONT_SIZE_HELP+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oDiveBestText.textAlign = "center";
        _oDiveBestText.textBaseline = "alphabetic";
        _oDiveBestText.lineWidth = 350;
        _oDiveBestText.x = _oDiveBestSprite.x;
        _oDiveBestText.y = _oDiveBestSprite.y + 120;
        _oDiveBestText.visible = false;        
        _oPanelContainer.addChild(_oDiveBestText);
        
        var oSprite = s_oSpriteLibrary.getSprite('help_dive_good');
        _oDiveGoodSprite = createBitmap(oSprite);        
        _oDiveGoodSprite.regX = oSprite.width * 0.5;
        _oDiveGoodSprite.regY = oSprite.height * 0.5;
        _oDiveGoodSprite.x = CANVAS_WIDTH_HALF;
        _oDiveGoodSprite.y = CANVAS_HEIGHT_HALF;
        _oDiveGoodSprite.visible = false;
        _oPanelContainer.addChild(_oDiveGoodSprite);
        
        _oDiveGoodText = new createjs.Text(TEXT_ENCOURAGEMENT0,FONT_SIZE_HELP+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oDiveGoodText.textAlign = "center";
        _oDiveGoodText.textBaseline = "alphabetic";
        _oDiveGoodText.lineWidth = 350;
        _oDiveGoodText.x = _oDiveGoodSprite.x;
        _oDiveGoodText.y = _oDiveGoodSprite.y + 120;
        _oDiveGoodText.visible = false;        
        _oPanelContainer.addChild(_oDiveGoodText);
        
        var oSprite = s_oSpriteLibrary.getSprite('help_dive_poor');
        _oDivePoorSprite = createBitmap(oSprite);        
        _oDivePoorSprite.regX = oSprite.width * 0.5;
        _oDivePoorSprite.regY = oSprite.height * 0.5;
        _oDivePoorSprite.x = CANVAS_WIDTH_HALF + 180;
        _oDivePoorSprite.y = CANVAS_HEIGHT_HALF;
        _oDivePoorSprite.visible = false;
        _oPanelContainer.addChild(_oDivePoorSprite);
        
        _oDivePoorText = new createjs.Text(TEXT_ENCOURAGEMENT1,FONT_SIZE_HELP+PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oDivePoorText.textAlign = "center";
        _oDivePoorText.textBaseline = "alphabetic";
        _oDivePoorText.lineWidth = 350;
        _oDivePoorText.x = _oDivePoorSprite.x;
        _oDivePoorText.y = _oDivePoorSprite.y + 120;
        _oDivePoorText.visible = false;        
        _oPanelContainer.addChild(_oDivePoorText);
        
        var oSprite = s_oSpriteLibrary.getSprite('help_hand');
        _oHelpHandPress = createBitmap(oSprite);        
        _oHelpHandPress.regX = oSprite.width * 0.5;
        _oHelpHandPress.regY = oSprite.height * 0.5;
        _oHelpHandPress.x = _oPreparationSprite.x + 50;
        _oHelpHandPress.y = _oPreparationSprite.y + 50;
        _oHelpHandPress.scaleX = _oHelpHandPress.scaleY = 0.5;
        _oHelpHandPress.visible = false;
        _oPanelContainer.addChild(_oHelpHandPress);
               
        _oHelpHandRelease = createBitmap(oSprite);        
        _oHelpHandRelease.regX = oSprite.width * 0.5;
        _oHelpHandRelease.regY = oSprite.height * 0.5;
        _oHelpHandRelease.x = _oJumpSprite.x + 100;
        _oHelpHandRelease.y = _oJumpSprite.y + 130;
        _oHelpHandRelease.visible = false;
        _oPanelContainer.addChild(_oHelpHandRelease);        
    };
    
    this.initNewPage = function(){
        _oTextIntro.visible = false;
        _oPreparationSprite.visible = _oPreparationText.visible = false;
        _oJumpSprite.visible = _oJumpText.visible = false;
        _oFlipSprite.visible = _oFlipText.visible = false;
        _oReleaseSprite.visible = _oReleaseText.visible = false;        
        _oDiveBestSprite.visible = _oDiveBestText.visible = false;
        _oDiveGoodSprite.visible = _oDiveGoodText.visible = false;
        _oDivePoorSprite.visible = _oDivePoorText.visible = false;
        _oHelpHandPress.visible = _oHelpHandRelease.visible = false;
        
        switch(_iPage){
            case 0: {
                _oTextIntro.text = TEXT_HELP1;
                _oTextIntro.visible = true;
                _oPreparationSprite.visible = _oPreparationText.visible = true;
                _oJumpSprite.visible = _oJumpText.visible = true;
                _oHelpHandPress.visible = _oHelpHandRelease.visible = true;
                break;
            };
            case 1: {
                _oFlipSprite.visible = _oFlipText.visible = true;
                _oReleaseSprite.visible = _oReleaseText.visible = true;
                _oHelpHandPress.visible = _oHelpHandRelease.visible = true;
                break;
            };
            case 2: {
                _oTextIntro.text = TEXT_HELP2;
                _oTextIntro.visible = true;
                _oDiveBestSprite.visible = _oDiveBestText.visible = true;
                _oDiveGoodSprite.visible = _oDiveGoodText.visible = true;
                _oDivePoorSprite.visible = _oDivePoorText.visible = true;
                break;
            };
        };
    };
    
    this.unload = function(){        
        createjs.Tween.get(_oFade).to({alpha:0},500);
        createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){                
                _oPanelContainer.removeAllChildren();
                s_oStage.removeChild(_oPanelContainer);
                s_oGame._bDisableEvents = false;                
                _oArrowRight.unload();
                _oArrowLeft.unload();
                _oButNext.unload();
                _oArrowRight = null;
                _oArrowLeft = null;
                _oButNext = null;
            });
    };

    this._onExitHelp = function(){
        if (_bFading === true) {
            return;
        }
        
        _bFading = true;
        createjs.Tween.removeTweens(_oPanelContainer);
        createjs.Tween.removeTweens(_oFade);
        this.unload();
        s_oGame._onExitHelp();
    };

    this._init();
}