function CWinPanel(iNumber){
    
    var _oBg;
    var _oButExit;
    var _oButRestart;
    var _oButContinue;
    var _oMsgText;
    var _oThis;

    var _oContainer;
    
    this._init = function(iNumber){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_end_panel"));
        _oContainer.addChild(_oBg);

        _oMsgText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2-60, 500, 200, 
                    74, "center", "#8ce5e6", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_CONGRATS + " " + iNumber + "!",
                    true, true, true,
                    false );

        
        _oButExit = new CGfxButton(CANVAS_WIDTH/2 - 200, 900, s_oSpriteLibrary.getSprite('but_home'), _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        _oButRestart = new CGfxButton(CANVAS_WIDTH/2, 900, s_oSpriteLibrary.getSprite('but_restart'), _oContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        
        _oButContinue = new CGfxButton(CANVAS_WIDTH/2 + 200, 900, s_oSpriteLibrary.getSprite('but_continue'), _oContainer);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onContinue, this);
        if(iNumber === FINAL_NUMBER){
            _oButContinue.setVisible(false);
            _oButRestart.setX(CANVAS_WIDTH/2 + 200);
        }
        
        
        _oContainer.alpha = 0;
	new createjs.Tween.get(_oContainer).to({alpha:1},500).call(function(){$(s_oMain).trigger("show_interlevel_ad");});	
    };
    
    this.unload = function(){
        _oButExit.unload(); 
        _oButExit = null;

        _oButRestart.unload();
        _oButRestart = null;
        
        s_oStage.removeChild(_oContainer);
    };
    
    this._onExit = function(){
        _oThis.unload();
        s_oMain.gotoMenu();
    };
    
    this._onRestart = function(){
        _oThis.unload();
        s_oGame.restart();
    };
    
    this._onContinue = function(){
        _oThis.unload();
        s_oGame.resumeGame();
    };
    
    _oThis = this;
    this._init(iNumber);
    
}