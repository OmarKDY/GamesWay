function CHelpPanel() {
    var _iCurPage;
    var _oContainerPage1;
    var _oContainerPage2;
    var _oFade;
    var _oBg;
    var _oGroup;
    var _oSkipBut;
    var _oArrowRight;
    var _oArrowLeft;
    var _pStartPosSkip;

    this._init = function () {
        _iCurPage = 0;
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('bg_help');
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        _oFade.on("mousedown", function () {
        });

        _oGroup = new createjs.Container();
        _oGroup.addChild(_oFade, _oBg);
        s_oStage.addChild(_oGroup);

        _oContainerPage1 = new createjs.Container();
        _oContainerPage2 = new createjs.Container();
        _oGroup.addChild(_oContainerPage1, _oContainerPage2);
        
        this.addObjectsContainerPage1();
        this.addObjectsContainerPage2();
        
        _oArrowRight = new CGfxButton(CANVAS_WIDTH_HALF + 320,CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow_select_level_right'),_oGroup);
            _oArrowRight.addEventListener(ON_MOUSE_UP, this._onRight, this);
            
            _oArrowLeft = new CGfxButton(CANVAS_WIDTH_HALF - 340, CANVAS_HEIGHT_HALF, s_oSpriteLibrary.getSprite('arrow_select_level_left'),_oGroup);
            _oArrowLeft.addEventListener(ON_MOUSE_UP, this._onLeft, this);

        this.setPageVisible();
        this.setArrowsVisible();
        
        var oSpriteSkip = s_oSpriteLibrary.getSprite('but_continue');
        _pStartPosSkip = {x: CANVAS_WIDTH - 270, y: CANVAS_HEIGHT - 70};
        _oSkipBut = new CGfxButton(_pStartPosSkip.x, _pStartPosSkip.y, oSpriteSkip, s_oStage);
        _oSkipBut.addEventListener(ON_MOUSE_UP, this._onExitHelp, this);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
            createjs.Tween.removeTweens(_oFade);   
            s_oStage.removeChild(_oFade);
        });
    };
    
    this.addObjectsContainerPage1 = function(){
        var iTextY1 = CANVAS_HEIGHT_HALF - 150;
        var iTextY2 = iTextY1 + 40;
        var iTextY3 = iTextY2 + 30;
        
        ///////TEXT 1
        var iWidth = 500;
        var iHeight = FONT_SIZE_HELP_TEXT*3;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = iTextY1;
        var oTextBack1 = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP1,
                    true, true, true,
                    false );
        oTextBack1.setOutline(3);
        var oText1 = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP1,
                    true, true, true,
                    false );
        
        ///////TEXT 2
        var iWidth = 500;
        var iHeight = FONT_SIZE_HELP_TEXT*2;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = iTextY2;
        var oTextBack2 = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        oTextBack2.setOutline(3);
        var oText2 = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );

       
        ///////TEXT 3
        var iWidth = 500;
        var iHeight = FONT_SIZE_HELP_TEXT*2;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = iTextY3;
        var oTextBack3 = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP3,
                    true, true, true,
                    false );
        oTextBack3.setOutline(3);
        var oText3 = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP3,
                    true, true, true,
                    false );


        var iBreakableBlocksX = CANVAS_WIDTH_HALF - 120;
        var iUnbreakableBlocksX = CANVAS_WIDTH_HALF + 80;
        var iHelpObjectY = CANVAS_HEIGHT_HALF + 80;
        
        var iWidth = 244;
        var iHeight = 182;
        var data = {                    
            images: [s_oSpriteLibrary.getSprite('block_1')],
            frames: {width: iWidth, height: iHeight, regX: -22, regY: 10}, 
            animations: {idle: [0,0,false]},
            framerate: 0
        };        
        var oSpriteSheet = new createjs.SpriteSheet(data);        
        var oBreakableBlockSprite1 = createSprite(oSpriteSheet, 'idle', -22, 10, iWidth, iHeight);
        oBreakableBlockSprite1.regX = iWidth * 0.5;
        oBreakableBlockSprite1.regY = iHeight * 0.5;
        oBreakableBlockSprite1.x = iBreakableBlocksX - 10;
        oBreakableBlockSprite1.y = iHelpObjectY - 50;
        
        var oSprite = s_oSpriteLibrary.getSprite('wood_2');
        var oBreakableBlockSprite2 = createBitmap(oSprite);
        oBreakableBlockSprite2.regX = oSprite.width * 0.5;
        oBreakableBlockSprite2.regY = oSprite.height * 0.5;
        oBreakableBlockSprite2.x = iBreakableBlocksX;
        oBreakableBlockSprite2.y = iHelpObjectY + 20;
        
        var oSprite = s_oSpriteLibrary.getSprite('block_2');
        var oUnbreakableBlockSprite1 = createBitmap(oSprite);
        oUnbreakableBlockSprite1.regX = 46;
        oUnbreakableBlockSprite1.regY = 90;
        oUnbreakableBlockSprite1.x = iUnbreakableBlocksX - 10;
        oUnbreakableBlockSprite1.y = iHelpObjectY - 50;
        
        var oSprite = s_oSpriteLibrary.getSprite('wood_1');
        var oUnbreakableBlockSprite2 = createBitmap(oSprite);
        oUnbreakableBlockSprite2.regX = oSprite.width * 0.5;
        oUnbreakableBlockSprite2.regY = oSprite.height * 0.5;
        oUnbreakableBlockSprite2.x = iUnbreakableBlocksX;
        oUnbreakableBlockSprite2.y = iHelpObjectY + 20;
        
        _oContainerPage1.addChild(oBreakableBlockSprite1, oBreakableBlockSprite2, oUnbreakableBlockSprite1, oUnbreakableBlockSprite2);
        
        var iWidth = 150;
        var iHeight = FONT_SIZE_HELP_TEXT*2;
        var iTextX = iBreakableBlocksX;
        var iTextY = iHelpObjectY + 50;
        var oTextBreakableBack = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP_BREAKABLE,
                    true, true, true,
                    false );
        oTextBreakableBack.setOutline(3);
        var oTextBreakable = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP_BREAKABLE,
                    true, true, true,
                    false );
        
        
        var iWidth = 150;
        var iHeight = FONT_SIZE_HELP_TEXT*2;
        var iTextX = iUnbreakableBlocksX;
        var iTextY = iHelpObjectY + 50;
        var oTextBreakableBack = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP_UNBREAKABLE,
                    true, true, true,
                    false );
        oTextBreakableBack.setOutline(3);
        var oTextBreakable = new CTLText(_oContainerPage1, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP_UNBREAKABLE,
                    true, true, true,
                    false ); 
    };

    this.addObjectsContainerPage2 = function(){
        var iTextY1 = CANVAS_HEIGHT_HALF - 150;
        var iTextY2 = iTextY1 + 50;
        var iTextY3 = iTextY2 + 50;
        
        ///////TEXT 1
        var iWidth = 500;
        var iHeight = FONT_SIZE_HELP_TEXT*3;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = iTextY1;
        var oTextBack1 = new CTLText(_oContainerPage2, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP4,
                    true, true, true,
                    false );
        oTextBack1.setOutline(3);
        var oText1 = new CTLText(_oContainerPage2, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP4,
                    true, true, true,
                    false );
        
        ///////TEXT 2
        var iWidth = 500;
        var iHeight = FONT_SIZE_HELP_TEXT*3;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = iTextY2;
        var oTextBack2 = new CTLText(_oContainerPage2, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP5,
                    true, true, true,
                    false );
        oTextBack2.setOutline(3);
        var oText2 = new CTLText(_oContainerPage2, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP5,
                    true, true, true,
                    false );
        
        ///////TEXT 3
        var iWidth = 500;
        var iHeight = FONT_SIZE_HELP_TEXT*3;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = iTextY3;
        var oTextBack3 = new CTLText(_oContainerPage2, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP6,
                    true, true, true,
                    false );
        oTextBack3.setOutline(3);
        var oText3 = new CTLText(_oContainerPage2, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.4,
                    2, 2,
                    TEXT_HELP6,
                    true, true, true,
                    false );
       
       
        var oSprite = s_oSpriteLibrary.getSprite('coin_score');
        var oStrawberrySprite = createBitmap(oSprite);
        oStrawberrySprite.regX = oSprite.width * 0.5;
        oStrawberrySprite.regY = oSprite.height * 0.5;
        oStrawberrySprite.x = CANVAS_WIDTH_HALF - 30;
        oStrawberrySprite.y = CANVAS_HEIGHT_HALF + 30;        
        _oContainerPage2.addChild(oStrawberrySprite);
        
        var oStrawberrySprite = createBitmap(oSprite);
        oStrawberrySprite.regX = oSprite.width * 0.5;
        oStrawberrySprite.regY = oSprite.height * 0.5;
        oStrawberrySprite.x = CANVAS_WIDTH_HALF + 30;
        oStrawberrySprite.y = CANVAS_HEIGHT_HALF + 30;
        _oContainerPage2.addChild(oStrawberrySprite);
        
        var oStrawberrySprite = createBitmap(oSprite);
        oStrawberrySprite.regX = oSprite.width * 0.5;
        oStrawberrySprite.regY = oSprite.height * 0.5;
        oStrawberrySprite.x = CANVAS_WIDTH_HALF;
        oStrawberrySprite.y = CANVAS_HEIGHT_HALF + 30;
        _oContainerPage2.addChild(oStrawberrySprite);
        
        ///////TEXT 3
        var iWidth = 380;
        var iHeight = FONT_SIZE_HELP_TEXT*3;
        var iTextX = CANVAS_WIDTH_HALF - 10;
        var iTextY = CANVAS_HEIGHT_HALF + 100;
        var oStrawberryTextBack = new CTLText(_oContainerPage2, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", SECONDARY_FONT_COLOR, PRIMARY_FONT, 1.5,
                    2, 2,
                    TEXT_HELP7,
                    true, true, true,
                    false );
        oStrawberryTextBack.setOutline(3);
        var oStrawberryText = new CTLText(_oContainerPage2, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    FONT_SIZE_HELP_TEXT, "center", PRIMARY_FONT_COLOR, PRIMARY_FONT, 1.5,
                    2, 2,
                    TEXT_HELP7,
                    true, true, true,
                    false );
    };

    this.setPageVisible = function(){
        if (_iCurPage === 0) {
            _oContainerPage1.visible = true;
            _oContainerPage2.visible = false;
        } else {
            _oContainerPage1.visible = false;
            _oContainerPage2.visible = true;
        }
    };

    this.setArrowsVisible = function(){
        if (_iCurPage === 0) {
            _oArrowRight.setVisible(true);
            _oArrowLeft.setVisible(false);
        } else {
            _oArrowRight.setVisible(false);
            _oArrowLeft.setVisible(true);
        }
    };

    this._onRight = function(){
        _iCurPage++;
        this.setPageVisible();
        this.setArrowsVisible();
    };
    
    this._onLeft = function(){
        _iCurPage--;        
        this.setPageVisible();
        this.setArrowsVisible();
    };

    this.unload = function () {
        s_oStage.removeChild(_oGroup);
        _oSkipBut.unload();
        _oSkipBut = null;        
    };

    this._onExitHelp = function () {
        this.unload();
        setTimeout(s_oGame._onExitHelp, 200);
    };

    this._init();

}