function CEndPanel(oSpriteBg){
    var _oBg;
    var _oTextGameOver;
    var _oTextRes1;
    var _oGroup;
    
    this._init = function(oSpriteBg){
        
        
        
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
         s_oStage.addChild(_oGroup);
         
         _oBg = createBitmap(oSpriteBg);
        _oGroup.addChild(_oBg);
        
        _oTextGameOver = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, (CANVAS_HEIGHT/2)-62, 500, 40, 
                    40, "center", "#fff", GAME_FONT, 1,
                    0, 0,
                    TEXT_GAMEOVER,
                    true, true, false,
                    false );
        
        _oTextGameOver.setShadow("#000",2,2,2);


        _oTextRes1 = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, (CANVAS_HEIGHT/2)+14, 500, 24, 
                    24, "center", "#fff", GAME_FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
        _oTextRes1.setShadow("#000",2,2,2);
        
        var oParent = this;
        _oGroup.on("pressup", function() {oParent._onExit();});
        
       
    };
	
    this.unload = function(){
        var oParent = this;
        _oGroup.off("pressup", function() {oParent._onExit();});
        
        s_oStage.removeChild(_oGroup);
    };
    
    this.show = function(szText2){
        _oTextRes1.refreshText(TEXT_MAX_SEQ+": "+szText2);
     
        _oGroup.visible = true;
        
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function(){$(s_oMain).trigger("show_interlevel_ad");});
		
	$(s_oMain).trigger("save_score",szText2);
    };
    
    this._onExit = function(){
        this.unload();

        s_oGame._onExit();
    };
    
    this._init(oSpriteBg);
}