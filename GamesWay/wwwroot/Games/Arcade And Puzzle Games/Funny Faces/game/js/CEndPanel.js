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
                    CANVAS_WIDTH/2-248, (CANVAS_HEIGHT/2)-108, 500, 80, 
                    80, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );


        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, (CANVAS_HEIGHT/2)-110, 500, 80, 
                    80, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
        
        _oScoreTextBack = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-248, (CANVAS_HEIGHT/2)+32, 500, 50, 
                    50, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );

        
        _oScoreText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, (CANVAS_HEIGHT/2)+30, 500, 50, 
                    50, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
       
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
        $(s_oMain).trigger("show_interlevel_ad");
    };
    
    this.show = function(iScore){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            setVolume("soundtrack",0);
            playSound("gameover", 1, false);
            s_aSounds["gameover"].on('end', function(){setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME )});
        }
        
        _oMsgTextBack.refreshText(TEXT_GAMEOVER);
        _oMsgText.refreshText(TEXT_GAMEOVER);

        _oScoreTextBack.refreshText(TEXT_SCORE+": "+iScore);
        _oScoreText.refreshText(TEXT_SCORE+": "+iScore);
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
		
        
	$(s_oMain).trigger("save_score",iScore);
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown");
	s_oStage.removeChild(_oGroup);
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg);
    
    return this;
}