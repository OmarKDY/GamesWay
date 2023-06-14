function CHelpPanel(){
    var _oText1;
    var _oText2;
    var _oText3;
    var _oImg1;
    var _oImg2;

    var _oHelpBg;
    var _oGroup;

    this._init = function(){
        
        _oGroup = new createjs.Container();
        s_oStage.addChild(_oGroup);
        
        _oHelpBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oGroup.addChild(_oHelpBg);
  
        _oImg1 = createBitmap(s_oSpriteLibrary.getSprite('survivor_run'+10));
        _oImg1.x = CANVAS_WIDTH/2 - 180;
        _oImg1.y = CANVAS_HEIGHT/2 - 90;
        _oImg1.scaleX = _oImg1.scaleY = 0.7;
        _oGroup.addChild(_oImg1);
  
        _oImg2 = createBitmap(s_oSpriteLibrary.getSprite('zombie0_run'+22));
        _oImg2.x = CANVAS_WIDTH/2 + 100;
        _oImg2.y = CANVAS_HEIGHT/2 - 120;
        _oImg2.scaleX = _oImg2.scaleY = 0.85;
        _oGroup.addChild(_oImg2);

        
        var iWidth = 250;
        var iHeight = 50;
        var iTextX = CANVAS_WIDTH/2 +140;
        var iTextY = (CANVAS_HEIGHT/2)-120;
        _oText1 = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    22, "center", "#fff2af", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP1,
                    true, true, true,
                    false );

       
        var iWidth = 250;
        var iHeight = 50;
        var iTextX = CANVAS_WIDTH/2 -140;
        var iTextY = (CANVAS_HEIGHT/2)-120;
        _oText2 = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    22, "center", "#fff2af", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );

        var iWidth = 500;
        var iHeight = 70;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = (CANVAS_HEIGHT/2)+120;
        _oText3 = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    36, "center", "#fff2af", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        

        var oParent = this;
        _oGroup.on("pressup",function(){oParent._onExitHelp()});
        
        
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);

        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp()});
    };

    this._onExitHelp = function(){
        this.unload();
        s_oGame._onExitHelp();
    };

    this._init();

}
