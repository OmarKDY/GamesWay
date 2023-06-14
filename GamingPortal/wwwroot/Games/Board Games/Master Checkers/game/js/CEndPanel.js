function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    var _oBlackPanel;
    var _oWhitePanel;

    var _oMsgText;
    var _oMsgTextUnder;
    var _oFade;
    var _oListener;

    
    this._init = function(oSpriteBg){
        
        s_oGame.pauseGame(true);
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        _oGroup.addChild(_oFade);
        
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oGroup.addChild(_oBg);
        

        var iWidth = 800;
        var iHeight = 90;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2) - 200;
        _oMsgText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    90, "center", "#ffffff", PRIMARY_FONT, 1,
                    2, 2,
                    " ",
                    true, true, false,
                    false );
                 

        var iWidth = 800;
        var iHeight = 40;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2) - 140;
        _oMsgTextUnder = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    40, "center", "#ffffff", PRIMARY_FONT, 1,
                    2, 2,
                    " ",
                    true, true, false,
                    false );
        

        _oBlackPanel = new CInfoTurn(CANVAS_WIDTH/2,1120,PAWN_BLACK, _oGroup);
        _oBlackPanel.setBgVisible(false);
        _oBlackPanel.invert();
        _oWhitePanel = new CInfoTurn(CANVAS_WIDTH/2,970,PAWN_WHITE, _oGroup);
        _oWhitePanel.setBgVisible(false);
        _oWhitePanel.invert();


        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",_oListener);
    };
    
    this._initListener = function(){
        _oListener = _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iWinner, iBlackTime, iWhiteTime){
        
        _oBlackPanel.refreshTime(formatTime(iBlackTime));
        _oWhitePanel.refreshTime(formatTime(iWhiteTime));
        
        
        if(iWinner === WIN_WHITE){
            playSound("win",1,false); 
            
            
            _oMsgText.refreshText( sprintf(TEXT_GAMEOVER, TEXT_WHITE) );
        } else if(iWinner === WIN_BLACK) {
            if(MODE_HUMAN){
                playSound("win",1,false); 
            } else {
                playSound("game_over",1,false);
            }            
            _oMsgText.refreshText( sprintf(TEXT_GAMEOVER, TEXT_BLACK) );
            
        } else if(iWinner === DRAW){ //DRAW            
            playSound("game_over",1,false);
            _oMsgText.refreshText( TEXT_DRAW );
        } else if(iWinner === WIN_WHITE_BLACK_NOMOVES){
            playSound("win",1,false); 
            _oMsgText.refreshText( sprintf(TEXT_GAMEOVER, TEXT_WHITE) );
            _oMsgTextUnder.refreshText( sprintf(TEXT_MOVES_AVAIL, TEXT_BLACK) );
        } else if(iWinner === WIN_BLACK_WHITE_NOMOVES){
            if(MODE_HUMAN){
                playSound("win",1,false);  
            } else {
                playSound("game_over",1,false);
            }            
            _oMsgText.refreshText( sprintf(TEXT_GAMEOVER, TEXT_BLACK) );
            _oMsgTextUnder.refreshText( sprintf(TEXT_MOVES_AVAIL, TEXT_WHITE) );
        }
       
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});

        var iWhiteScore = 1800000 - iWhiteTime;        
        $(s_oMain).trigger("save_score", [iWinner, iBlackTime, iWhiteTime, s_iGameType, iWhiteScore]);
        $(s_oMain).trigger("share_event", [iWhiteScore, s_iGameType, iWinner] ); 
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown",_oListener);
        _oBlackPanel.unload();
        _oWhitePanel.unload();
        s_oStage.removeChild(_oGroup);
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
        
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg);
    
    return this;
}
