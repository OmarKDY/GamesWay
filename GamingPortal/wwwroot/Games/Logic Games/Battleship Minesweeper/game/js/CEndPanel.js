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
                    CANVAS_WIDTH/2 - 300, (CANVAS_HEIGHT/2)-100, 600, 90, 
                    90, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        _oMsgTextBack.setOutline(4);

        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 300, (CANVAS_HEIGHT/2)-100, 600, 90,  
                    90, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        
        _oScoreTextBack = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 300, (CANVAS_HEIGHT/2)+72, 600, 52, 
                    52, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        _oScoreTextBack.setOutline(4)
        
        _oScoreText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 300, (CANVAS_HEIGHT/2)+72, 600, 52, 
                    52, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        
        

        
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",this._onExit);
        s_oStage.removeChild(_oGroup);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iScore,bWin){
        if(bWin){
            _oMsgTextBack.refreshText(TEXT_CONGRATS);
            _oMsgText.refreshText(TEXT_CONGRATS);
        }else{
            _oMsgTextBack.refreshText(TEXT_GAMEOVER);
            _oMsgText.refreshText(TEXT_GAMEOVER);
        }
        _oScoreTextBack.refreshText(TEXT_SCORE+": "+iScore);
        _oScoreText.refreshText(TEXT_SCORE+": "+iScore);
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
		
	$(s_oMain).trigger("save_score",iScore);
        $(s_oMain).trigger("end_level",1);
        $(s_oMain).trigger("share_event",iScore);
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown");
        $(s_oMain).trigger("show_interlevel_ad");

        s_oGame.onExit();
    };
    
    this._init(oSpriteBg);
    
    return this;
}