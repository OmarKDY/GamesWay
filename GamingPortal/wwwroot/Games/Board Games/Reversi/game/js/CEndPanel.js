function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    var _oBlackPanel;
    var _oWhitePanel;
    var _oListener;
    var _oMsgText;

    
    this._init = function(oSpriteBg){
        
        s_oGame.pauseGame(true);
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;

        _oMsgText = new createjs.Text("","60px "+PRIMARY_FONT, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2) + 200;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 500;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oBg,_oMsgText);
        _oBlackPanel = new CInfoTurn(CANVAS_WIDTH/2,820,PAWN_BLACK, _oGroup);
        _oBlackPanel.setBgVisible(false);
        _oWhitePanel = new CInfoTurn(CANVAS_WIDTH/2,670,PAWN_BLACK, _oGroup);
        _oWhitePanel.setBgVisible(false);
        _oWhitePanel.setPawn(PAWN_WHITE);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",_oListener);
    };
    
    this._initListener = function(){
        _oListener = _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iBlackPoints, iWhitePoints, iBlackTime, iWhiteTime){
        
        _oBlackPanel.refreshTime(formatTime(iBlackTime));
        _oWhitePanel.refreshTime(formatTime(iWhiteTime));
        _oBlackPanel.refreshPawnNumber(iBlackPoints);
        _oWhitePanel.refreshPawnNumber(iWhitePoints);

        if(iBlackPoints > iWhitePoints){            
            playSound("win",1,false);            
            _oMsgText.text = TEXT_BLACK + " " +TEXT_GAMEOVER;
        } else if(iBlackPoints < iWhitePoints){

                if(s_iGameType === MODE_COMPUTER){
                    playSound("game_over",1,false);
                } else {
                    playSound("win",1,false);  
                }                   

            _oMsgText.text = TEXT_WHITE + " " +TEXT_GAMEOVER;
        } else {
            playSound("game_over",1,false);
            _oMsgText.text = TEXT_DRAW;
        }
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("save_score", [iBlackPoints, iWhitePoints, iBlackTime, iWhiteTime, s_iGameType, s_iDifficulty]);

        $(s_oMain).trigger("share_event", [iBlackPoints, iWhitePoints, s_iGameType]);
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
