function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;

    var _oMsgText;
    var _oScoreText;
    
    this._init = function(oSpriteBg){
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        _oBg = createBitmap(oSpriteBg);
        _oGroup.addChild(_oBg);

        /*
        _oMsgText = new createjs.Text(""," 60px "+PRIMARY_FONT, "#fff2af");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-102;
        _oMsgText.textAlign = "center";
        
        _oScoreText = new createjs.Text(""," 40px "+PRIMARY_FONT, "#fff2af");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = (CANVAS_HEIGHT/2) + 52;
        _oScoreText.textAlign = "center";
        */

        var iWidth = 500;
        var iHeight = 70;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = (CANVAS_HEIGHT/2)-100;
        _oMsgText = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    60, "center", "#fff2af", PRIMARY_FONT, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
                    
        var iWidth = 500;
        var iHeight = 50;
        var iTextX = CANVAS_WIDTH/2;
        var iTextY = (CANVAS_HEIGHT/2)+50;
        _oScoreText = new CTLText(_oGroup, 
                    iTextX - iWidth/2, iTextY - iHeight/2, iWidth, iHeight, 
                    40, "center", "#fff2af", PRIMARY_FONT, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );

        
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",this._onExit);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iScore){
        _oMsgText.refreshText( TEXT_GAMEOVER );
        
        _oScoreText.refreshText( TEXT_SCORE +": "+iScore );
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("save_score",iScore);
        $(s_oMain).trigger("share_event",iScore);
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown",this._onExit);
        s_oStage.removeChild(_oGroup);
        
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg);
    
    return this;
}
