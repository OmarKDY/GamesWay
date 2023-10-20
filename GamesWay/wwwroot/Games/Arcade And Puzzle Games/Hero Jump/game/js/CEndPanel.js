function CEndPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    
    var _oMsgTextStroke;
    var _oMsgText;
    var _oScoreTextStroke;
    var _oScoreText;
    var _oButRestart;
    var _oButHome;

    
    var _oParent = this;
    
    this._init = function(oSpriteBg){
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = 0;
        _oBg.y = 0;
        
        var oPlayerSprite = s_oSpriteLibrary.getSprite("stunned");
        
        var oData = {   
            images: [oPlayerSprite], 
            framerate: 40,
            // width, height & registration point of each sprite
            frames: {width: PLAYER_STUNNED_WIDTH, height: PLAYER_STUNNED_HEIGHT, regX: 0, regY: 0}, 
            animations: {falled:[0, 2, "idle"], idle:[3, 27, "idle"]}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        var _oPlayerStunned = createSprite(oSpriteSheet, "falled", 0, 0, PLAYER_STUNNED_WIDTH, PLAYER_STUNNED_HEIGHT);
        _oPlayerStunned.x = CANVAS_WIDTH/2;
        _oPlayerStunned.y = CANVAS_HEIGHT/2-10;
        _oPlayerStunned.regX = PLAYER_STUNNED_WIDTH/2;
        _oPlayerStunned.regY = PLAYER_STUNNED_HEIGHT/2;
        _oPlayerStunned.scaleX = 1.2;
        _oPlayerStunned.scaleY = 1.2;
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;

       
        var iWidth = 390;
        var iHeight = 80;
        _oMsgTextStroke = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-iWidth/2 +2, CANVAS_HEIGHT/2 - iHeight/2 -52, iWidth, iHeight, 
                    70, "center", "#410701", FONT, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );

        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-iWidth/2, CANVAS_HEIGHT/2 - iHeight/2 -52, iWidth, iHeight, 
                    70, "center", "#ffb400", FONT, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
       
        var iWidth = 300;
        var iHeight = 60;
        _oScoreTextStroke = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-iWidth/2 +2, CANVAS_HEIGHT/2 - iHeight/2 + 112, iWidth, iHeight, 
                    40, "center", "#410701", FONT, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );

        _oScoreText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-iWidth/2, CANVAS_HEIGHT/2 - iHeight/2 + 112, iWidth, iHeight, 
                    40, "center", "#ffb400", FONT, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
        
       
        _oButRestart = createBitmap(s_oSpriteLibrary.getSprite('but_restart'));
        _oButRestart.x = CANVAS_WIDTH/2+15;
        _oButRestart.y = CANVAS_HEIGHT/2+160;
        
        _oButHome = createBitmap(s_oSpriteLibrary.getSprite('but_home'));
        _oButHome.x = CANVAS_WIDTH/2-105;
        _oButHome.y = CANVAS_HEIGHT/2+160;
        
        
        
        _oGroup.addChild(_oBg, _oPlayerStunned, _oButRestart, _oButHome);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        _oButHome.off("mousedown",this._onExit);
        _oButRestart.off("mousedown",this._onRestart);
    };
    
    this._initListener = function(){
        _oButHome.on("mousedown",this._onExit);
        _oButRestart.on("mousedown",this._onRestart);
    };
    
    this.show = function(iScore){
        setVolume("soundtrack", 0)
	playSound("game_over",1,false);
        _oMsgTextStroke.refreshText( TEXT_GAMEOVER );
        _oMsgText.refreshText( TEXT_GAMEOVER );
        
        _oScoreTextStroke.refreshText( TEXT_SCORE + iScore );
        _oScoreText.refreshText( TEXT_SCORE + iScore );
        
        _oGroup.visible = true;
        
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {_oParent._initListener();});
        
        $(s_oMain).trigger("share_event",[iScore]);
        $(s_oMain).trigger("save_score",[iScore]);
    };
    
    this._onExit = function(){
        _oParent.unload();

        s_oStage.removeChild(_oGroup);
        
        s_oGame.onExit();
        stopSound("game_over");
        stopSound("death"); 
    };
    
    this._onRestart = function(){
        _oParent.unload();

        s_oStage.removeChild(_oGroup);
        
        s_oGame.onRestart();
        stopSound("game_over");
        setVolume("soundtrack", 1)
        
        stopSound("death");
        
    };
    
    this._init(oSpriteBg);
    
    return this;
}
