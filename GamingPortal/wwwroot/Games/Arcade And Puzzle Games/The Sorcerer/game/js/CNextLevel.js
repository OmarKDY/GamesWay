function CNextLevel(){
    var _oBg;
    var _oMsgText;
    var _oMsgTextBack;
    var _oScoreText;
    var _oScoreTextBack;
    var _oGroup;
    
    this._init = function(){
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
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
    
    this.show = function(iLevel,iScore){
        _oMsgTextBack.refreshText( TEXT_LEVEL + " "+ iLevel);
        _oMsgText.refreshText( TEXT_LEVEL + " "+ iLevel);
        
        _oScoreTextBack.refreshText( TEXT_SCORE +" "+ iScore);
        _oScoreText.refreshText( TEXT_SCORE +" "+ iScore);
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("save_score",iScore);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
        $(s_oMain).trigger("show_interlevel_ad");
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown");
        _oGroup.alpha = 0;
        _oGroup.visible = false;
        s_oGame.nextLevel();
    };
    
    this._init();
}