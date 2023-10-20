function CPause (oParentContainer){
    var _oShape;
    var _oTextBack;
    var _oText;
    var _oContainer;
    var _oParentContainer;
    
    this.init = function(oParentContainer){
        s_oGame.pause(true);
        _oContainer = new createjs.Container();
        _oParentContainer = oParentContainer;
        _oParentContainer.addChild(_oContainer);
        
        _oShape = new createjs.Shape();
        _oShape.graphics.beginFill("#black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oShape.alpha = 0.7;
        _oShape.on("mousedown",this.exitPause);
        
        _oTextBack = new createjs.Text(TEXT_PAUSE," 40px " + PRIMARY_FONT, SECONDARY_FONT_COLOR);
        _oTextBack.textBaseline = "alphabetic";
        _oTextBack.textAlign = "center";
        _oTextBack.x = CANVAS_WIDTH_HALF;
        _oTextBack.y = CANVAS_HEIGHT_HALF;
        _oTextBack.outline = 5;
        
        _oText = new createjs.Text(TEXT_PAUSE," 40px " + PRIMARY_FONT, PRIMARY_FONT_COLOR);
        _oText.textBaseline =  _oTextBack.textBaseline;
        _oText.textAlign = _oTextBack.textAlign;
        _oText.x = _oTextBack.x;
        _oText.y = _oTextBack.y;
        
        _oContainer.addChild(_oShape, _oTextBack, _oText);
        _oTextBack.alpha = 1;
        _oText.alpha = 1;
    };
    
    this.exitPause = function(){
        s_oInterface.closePanel();
    };
    
    this.onExit = function(){
        _oShape.alpha = 0;
        _oTextBack.alpha = 0;    
        _oText.alpha = 0;
        s_oStage.removeChild(_oContainer);
        s_oGame.pause(false);
    };
    
    this.init(oParentContainer);
}

