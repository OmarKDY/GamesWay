function CHelpPanel(oSpriteBg){
    
    var _oBg;
    var _oGroup;
    var _oHelpText;
    var _oButPlay;
    var _oFade;
    var _oParent;
    
    this._init = function(oSpriteBg){        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;

        _oGroup = new createjs.Container();
        s_oStage.addChild(_oGroup);
        _oGroup.addChild(oBg, _oFade, _oBg);
        
        var oTextOutline = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-350, CANVAS_HEIGHT/2 - 300, 700, 300, 
                    50, "center", "#0075b8", FONT, 1,
                    0, 0,
                    TEXT_HELP,
                    true, true, true,
                    false );
                    
        oTextOutline.setOutline(8);
        
        oText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-350, CANVAS_HEIGHT/2 - 300, 700, 300, 
                    50, "center", "#fff", FONT, 1,
                    0, 0,
                    TEXT_HELP,
                    true, true, true,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('but_play_small');
        _oButPlay = new CGfxButton((CANVAS_WIDTH/2+334),CANVAS_HEIGHT -500,oSprite, _oGroup);
                
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {
            _oButPlay.addEventListener(ON_MOUSE_DOWN, oParent._onButPlayRelease, this);
        });
        
        var oAnimContainer = new createjs.Container();
        oAnimContainer.x = CANVAS_WIDTH/2 - 32;
        oAnimContainer.y = CANVAS_HEIGHT/2 + 220;
        oAnimContainer.scaleX = oAnimContainer.scaleY = 0.65;
        _oGroup.addChild(oAnimContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('car_player');
        var oPlayerCar = createBitmap(oSprite);
        oPlayerCar.regX = oSprite.width/2;
        oPlayerCar.regY = oSprite.height/2;
        oPlayerCar.x = -200;
        oAnimContainer.addChild(oPlayerCar);
        
        var oSprite = s_oSpriteLibrary.getSprite('car_1');
        var oBlockCar = createBitmap(oSprite);
        oBlockCar.regX = oSprite.width/2;
        oBlockCar.regY = oSprite.height;
        oBlockCar.rotation = 90;
        oBlockCar.x = -40
        oAnimContainer.addChild(oBlockCar);
        
        this.setAnim(oPlayerCar, oBlockCar);
        
    };
    
    this.setAnim = function(oPlayerCar, oBlockCar){
        oPlayerCar.x = -200;
        oBlockCar.y = 0;
        
        createjs.Tween.get(oBlockCar).wait(500).to({y: -220}, 1000, createjs.Ease.cubicOut).call(function(){
            createjs.Tween.get(oPlayerCar).to({x: 270}, 1000, createjs.Ease.cubicIn).wait(1000).call(function(){
                _oParent.setAnim(oPlayerCar, oBlockCar);
            });
        });
    };
    
    this._onButPlayRelease = function(){
        _oButPlay.unload();
        s_oStage.removeChild(_oGroup);
        s_oMain.gotoGame(0, 0);
    };
    
    this._init(oSpriteBg);
    
    _oParent = this;
    return this;
}
