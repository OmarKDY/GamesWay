function CHelpPanel(){

    var _bPage1Active = true;

    var _oHelpBg;
    
    var _oMsgStroke1;
    var _oMsg1;
    var _oMsgStroke2;
    var _oMsg2;
    
    var _oRightArrow;
    
    var _oMsg3;
    var _oMsgStroke3;
    var _oMsg4;
    var _oMsgStroke4;
    var _oBomb;
    var _oClock;
    var _oChanging;
    var _oLeftArrow;
    var _oListener;
    
    var _aThree;
    var _aFour;
    
    var _oParent;

    this._init = function(){
       
        var oSprite = s_oSpriteLibrary.getSprite('pause_panel');
        _oHelpBg = createBitmap(oSprite);
        _oListener = _oHelpBg.on("click", function(){_oParent._onExitHelp();});
        s_oStage.addChild(_oHelpBg);
        
        _oBomb = createSprite(s_oFruitSpritesheet, "bomb",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
        _oBomb.x = 150;
        _oBomb.y = 350;
        
        _oClock = createSprite(s_oFruitSpritesheet, "clock",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
        _oClock.x = 430;
        _oClock.y = 450;
        
        _oChanging = createSprite(s_oFruitSpritesheet, "changing",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
        _oChanging.x = 150;
        _oChanging.y = 600;
        
        _aThree = new Array();
        var iOffset = 10;
        for(var i=0; i<3; i++){
            _aThree[i] = createSprite(s_oFruitSpritesheet, "type_0",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
            _aThree[i].x = CANVAS_WIDTH/2 +i*(CELL_SIZE+iOffset) - CELL_SIZE-iOffset;
            _aThree[i].y = 300;
        }
        
        _aFour = new Array();
        for(var i=0; i<4; i++){
            _aFour[i] = createSprite(s_oFruitSpritesheet, "type_4",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
            _aFour[i].x = CANVAS_WIDTH/2 +i*(CELL_SIZE+iOffset) - (CELL_SIZE+iOffset)*3/2;
            _aFour[i].y = 500;
        }
        
        this._buildPage1();
        
        
    };

    this.unload = function(){       
        
        if(_bPage1Active){
            _oMsg1.unload();
            _oMsgStroke1.unload();
            _oMsg2.unload();
            _oMsgStroke2.unload();
            for(var i=0; i<3; i++){
                s_oStage.removeChild(_aThree[i]);
            }
            for(var i=0; i<4; i++){
                s_oStage.removeChild(_aFour[i]);
            }
            _oRightArrow.unload();
        } else {
            _oMsg1.unload();
            _oMsgStroke1.unload();
            _oMsg2.unload();
            _oMsgStroke2.unload();
            _oMsg3.unload();
            _oMsgStroke3.unload();
            _oMsg4.unload();
            _oMsgStroke4.unload();
            _oLeftArrow.unload();
            s_oStage.removeChild(_oBomb);
            s_oStage.removeChild(_oClock);
            s_oStage.removeChild(_oChanging);
        }
        
        _oHelpBg.off("click", _oListener);
        s_oStage.removeChild(_oHelpBg);
        
    };
    
    this._buildPage1 = function(){
        _bPage1Active = true;
        
        for(var i=0; i<3; i++){
            s_oStage.addChild(_aThree[i]);
        }
        for(var i=0; i<4; i++){
            s_oStage.addChild(_aFour[i]);
        }
        
        _oMsgStroke1 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-200, 350, 400, 100, 
                    25, "center", "#821010", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP,
                    true, true, true,
                    false );
        _oMsgStroke1.setOutline(4);
        
        _oMsg1 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-200, 350, 400, 100, 
                    25, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP,
                    true, true, true,
                    false );
                    
        _oMsgStroke2 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-200, 530, 400, 100, 
                    25, "center", "#821010", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        _oMsgStroke2.setOutline(4);
        
        _oMsg2 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-200, 530, 400, 100, 
                    25, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('arrow');
        _oRightArrow = new CGfxButton(CANVAS_WIDTH/2 + 200, 700, oSprite, s_oStage);
        _oRightArrow.addEventListener(ON_MOUSE_UP, this._onButRightRelease, this);
        
    };

    this._buildPage2 = function(){        
        _bPage1Active = false;
        
        _oMsgStroke1 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-200, 270, 400, 30, 
                    30, "center", "#821010", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_ITEM,
                    true, true, false,
                    false );
        _oMsgStroke1.setOutline(4);
        
        _oMsg1 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-200, 270, 400, 30, 
                    30, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_ITEM,
                    true, true, true,
                    false );
        

        s_oStage.addChild(_oBomb);
        
        _oMsgStroke2 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-80, 330, 250, 50, 
                    16, "left", "#821010", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_BOMB,
                    true, true, true,
                    false );
        _oMsgStroke2.setOutline(4);
        
        
        _oMsg2 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-80, 330, 250, 50, 
                    16, "left", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_BOMB,
                    true, true, true,
                    false );
        
        s_oStage.addChild(_oClock);
        
        _oMsgStroke3 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-150, 424, 275, 50, 
                    16, "right", "#821010", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_CLOCK,
                    true, true, true,
                    false );
        _oMsgStroke3.setOutline(4);
        
        _oMsg3 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-150, 424, 275, 50, 
                    16, "right", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_CLOCK,
                    true, true, true,
                    false );
        
        s_oStage.addChild(_oClock);
        
        _oMsgStroke4 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-85, 540, 250, 120, 
                    16, "left", "#821010", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_CHANGING,
                    true, true, true,
                    false );
        _oMsgStroke4.setOutline(4);            
       
        _oMsg4 = new CTLText(s_oStage, 
                    CANVAS_WIDTH/2-85, 540, 250, 120, 
                    16, "left", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP_CHANGING,
                    true, true, true,
                    false );
        s_oStage.addChild(_oChanging);
        
        var oSprite = s_oSpriteLibrary.getSprite('arrow');
        _oLeftArrow = new CGfxButton(CANVAS_WIDTH/2 - 200, 700, oSprite, s_oStage);
        _oLeftArrow.addEventListener(ON_MOUSE_UP, this._onButLeftRelease, this);
        _oLeftArrow.reverseSprite();
        
    };
    
    this._onButRightRelease = function(){
        _oMsg1.unload();
        _oMsgStroke1.unload();
        _oMsg2.unload();
        _oMsgStroke2.unload();
        for(var i=0; i<3; i++){
            s_oStage.removeChild(_aThree[i]);
        }
        for(var i=0; i<4; i++){
            s_oStage.removeChild(_aFour[i]);
        }
        
        _oRightArrow.unload();
        
        this._buildPage2();
    };
    
    this._onButLeftRelease = function(){
        if(!_bPage1Active){
            _oMsg1.unload();
            _oMsgStroke1.unload();
            _oMsg2.unload();
            _oMsgStroke2.unload();
            _oMsg3.unload();
            _oMsgStroke3.unload();
            _oMsg4.unload();
            _oMsgStroke4.unload();
            _oLeftArrow.unload();
            s_oStage.removeChild(_oBomb);
            s_oStage.removeChild(_oClock);
            s_oStage.removeChild(_oChanging);
        }
        
        this._buildPage1();
    };

    this._onExitHelp = function(){
        _oParent.unload();
        s_oGame.onExitHelp();
    };

    this._onButContinueRelease = function(){
        this.unload();
        s_oGame.onExitHelp();
    };

    _oParent=this;
    this._init();

}
