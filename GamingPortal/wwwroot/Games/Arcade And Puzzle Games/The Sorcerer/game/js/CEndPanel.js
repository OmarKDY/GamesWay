function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oScoreTextBack;
    var _oScoreText;
    var _oMsgText;
    var _oMsgTextBack;
    var _oGroup;
    
    this._init = function(oSpriteBg){
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        _oBg = createBitmap(oSpriteBg);
        _oGroup.addChild(_oBg);
        
        _oMsgTextBack = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 80, (CANVAS_HEIGHT/2)-68, 210, 30, 
                    50, "center", "#000", FONT_GAME, 1.1,
                    0, 0,
                    TEXT_CONGRATS,
                    true, true, true,
                    false );



        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 80, (CANVAS_HEIGHT/2)-68, 210, 30, 
                    50, "center", "#fff", FONT_GAME, 1.1,
                    0, 0,
                    TEXT_CONGRATS,
                    true, true, true,
                    false );

        
        _oScoreTextBack = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 80, (CANVAS_HEIGHT/2)-15, 200, 70, 
                    50, "center", "#000", FONT_GAME, 1.1,
                    0, 0,
                    TEXT_FINAL_SCORE + "\n99999",
                    true, true, true,
                    false );

        
        _oScoreText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 80, (CANVAS_HEIGHT/2)-15, 200, 70, 
                    50, "center", "#fff", FONT_GAME, 1.1,
                    0, 0,
                    TEXT_FINAL_SCORE + "\n99999",
                    true, true, true,
                    false );
        
        
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",this._onExit);
        s_oStage.removeChild(_oGroup);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
        $(s_oMain).trigger("show_interlevel_ad");
    };
    
    this.show = function(iScore,bWin){
        if(bWin){
            _oMsgTextBack.refreshText( TEXT_CONGRATS);
            _oMsgText.refreshText(TEXT_CONGRATS);
        }else{
            _oMsgTextBack.refreshText( TEXT_GAMEOVER);
            _oMsgText.refreshText(TEXT_GAMEOVER);
        }
        _oScoreTextBack.refreshText( TEXT_FINAL_SCORE+"\n "+iScore);
        _oScoreText.refreshText( TEXT_FINAL_SCORE+"\n "+iScore);
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("save_score",iScore);
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown");
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg);
    
    return this;
}