function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    
    var _oMsgText;
    var _oTimeText;
    var _oScoreText;
    
    this._init = function(oSpriteBg){
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;

        _oMsgText = new createjs.Text(""," 120px "+PRIMARY_FONT, "#008df0");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-200;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 500;        
        
        _oTimeText = new createjs.Text(""," 70px "+PRIMARY_FONT, "#008df0");
        _oTimeText.x = CANVAS_WIDTH/2;
        _oTimeText.y = (CANVAS_HEIGHT/2);
        _oTimeText.textAlign = "center";
        _oTimeText.textBaseline = "alphabetic";
        _oTimeText.lineWidth = 500;
        
        _oScoreText = new createjs.Text(""," 70px "+PRIMARY_FONT, "#008df0");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = (CANVAS_HEIGHT/2) + 200;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.lineWidth = 100;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oBg, _oTimeText, _oScoreText,  _oMsgText);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oGroup.off("mousedown",this._onExit);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iTime, iScore){
	playSound("game_over",1,false);
        
        
        _oMsgText.text = TEXT_GAMEOVER;
        
        _oTimeText.text = TEXT_TIME + formatTime(iTime);
        
        _oScoreText.text = TEXT_SCORE + iScore;
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("save_score",[iScore, s_iMode]);
        $(s_oMain).trigger("end_level",1);
        
        var szImage = "200x200.jpg";
        var szTitle = "Congratulations!";
        var szMsg = "You collected <strong>" + (iScore) + " points</strong>!<br><br>Share your score with your friends!";
        var szMsgShare = "My score is " + (iScore) + " points! Can you do better";
        
        $(s_oMain).trigger("share_event",[iScore, szImage, szTitle, szMsg, szMsgShare]);
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown",this._onExit);
        s_oStage.removeChild(_oGroup);
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
        
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg);
    
    return this;
}
