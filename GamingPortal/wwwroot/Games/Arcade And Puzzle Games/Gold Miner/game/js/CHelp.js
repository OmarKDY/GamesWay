function CHelp(oSprite){
    var _oGroup;
    var _oText1;
    var _oText1Back;
    var _oText2;
    var _oText2Back;
    
    this._init = function(oSprite){
        var oBg = createBitmap(oSprite); 
        
        _oText1Back = new createjs.Text(TEXT_COLLECT,"40px "+FONT_GAME, "#000000");
        _oText1Back.x = CANVAS_WIDTH/2 + 2;
        _oText1Back.y = 242;
        _oText1Back.textAlign = "center";
        
        _oText1 = new createjs.Text(TEXT_COLLECT,"40px "+FONT_GAME, "#ffffff");
        _oText1.x = CANVAS_WIDTH/2;
        _oText1.y = 240;
        _oText1.textAlign = "center";
        
        _oText2Back = new createjs.Text(TEXT_AVOID,"40px "+FONT_GAME, "#000000");
        _oText2Back.x = CANVAS_WIDTH/2 + 2;
        _oText2Back.y = 422;
        _oText2Back.textAlign = "center";
        
        _oText2 = new createjs.Text(TEXT_AVOID,"40px "+FONT_GAME, "#ffffff");
        _oText2.x = CANVAS_WIDTH/2;
        _oText2.y = 420;
        _oText2.textAlign = "center";
        
        _oGroup = new createjs.Container();
        _oGroup.addChild(oBg);
        _oGroup.addChild(_oText1Back);
        _oGroup.addChild(_oText2Back);
        _oGroup.addChild(_oText1);
        _oGroup.addChild(_oText2);
        
        s_oStage.addChild(_oGroup);
        
        var oParent = this;
        _oGroup.on("pressup",function(){oParent._onExit()});
    };
    
    this.unload = function(){
        var oParent = this;
        _oGroup.off("pressup",function(){oParent._onExit()});
        s_oStage.removeChild(_oGroup);
    };
    
    this._onExit = function(){
        this.unload();
        s_oGame.onExitHelp();
    };
    
    this._init(oSprite);
}