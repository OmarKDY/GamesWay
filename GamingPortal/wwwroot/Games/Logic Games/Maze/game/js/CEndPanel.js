function CEndPanel(){
    var _oBg;
    var _oButExit;
    var _oButRestart;
    var _oMsgTextGameOver;
    var _oMsgTextFinalScore;
    var _oThis;

    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_end_panel"));
        _oContainer.addChild(_oBg);

        
        
        var iWidth = 500;
        var iHeight = 60;
        var iTextX = CANVAS_WIDTH / 2;
        var iTextY = CANVAS_HEIGHT/2 - 60;
        _oMsgTextGameOver = new CTLText(_oContainer, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    54, "center", "#FFFFFF", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_GAMEOVER,
                    true, true, true,
                    false );

        
        var iWidth = 500;
        var iHeight = 60;
        var iTextX = CANVAS_WIDTH / 2;
        var iTextY = CANVAS_HEIGHT/2 + 40;
        _oMsgTextFinalScore = new CTLText(_oContainer, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    54, "center", "#FFFFFF", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_END_PANEL + ": " + 0,
                    true, true, true,
                    false );
        
        _oButExit = new CGfxButton(CANVAS_WIDTH/2 - 170, 850, s_oSpriteLibrary.getSprite('but_home'), _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        
        _oButRestart = new CGfxButton(CANVAS_WIDTH/2 + 170, 850, s_oSpriteLibrary.getSprite('but_restart'), _oContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        
        _oContainer.alpha = 0;
	new createjs.Tween.get(_oContainer).to({alpha:1},500).call(function(){$(s_oMain).trigger("show_interlevel_ad");});		
        console.log('iScore  ' + 0);
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
    
    _oThis = this;
    this._init();
}