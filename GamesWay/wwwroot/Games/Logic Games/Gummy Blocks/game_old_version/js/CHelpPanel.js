function CHelpPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    var _oHelp;
    var _oHelpText;
    var _oHelpText1;
    var _oFade;
    var _oListener;
    
    this._init = function(oSpriteBg){  
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        //_oListener = _oFade.on("click", function () {});
        //_oContainer.addChild(_oFade);
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2 - 70;
             
        _oHelp = createBitmap(s_oSpriteLibrary.getSprite('bg_help'));
        _oHelp.x = CANVAS_WIDTH/2-100
        _oHelp.y = CANVAS_HEIGHT/2-290;
        
        _oHelpText1 = new createjs.Text(TEXT_HELP," 30px "+FONT, "#ffffff");
        _oHelpText1.x = CANVAS_WIDTH/2;
        _oHelpText1.y = (CANVAS_HEIGHT/2);
        _oHelpText1.textAlign = "center";
        _oHelpText1.textBaseline = "alphabetic";
        _oHelpText1.lineWidth = 470;

        _oGroup = new createjs.Container();
        
        _oGroup.addChild(_oFade, _oBg,  _oHelp, _oHelpText, _oHelpText1);
        _oGroup.alpha = 0;
        s_oStage.addChild(_oGroup);
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",_oListener);
    };
    
    this._initListener = function(){
        _oListener = _oGroup.on("mousedown",this._onExit);
    };
    
    
    this._onExit = function(){
        _oGroup.off("mousedown",_oListener);
        s_oStage.removeChild(_oGroup);
        
        s_oGame.setUpdateOn();
        $(s_oMain).trigger("start_level");
    };
    
    this._init(oSpriteBg);
    
    return this;
}
