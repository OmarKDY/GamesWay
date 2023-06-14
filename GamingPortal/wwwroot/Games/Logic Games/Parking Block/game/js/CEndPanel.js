function CEndPanel(oSpriteBg){
    var _iScore;
    
    var _oBg;
    var _oGroup;
    
    var _oFirstStar;
    var _oSecondStar;
    var _oThirdStar;
    var _oButton;
    var _oScoreTextStroke;
    var _oScoreText;
    var _oScorePos = {x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2-280};
    var _oFade;
    var _oListener;
    
    this._init = function(oSpriteBg){
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oListener = _oFade.on("mousedown", function(){});
        s_oStage.addChild(_oFade);
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        var oStarContainer = new createjs.Container();
        oStarContainer.y = -90;
        
        _oFirstStar = createBitmap(s_oSpriteLibrary.getSprite('star_filled'));
        _oFirstStar.x = CANVAS_WIDTH/2;
        _oFirstStar.y = CANVAS_HEIGHT/2-60;
        _oFirstStar.regX = STAR_WIDTH/2;
        _oFirstStar.regY = STAR_HEIGHT/2;
        _oFirstStar.scaleX = 0.1;
        _oFirstStar.scaleY = 0.1;
        _oFirstStar.visible = false;
        oStarContainer.addChild(_oFirstStar);
        
        _oSecondStar = createBitmap(s_oSpriteLibrary.getSprite('star_filled'));
        _oSecondStar.x = CANVAS_WIDTH/2;
        _oSecondStar.y = CANVAS_HEIGHT/2-60;
        _oSecondStar.regX = STAR_WIDTH/2;
        _oSecondStar.regY = STAR_HEIGHT/2;
        _oSecondStar.scaleX = 0.1;
        _oSecondStar.scaleY = 0.1;
        _oSecondStar.visible = false;
        oStarContainer.addChild(_oSecondStar);
        
        _oThirdStar = createBitmap(s_oSpriteLibrary.getSprite('star_filled'));
        _oThirdStar.x = CANVAS_WIDTH/2;
        _oThirdStar.y = CANVAS_HEIGHT/2-60;
        _oThirdStar.regX = STAR_WIDTH/2;
        _oThirdStar.regY = STAR_HEIGHT/2;
        _oThirdStar.scaleX = 0.1;
        _oThirdStar.scaleY = 0.1;
        _oThirdStar.visible = false;
        oStarContainer.addChild(_oThirdStar);
        
        _oGroup.addChild(_oBg, oStarContainer);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){

    };
    
    this.show = function(iLevel, iScore){
        _iScore = iScore;
        playSound("stage_clear",1,false);
        setVolume("soundtrack",0);
        
        
        var szText = TEXT_GAMEOVER+s_oLocalStorage.getTotalScore();
        var oTextStroke = new CTLText(_oGroup, 
                   CANVAS_WIDTH/2-350, CANVAS_HEIGHT/2-300, 700, 250, 
                    100, "center", "#0075b8", FONT, 1,
                    0, 0,
                    szText,
                    true, true, true,
                    true );
                    
        oTextStroke.setOutline(4);

        var Text = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-350, CANVAS_HEIGHT/2-300, 700, 250, 
                    100, "center", "#fff", FONT, 1,
                    0, 0,
                    szText,
                    true, true, true,
                    false );


        _oGroup.visible = true;
                        
        var oSprite = s_oSpriteLibrary.getSprite('but_restart');
        _oButton = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT/2+150,oSprite, _oGroup);
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {
            _oButton.addEventListener(ON_MOUSE_DOWN, oParent._onExit, this);
        });
        $(s_oMain).trigger("share_event",iScore);
        $(s_oMain).trigger("save_score",iScore);
    };
    
    this.nextLevel = function(iMoves, iLevel, iMaxMoves, iScore){
        _iScore = iScore;
        _oScoreTextStroke = new CTLText(_oGroup, 
                    _oScorePos.x-300, _oScorePos.y, 600, 50, 
                    50, "center", "#0075b8", FONT, 1,
                    0, 0,
                    TEXT_YOUR_SCORE+": "+iScore,
                    true, true, false,
                    false );
                    
        _oScoreTextStroke.setOutline(4);

        _oScoreText = new CTLText(_oGroup, 
                    _oScorePos.x-300, _oScorePos.y, 600, 50, 
                    50, "center", "#fff", FONT, 1,
                    0, 0,
                    TEXT_YOUR_SCORE+": "+iScore,
                    true, true, false,
                    false );
        
	playSound("stage_clear",1,false);
        setVolume("soundtrack",0);
        
        var szText = TEXT_NEXT_LEVEL+" "+TEXT_SCORE.toUpperCase()+" "+iMoves+" "+ TEXT_MOVES_OUT + " " +iMaxMoves;
        var oTextOutline = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, CANVAS_HEIGHT/2-40, 600, 200, 
                    50, "center", "#0075b8", FONT, 1,
                    0, 0,
                    szText,
                    true, true, true,
                    false );
                    
        oTextOutline.setOutline(4);
        
        var oText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-300, CANVAS_HEIGHT/2-40, 600, 200, 
                    50, "center", "#FFFFFF", FONT, 1,
                    0, 0,
                    szText,
                    true, true, true,
                    false );

        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_play_small');
        _oButton = new CGfxButton((CANVAS_WIDTH/2+334),CANVAS_HEIGHT -500,oSprite, _oGroup);
        _oButton.addEventListener(ON_MOUSE_DOWN, this._onNextLevel, this);
        
        if(iMoves >= iMaxMoves+5){
            _oFirstStar.visible = true;
            createjs.Tween.get(_oFirstStar).wait(500).to({scaleX:1, scaleY: 1}, 500, createjs.Ease.bounceOut);
        }else if(iMoves >= iMaxMoves+2){
            _oFirstStar.visible = true;
            createjs.Tween.get(_oFirstStar).wait(500).to({scaleX:1, scaleY: 1}, 500, createjs.Ease.bounceOut).call(function() {
                _oSecondStar.visible = true;
                createjs.Tween.get(_oFirstStar).to({x:CANVAS_WIDTH/2-40, y: CANVAS_HEIGHT/2-55, rotation: -20}, 250, createjs.Ease.linear).call(function() {});
                createjs.Tween.get(_oSecondStar).to({scaleX:1, scaleY: 1, x:CANVAS_WIDTH/2+40, y: CANVAS_HEIGHT/2-55, rotation: 20}, 500, createjs.Ease.bounceOut);
            });
        }else if(iMoves < iMaxMoves+2){
            _oFirstStar.visible = true;
            createjs.Tween.get(_oFirstStar).wait(500).to({scaleX:1, scaleY: 1, rotation: 0}, 500, createjs.Ease.bounceOut).call(function() {
                _oSecondStar.visible = true;
                createjs.Tween.get(_oFirstStar).to({x:CANVAS_WIDTH/2-40, y: CANVAS_HEIGHT/2-55, rotation: -20}, 250, createjs.Ease.linear).call(function() {});
                createjs.Tween.get(_oSecondStar).to({scaleX:1, scaleY: 1, x:CANVAS_WIDTH/2+40, y: CANVAS_HEIGHT/2-55, rotation: 20}, 500, createjs.Ease.bounceOut).call(function() {
                    _oThirdStar.visible = true;
                    createjs.Tween.get(_oFirstStar).to({x:CANVAS_WIDTH/2-75, y: CANVAS_HEIGHT/2-50}, 250, createjs.Ease.linear).call(function() {});
                    createjs.Tween.get(_oSecondStar).to({x:CANVAS_WIDTH/2+75, y: CANVAS_HEIGHT/2-50}, 250, createjs.Ease.linear).call(function() {});
                    createjs.Tween.get(_oThirdStar).to({scaleX:1, scaleY: 1, x:CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2-60}, 700, createjs.Ease.bounceOut);
                });
            });
        }
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {});
        
        $(s_oMain).trigger("share_event",iScore);
    };
    
    this._onExit = function(){
        s_oStage.removeChild(_oGroup);
        _oButton.unload();
        _oFade.off("mousedown", _oListener)
        s_oGame.onExitEndPanel();
    };
    
    this._onNextLevel = function(iLevel){
        s_oStage.removeChild(_oGroup);
        
        s_oGame.onNextLevel(_iScore);
    };
    
    this._init(oSpriteBg);
    
    return this;
}
