function CWinPanel(iMode){    
    var _oBg;
    var _oButExit;
    var _oButRestart;
    var _oButContinue;
    var _oMsgText;
    var _oMsgBestScoreText;
    var _oThis;
    var _iMode = iMode;
    
    var _oContainer;
    
    this._init = function(iScore){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_end_panel"));
        _oContainer.addChild(_oBg);

        var iScore = s_oGame.getScore();

        var iWidth = 500;
        var iHeight = 120;
        var iTextX = CANVAS_WIDTH / 2;
        var iTextY = CANVAS_HEIGHT/2 - 150;
        _oMsgText = new CTLText(_oContainer, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    48, "center", "#FFFFFF", PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_CONGRATS, iScore),
                    true, true, true,
                    false );

       
        var iWidth = 500;
        var iHeight = 120;
        var iTextX = CANVAS_WIDTH / 2;
        var iTextY = CANVAS_HEIGHT/2;
        _oMsgBestScoreText = new CTLText(_oContainer, 
                    iTextX -iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    48, "center", "#FFFFFF", PRIMARY_FONT, 1,
                    2, 2,
                    sprintf(TEXT_YOUR_BEST_SCORE, s_aBestScore[_iMode]),
                    true, true, true,
                    false );
       
        _oButExit = new CGfxButton(CANVAS_WIDTH/2 - 170, 850, s_oSpriteLibrary.getSprite('but_home'), _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        _oButRestart = new CGfxButton(CANVAS_WIDTH/2 + 170, 850, s_oSpriteLibrary.getSprite('but_restart'), _oContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);

        _oContainer.alpha = 0;
        var _bShowInterlevel = false;

        new createjs.Tween.get(_oContainer).to({alpha:1},300).call(function(){$(s_oMain).trigger("show_interlevel_ad");});

        setVolume("soundtrack", 0.4);
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