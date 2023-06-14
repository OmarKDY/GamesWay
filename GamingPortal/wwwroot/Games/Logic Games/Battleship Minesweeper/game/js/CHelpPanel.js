function CHelpPanel(oSprite){
    var _oText;
    var _oTextBack;
    var _oHelpBg;
    var _oGroup;

    this._init = function(oSprite){
        _oGroup = new createjs.Container();
        
        s_oStage.addChild(_oGroup);
        
        _oHelpBg = createBitmap(oSprite); 
        _oGroup.addChild(_oHelpBg);

        _oTextBack = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 300, 672, 600, 72, 
                    36, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    TEXT_HELP1,
                    true, true, true,
                    false );
                    
        _oTextBack.setOutline(4);
		
	_oText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 300, 672, 600, 72, 
                    36, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_HELP1,
                    true, true, true,
                    false );

        var oTextBack2 = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 300, 849, 600, 60, 
                    30, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        oTextBack2.setOutline(4);
		
        var oText2 = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 300, 849, 600, 60, 
                    30, "center", "#fff", FONT_GAME, 1,
                    0, 0,
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

    this._init(oSprite);

}