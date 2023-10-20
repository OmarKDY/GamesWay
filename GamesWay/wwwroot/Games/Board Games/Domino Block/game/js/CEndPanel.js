function CEndPanel(iPlayers, iWinnerPlayer, iWinnerPoints){
    var _oBg;
    var _oMessageBg;
    var _oButExit;
    var _oButRestart;
    var _oMsgGameOver;
    var _oMsgWinnerPlayer;
    var _oMsgWinnerScore;
    var _oMsgText0;
    var _oMsgText1;
    var _oMsgText2;
    var _oMsgText3;
    var _oMsgBestScore;
    var _oThis;
    var _oContainer;
    
    var _iPage;
    var _iPlayers;
    var _iWinnerPlayer;
    var _iWinnerPoints;
    var _iBestScore;

    this._init = function(){
        _iPage = 0;
        _iPlayers = iPlayers;
        _iWinnerPlayer = iWinnerPlayer+1;
        _iWinnerPoints = iWinnerPoints;
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_end_panel"));
        _oContainer.addChild(_oBg);
        
        _oMessageBg = createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
        _oMessageBg.regX = 616/2;
        _oMessageBg.regY = 617/2;
        _oMessageBg.x = CANVAS_WIDTH_HALF;
        _oMessageBg.y = CANVAS_HEIGHT_HALF;
        _oContainer.addChild(_oMessageBg);

        _oMsgGameOver = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2 - 250, 500, 100, 
                    40, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
                    

        
        if (_iWinnerPlayer === 1) {
            _oMsgGameOver.refreshText(TEXT_GAMEWON);
        } else {
            _oMsgGameOver.refreshText(TEXT_GAMEOVER);
        };
        
        _oMsgWinnerPlayer = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2 - 100, 500, 30, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_PLAYER + " " + _iWinnerPlayer + " " + TEXT_WINS,
                    true, true, false,
                    false );
                    
        
        
        _oMsgWinnerScore = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2, 500, 30, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_MATCHSCORE + " " + _iWinnerPoints + " " + TEXT_PTS,
                    true, true, false,
                    false );
                    
   
       
        var iButtonY = CANVAS_HEIGHT_HALF + 220;
        
        _oButExit = new CGfxButton(CANVAS_WIDTH/2 - 210, iButtonY, s_oSpriteLibrary.getSprite('but_home'), _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
                
        _oButRestart = new CGfxButton(CANVAS_WIDTH/2 + 210, iButtonY, s_oSpriteLibrary.getSprite('but_restart'), _oContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);

        _oContainer.alpha = 0;


        new createjs.Tween.get(_oContainer).to({alpha:1},500).call(function(){$(s_oMain).trigger("show_interlevel_ad");});
    };
    
    this.initPage = function(){
        _iPage++;
        
        if (_iPage > 1) {
            _iPage = 0;
        };
        
        _oMsgWinnerPlayer.refreshText(" ");
        _oMsgWinnerScore.refreshText(" ");
        
        _oMsgGameOver.refreshText(TEXT_GAMESUMMARY);
        
        var iScorePlayer0 = s_oGame.getScore(0);
        var iScorePlayer1 = s_oGame.getScore(1);
        
        _oMsgText0 = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2-110, 500, 30, 
                    30, "center", SPECIAL_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_PLAYER + " 1: " + iScorePlayer0 + " " + TEXT_PTS,
                    true, true, false,
                    false );
                    
     
        
        _oMsgText1 = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2-70, 500, 30, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_PLAYER + " 2: " + iScorePlayer1 + " " + TEXT_PTS,
                    true, true, false,
                    false );
                    
       

        if (_iPlayers > 2) {
            var iScorePlayer2 = s_oGame.getScore(2);
            _oMsgText2 = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2-30, 500, 30, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_PLAYER + " 3: " + iScorePlayer2 + " " + TEXT_PTS,
                    true, true, false,
                    false );
                    
            

            if (_iPlayers > 3) {
                var iScorePlayer3 = s_oGame.getScore(3);
                _oMsgText3 = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2+10, 500, 30, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_PLAYER + " 4: " + iScorePlayer3 + " " + TEXT_PTS,
                    true, true, false,
                    false );

            };
        };
        
        if (_iBestScore === undefined) {
            _iBestScore = 0;
        } else {
            _iBestScore = s_aBestScore[_iPlayers];
        };
        
        _oMsgBestScore = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-250, CANVAS_HEIGHT/2+100, 500, 30, 
                    30, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_BESTSCORE + ": " + _iBestScore + " " + TEXT_PTS,
                    true, true, false,
                    false );
                    
        
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
        s_oGame.resetScore(_iPlayers);
        s_oGame.onExit();
    };
    
    this._onRestart = function(){
        switch (_iPage) {
            case 0:
                this.initPage();
                break;
            case 1:
                s_oGame.resetScore(_iPlayers);
                _oThis.unload();
                s_oGame.restart();
                break;
        };
    };
    
    _oThis = this;
    this._init();
}