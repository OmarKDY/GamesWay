function CWinPanel(iScore, iLevelStars){
    var _oContainer;
    var _oPanelContainer;
    var _oFade;
    var _oButExit;
    var _oButRestart;
    var _oButNext;
    var _oMsgTextGameOver;
    var _oMsgTextFinalScore;
    
    var _iScore;
    var _iLevelStars;
    
    var _aStars;
    
    var _pStartPanelPos;
        
    this._init = function(){
        _iScore = iScore;
        _iLevelStars = iLevelStars;
        _aStars = [];
        
        _oContainer = new createjs.Container();        
        s_oStage.addChild(_oContainer);

        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        _oContainer.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box_big');
        var oPanel = createBitmap(oSprite);  
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        oPanel.x = CANVAS_WIDTH_HALF;
        oPanel.y = CANVAS_HEIGHT_HALF;
        _oPanelContainer.addChild(oPanel);

        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        createjs.Tween.get(_oPanelContainer)
            .to({y:0},1000, createjs.Ease.backOut)
            .call(function(){
                $("#canvas").trigger("show_interlevel_ad");
            })
            .wait(100)
            .call(this.showStars);
        
        _oMsgTextGameOver = new createjs.Text(TEXT_LEVELWIN, FONT_SIZE_END_PANEL_TITLE+ PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oMsgTextGameOver.textAlign = "center";
        _oMsgTextGameOver.textBaseline = "alphabetic";
	_oMsgTextGameOver.x = CANVAS_WIDTH_HALF;
        _oMsgTextGameOver.y = CANVAS_HEIGHT_HALF - 160;
        _oMsgTextGameOver.lineWidth = 560;
	_oPanelContainer.addChild(_oMsgTextGameOver);
        
        _oMsgTextFinalScore = new createjs.Text(TEXT_SCORE + ": " + _iScore, FONT_SIZE_END_PANEL_TEXT + PRIMARY_FONT, PRIMARY_FONT_COLOUR);
        _oMsgTextFinalScore.textAlign = "center";
        _oMsgTextFinalScore.textBaseline = "alphabetic";
	_oMsgTextFinalScore.x = CANVAS_WIDTH_HALF;
        _oMsgTextFinalScore.y = CANVAS_HEIGHT_HALF - 80;
        _oMsgTextFinalScore.lineWidth = 560;
	_oPanelContainer.addChild(_oMsgTextFinalScore);  
        
        this.initStars();
        
        _oButExit = new CGfxButton(CANVAS_WIDTH_HALF - 190, 830, s_oSpriteLibrary.getSprite('but_home'), _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);        
        
        _oButRestart = new CGfxButton(CANVAS_WIDTH_HALF, 830, s_oSpriteLibrary.getSprite('but_restart'), _oPanelContainer);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        
        _oButNext = new CGfxButton(CANVAS_WIDTH_HALF + 190, 830, s_oSpriteLibrary.getSprite('but_next'), _oPanelContainer);
        _oButNext.addEventListener(ON_MOUSE_UP, this._onNext, this);
    };
    
    this.initStars = function(){
        _aStars = [];
        
        var oSprite = s_oSpriteLibrary.getSprite("starbox");
        var oStar1 = createBitmap(oSprite);
        var oStar2 = createBitmap(oSprite);
        var oStar3 = createBitmap(oSprite);
        oStar1.regX = oStar2.regX = oStar3.regX = oSprite.width * 0.5;
        oStar1.regY = oStar2.regY = oStar3.regY = oSprite.height * 0.5;
        
        var oSprite = s_oSpriteLibrary.getSprite("star");
        var oFullStar1 = createBitmap(oSprite);
        _aStars.push(oFullStar1);
        var oFullStar2 = createBitmap(oSprite);
        _aStars.push(oFullStar2);
        var oFullStar3 = createBitmap(oSprite);
        _aStars.push(oFullStar3);
        oFullStar1.regX = oFullStar2.regX = oFullStar3.regX = oSprite.width * 0.5;
        oFullStar1.regY = oFullStar2.regY = oFullStar3.regY = oSprite.height * 0.5;
        
        oFullStar1.scaleX = oFullStar1.scaleY = oFullStar2.scaleX = 
            oFullStar2.scaleY = oFullStar3.scaleX = oFullStar3.scaleY = 0;
        
        oStar1.x = oFullStar1.x = CANVAS_WIDTH_HALF - 70;        
        oStar2.x = oFullStar2.x = CANVAS_WIDTH_HALF;
        oStar3.x = oFullStar3.x = CANVAS_WIDTH_HALF + 70;
        oStar1.y = oStar2.y = oStar3.y = oFullStar1.y = oFullStar2.y = oFullStar3.y = CANVAS_HEIGHT_HALF;
        
        _oPanelContainer.addChild(oStar1, oStar2, oStar3);
        _oPanelContainer.addChild(oFullStar1, oFullStar2, oFullStar3);
    };
    
    this.showStars = function(){        
        for (var i = 0; i < _iLevelStars; i++) {
            playSound("coin", 1, false);
            createjs.Tween.get(_aStars[i])                
                .wait(300*i)
                .to({scaleX: 1, scaleY: 1}, 1500, createjs.Ease.elasticOut);
        };
    };
    
    this.unload = function(){
        createjs.Tween.get(_oFade)
            .wait(MESSAGE_GAMEWIN_DELAY)
            .to({alpha:0},500);
    
        createjs.Tween.get(_oPanelContainer)
            .wait(MESSAGE_GAMEWIN_DELAY)
            .to({y:_pStartPanelPos.y},400, createjs.Ease.backIn)
            .call(function(){
                _oButExit.unload(); 
                _oButRestart.unload();
                s_oStage.removeChild(_oContainer);
                s_oEndPanel = null;        
        }); 
    };
    
    this._onExit = function(){
        this.unload();
        s_oGame.onExit();
    };
    
    this._onNext = function(){
        s_iLevel += 1;
            
        if (s_iLevel < LEVELS_NUMBER) {
            s_oMain.gotoGame();
        } else {
            s_oMain.gotoMenu();
        }
    };
    
    this._onRestart = function(){
        this.unload();
        s_oGame.restart();
    };
    
    s_oEndPanel = this;
    
    this._init();
}

var s_oEndPanel = null;