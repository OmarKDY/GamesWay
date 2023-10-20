function CEndPanel(oSpriteBg){
    var _iScore;
    var _oBg;
    var _oMsgText;
    var _oTitleText;
    var _oScoreText;
    var _oGroup;
    var _oListener;
    
    this._init = function(oSpriteBg){
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;
        _oGroup.addChild(_oBg);

        
        var iWidth = 500;
        var iHeight = 70;
        _oTitleText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 -iWidth/2, (CANVAS_HEIGHT/2)-102 - iHeight/2, iWidth, iHeight, 
                    60, "center", "#FF6699", FONT_GAME, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
        
        var iWidth = 150;
        var iHeight = 100;
        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 - 60 -iWidth/2, (CANVAS_HEIGHT/2)+64 - iHeight/2, iWidth, iHeight, 
                    40, "center", "#ffffff", FONT_GAME, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );

        var iWidth = 500;
        var iHeight = 50;
        _oScoreText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2 -iWidth/2, (CANVAS_HEIGHT/2)-40 - iHeight/2, iWidth, iHeight, 
                    40, "center", "#ffffff", FONT_GAME, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );

        
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",_oListener);
    };
    
    this._initListener = function(){
        _oListener = _oGroup.on("mousedown",this._onExit);
        $(s_oMain).trigger("show_interlevel_ad");
    };
    
    this.show = function(szTitle,szMsg,iCharacter,iScore){
        _iScore = iScore;
        
        _oTitleText.refreshText( szTitle ); 
        _oMsgText.refreshText( szMsg );
        _oScoreText.refreshText( TEXT_FINAL_SCORE + " " + iScore );
        
        var oSprite = s_oSpriteLibrary.getSprite('character_'+iCharacter);
        var oCharacter = createBitmap(oSprite);
        oCharacter.x = (CANVAS_WIDTH/2) + 20;
        oCharacter.y = CANVAS_HEIGHT/2;
        _oGroup.addChild(oCharacter);
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("save_score",iScore);
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown",_oListener);
        s_oStage.removeChild(_oGroup);
        $(s_oMain).trigger("share_event",_iScore);
        
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg);
    
    return this;
}