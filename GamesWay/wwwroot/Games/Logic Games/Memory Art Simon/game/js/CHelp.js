function CHelp(oSprite){
    
    var _oHelpBg;
    var _oText;
    var _oGroup;
    
    this._init = function(oSprite){
        _oGroup = new createjs.Container();
        s_oStage.addChild(_oGroup);
        
        _oHelpBg = createBitmap(oSprite); 
        _oGroup.addChild(_oHelpBg);
        
        _oText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, (CANVAS_HEIGHT/2)-90, 500, 160, 
                    40, "center", "#fff", GAME_FONT, 1,
                    0, 0,
                    TEXT_HELP,
                    true, true, true,
                    false );
                    
        var oParent = this;
        _oGroup.on("pressup",function(){oParent._onExitHelp()});
    };
    
    this.unload = function(){
        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExitHelp()});
        
        s_oStage.removeChild(_oGroup);
    };
    
    this._onExitHelp = function(){
        this.unload();
        s_oGame.onExitHelp();
    };
    
    this._init(oSprite);
}