function CHelpPanel(){
    var _oText;
    var _oHelpBg;
    var _oButExit;
    var _oContainer;

    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        
        _oHelpBg = createBitmap(s_oSpriteLibrary.getSprite('help_bg')); 
	_oContainer.addChild(_oHelpBg);
                
	_oText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-300, 130, 600, 64, 
                    32, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    TEXT_HELP,
                    true, true, true,
                    false );


        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButExit = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT - 145,oSprite,_oContainer);
        _oButExit.setScale(0.6);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this); 

        
        

    };

    this.unload = function(){
        _oButExit.unload();
        
        s_oStage.removeAllChildren();
    };

    this._onExit = function(){
        this.unload();
        s_oMain.gotoGame();
    };

    this._init();

}