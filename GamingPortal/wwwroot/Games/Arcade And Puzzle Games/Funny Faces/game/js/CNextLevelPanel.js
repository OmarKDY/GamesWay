function CNextLevelPanel(oSpriteBg){
    var _iLevel;
    var _oGroup;
    var _oBg;
    var _oMsgText;
    var _oMsgTextBack;
	
    this._init = function(oSpriteBg){
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        _oBg = createBitmap(oSpriteBg);
        _oGroup.addChild(_oBg);
        
        _oMsgTextBack = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-248, (CANVAS_HEIGHT/2) - 58, 500, 100, 
                    100, "center", "#000", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
                    
        

        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-250, (CANVAS_HEIGHT/2) - 60, 500, 100, 
                    100, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
	
		
        var oParent = this;
	_oGroup.on("mousedown",oParent._onExit);
    };

    this.show = function(iLevel,iScore){
        _iLevel = iLevel;
        _oMsgTextBack.refreshText(TEXT_LEVEL + " "+iLevel);
        _oMsgText.refreshText(TEXT_LEVEL + " "+iLevel);

        _oGroup.visible = true;
        
        $(s_oMain).trigger("save_score",iScore);
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {s_oGame.initNextLevel()});
    };
    
    this._onExit = function(){
        var oParent = this;
        _oGroup.off("mousedown",oParent._onExit);
        s_oStage.removeChild(_oGroup);
        
        $(s_oMain).trigger("start_level",_iLevel);
    };

    this._init(oSpriteBg);
}