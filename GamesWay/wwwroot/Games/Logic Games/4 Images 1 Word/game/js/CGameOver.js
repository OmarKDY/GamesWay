function CGameOver(iMoney) {
    var _oButToMenu;
    var _oFade;
    var _oMoneyDisplay;
    var _oTextGameOver;
    var _oTextGameOverCont;
    var _oTextScore;
    var _oTextScoreCont;
    var _oGameOver;
    var _oBg;

    this._init = function () {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);
        
        $(s_oMain).trigger("save_score", s_oGame.getMoney());
        
        var _oGameOver = createBitmap(s_oSpriteLibrary.getSprite('bg_gameover'));
        s_oStage.addChild(_oGameOver); //Draws on canvas

        var oSpriteMoney = s_oSpriteLibrary.getSprite('money_panel');
        _oMoneyDisplay = new CTextButton(CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2, oSpriteMoney, iMoney, PRIMARY_FONT, "#ffffff", 50, -8,s_oStage);
        _oMoneyDisplay.block(true);
        _oMoneyDisplay.setScale(1);

        var oSpriteGameOver = s_oSpriteLibrary.getSprite('but_menu');
        _oButToMenu = new CGfxButton(s_oStage,CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 270, oSpriteGameOver);
        _oButToMenu.addEventListener(ON_MOUSE_UP, this._onButToMenuRelease, this);
        
        _oTextGameOverCont = new CTLText(s_oStage, 
                                    CANVAS_WIDTH / 2-400, CANVAS_HEIGHT / 2 - 270, 800, 136,  
                                    136, "center", "#ff21fe", PRIMARY_FONT, 1,
                                    0, 0,
                                    TEXT_GAMEOVER,
                                    true, true, false,
                                    false);
        _oTextGameOverCont.setOutline(4);
        
        _oTextGameOver = new CTLText(s_oStage, 
                                    CANVAS_WIDTH / 2-400, CANVAS_HEIGHT / 2 - 270, 800, 136,  
                                    136, "center", "#ff21fe", PRIMARY_FONT, 1,
                                    0, 0,
                                    TEXT_GAMEOVER,
                                    true, true, false,
                                    false);
        
        
        

        var pTextScore = {x: CANVAS_WIDTH / 2 - 180, y: CANVAS_HEIGHT / 2 -50};
        
        _oTextScoreCont = new CTLText(s_oStage, 
                                    pTextScore.x-250, pTextScore.y, 450, 96, 
                                    96, "right", "#ff21fe", PRIMARY_FONT, 1,
                                    0, 0,
                                    TEXT_SCORE,
                                    true, true, false,
                                    false);
        _oTextScoreCont.setOutline(4);
        
        _oTextScore = new CTLText(s_oStage, 
                                    pTextScore.x-250, pTextScore.y, 450, 96, 
                                    96, "right", "#ff21fe", PRIMARY_FONT, 1,
                                    0, 0,
                                    TEXT_SCORE,
                                    true, true, false,
                                    false);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);
        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });
    };

    this.unload = function () {
        _oMoneyDisplay.unload();
        _oMoneyDisplay = null;

        _oButToMenu.unload();
        _oButToMenu = null;

        s_oStage.removeChild(_oGameOver, _oBg, _oTextGameOverCont, _oTextGameOverCont, _oTextScore, _oTextScoreCont);
        _oGameOver = null;
        _oBg = null;
        _oTextGameOver = null;
        _oTextGameOverCont = null;
        _oTextScore = null;
        _oTextScoreCont = null;
        
        s_oGameOver = null;
    };

    this._onButToMenuRelease = function () {
        $(s_oMain).trigger("show_interlevel_ad");
        this.unload();

        
        s_oMain.gotoMenu();
    };

    s_oGameOver = this;
    this._init();
}

var s_oGameOver;

