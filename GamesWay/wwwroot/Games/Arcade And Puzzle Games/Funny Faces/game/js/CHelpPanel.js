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
                    CANVAS_WIDTH/2-248, 502, 500, 220, 
                    80, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    TEXT_HELP,
                    true, true, true,
                    false );

		
	_oText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, 500, 500, 220, 
                    80, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_HELP,
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
        $(s_oMain).trigger("start_level",1);
    };

    this._init(oSprite);

}